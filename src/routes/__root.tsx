import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HeadContent, Link, Outlet, Scripts, createRootRouteWithContext, useRouter } from "@tanstack/react-router";
import appCss from "../styles.css?url";

function NotFound() {
  return (
    <main className="shell center-page">
      <div className="glass empty-card">
        <span className="eyebrow">404</span>
        <h1>Página não encontrada</h1>
        <p>Esse endereço não existe ou o catálogo mudou de lugar.</p>
        <Link to="/" className="button primary">Voltar ao início</Link>
      </div>
    </main>
  );
}

function ErrorPage({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <main className="shell center-page">
      <div className="glass empty-card">
        <span className="eyebrow">Erro</span>
        <h1>Não foi possível carregar esta página.</h1>
        <p>Tente novamente. A internet já tem drama suficiente sem inventarmos mais um.</p>
        <button className="button primary" onClick={() => { router.invalidate(); reset(); }}>Tentar novamente</button>
      </div>
    </main>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Vitrine Local" },
      { name: "description", content: "Catálogos digitais com pedidos pelo WhatsApp para negócios locais." },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,700&family=Inter:wght@400;500;600;700;800&display=swap" },
      { rel: "stylesheet", href: appCss },
    ],
  }),
  shellComponent: ({ children }) => (
    <html lang="pt-BR"><head><HeadContent /></head><body>{children}<Scripts /></body></html>
  ),
  component: function Root() {
    const { queryClient } = Route.useRouteContext();
    return <QueryClientProvider client={queryClient}><Outlet /></QueryClientProvider>;
  },
  notFoundComponent: NotFound,
  errorComponent: ErrorPage,
});
