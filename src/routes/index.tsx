import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ShoppingBag, Sparkles } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "Vitrine Local — seu catálogo digital, do seu jeito" },
    { name: "description", content: "Catálogos digitais personalizados para negócios locais receberem pedidos pelo WhatsApp." },
  ] }),
  component: Home,
});

function Home() {
  return (
    <main className="landing">
      <div className="shell">
        <header className="site-nav">
          <Link to="/" className="brand"><span className="brand-mark">V</span><span>Vitrine Local</span></Link>
          <div style={{display:"flex",gap:8}}>
            <Link to="/barbearia-do-ze" className="button secondary">Ver demonstração</Link>
            <Link to="/auth" className="button primary">Entrar</Link>
          </div>
        </header>

        <section className="hero">
          <div>
            <span className="eyebrow"><Sparkles size={14}/> catálogo, carrinho e WhatsApp</span>
            <h1>Seu negócio local com cara de marca grande.</h1>
            <p>Crie um catálogo bonito, rápido e personalizado. Seus clientes escolhem produtos ou serviços, montam o pedido e enviam tudo pronto pelo WhatsApp.</p>
            <div className="hero-actions">
              <Link to="/barbearia-do-ze" className="button primary">Abrir catálogo demo <ArrowRight size={17}/></Link>
              <Link to="/auth" className="button secondary">Acessar painel</Link>
            </div>
          </div>

          <div className="glass mockup">
            <div className="mockup-window">
              <div className="eyebrow" style={{color:"rgba(255,255,255,.65)"}}>Barbearia do Zé</div>
              <h2 style={{fontSize:48,marginTop:12}}>Escolha seu corte. O resto é conversa.</h2>
              <div className="mockup-card one"><strong>Corte clássico</strong><br/><small>45 min · R$ 45</small></div>
              <div className="mockup-card two"><strong>Barba completa</strong><br/><small>30 min · R$ 35</small></div>
              <div className="mockup-card three"><ShoppingBag size={16}/> Pedido pronto para WhatsApp</div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
