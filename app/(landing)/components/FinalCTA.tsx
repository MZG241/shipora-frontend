
"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export function FinalCta() {
  return (
    <section className="bg-slate-50 px-6 py-24 sm:py-32">
      <motion.div
        initial={{
          opacity: 0,
          y: 25,
        }}
        whileInView={{
          opacity: 1,
          y: 0,
        }}
        viewport={{
          once: true,
          amount: 0.3,
        }}
        transition={{
          duration: 0.6,
        }}
        className="relative mx-auto max-w-6xl overflow-hidden rounded-[32px] bg-primary px-6 py-16 text-center sm:px-12 sm:py-20"
      >
        {/* Décorations */}
        <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-white/10 blur-3xl" />

        <div className="pointer-events-none absolute -bottom-32 -left-20 h-72 w-72 rounded-full bg-blue-300/10 blur-3xl" />

        <div className="relative">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-100">
            Commencez aujourd'hui
          </p>

          <h2 className="mx-auto mt-5 max-w-3xl text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl">
            Prêt à simplifier votre logistique ?
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-blue-100">
            Centralisez vos opérations, donnez plus de visibilité
            à votre équipe et offrez une meilleure expérience
            de suivi à vos clients.
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/register"
              className="group inline-flex items-center justify-center gap-2 rounded-xl bg-white px-7 py-3.5 font-bold text-primary shadow-lg transition hover:bg-blue-50"
            >
              Créer mon organisation

              <ArrowRight
                size={18}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>

            <Link
              href="/track"
              className="inline-flex items-center justify-center rounded-xl border border-white/25 px-7 py-3.5 font-bold text-white transition hover:bg-white/10"
            >
              Suivre un colis
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-3">
            {[
              "Configuration simple",
              "Suivi public",
              "Gestion centralisée",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-2 text-sm font-medium text-blue-100"
              >
                <CheckCircle2 size={16} />
                {item}
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}

