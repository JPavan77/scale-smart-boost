import { motion } from "motion/react";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const links = [
  { href: "#servicos", label: "Serviços" },
  { href: "#processo", label: "Processo" },
  { href: "#cases", label: "Cases" },
  { href: "#precos", label: "Preços" },
  { href: "#faq", label: "FAQ" },
];

export function Nav() {
  const [open, setOpen] = useState(false);
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="sticky top-4 z-50 mx-auto w-[min(1100px,94%)]"
    >
      <div className="flex items-center justify-between rounded-2xl border border-border/60 bg-card/80 px-5 py-3 shadow-sm backdrop-blur">
        <a href="#" className="flex items-center gap-2 font-display text-xl font-bold">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-lime text-ink">⌁</span>
          <span>Nexlift</span>
        </a>
        <nav className="hidden items-center gap-7 text-sm text-muted-foreground md:flex">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="transition-colors hover:text-foreground">
              {l.label}
            </a>
          ))}
        </nav>
        <a
          href="#contato"
          className="hidden rounded-xl bg-lime px-4 py-2 text-sm font-semibold text-ink shadow-[0_4px_0_0_oklch(0.65_0.2_130)] transition-transform hover:-translate-y-0.5 md:inline-block"
        >
          Falar com a gente
        </a>
        <button onClick={() => setOpen(!open)} className="md:hidden" aria-label="Menu">
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <div className="mt-2 rounded-2xl border border-border/60 bg-card p-4 md:hidden">
          {links.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="block py-2 text-sm">
              {l.label}
            </a>
          ))}
          <a href="#contato" className="mt-2 block rounded-xl bg-lime px-4 py-2 text-center text-sm font-semibold text-ink">
            Falar com a gente
          </a>
        </div>
      )}
    </motion.header>
  );
}
