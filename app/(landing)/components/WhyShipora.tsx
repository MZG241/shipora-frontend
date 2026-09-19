
"use client";

import { motion } from "framer-motion";
import {
  Globe2,
  LockKeyhole,
  RefreshCw,
  Zap,
} from "lucide-react";

const benefits = [
  {
    icon: Zap,
    title: "Simple à utiliser",
    description:
      "Une interface claire pensée pour permettre à votre équipe de travailler rapidement.",
  },
  {
    icon: Globe2,
    title: "Accessible partout",
    description:
      "Accédez à vos opérations depuis n'importe quel appareil connecté à Internet.",
  },
  {
    icon: RefreshCw,
    title: "Tout est centralisé",
    description:
      "Expéditions, colis, clients, tarifs, factures et paiements réunis au même endroit.",
  },
  {
    icon: LockKeyhole,
    title: "Données isolées",
    description:
      "Chaque organisation dispose d'un espace séparé pour garder ses données protégées.",
  },
];

export function WhyShipora() {
  return (
    <section className="relative overflow-hidden bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid items-center gap-16 lg:grid-cols-[0.8fr_1.2fr]">
          {/* Texte */}
          <motion.div
            initial={{
              opacity: 0,
              x: -25,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            viewport={{
              once: true,
              amount: 0.3,
            }}
            transition={{
              duration: 0.6,
            }}
          >
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary">
              Pourquoi Shipora ?
            </p>

            <h2 className="mt-4 text-4xl font-bold leading-tight tracking-tight text-slate-950 sm:text-5xl">
              Moins de complexité.
              <span className="block text-primary">
                Plus de contrôle.
              </span>
            </h2>

            <p className="mt-6 max-w-lg text-lg leading-8 text-slate-600">
              Shipora est conçu pour permettre aux entreprises
              logistiques de gérer leurs opérations sans multiplier
              les outils et les fichiers.
            </p>

            <div className="mt-8 flex items-center gap-3">
              <div className="h-px w-10 bg-primary" />

              <span className="text-sm font-semibold text-slate-500">
                Une seule plateforme pour toute votre activité.
              </span>
            </div>
          </motion.div>

          {/* Benefits */}
          <div className="grid gap-4 sm:grid-cols-2">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;

              return (
                <motion.div
                  key={benefit.title}
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
                    amount: 0.2,
                  }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.08,
                  }}
                  whileHover={{
                    y: -4,
                  }}
                  className="group rounded-2xl border border-slate-200 bg-white p-6 transition-shadow duration-300 hover:shadow-lg hover:shadow-slate-200/50"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-light text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-white">
                    <Icon size={20} />
                  </div>

                  <h3 className="mt-5 text-lg font-bold text-slate-950">
                    {benefit.title}
                  </h3>

                  <p className="mt-2 leading-7 text-slate-600">
                    {benefit.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

