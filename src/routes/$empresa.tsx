import { createFileRoute } from "@tanstack/react-router";
import { Minus, Plus, ShoppingBag, MessageCircle } from "lucide-react";
import { useState } from "react";
import { demoBusiness, demoItems, type CatalogItem } from "@/data/demo";

type CartLine = { item: CatalogItem; variant?: string; unitPrice?: number; qty: number };

export const Route = createFileRoute("/$empresa")({
  head: ({ params }) => ({
    meta: [
      { title: (params.empresa === demoBusiness.slug ? demoBusiness.name : "Catálogo") + " — Catálogo" },
      { name: "description", content: demoBusiness.description },
    ],
  }),
  component: Catalog,
});

function money(value?: number) {
  return value == null ? "Sob consulta" : value.toLocaleString("pt-BR",{style:"currency",currency:"BRL"});
}

function Catalog() {
  const { empresa } = Route.useParams();
  const business = empresa === demoBusiness.slug ? demoBusiness : { ...demoBusiness, name: empresa.replaceAll("-"," ") };
  const [category,setCategory] = useState("Todos");
  const [cart,setCart] = useState<CartLine[]>([]);
  const [variants,setVariants] = useState<Record<string,string>>({});

  if (!business.active) return <main className="offline"><div className="empty-card"><h1>Catálogo temporariamente indisponível</h1><p>Este estabelecimento pausou o catálogo.</p></div></main>;

  const categories = ["Todos",...Array.from(new Set(demoItems.map(i=>i.category)))];
  const visible = category === "Todos" ? demoItems : demoItems.filter(i=>i.category===category);
  const total = cart.reduce((sum,l)=>sum+(l.unitPrice ?? 0)*l.qty,0);
  const duration = cart.reduce((sum,l)=>sum+(l.item.duration ?? 0)*l.qty,0);
  const count = cart.reduce((sum,l)=>sum+l.qty,0);

  function add(item: CatalogItem){
    const selected = variants[item.id] || item.variants?.[0]?.name;
    const variant = item.variants?.find(v=>v.name===selected);
    const price = variant?.price ?? item.price;
    setCart(current=>{
      const idx=current.findIndex(l=>l.item.id===item.id && l.variant===selected);
      if(idx>=0) return current.map((l,i)=>i===idx?{...l,qty:l.qty+1}:l);
      return [...current,{item,variant:selected,unitPrice:price,qty:1}];
    });
  }

  function changeQty(index:number,delta:number){
    setCart(current=>current.flatMap((l,i)=>{
      if(i!==index) return [l];
      const qty=l.qty+delta;
      return qty<=0?[]:[{...l,qty}];
    }));
  }

  function sendWhatsApp(){
    const lines = cart.map(l=>"• "+l.qty+"x "+l.item.name+(l.variant?" ("+l.variant+")":"")+" — "+money(l.unitPrice));
    const body = [
      "Olá, "+business.name+"! Quero fazer este pedido:",
      "",
      ...lines,
      "",
      duration ? "Duração estimada: "+duration+" min" : "",
      "Total: "+money(total),
    ].filter(Boolean).join("\n");
    window.open("https://wa.me/"+business.whatsapp+"?text="+encodeURIComponent(body),"_blank","noopener,noreferrer");
  }

  return (
    <main className="catalog-page" style={{"--biz-primary":business.primary,"--biz-accent":business.accent} as React.CSSProperties}>
      <div className="catalog-shell">
        <header className="catalog-nav">
          <div className="biz">
            <div className="biz-logo" style={{display:"grid",placeItems:"center",fontFamily:"Fraunces",fontSize:22}}>Z</div>
            <div><div className="biz-name">{business.name}</div><div className="biz-sub">{business.subtitle}</div></div>
          </div>
          <button className="button cart-pill"><ShoppingBag size={17}/> {count}</button>
        </header>

        <div className="catalog-layout">
          <section className="catalog-main">
            <div className="hero-glass">
              <span className="status"><span className="dot"/>{business.hours}</span>
              <h1>Seu estilo começa aqui.</h1>
              <p>{business.description}</p>
              <div className="hero-actions">
                <a href="#catalogo" className="button catalog-primary">Ver catálogo</a>
                <a href={"https://wa.me/"+business.whatsapp} target="_blank" rel="noreferrer" className="button catalog-secondary"><MessageCircle size={17}/> Falar no WhatsApp</a>
              </div>
            </div>

            <div id="catalogo" className="category-tabs">
              {categories.map(c=><button key={c} onClick={()=>setCategory(c)} className={"category-tab "+(category===c?"active":"")}>{c}</button>)}
            </div>

            <div className="product-grid">
              {visible.map(item=>(
                <article key={item.id} className="product-card">
                  <img src={item.image} alt={item.name} className="product-image"/>
                  <div className="product-body">
                    <div><h3>{item.name}</h3><p className="product-desc">{item.description}</p></div>
                    {item.variants && <select className="variant-select" value={variants[item.id] || item.variants[0].name} onChange={e=>setVariants(v=>({...v,[item.id]:e.target.value}))}>
                      {item.variants.map(v=><option key={v.name} value={v.name}>{v.name}{v.price?" · "+money(v.price):""}</option>)}
                    </select>}
                    <div className="product-meta">
                      <div><div className="price">{money(item.price)}</div>{item.duration && <div className="duration">{item.duration} min</div>}</div>
                      <button className="add-button" aria-label={"Adicionar "+item.name} onClick={()=>add(item)}><Plus size={19}/></button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <aside className="cart-panel">
            <h2>Seu pedido</h2>
            {cart.length===0 ? <p className="cart-empty">Adicione itens para montar o pedido.</p> : cart.map((line,index)=>(
              <div className="cart-line" key={line.item.id+"-"+line.variant}>
                <div><strong>{line.item.name}</strong><br/><small>{line.variant || money(line.unitPrice)}</small></div>
                <div className="qty"><button onClick={()=>changeQty(index,-1)}><Minus size={13}/></button><span>{line.qty}</span><button onClick={()=>changeQty(index,1)}><Plus size={13}/></button></div>
              </div>
            ))}
            <div className="cart-total"><span>Total</span><span>{money(total)}</span></div>
            {duration>0 && <p className="muted" style={{color:"rgba(255,255,255,.55)",fontSize:13}}>Duração estimada: {duration} min</p>}
            <button disabled={!cart.length} onClick={sendWhatsApp} className="button full whatsapp"><MessageCircle size={17}/> Enviar pelo WhatsApp</button>
          </aside>
        </div>
      </div>

      {count>0 && <div className="mobile-cart-bar"><div><small>{count} item(ns)</small><strong style={{display:"block"}}>{money(total)}</strong></div><button className="button whatsapp" onClick={sendWhatsApp}>Enviar pedido</button></div>}
    </main>
  );
}
