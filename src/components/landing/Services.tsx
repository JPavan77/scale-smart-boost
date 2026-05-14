import { motion } from "motion/react";
import { Bot, Code2, Megaphone } from "lucide-react";

const services = [
  {
    icon: Bot,
    title: "Automação com IA",
    desc: "Eliminamos tarefas repetitivas com agentes de IA e scripts sob medida que rodam 24/7 no seu fluxo.",
    bullets: ["Integrações com seus sistemas", "Agentes que conversam, leem e agem", "ROI mensurável em semanas"],
  },
  {
    icon: Code2,
    title: "Apps & Web Apps",
    desc: "Desenvolvemos aplicativos e plataformas web rápidas, escaláveis e desenhadas para conversão.",
    bullets: ["MVP em 4–6 semanas", "Stack moderna e segura", "Design pensado para uso real"],
  },
  {
    icon: Megaphone,
    title: "Tráfego Pago",
    desc: "Campanhas com foco em receita, não em vaidade. Estrutura, criativos e otimização baseada em dados.",
    bullets: ["Meta, Google e LinkedIn Ads", "Criativos testados semanalmente", "Dashboard de performance"],
  },
];

export function Services() {
  return (
    <section id="servicos" className="mx-auto mt-24 w-[min(1100px,94%)]">
      <div className="text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-lime">O que fazemos</p>
        <h2 className="mx-auto mt-3 max-w-2xl text-4xl font-bold text-ink md:text-5xl">
          Três frentes que fazem sua empresa <span className="text-lime">crescer</span>
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
          Atuamos onde o gargalo está: operação, produto ou aquisição. Você escolhe — ou combina os três.
        </p>
      </div>

      <div className="mt-12 grid gap-5 md:grid-cols-3">
        {services.map((s, i) => (
          <motion.div
            key={s.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ y: -6 }}
            className="group rounded-3xl border border-border bg-card p-7 shadow-sm transition-shadow hover:shadow-lg"
          >
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-lime-soft text-ink transition-colors group-hover:bg-lime">
              <s.icon className="h-6 w-6" />
            </div>
            <h3 className="mt-5 text-xl font-bold text-ink">{s.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
            <ul className="mt-5 space-y-2 text-sm">
              {s.bullets.map((b) => (
                <li key={b} className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-lime" />
                  {b}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
