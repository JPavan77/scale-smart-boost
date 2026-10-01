import type { ReactNode } from "react";
import { ExternalLink, LogOut, Shield, Store, Tags } from "lucide-react";
import { useAuth } from "../context/AuthContext";
export function DashboardShell({admin=false,title,eyebrow,action,children}:{admin?:boolean;title:string;eyebrow:string;action?:ReactNode;children:ReactNode}){
 const auth=useAuth(); async function leave(){ await auth.signOut(); window.location.href="/auth"; }
 return <main className="dashboard"><div className="dash-shell"><aside className="sidebar"><a className="brand white" href="/"><span className="brand-mark">V</span><span>Vitrine Local</span></a><nav>{admin?<><a className="active" href="/admin"><Shield size={16}/> Empresas</a><a href="/painel"><Store size={16}/> Meu painel</a></>:<><a className="active" href="/painel"><Store size={16}/> Catálogo</a>{auth.isSuperAdmin&&<a href="/admin"><Shield size={16}/> Super admin</a>}<a href="/barbearia-do-ze" target="_blank"><ExternalLink size={16}/> Ver catálogo</a></>}</nav><button className="sidebar-logout" onClick={leave}><LogOut size={16}/> Sair</button></aside><section className="dash-main"><header className="dash-header"><div><span className="eyebrow">{eyebrow}</span><h1>{title}</h1></div>{action}</header>{children}</section></div></main>;
}
