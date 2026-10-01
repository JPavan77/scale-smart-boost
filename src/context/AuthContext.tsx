import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { cloudConfigured, supabase } from "../lib/supabase";
type AuthValue = { session:Session|null; user:User|null; loading:boolean; isSuperAdmin:boolean; businessIds:string[]; signIn:(email:string,password:string)=>Promise<void>; signOut:()=>Promise<void>; refreshAccess:()=>Promise<void> };
const AuthContext = createContext<AuthValue|null>(null);
export function AuthProvider({children}:{children:ReactNode}){
 const [session,setSession]=useState<Session|null>(null); const [loading,setLoading]=useState(cloudConfigured); const [isSuperAdmin,setSuperAdmin]=useState(false); const [businessIds,setBusinessIds]=useState<string[]>([]);
 async function refreshAccess(){
   if(!supabase){ setSuperAdmin(false); setBusinessIds([]); return; }
   const {data:{session:current}}=await supabase.auth.getSession();
   if(!current){ setSuperAdmin(false); setBusinessIds([]); return; }
   const [role,members]=await Promise.all([
     supabase.rpc("has_role",{_user_id:current.user.id,_role:"super_admin"}),
     supabase.from("business_members").select("business_id").eq("user_id",current.user.id)
   ]);
   setSuperAdmin(Boolean(role.data)); setBusinessIds((members.data??[]).map((row:any)=>row.business_id));
 }
 useEffect(()=>{
   if(!supabase){ setLoading(false); return; }
   let mounted=true;
   supabase.auth.getSession().then(async ({data})=>{ if(!mounted)return; setSession(data.session); await refreshAccess(); if(mounted)setLoading(false); });
   const {data:listener}=supabase.auth.onAuthStateChange(async (_event,next)=>{ setSession(next); await refreshAccess(); setLoading(false); });
   return ()=>{ mounted=false; listener.subscription.unsubscribe(); };
 },[]);
 async function signIn(email:string,password:string){ if(!supabase) return; const {error}=await supabase.auth.signInWithPassword({email,password}); if(error) throw error; await refreshAccess(); }
 async function signOut(){ if(supabase) await supabase.auth.signOut(); setSession(null); setSuperAdmin(false); setBusinessIds([]); }
 const value=useMemo(()=>({session,user:session?.user??null,loading,isSuperAdmin,businessIds,signIn,signOut,refreshAccess}),[session,loading,isSuperAdmin,businessIds]);
 return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export function useAuth(){ const value=useContext(AuthContext); if(!value) throw new Error("useAuth precisa estar dentro de AuthProvider"); return value; }
