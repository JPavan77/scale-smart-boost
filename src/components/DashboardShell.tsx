import type { ReactNode } from "react";
import { ExternalLink, LogOut, Shield, Store } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { appHref, navigate } from "../lib/navigation";

export function DashboardShell({
  admin=false,
  title,
  eyebrow,
  action,
  catalogPath,
  children,
}:{
  admin?:boolean;
  title:string;
  eyebrow:string;
  action?:ReactNode;
  catalogPath?:string;
  children:ReactNode;
}){
  const auth=useAuth();
  async function leave(){ await auth.signOut(); navigate("/auth"); }
  const publicCatalogPath=catalogPath||"/barbearia-do-ze";

  return <main className="dashboard"><div className="dash-shell">
    <aside className="sidebar">
      <a className="brand white" href={appHref("/")}><span className="brand-mark">V</span><span>Vitrine Local</span></a>
      <nav>
        {admin
          ? <><a className="active" href={appHref("/admin")}><Shield size={16}/> Empresas</a><a href={appHref("/painel")}><Store size={16}/> Gerenciar catálogo</a></>
          : <><a className="active" href={appHref("/painel")}><Store size={16}/> Catálogo</a>{auth.isSuperAdmin&&<a href={appHref("/admin")}><Shield size={16}/> Super admin</a>}<a href={appHref(publicCatalogPath)} target="_blank"><ExternalLink size={16}/> Ver catálogo</a></>}
      </nav>
      <button className="sidebar-logout" onClick={leave}><LogOut size={16}/> Sair</button>
    </aside>
    <section className="dash-main">
      <header className="dash-header"><div><span className="eyebrow">{eyebrow}</span><h1>{title}</h1></div>{action}</header>
      {children}
    </section>
  </div></main>;
}
