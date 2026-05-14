import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";

const data = [
  {
    name: "Diana Lorenz",
    role: "Diretora de Operações, Symmetry",
    text: "A Nexlift automatizou nosso onboarding e cortou 70% do tempo manual. Em dois meses ganhamos capacidade de atender o triplo de clientes.",
  },
  {
    name: "Rafael Mendes",
    role: "Founder, FolhaPro",
    text: "Nosso app saiu do zero ao ar em 5 semanas. Time sênior, comunicação clara e zero retrabalho. Recomendo de olhos fechados.",
  },
  {
    name: "Carla Vieira",
    role: "CMO, Quotient",
    text: "O tráfego pago passou de custo a investimento previsível. Estrutura impecável e relatórios que finalmente fazem sentido.",
  },
];

export function Testimonials() {
  const [i, setI] = useState(0);
  const next = () => setI((p) => (p + 1) % data.length);
  const prev = () => setI((p) => (p - 1 + data.length) % data.length);
  const t = data[i];
  return (
    <section id="cases" className="mx-auto mt-24 w-[min(1100px,94%)]">
      <div className="text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-lime">Quem já cresceu com a gente</p>
        <h2 className="mx-auto mt-3 max-w-2xl text-4xl font-bold text-ink md:text-5xl">O que nossos clientes dizem</h2>
      </div>

      <div className="relative mt-10 rounded-3xl border border-border bg-card p-8 md:p-12">
        <Quote className="h-10 w-10 text-lime" />
        <AnimatePresence mode="wait">
          <motion.div
            key={i}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <p className="mt-4 text-2xl font-display leading-snug text-ink md:text-3xl">"{t.text}"</p>
            <div className="mt-6 flex items-center gap-4">
              <div className="grid h-12 w-12 place-items-center rounded-full bg-lime font-bold text-ink">
                {t.name[0]}
              </div>
              <div>
                <p className="font-semibold text-ink">{t.name}</p>
                <p className="text-sm text-muted-foreground">{t.role}</p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
        <div className="mt-8 flex items-center justify-between">
          <div className="flex gap-2">
            {data.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setI(idx)}
                className={`h-2 rounded-full transition-all ${idx === i ? "w-8 bg-lime" : "w-2 bg-border"}`}
                aria-label={`Depoimento ${idx + 1}`}
              />
            ))}
          </div>
          <div className="flex gap-2">
            <button onClick={prev} className="grid h-10 w-10 place-items-center rounded-full border border-border hover:bg-muted">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button onClick={next} className="grid h-10 w-10 place-items-center rounded-full bg-lime text-ink">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
