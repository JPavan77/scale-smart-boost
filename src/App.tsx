import { useEffect, useState } from "react";
import { useAuth } from "./context/AuthContext";
import { cloudConfigured } from "./lib/api";
import { HomePage } from "./pages/HomePage";
import { CatalogPage } from "./pages/CatalogPage";
import { AuthPage } from "./pages/AuthPage";
import { SetPasswordPage } from "./pages/SetPasswordPage";
import { OwnerDashboard } from "./pages/OwnerDashboard";
import { AdminDashboard } from "./pages/AdminDashboard";
import { appBase, appHref, currentAppPath, navigate } from "./lib/navigation";

function Loading(){ return <main className="center-screen"><div className="loader"/><p>Carregando...</p></main>; }

function Redirect({to}:{to:string}){
  useEffect(()=>{ navigate(to,true); },[to]);
  return <Loading/>;
}

function OwnerGate(){
  const auth=useAuth();
  if(cloudConfigured&&auth.loading)return <Loading/>;
  if(cloudConfigured&&!auth.session)return <Redirect to="/auth"/>;
  return <OwnerDashboard/>;
}

function AdminGate(){
  const auth=useAuth();
  if(cloudConfigured&&auth.loading)return <Loading/>;
  if(cloudConfigured&&!auth.session)return <Redirect to="/auth"/>;
  if(cloudConfigured&&!auth.isSuperAdmin)return <Redirect to="/painel"/>;
  return <AdminDashboard/>;
}

export function App(){
  const auth=useAuth();
  const [path,setPath]=useState(currentAppPath());

  useEffect(()=>{
    const params=new URLSearchParams(window.location.search);
    if(params.get("invite")==="1" && !auth.loading && auth.session){
      navigate("/set-password",true);
      return;
    }

    if(appBase && !window.location.hash.startsWith("#/") && path!=="/"){
      window.history.replaceState(null,"",appHref(path));
    }

    const sync=()=>setPath(currentAppPath());
    window.addEventListener("hashchange",sync);
    window.addEventListener("popstate",sync);
    return ()=>{
      window.removeEventListener("hashchange",sync);
      window.removeEventListener("popstate",sync);
    };
  },[auth.loading,auth.session,path]);

  if(path==="/")return <HomePage/>;
  if(path==="/auth")return <AuthPage/>;
  if(path==="/set-password")return <SetPasswordPage/>;
  if(path==="/painel")return <OwnerGate/>;
  if(path==="/admin")return <AdminGate/>;
  const slug=decodeURIComponent(path.slice(1));
  return <CatalogPage slug={slug}/>;
}
