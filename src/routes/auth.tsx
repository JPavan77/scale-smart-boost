import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta:[{title:"Entrar — Vitrine Local"}] }),
  component: Auth,
});

function Auth(){
  return <main className="form-page">
    <div className="glass form-card">
      <Link to="/" className="brand"><span className="brand-mark">V</span><span>Vitrine Local</span></Link>
      <div style={{marginTop:28}}>
        <span className="eyebrow">Acesso do lojista</span>
        <h1 style={{fontSize:44,marginTop:8}}>Entre no seu painel.</h1>
        <p className="muted">Use o email vinculado à sua empresa.</p>
      </div>
      <form onSubmit={e=>e.preventDefault()}>
        <div className="field"><label>Email</label><input type="email" placeholder="voce@empresa.com" required/></div>
        <div className="field"><label>Senha</label><input type="password" placeholder="••••••••" required/></div>
        <Link to="/painel" className="button primary full">Entrar</Link>
      </form>
      <p className="muted" style={{fontSize:13,textAlign:"center",marginTop:18}}>A criação de usuários é feita pelo administrador da plataforma.</p>
    </div>
  </main>
}
