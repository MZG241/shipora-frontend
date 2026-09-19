"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  Building2,
  PackagePlus,
  ScanLine,
  Settings2,
} from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Building2,
    title: "Créez votre organisation",
    description:
      "Configurez votre entreprise et créez votre espace de travail sur Shipora.",
  },
  {
    number: "02",
    icon: Settings2,
    title: "Configurez vos opérations",
    description:
      "Ajoutez vos clients, entrepôts et règles tarifaires adaptées à votre activité.",
  },
  {
    number: "03",
    icon: PackagePlus,
    title: "Gérez vos expéditions",
    description:
      "Créez vos expéditions, ajoutez les colis et centralisez toutes leurs informations.",
  },
  {
    number: "04",
    icon: ScanLine,
    title: "Suivez chaque colis",
    description:
      "Utilisez les codes-barres et QR codes pour suivre facilement vos colis.",
  },
];

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="relative overflow-hidden bg-slate-50 py-24 sm:py-32"
    >
      {/* Décoration */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-primary/5 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center"
        >
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary">
            Comment ça marche
          </p>

          <h2 className="mt-4 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
            Simple à mettre en place.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            Quelques étapes suffisent pour commencer à gérer
            votre activité logistique avec Shipora.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative mt-16">
          {/* Ligne centrale desktop */}
          <div className="absolute left-[12.5%] right-[12.5%] top-[55px] hidden h-px bg-slate-200 lg:block" />

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => {
              const Icon = step.icon;

              return (
                <motion.div
                  key={step.number}
                  initial={{
                    opacity: 0,
                    y: 30,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{
                    once: true,
                    amount: 0.2,
                  }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.1,
                  }}
                  className="relative"
                >
                  {/* Numéro + icône */}
                  <div className="relative z-10 mx-auto flex h-[110px] w-[110px] items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-light text-primary">
                      <Icon size={25} strokeWidth={2} />
                    </div>

                    <span className="absolute -right-1 -top-1 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
                      {step.number}
                    </span>
                  </div>

                  {/* Contenu */}
                  <div className="mt-7 text-center">
                    <h3 className="text-xl font-bold text-slate-950">
                      {step.title}
                    </h3>

                    <p className="mx-auto mt-3 max-w-xs leading-7 text-slate-600">
                      {step.description}
                    </p>
                  </div>

                  {/* Flèche */}
                  {index < steps.length - 1 && (
                    <div className="absolute -right-5 top-[42px] z-20 hidden h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-white lg:flex">
                      <ArrowRight
                        size={14}
                        className="text-primary"
                      />
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.6,
            delay: 0.2,
          }}
          className="mx-auto mt-16 max-w-2xl rounded-2xl border border-primary/10 bg-white p-6 text-center shadow-sm sm:p-8"
        >
          <p className="text-lg font-bold text-slate-950">
            Tout est centralisé dans un seul espace.
          </p>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            De la création d'une expédition jusqu'au suivi et
            à la facturation, votre équipe garde une vision claire.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

