import { motion } from "motion/react";
import { Sparkles, ArrowRight, Play } from "lucide-react";

export function Hero() {
  return (
    <section className="relative mx-auto mt-10 w-[min(1100px,94%)] overflow-hidden rounded-[32px] border border-border/60 bg-card px-6 py-20 text-center shadow-sm md:py-28">
      <div className="absolute inset-0 bg-grain opacity-70" />
      {/* Sparkles */}
      {[
        { top: "12%", left: "8%", size: 80 },
        { top: "20%", right: "10%", size: 60 },
        { bottom: "18%", left: "14%", size: 50 },
        { bottom: "10%", right: "16%", size: 70 },
        { top: "55%", left: "5%", size: 30 },
      ].map((s, i) => (
        <motion.div
          key={i}
          className="sparkle absolute rounded-full opacity-50"
          style={{ ...s, width: s.size, height: s.size }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 3 + i, repeat: Infinity, delay: i * 0.4 }}
        />
      ))}

      <div className="relative">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-1.5 text-xs font-medium text-muted-foreground"
        >
          <Sparkles className="h-3.5 w-3.5 text-lime" />
          Automação · Apps · Tráfego que converte
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mx-auto mt-6 max-w-3xl text-5xl font-bold leading-[1.05] text-ink md:text-7xl"
        >
          Escale as vendas da sua empresa <span className="text-lime">sem aumentar</span> o esforço manual
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="mx-auto mt-6 max-w-xl text-base text-muted-foreground md:text-lg"
        >
          Automatizamos processos com IA, construímos apps sob medida e rodamos campanhas que trazem clientes — tudo em um só time.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-3"
        >
          <a
            href="#contato"
            className="group inline-flex items-center gap-2 rounded-xl bg-lime px-6 py-3 font-semibold text-ink shadow-[0_4px_0_0_oklch(0.65_0.2_130)] transition-transform hover:-translate-y-0.5"
          >
            Diagnóstico gratuito
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
          <a
            href="#processo"
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-6 py-3 font-semibold text-ink hover:bg-muted"
          >
            <Play className="h-4 w-4" /> Ver como funciona
          </a>
        </motion.div>

        <p className="mt-12 text-xs uppercase tracking-widest text-muted-foreground">Confiado por empresas em crescimento</p>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
          {["Quotient", "Finch", "Hourglass", "FolhaPro", "Chase ●"].map((b) => (
            <span
              key={b}
              className="rounded-xl border border-border bg-lime-soft/60 px-4 py-2 text-sm font-semibold text-ink"
            >
              {b}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
