import { useState, type FormEvent } from "react";
import { LockKeyhole } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { cloudConfigured } from "../lib/api";
import { appHref, navigate } from "../lib/navigation";
export function AuthPage(){ const {signIn}=useAuth(); const [email,setEmail]=useState(""); const [password,setPassword]=useState(""); const [error,setError]=useState(""); const [busy,setBusy]=useState(false);
 async function submit(e:FormEvent){ e.preventDefault(); setError(""); if(!cloudConfigured){ navigate("/painel"); return; } try{ setBusy(true); await signIn(email,password); window.location.href="/painel"; }catch(err:any){ setError(err?.message||"Não foi possível entrar."); }finally{setBusy(false);} }
 return <main className="soft-page"><form className="form-card" onSubmit={submit}><a className="brand" href={appHref("/")}><span className="brand-mark">V</span><span>Vitrine Local</span></a><span className="eyebrow top"><LockKeyhole size={14}/> acesso do lojista</span><h1>Entre no seu painel.</h1><p className="muted">{cloudConfigured?"Use o email vinculado à sua empresa.":"Modo demonstração ativo: o Cloud ainda não está configurado."}</p><label>Email<input value={email} onChange={e=>setEmail(e.target.value)} type="email" placeholder="voce@empresa.com" required={cloudConfigured}/></label><label>Senha<input value={password} onChange={e=>setPassword(e.target.value)} type="password" placeholder="••••••••" required={cloudConfigured}/></label>{error&&<div className="form-error">{error}</div>}<button disabled={busy} className="btn dark full">{busy?"Entrando...":"Entrar"}</button></form></main>;
}
