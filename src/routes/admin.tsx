import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/admin")({
  head:()=>({meta:[{title:"Admin — Vitrine Local"}]}),
  component: Admin,
});

const businesses = [
  {name:"Barbearia do Zé",slug:"barbearia-do-ze",type:"Serviços",status:true},
  {name:"Empório Central",slug:"emporio-central",type:"Produtos",status:true},
  {name:"Studio Aurora",slug:"studio-aurora",type:"Ambos",status:false},
];

function Admin(){
  return <main className="dashboard"><div className="dash-shell">
    <aside className="sidebar">
      <div className="brand"><span className="brand-mark">V</span><span>Vitrine Local</span></div>
      <nav><a className="active">Empresas</a><a>Convites</a><a>Configurações</a></nav>
    </aside>
    <section className="dash-main">
      <header className="dash-header"><div><span className="eyebrow">Super admin</span><h1>Empresas</h1></div><button className="button primary">Criar empresa</button></header>
      <div className="stats">
        <div className="stat"><span className="muted">Empresas</span><strong>3</strong></div>
        <div className="stat"><span className="muted">Ativas</span><strong>2</strong></div>
        <div className="stat"><span className="muted">Pausadas</span><strong>1</strong></div>
      </div>
      <div className="panel">
        <table className="table"><thead><tr><th>Empresa</th><th>Link</th><th>Tipo</th><th>Status</th><th></th></tr></thead>
        <tbody>{businesses.map(b=><tr key={b.slug}><td><strong>{b.name}</strong></td><td>/{b.slug}</td><td>{b.type}</td><td><span className={b.status?"badge":"badge off"}>{b.status?"Ativa":"Pausada"}</span></td><td><Link to="/$empresa" params={{empresa:b.slug}} className="button ghost">Abrir</Link></td></tr>)}</tbody></table>
      </div>
    </section>
  </div></main>
}
