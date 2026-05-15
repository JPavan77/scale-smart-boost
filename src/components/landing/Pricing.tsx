import { motion } from "motion/react";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Starter",
    price: "Sob medida",
    period: "",
    desc: "Ideal para montar uma automação ou rodar uma primeira campanha.",
    features: ["Uma equipe compartilhada para o seu projeto", "Até 1 serviço mensal ativo", "Contrato mínimo de 3 meses", "Reuniões de alinhamento mensais"],
  },
  {
    name: "Growth",
    price: "Sob medida",
    period: "",
    desc: "Para empresas que querem evoluir produto, operação e aquisição em paralelo.",
    features: ["Uma equipe compartilhada para o seu projeto", "Até 2 serviços mensais ativos simultaneamente", "Contrato mínimo de 3 meses", "Reuniões de alinhamento mensais"],
    highlight: true,
  },
  {
    name: "Scale",
    price: "Sob medida",
    period: "",
    desc: "Operação completa para quem precisa escalar agora, com SLA e prioridade total.",
    features: ["Uma equipe exclusiva dedicada full-time ao seu projeto", "Múltiplos serviços simultâneos", "Reuniões de alinhamento quinzenais"],
  },
];

export function Pricing() {
  return (
    <section id="precos" className="mx-auto mt-24 w-[min(1100px,94%)]">
      <div className="text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-lime">Planos transparentes</p>
        <h2 className="mx-auto mt-3 max-w-2xl text-4xl font-bold text-ink md:text-5xl">Escolha o ritmo do seu crescimento</h2>
      </div>
      <div className="mt-12 grid gap-5 md:grid-cols-3">
        {plans.map((p, i) => (
          <motion.div
            key={p.name}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className={`relative rounded-3xl border p-7 transition-shadow hover:shadow-lg ${
              p.highlight ? "border-lime bg-card shadow-[0_8px_30px_-10px_oklch(0.78_0.22_130)]" : "border-border bg-card"
            }`}
          >
            {p.highlight && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-lime px-3 py-1 text-xs font-bold text-ink">
                Mais escolhido
              </span>
            )}
            <h3 className="text-lg font-bold text-ink">{p.name}</h3>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="text-4xl font-bold text-lime">{p.price}</span>
              <span className="text-sm text-muted-foreground">{p.period}</span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{p.desc}</p>
            <ul className="mt-6 space-y-3 text-sm">
              {p.features.map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-lime" /> {f}
                </li>
              ))}
            </ul>
            <a
              href="#contato"
              className={`mt-7 inline-block w-full rounded-xl px-4 py-3 text-center font-semibold transition-transform hover:-translate-y-0.5 ${
                p.highlight
                  ? "bg-lime text-ink shadow-[0_4px_0_0_oklch(0.65_0.2_130)]"
                  : "border border-border bg-background text-ink"
              }`}
            >
              Quero esse plano
            </a>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
