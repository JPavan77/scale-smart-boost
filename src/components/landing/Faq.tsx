import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { Plus } from "lucide-react";

const items = [
  { q: "Em quanto tempo vejo resultado?", a: "Para automações simples, em 2 a 4 semanas. Apps em 4 a 6. Tráfego pago começa a gerar dados acionáveis nos primeiros 14 dias." },
  { q: "Vocês atendem empresas pequenas?", a: "Sim. Trabalhamos com startups e PMEs em crescimento — o porte não importa, o que importa é ter clareza do problema a resolver." },
  { q: "Como funciona a cobrança?", a: "Por projeto fechado (escopo claro) ou mensalidade (squad dedicado). Sempre transparente, sem letras miúdas." },
  { q: "Posso combinar mais de um serviço?", a: "Pode e recomendamos. Automação + tráfego, por exemplo, multiplica o efeito de cada um." },
  { q: "E se eu não souber o que preciso?", a: "Faça o diagnóstico gratuito. Em 30 minutos mapeamos seus gargalos e indicamos o caminho — mesmo que não seja com a gente." },
];

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="mx-auto mt-24 w-[min(800px,94%)]">
      <div className="text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-lime">FAQ</p>
        <h2 className="mt-3 text-4xl font-bold text-ink md:text-5xl">Perguntas frequentes</h2>
      </div>
      <div className="mt-10 space-y-3">
        {items.map((it, i) => {
          const isOpen = open === i;
          return (
            <div key={it.q} className="rounded-2xl border border-border bg-card">
              <button
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-4 p-5 text-left"
              >
                <span className="font-semibold text-ink">{it.q}</span>
                <motion.span animate={{ rotate: isOpen ? 45 : 0 }} className="grid h-8 w-8 place-items-center rounded-full bg-lime-soft">
                  <Plus className="h-4 w-4 text-ink" />
                </motion.span>
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <p className="px-5 pb-5 text-sm text-muted-foreground">{it.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}
