import { createFileRoute, Link } from "@tanstack/react-router";
import { demoItems } from "@/data/demo";

export const Route = createFileRoute("/painel")({
  head:()=>({meta:[{title:"Painel da empresa — Vitrine Local"}]}),
  component: OwnerPanel,
});

function OwnerPanel(){
  return <main className="dashboard"><div className="dash-shell">
    <aside className="sidebar">
      <div className="brand"><span className="brand-mark">V</span><span>Vitrine Local</span></div>
      <nav><a className="active">Visão geral</a><a>Catálogo</a><a>Empresa</a></nav>
    </aside>
    <section className="dash-main">
      <header className="dash-header"><div><span className="eyebrow">Barbearia do Zé</span><h1>Seu catálogo</h1></div><Link to="/$empresa" params={{empresa:"barbearia-do-ze"}} className="button secondary">Ver catálogo</Link></header>
      <div className="stats">
        <div className="stat"><span className="muted">Itens ativos</span><strong>{demoItems.length}</strong></div>
        <div className="stat"><span className="muted">Categorias</span><strong>{new Set(demoItems.map(i=>i.category)).size}</strong></div>
        <div className="stat"><span className="muted">Status</span><strong>Online</strong></div>
      </div>
      <div className="panel">
        <div className="dash-header" style={{padding:0}}><div><h2 style={{fontSize:30}}>Itens</h2><p className="muted">Gerencie preço, duração, variações e disponibilidade.</p></div><button className="button primary">Novo item</button></div>
        <table className="table"><thead><tr><th>Item</th><th>Categoria</th><th>Preço</th><th>Duração</th><th>Status</th></tr></thead>
        <tbody>{demoItems.map(i=><tr key={i.id}><td><strong>{i.name}</strong></td><td>{i.category}</td><td>{i.price?i.price.toLocaleString("pt-BR",{style:"currency",currency:"BRL"}):"Sob consulta"}</td><td>{i.duration?i.duration+" min":"—"}</td><td><span className="badge">Ativo</span></td></tr>)}</tbody></table>
      </div>
    </section>
  </div></main>
}
