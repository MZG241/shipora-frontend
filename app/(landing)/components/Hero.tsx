
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  Package,
  TrendingUp,
  Truck,
} from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-white">
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          backgroundImage: `
            linear-gradient(
              to right,
              rgba(22, 119, 255, 0.08) 1px,
              transparent 1px
            ),
            linear-gradient(
              to bottom,
              rgba(22, 119, 255, 0.08) 1px,
              transparent 1px
            )
          `,
          backgroundSize: "48px 48px",
          maskImage:
            "radial-gradient(ellipse 80% 70% at 50% 20%, black 20%, transparent 80%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 80% 70% at 50% 20%, black 20%, transparent 80%)",
        }}
      />

      <div className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[760px] -translate-x-1/2 rounded-full bg-primary/[0.04] blur-3xl" />

      <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-16 px-6 py-20 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-28">
        <motion.div
          initial={{
            opacity: 0,
            y: 25,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.7,
          }}
        >
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary-light px-4 py-2 text-sm font-semibold text-primary">
            <span className="h-2 w-2 rounded-full bg-primary" />
            La logistique, simplement.
          </div>

          <h1 className="max-w-3xl text-5xl font-bold leading-[1.03] tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
            Gérez vos opérations
            <span className="block text-primary">
              logistiques sans complexité.
            </span>
          </h1>

          <p className="mt-7 max-w-xl text-lg leading-8 text-slate-600">
            Shipora centralise vos expéditions, colis, clients,
            tarifs, factures et paiements dans une seule plateforme
            pensée pour les entreprises logistiques modernes.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/register"
              className="group inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3.5 font-bold text-white transition-colors hover:bg-primary-dark"
            >
              Commencer gratuitement

              <ArrowRight
                size={18}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>

            <Link
              href="#how-it-works"
              className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-6 py-3.5 font-bold text-slate-700 transition-colors hover:bg-slate-50"
            >
              Découvrir la plateforme
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
            {[
              "Gestion centralisée",
              "Suivi des colis",
              "Facturation intégrée",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-2 text-sm font-medium text-slate-600"
              >
                <CheckCircle2
                  size={17}
                  className="text-primary"
                />

                {item}
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{
            opacity: 0,
            scale: 0.97,
            y: 20,
          }}
          animate={{
            opacity: 1,
            scale: 1,
            y: 0,
          }}
          transition={{
            duration: 0.8,
            delay: 0.15,
          }}
          className="relative"
        >
          <div className="relative rounded-[24px] border border-slate-200 bg-slate-50 p-3">
            <div className="rounded-[19px] border border-slate-200 bg-white p-5 sm:p-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Vue d'ensemble
                  </p>

                  <h2 className="mt-1 text-xl font-bold text-slate-950">
                    Tableau de bord
                  </h2>
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-light text-primary">
                  <TrendingUp size={20} />
                </div>
              </div>

              {/* Stats */}
              <div className="mt-6 grid grid-cols-3 gap-3">
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 text-center">
                  <p className="text-[11px] font-medium text-slate-500">
                    Expéditions
                  </p>

                  <p className="mt-2 text-2xl font-bold text-slate-950">
                    248
                  </p>

                  <p className="mt-1 text-[11px] font-semibold text-green-600">
                    +12,5%
                  </p>
                </div>

                <div className="rounded-xl border border-primary/10 bg-primary-light p-4 text-center">
                  <p className="text-[11px] font-medium text-slate-600">
                    Colis
                  </p>

                  <p className="mt-2 text-2xl font-bold text-slate-950">
                    1 284
                  </p>

                  <p className="mt-1 text-[11px] font-semibold text-primary">
                    Ce mois
                  </p>
                </div>

                <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 text-center">
                  <p className="text-[11px] font-medium text-slate-500">
                    Livrés
                  </p>

                  <p className="mt-2 text-2xl font-bold text-slate-950">
                    96%
                  </p>

                  <p className="mt-1 text-[11px] font-semibold text-green-600">
                    À temps
                  </p>
                </div>
              </div>

              {/* Expédition principale */}
              <div className="mt-4 rounded-xl border border-slate-200 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-light text-primary">
                      <Truck size={19} />
                    </div>

                    <div>
                      <p className="text-sm font-bold text-slate-950">
                        SHP-GOGO-CARGO
                      </p>

                      <p className="mt-0.5 text-xs text-slate-500">
                        Guangzhou → Libreville
                      </p>
                    </div>
                  </div>

                  <span className="rounded-full bg-blue-50 px-3 py-1 text-[10px] font-bold text-primary">
                    En transit
                  </span>
                </div>

                {/* Progression */}
                <div className="mt-5">
                  <div className="flex items-center justify-between text-[10px] font-semibold text-slate-400">
                    <span>Expédition</span>
                    <span>Arrivée estimée</span>
                  </div>

                  <div className="relative mt-3 h-1.5 rounded-full bg-slate-100">
                    <div className="absolute left-0 top-0 h-1.5 w-[68%] rounded-full bg-primary" />

                    <div className="absolute left-[68%] top-1/2 h-3 w-3 -translate-y-1/2 rounded-full border-2 border-primary bg-white" />
                  </div>
                </div>
              </div>

              {/* Activités */}
              <div className="mt-4 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                  <div>
                    <p className="text-sm font-bold text-slate-950">
                      Activité récente
                    </p>

                    <p className="mt-0.5 text-xs text-slate-500">
                      Dernières opérations
                    </p>
                  </div>

                  <Package
                    size={18}
                    className="text-slate-400"
                  />
                </div>

                <div className="divide-y divide-slate-100">
                  <Activity
                    icon={Package}
                    title="Nouveau colis enregistré"
                    description="PKG-20260912-A8F3"
                    time="Il y a 5 min"
                  />

                  <Activity
                    icon={Truck}
                    title="Expédition mise en transit"
                    description="SHP-GOGO-CARGO"
                    time="Il y a 18 min"
                  />

                  <Activity
                    icon={Clock3}
                    title="Paiement enregistré"
                    description="100 000 FCFA"
                    time="Il y a 32 min"
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Activity({
  icon: Icon,
  title,
  description,
  time,
}: {
  icon: typeof Package;
  title: string;
  description: string;
  time: string;
}) {
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-500">
        <Icon size={15} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-xs font-bold text-slate-900">
          {title}
        </p>

        <p className="mt-0.5 truncate text-[10px] text-slate-500">
          {description}
        </p>
      </div>

      <span className="shrink-0 text-[10px] text-slate-400">
        {time}
      </span>
    </div>
  );
}

