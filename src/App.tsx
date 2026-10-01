import { useEffect, useState } from "react";
import { useAuth } from "./context/AuthContext";
import { cloudConfigured } from "./lib/api";
import { HomePage } from "./pages/HomePage";
import { CatalogPage } from "./pages/CatalogPage";
import { AuthPage } from "./pages/AuthPage";
import { OwnerDashboard } from "./pages/OwnerDashboard";
import { AdminDashboard } from "./pages/AdminDashboard";
import { currentAppPath, navigate } from "./lib/navigation";

function Loading(){ return <main className="center-screen"><div className="loader"/><p>Carregando...</p></main>; }

function OwnerGate(){
  const auth=useAuth();
  if(cloudConfigured&&auth.loading)return <Loading/>;
  if(cloudConfigured&&!auth.session){ navigate("/auth", true); return null; }
  return <OwnerDashboard/>;
}

function AdminGate(){
  const auth=useAuth();
  if(cloudConfigured&&auth.loading)return <Loading/>;
  if(cloudConfigured&&!auth.session){ navigate("/auth", true); return null; }
  if(cloudConfigured&&!auth.isSuperAdmin){ navigate("/painel", true); return null; }
  return <AdminDashboard/>;
}

export function App(){
  const [path,setPath]=useState(currentAppPath());

  useEffect(()=>{
    const sync=()=>setPath(currentAppPath());
    window.addEventListener("hashchange",sync);
    window.addEventListener("popstate",sync);
    return ()=>{
      window.removeEventListener("hashchange",sync);
      window.removeEventListener("popstate",sync);
    };
  },[]);

  if(path==="/")return <HomePage/>;
  if(path==="/auth")return <AuthPage/>;
  if(path==="/painel")return <OwnerGate/>;
  if(path==="/admin")return <AdminGate/>;
  const slug=decodeURIComponent(path.slice(1));
  return <CatalogPage slug={slug}/>;
}
