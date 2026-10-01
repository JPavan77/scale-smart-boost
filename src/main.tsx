import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { MessageCircle, Minus, Plus, ShoppingBag, Sparkles } from "lucide-react";
import "./styles.css";

type Variant = { name: string; price?: number };
type Item = {
  id: string;
  category: string;
  name: string;
  description: string;
  price?: number;
  duration?: number;
  image: string;
  variants?: Variant[];
};
type CartLine = { item: Item; variant?: string; unitPrice?: number; qty: number };

const business = {
  slug: "barbearia-do-ze",
  name: "Barbearia do Zé",
  subtitle: "Cortes, barba e cuidado sem enrolação.",
  description: "Atendimento de bairro com acabamento de respeito. Escolha seu serviço e envie o pedido pelo WhatsApp.",
  primary: "#294a41",
  accent: "#f4c96b",
  whatsapp: "5511999999999",
  hours: "Hoje até 19h",
  active: true,
};

const items: Item[] = [
  { id:"corte", category:"Cortes", name:"Corte clássico", description:"Tesoura e máquina, acabamento e finalização.", price:45, duration:45, image:"https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=900&q=80", variants:[{name:"Tradicional"},{name:"Degradê",price:55}] },
  { id:"combo", category:"Combos", name:"Corte + barba", description:"Pacote completo para sair pronto.", price:75, duration:75, image:"https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=900&q=80", variants:[{name:"Tradicional"},{name:"Toalha quente",price:85}] },
  { id:"barba", category:"Barba", name:"Barba completa", description:"Desenho, acabamento e hidratação.", price:35, duration:30, image:"https://images.unsplash.com/photo-1622296089863-eb7fc530daa8?auto=format&fit=crop&w=900&q=80" },
  { id:"acabamento", category:"Cortes", name:"Acabamento", description:"Pezinho e contorno para segurar o corte por mais tempo.", price:20, duration:15, image:"https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=900&q=80" },
];

function money(value?: number) {
  return value == null ? "Sob consulta" : value.toLocaleString("pt-BR",{style:"currency",currency:"BRL"});
}

function Nav() {
  return <header className="nav shell">
    <a className="brand" href="/"><span className="brand-mark">V</span><span>Vitrine Local</span></a>
    <div className="nav-actions"><a className="btn ghost" href="/barbearia-do-ze">Ver demo</a><a className="btn dark" href="/auth">Entrar</a></div>
  </header>;
}

function Home() {
  return <main className="landing"><Nav/><section className="hero shell">
    <div className="hero-copy">
      <span className="eyebrow"><Sparkles size={14}/> catálogo, carrinho e WhatsApp</span>
      <h1>Seu negócio local com cara de marca grande.</h1>
      <p>Uma vitrine digital bonita, simples de administrar e pronta para transformar visitas em pedidos no WhatsApp.</p>
      <div className="actions"><a className="btn dark" href="/barbearia-do-ze">Abrir catálogo demo</a><a className="btn ghost" href="/auth">Acessar painel</a></div>
    </div>
    <div className="preview-card">
      <div className="preview-inner">
        <span className="eyebrow light">Barbearia do Zé</span>
        <h2>Escolha seu corte. O resto é conversa.</h2>
        <div className="mini-card a"><strong>Corte clássico</strong><span>45 min · R$ 45</span></div>
        <div className="mini-card b"><strong>Barba completa</strong><span>30 min · R$ 35</span></div>
        <div className="mini-card c"><ShoppingBag size={16}/> Pedido pronto para WhatsApp</div>
      </div>
    </div>
  </section></main>;
}

function Catalog() {
  const [category,setCategory] = useState("Todos");
  const [cart,setCart] = useState<CartLine[]>([]);
  const [variants,setVariants] = useState<Record<string,string>>({});
  const categories = useMemo(()=>["Todos",...Array.from(new Set(items.map(i=>i.category)))],[]);
  const visible = category==="Todos"?items:items.filter(i=>i.category===category);
  const total = cart.reduce((s,l)=>s+(l.unitPrice??0)*l.qty,0);
  const duration = cart.reduce((s,l)=>s+(l.item.duration??0)*l.qty,0);
  const count = cart.reduce((s,l)=>s+l.qty,0);

  function add(item:Item){
    const selected = variants[item.id] || item.variants?.[0]?.name;
    const variant = item.variants?.find(v=>v.name===selected);
    const price = variant?.price ?? item.price;
    setCart(current=>{
      const idx=current.findIndex(l=>l.item.id===item.id && l.variant===selected);
      if(idx>=0) return current.map((l,i)=>i===idx?{...l,qty:l.qty+1}:l);
      return [...current,{item,variant:selected,unitPrice:price,qty:1}];
    });
  }

  function qty(index:number,delta:number){
    setCart(current=>current.flatMap((line,i)=>{
      if(i!==index) return [line];
      const next=line.qty+delta;
      return next<=0?[]:[{...line,qty:next}];
    }));
  }

  function send(){
    const lines=cart.map(l=>"• "+l.qty+"x "+l.item.name+(l.variant?" ("+l.variant+")":"")+" — "+money(l.unitPrice));
    const text=["Olá, "+business.name+"! Quero fazer este pedido:","",...lines,"",duration?"Duração estimada: "+duration+" min":"","Total: "+money(total)].filter(Boolean).join("\n");
    window.open("https://wa.me/"+business.whatsapp+"?text="+encodeURIComponent(text),"_blank","noopener,noreferrer");
  }

  return <main className="catalog" style={{"--biz-primary":business.primary,"--biz-accent":business.accent} as React.CSSProperties}>
    <div className="catalog-shell">
      <header className="catalog-nav">
        <div className="biz"><div className="logo">Z</div><div><strong>{business.name}</strong><span>{business.subtitle}</span></div></div>
        <button className="cart-chip"><ShoppingBag size={17}/>{count}</button>
      </header>

      <div className="catalog-grid">
        <section>
          <div className="catalog-hero"><span className="status">● {business.hours}</span><h1>Seu estilo começa aqui.</h1><p>{business.description}</p><div className="actions"><a className="btn accent" href="#catalogo">Ver catálogo</a><a className="btn glass-btn" target="_blank" rel="noreferrer" href={"https://wa.me/"+business.whatsapp}><MessageCircle size={16}/> WhatsApp</a></div></div>
          <div id="catalogo" className="tabs">{categories.map(c=><button key={c} className={category===c?"active":""} onClick={()=>setCategory(c)}>{c}</button>)}</div>
          <div className="products">{visible.map(item=><article className="product" key={item.id}>
            <img src={item.image} alt={item.name}/>
            <div className="product-body"><h3>{item.name}</h3><p>{item.description}</p>
              {item.variants&&<select value={variants[item.id]||item.variants[0].name} onChange={e=>setVariants(v=>({...v,[item.id]:e.target.value}))}>{item.variants.map(v=><option key={v.name} value={v.name}>{v.name}{v.price?" · "+money(v.price):""}</option>)}</select>}
              <div className="product-foot"><div><strong>{money(item.price)}</strong>{item.duration&&<span>{item.duration} min</span>}</div><button onClick={()=>add(item)}><Plus size={18}/></button></div>
            </div>
          </article>)}</div>
        </section>

        <aside className="cart">
          <h2>Seu pedido</h2>
          {cart.length===0?<p className="muted-light">Adicione itens para montar o pedido.</p>:cart.map((line,index)=><div className="cart-line" key={line.item.id+"-"+line.variant}><div><strong>{line.item.name}</strong><span>{line.variant||money(line.unitPrice)}</span></div><div className="qty"><button onClick={()=>qty(index,-1)}><Minus size={12}/></button>{line.qty}<button onClick={()=>qty(index,1)}><Plus size={12}/></button></div></div>)}
          <div className="total"><span>Total</span><strong>{money(total)}</strong></div>
          {duration>0&&<small className="muted-light">Duração estimada: {duration} min</small>}
          <button disabled={!cart.length} onClick={send} className="btn whatsapp full"><MessageCircle size={16}/> Enviar pelo WhatsApp</button>
        </aside>
      </div>
    </div>
    {count>0&&<div className="mobile-cart"><div><small>{count} item(ns)</small><strong>{money(total)}</strong></div><button className="btn whatsapp" onClick={send}>Enviar pedido</button></div>}
  </main>;
}

function Auth(){
  return <main className="soft-page"><div className="form-card"><a className="brand" href="/"><span className="brand-mark">V</span><span>Vitrine Local</span></a><span className="eyebrow top">Acesso do lojista</span><h1>Entre no seu painel.</h1><p className="muted">Use o email vinculado à sua empresa.</p><label>Email<input type="email" placeholder="voce@empresa.com"/></label><label>Senha<input type="password" placeholder="••••••••"/></label><a className="btn dark full" href="/painel">Entrar</a></div></main>;
}

function Dashboard({admin=false}:{admin?:boolean}){
  const rows=admin?[["Barbearia do Zé","/barbearia-do-ze","Serviços","Ativa"],["Empório Central","/emporio-central","Produtos","Ativa"],["Studio Aurora","/studio-aurora","Ambos","Pausada"]]:items.map(i=>[i.name,i.category,money(i.price),i.duration?i.duration+" min":"—"]);
  return <main className="dashboard"><div className="dash-shell"><aside className="sidebar"><div className="brand white"><span className="brand-mark">V</span><span>Vitrine Local</span></div><nav><a className="active">{admin?"Empresas":"Visão geral"}</a><a>{admin?"Convites":"Catálogo"}</a><a>{admin?"Configurações":"Empresa"}</a></nav></aside><section className="dash-main"><header><div><span className="eyebrow">{admin?"Super admin":"Barbearia do Zé"}</span><h1>{admin?"Empresas":"Seu catálogo"}</h1></div><button className="btn dark">{admin?"Criar empresa":"Novo item"}</button></header><div className="stats"><div><span>Total</span><strong>{admin?3:items.length}</strong></div><div><span>Ativos</span><strong>{admin?2:items.length}</strong></div><div><span>Status</span><strong>{admin?"1 pausada":"Online"}</strong></div></div><div className="table-card"><table><thead><tr>{(admin?["Empresa","Link","Tipo","Status"]:["Item","Categoria","Preço","Duração"]).map(h=><th key={h}>{h}</th>)}</tr></thead><tbody>{rows.map((row,i)=><tr key={i}>{row.map((cell,j)=><td key={j}>{j===0?<strong>{cell}</strong>:cell}</td>)}</tr>)}</tbody></table></div></section></div></main>;
}

function App(){
  const path=window.location.pathname.replace(/\/$/,"")||"/";
  if(path==="/") return <Home/>;
  if(path==="/auth") return <Auth/>;
  if(path==="/painel") return <Dashboard/>;
  if(path==="/admin") return <Dashboard admin/>;
  return <Catalog/>;
}

createRoot(document.getElementById("root")!).render(<React.StrictMode><App/></React.StrictMode>);
