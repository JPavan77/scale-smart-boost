import { motion } from "motion/react";
import { Clock, TrendingUp, ShieldCheck, Users } from "lucide-react";

const items = [
  { icon: Clock, title: "Entrega rápida", desc: "Primeiros resultados em semanas, não meses." },
  { icon: TrendingUp, title: "Foco em receita", desc: "Tudo que fazemos precisa virar venda." },
  { icon: ShieldCheck, title: "Tecnologia confiável", desc: "Stack moderna, segura e bem documentada." },
  { icon: Users, title: "Time sênior", desc: "Quem vende é quem executa. Sem repasses." },
];

export function WhyUs() {
  return (
    <section className="mx-auto mt-24 w-[min(1100px,94%)] rounded-[32px] border border-border bg-card p-8 md:p-14">
      <div className="text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-lime">Por que a Nexlift</p>
        <h2 className="mx-auto mt-3 max-w-2xl text-4xl font-bold text-ink md:text-5xl">
          Times escolhem a gente porque <span className="text-lime">funciona</span>
        </h2>
      </div>
      <div className="mt-10 grid gap-4 md:grid-cols-4">
        {items.map((it, i) => (
          <motion.div
            key={it.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="rounded-2xl border border-border bg-background p-5"
          >
            <it.icon className="h-6 w-6 text-lime" />
            <h3 className="mt-3 font-bold text-ink">{it.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{it.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
