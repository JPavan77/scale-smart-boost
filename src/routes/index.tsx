import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/landing/Nav";
import { Hero } from "@/components/landing/Hero";
import { Services } from "@/components/landing/Services";
import { WhyUs } from "@/components/landing/WhyUs";
import { Testimonials } from "@/components/landing/Testimonials";
import { Pricing } from "@/components/landing/Pricing";
import { Faq } from "@/components/landing/Faq";
import { CtaFooter } from "@/components/landing/CtaFooter";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Nexlift — Escale suas vendas sem aumentar o esforço manual" },
      { name: "description", content: "Automação com IA, desenvolvimento de apps e tráfego pago para empresas que querem crescer sem inflar a operação." },
      { property: "og:title", content: "Nexlift — Escale suas vendas sem esforço manual" },
      { property: "og:description", content: "Automação com IA, apps sob medida e tráfego pago que vira receita." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="min-h-screen pb-10">
      <Nav />
      <Hero />
      <Services />
      <WhyUs />
      <Testimonials />
      <Pricing />
      <Faq />
      <CtaFooter />
    </main>
  );
}
