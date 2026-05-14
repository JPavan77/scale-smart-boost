import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";

export function CtaFooter() {
  return (
    <section id="contato" className="mx-auto mt-24 w-[min(1100px,94%)]">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative overflow-hidden rounded-[32px] bg-ink p-10 text-center md:p-16"
      >
        <div className="absolute inset-0 opacity-30 bg-grain" />
        <div className="relative">
          <h2 className="mx-auto max-w-2xl text-4xl font-bold text-white md:text-5xl">
            Pronto para crescer <span className="text-lime">sem se sobrecarregar</span>?
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-white/70">
            Marque um diagnóstico gratuito de 30 minutos. Sai com clareza do próximo passo, com ou sem a gente.
          </p>
          <a
            href="mailto:contato@nexlift.com"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-lime px-6 py-3 font-semibold text-ink shadow-[0_4px_0_0_oklch(0.65_0.2_130)] transition-transform hover:-translate-y-0.5"
          >
            Agendar diagnóstico <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </motion.div>
      <footer className="mt-10 flex flex-col items-center justify-between gap-3 pb-10 text-sm text-muted-foreground md:flex-row">
        <p>© {new Date().getFullYear()} Nexlift. Feito com cafeína e código.</p>
        <div className="flex gap-5">
          <a href="#" className="hover:text-foreground">Privacidade</a>
          <a href="#" className="hover:text-foreground">Termos</a>
          <a href="#" className="hover:text-foreground">Contato</a>
        </div>
      </footer>
    </section>
  );
}
