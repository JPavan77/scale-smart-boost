import { useState, type FormEvent } from "react";
import { KeyRound } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { appHref, navigate } from "../lib/navigation";

export function SetPasswordPage(){
  const auth=useAuth();
  const [password,setPassword]=useState("");
  const [confirm,setConfirm]=useState("");
  const [error,setError]=useState("");
  const [busy,setBusy]=useState(false);

  async function submit(e:FormEvent){
    e.preventDefault();
    setError("");

    if(password.length<8){
      setError("Use uma senha com pelo menos 8 caracteres.");
      return;
    }
    if(password!==confirm){
      setError("As senhas não conferem.");
      return;
    }

    try{
      setBusy(true);
      await auth.updatePassword(password);
      window.history.replaceState(null,"",appHref("/painel"));
      navigate("/painel",true);
    }catch(err:any){
      setError(err?.message||"Não foi possível definir a senha.");
    }finally{
      setBusy(false);
    }
  }

  if(auth.loading){
    return <main className="center-screen"><div className="loader"/><p>Validando convite...</p></main>;
  }

  if(!auth.session){
    return <main className="soft-page"><div className="form-card">
      <h1>Convite inválido ou expirado.</h1>
      <p className="muted">Peça ao administrador para enviar um novo convite.</p>
      <a className="btn dark full" href={appHref("/auth")}>Ir para o login</a>
    </div></main>;
  }

  return <main className="soft-page">
    <form className="form-card" onSubmit={submit}>
      <a className="brand" href={appHref("/")}><span className="brand-mark">V</span><span>Vitrine Local</span></a>
      <span className="eyebrow top"><KeyRound size={14}/> ativar acesso</span>
      <h1>Defina sua senha.</h1>
      <p className="muted">Depois disso você entra normalmente com email e senha.</p>
      <label>Nova senha<input type="password" minLength={8} required value={password} onChange={e=>setPassword(e.target.value)}/></label>
      <label>Confirmar senha<input type="password" minLength={8} required value={confirm} onChange={e=>setConfirm(e.target.value)}/></label>
      {error&&<div className="form-error">{error}</div>}
      <button disabled={busy} className="btn dark full">{busy?"Salvando...":"Definir senha e entrar"}</button>
    </form>
  </main>;
}
