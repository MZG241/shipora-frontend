"use client";

import { motion } from "framer-motion";
import { PackageSearch } from "lucide-react";

export function TrackHero() {
  return (
    <section className="relative overflow-hidden bg-white pt-32 pb-16 sm:pt-40 sm:pb-20">
      {/* Grille */}
      <div
        className="pointer-events-none absolute inset-0 opacity-50"
        style={{
          backgroundImage: `
            linear-gradient(
              to right,
              rgba(22, 119, 255, 0.07) 1px,
              transparent 1px
            ),
            linear-gradient(
              to bottom,
              rgba(22, 119, 255, 0.07) 1px,
              transparent 1px
            )
          `,
          backgroundSize: "48px 48px",
          maskImage:
            "radial-gradient(ellipse 70% 65% at 50% 25%, black 15%, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 70% 65% at 50% 25%, black 15%, transparent 75%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.6,
          }}
        >
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-primary-light text-primary">
            <PackageSearch size={27} />
          </div>

          <p className="mt-6 text-sm font-bold uppercase tracking-[0.18em] text-primary">
            Suivi de colis
          </p>

          <h1 className="mx-auto mt-4 max-w-3xl text-4xl font-bold leading-tight tracking-tight text-slate-950 sm:text-6xl">
            Suivez votre colis,
            <span className="block text-primary">
              où qu'il soit.
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            Entrez votre numéro de suivi pour connaître
            l'état actuel de votre colis et suivre son évolution.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

