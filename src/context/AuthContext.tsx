import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { cloudConfigured, supabase } from "../lib/supabase";

type AuthValue = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  isSuperAdmin: boolean;
  businessIds: string[];
  signIn: (email:string,password:string)=>Promise<void>;
  signOut: ()=>Promise<void>;
  refreshAccess: ()=>Promise<void>;
  updatePassword: (password:string)=>Promise<void>;
};

const AuthContext = createContext<AuthValue|null>(null);

export function AuthProvider({children}:{children:ReactNode}){
  const [session,setSession]=useState<Session|null>(null);
  const [loading,setLoading]=useState(cloudConfigured);
  const [isSuperAdmin,setSuperAdmin]=useState(false);
  const [businessIds,setBusinessIds]=useState<string[]>([]);

  async function loadAccess(current:Session|null){
    if(!supabase||!current){
      setSuperAdmin(false);
      setBusinessIds([]);
      return;
    }

    const [role,members]=await Promise.all([
      supabase.rpc("has_role",{_user_id:current.user.id,_role:"super_admin"}),
      supabase.from("business_members").select("business_id").eq("user_id",current.user.id)
    ]);

    if(role.error) throw role.error;
    if(members.error) throw members.error;

    setSuperAdmin(Boolean(role.data));
    setBusinessIds((members.data??[]).map((row:any)=>row.business_id));
  }

  async function syncSession(current:Session|null){
    setSession(current);
    try{
      await loadAccess(current);
    }catch(error){
      console.error("Falha ao carregar permissões da sessão",error);
      setSuperAdmin(false);
      setBusinessIds([]);
    }finally{
      setLoading(false);
    }
  }

  useEffect(()=>{
    if(!supabase){
      setLoading(false);
      return;
    }

    let mounted=true;

    supabase.auth.getSession().then(({data,error})=>{
      if(!mounted)return;
      if(error){
        console.error("Falha ao restaurar sessão",error);
        setLoading(false);
        return;
      }
      void syncSession(data.session);
    });

    const {data:listener}=supabase.auth.onAuthStateChange((_event,next)=>{
      if(!mounted)return;
      setSession(next);

      // Supabase recomenda manter este callback síncrono.
      // O carregamento adicional roda fora do callback para evitar lock/deadlock.
      window.setTimeout(()=>{
        if(mounted) void syncSession(next);
      },0);
    });

    return ()=>{
      mounted=false;
      listener.subscription.unsubscribe();
    };
  },[]);

  async function refreshAccess(){
    if(!supabase)return;
    const {data,error}=await supabase.auth.getSession();
    if(error)throw error;
    await syncSession(data.session);
  }

  async function signIn(email:string,password:string){
    if(!supabase)return;
    setLoading(true);
    const {data,error}=await supabase.auth.signInWithPassword({email,password});
    if(error){
      setLoading(false);
      throw error;
    }
    await syncSession(data.session);
  }

  async function signOut(){
    if(supabase){
      const {error}=await supabase.auth.signOut();
      if(error)throw error;
    }
    setSession(null);
    setSuperAdmin(false);
    setBusinessIds([]);
    setLoading(false);
  }

  async function updatePassword(password:string){
    if(!supabase) return;
    const {error}=await supabase.auth.updateUser({password});
    if(error)throw error;
  }

  const value=useMemo(()=>({
    session,
    user:session?.user??null,
    loading,
    isSuperAdmin,
    businessIds,
    signIn,
    signOut,
    refreshAccess,
    updatePassword
  }),[session,loading,isSuperAdmin,businessIds]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(){
  const value=useContext(AuthContext);
  if(!value)throw new Error("useAuth precisa estar dentro de AuthProvider");
  return value;
}
