
"use client";

import { motion } from "framer-motion";
import {
  BarChart3,
  CreditCard,
  Package,
  Settings2,
  Truck,
  Users,
} from "lucide-react";

const features = [
  {
    icon: Truck,
    title: "Gestion des expéditions",
    description:
      "Créez et suivez vos expéditions depuis une interface centralisée.",
  },
  {
    icon: Package,
    title: "Gestion des colis",
    description:
      "Gérez les colis, leurs poids, leurs statuts et leurs informations de tracking.",
  },
  {
    icon: Settings2,
    title: "Tarification flexible",
    description:
      "Configurez vos tarifs selon le poids, le volume, la destination ou le transport.",
  },
  {
    icon: CreditCard,
    title: "Facturation & paiements",
    description:
      "Centralisez vos factures, paiements et soldes au même endroit.",
  },
  {
    icon: Users,
    title: "Gestion des clients",
    description:
      "Retrouvez toutes les informations de vos clients dans un espace organisé.",
  },
  {
    icon: BarChart3,
    title: "Vue d'ensemble",
    description:
      "Visualisez vos opérations et les indicateurs importants de votre activité.",
  },
];

export function Features() {
  return (
    <section
      id="features"
      className="relative overflow-hidden bg-white py-24 sm:py-32"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Introduction */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center"
        >
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary">
            Une plateforme complète
          </p>

          <h2 className="mt-4 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
            Tout ce dont votre activité logistique a besoin.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            Shipora rassemble vos opérations dans un seul environnement
            afin de réduire la complexité et vous permettre de garder
            le contrôle.
          </p>
        </motion.div>

        {/* Features */}
        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <motion.div
                key={feature.title}
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
                  delay: index * 0.07,
                }}
                whileHover={{
                  y: -5,
                }}
                className="group rounded-2xl border border-slate-200 bg-white p-7 transition-shadow duration-300 hover:shadow-xl hover:shadow-slate-200/60"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-light text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-white">
                    <Icon size={22} strokeWidth={2} />
                  </div>

                  <span className="text-sm font-bold text-slate-200">
                    0{index + 1}
                  </span>
                </div>

                <h3 className="mt-7 text-xl font-bold text-slate-950">
                  {feature.title}
                </h3>

                <p className="mt-3 leading-7 text-slate-600">
                  {feature.description}
                </p>

                <div className="mt-7 h-px w-0 bg-primary transition-all duration-300 group-hover:w-full" />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

