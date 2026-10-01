import { useAuth } from "./context/AuthContext";
import { cloudConfigured } from "./lib/api";
import { HomePage } from "./pages/HomePage";
import { CatalogPage } from "./pages/CatalogPage";
import { AuthPage } from "./pages/AuthPage";
import { OwnerDashboard } from "./pages/OwnerDashboard";
import { AdminDashboard } from "./pages/AdminDashboard";
function Loading(){ return <main className="center-screen"><div className="loader"/><p>Carregando...</p></main>; }
function OwnerGate(){ const auth=useAuth(); if(cloudConfigured&&auth.loading)return <Loading/>; if(cloudConfigured&&!auth.session){ window.location.replace("/auth"); return null; } return <OwnerDashboard/>; }
function AdminGate(){ const auth=useAuth(); if(cloudConfigured&&auth.loading)return <Loading/>; if(cloudConfigured&&!auth.session){ window.location.replace("/auth"); return null; } if(cloudConfigured&&!auth.isSuperAdmin){ window.location.replace("/painel"); return null; } return <AdminDashboard/>; }
export function App(){
 const path=window.location.pathname.replace(/\/+$/,"")||"/";
 if(path==="/")return <HomePage/>;
 if(path==="/auth")return <AuthPage/>;
 if(path==="/painel")return <OwnerGate/>;
 if(path==="/admin")return <AdminGate/>;
 const slug=decodeURIComponent(path.slice(1)); return <CatalogPage slug={slug}/>;
}
