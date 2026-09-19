"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const plans = [
  {
    name: "Starter",
    description: "Pour les petites équipes qui débutent.",
    monthly: 15000,
    yearly: 150000,
    features: [
      "Jusqu'à 3 utilisateurs",
      "Gestion des clients",
      "Gestion des expéditions",
      "Gestion des colis",
      "Suivi public des colis",
      "Facturation",
    ],
  },
  {
    name: "Business",
    description: "Pour les entreprises logistiques en croissance.",
    monthly: 35000,
    yearly: 350000,
    popular: true,
    features: [
      "Jusqu'à 10 utilisateurs",
      "Toutes les fonctionnalités Starter",
      "Gestion des entrepôts",
      "Tarification avancée",
      "Codes-barres & QR codes",
      "Gestion des paiements",
      "Tableau de bord avancé",
    ],
  },
  {
    name: "Enterprise",
    description: "Pour les opérations logistiques plus importantes.",
    monthly: 75000,
    yearly: 750000,
    features: [
      "Utilisateurs illimités",
      "Toutes les fonctionnalités Business",
      "Multi-entrepôts",
      "Support prioritaire",
      "Personnalisation avancée",
      "Accompagnement dédié",
    ],
  },
];

export function Pricing() {
  const [yearly, setYearly] = useState(false);

  return (
    <section
      id="pricing"
      className="relative overflow-hidden bg-white py-24 sm:py-32"
    >
      <div className="pointer-events-none absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-primary/5 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
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
          className="mx-auto max-w-3xl text-center"
        >
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary">
            Tarification
          </p>

          <h2 className="mt-4 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
            Un prix simple pour une gestion plus simple.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            Choisissez la formule adaptée à la taille de votre
            activité et à vos besoins.
          </p>

          <div className="mt-8 inline-flex items-center rounded-xl border border-slate-200 bg-slate-50 p-1.5">
            <button
              type="button"
              onClick={() => setYearly(false)}
              className={`rounded-lg px-5 py-2.5 text-sm font-bold transition ${
                !yearly
                  ? "bg-white text-slate-950 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Mensuel
            </button>

            <button
              type="button"
              onClick={() => setYearly(true)}
              className={`flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-bold transition ${
                yearly
                  ? "bg-white text-slate-950 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Annuel
              <span className="rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-bold text-green-700">
                -17%
              </span>
            </button>
          </div>
        </motion.div>

        <div className="mt-16 grid gap-6 lg:grid-cols-3 lg:items-stretch">
          {plans.map((plan, index) => {
            const price = yearly
              ? plan.yearly
              : plan.monthly;

            return (
              <motion.div
                key={plan.name}
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
                className={`relative flex flex-col rounded-2xl border p-7 ${
                  plan.popular
                    ? "border-primary bg-white shadow-xl shadow-primary/10"
                    : "border-slate-200 bg-white shadow-sm"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1.5 text-xs font-bold text-white">
                    Le plus populaire
                  </div>
                )}

                <div>
                  <h3 className="text-xl font-bold text-slate-950">
                    {plan.name}
                  </h3>

                  <p className="mt-2 min-h-12 text-sm leading-6 text-slate-500">
                    {plan.description}
                  </p>
                </div>

                <div className="mt-7">
                  <div className="flex items-end gap-1">
                    <motion.span
                      key={price}
                      initial={{
                        opacity: 0,
                        y: 8,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      className="text-4xl font-bold tracking-tight text-slate-950"
                    >
                      {price.toLocaleString("fr-FR")}
                    </motion.span>

                    <span className="mb-1 text-sm font-medium text-slate-500">
                      FCFA
                    </span>
                  </div>

                  <p className="mt-1 text-xs text-slate-400">
                    {yearly
                      ? "par an"
                      : "par mois"}
                  </p>

                  {yearly && (
                    <p className="mt-3 text-xs font-semibold text-green-600">
                      Économisez avec la formule annuelle
                    </p>
                  )}
                </div>

                <div className="my-7 h-px bg-slate-100" />

                <ul className="space-y-4">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-3 text-sm text-slate-600"
                    >
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary-light text-primary">
                        <Check size={13} strokeWidth={3} />
                      </span>

                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-auto pt-8">
                  <Link
                    href="/register"
                    className={`flex w-full items-center justify-center rounded-xl px-5 py-3.5 text-sm font-bold transition ${
                      plan.popular
                        ? "bg-primary text-white hover:bg-primary-dark"
                        : "border border-slate-200 bg-white text-slate-800 hover:border-primary hover:text-primary"
                    }`}
                  >
                    Commencer avec {plan.name}
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>

        <p className="mt-8 text-center text-xs text-slate-400">
          Tous les prix sont indicatifs et peuvent évoluer selon
          les besoins de votre organisation.
        </p>
      </div>
    </section>
  );
}