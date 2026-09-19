
"use client";

import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";

const testimonialsTop = [
  {
    name: "Marc D.",
    role: "Responsable logistique",
    company: "Gogo Cargo",
    avatar: "MD",
    text: "Shipora nous permet de garder toutes nos opérations au même endroit. C'est beaucoup plus simple à gérer.",
  },
  {
    name: "Sarah K.",
    role: "Operations Manager",
    company: "Africa Freight",
    avatar: "SK",
    text: "Le suivi des colis et la gestion des expéditions sont beaucoup plus fluides depuis que nous avons centralisé nos opérations.",
  },
  {
    name: "Kevin M.",
    role: "Directeur",
    company: "Kivu Logistics",
    avatar: "KM",
    text: "Une interface simple, claire et surtout adaptée aux besoins réels d'une entreprise logistique.",
  },
  {
    name: "Aline N.",
    role: "Responsable opérations",
    company: "TransAfrica",
    avatar: "AN",
    text: "Nous avons enfin une vision claire de nos expéditions, de nos colis et de notre facturation.",
  },
];

const testimonialsBottom = [
  {
    name: "David T.",
    role: "Fleet Manager",
    company: "Global Transit",
    avatar: "DT",
    text: "La centralisation des informations nous fait gagner énormément de temps au quotidien.",
  },
  {
    name: "Chris B.",
    role: "Founder",
    company: "Boma Express",
    avatar: "CB",
    text: "Le système de tracking donne une expérience beaucoup plus professionnelle à nos clients.",
  },
  {
    name: "Grace M.",
    role: "Logistics Manager",
    company: "East Link",
    avatar: "GM",
    text: "Shipora nous aide à mieux organiser notre équipe et à suivre chaque opération.",
  },
  {
    name: "Eric P.",
    role: "Operations Director",
    company: "Cargo Plus",
    avatar: "EP",
    text: "Une solution moderne qui simplifie vraiment la gestion quotidienne de notre activité.",
  },
];

type Testimonial = (typeof testimonialsTop)[number];

function TestimonialCard({
  testimonial,
}: {
  testimonial: Testimonial;
}) {
  return (
    <article className="w-[340px] shrink-0 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:w-[380px]">
      {/* Stars */}
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }).map((_, index) => (
          <Star
            key={index}
            size={14}
            className="fill-primary text-primary"
          />
        ))}
      </div>

      {/* Quote */}
      <div className="mt-5 flex gap-3">
        <Quote
          size={22}
          className="mt-1 shrink-0 text-primary/30"
        />

        <p className="text-sm leading-6 text-slate-600">
          {testimonial.text}
        </p>
      </div>

      {/* Author */}
      <div className="mt-6 flex items-center gap-3 border-t border-slate-100 pt-5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-light text-xs font-bold text-primary">
          {testimonial.avatar}
        </div>

        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-slate-950">
            {testimonial.name}
          </p>

          <p className="truncate text-xs text-slate-500">
            {testimonial.role} · {testimonial.company}
          </p>
        </div>
      </div>
    </article>
  );
}

function Marquee({
  testimonials,
  reverse = false,
}: {
  testimonials: Testimonial[];
  reverse?: boolean;
}) {
  /*
   * On duplique les cartes pour que la fin de la première
   * série soit immédiatement suivie par le début de la seconde.
   */
  const items = [
    ...testimonials,
    ...testimonials,
    ...testimonials,
  ];

  return (
    <div className="relative overflow-hidden">
      {/* Fade gauche */}
      <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-16 bg-gradient-to-r from-slate-50 to-transparent sm:w-32" />

      {/* Fade droite */}
      <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-16 bg-gradient-to-l from-slate-50 to-transparent sm:w-32" />

      <motion.div
        className="flex w-max gap-5"
        initial={{
          x: reverse ? "-33.333%" : "0%",
        }}
        animate={{
          x: reverse ? "0%" : "-33.333%",
        }}
        transition={{
          duration: 35,
          repeat: Infinity,
          ease: "linear",
        }}
        whileHover={{
          animationPlayState: "paused",
        }}
      >
        {items.map((testimonial, index) => (
          <TestimonialCard
            key={`${testimonial.name}-${index}`}
            testimonial={testimonial}
          />
        ))}
      </motion.div>
    </div>
  );
}

export function Testimonials() {
  return (
    <section className="overflow-hidden bg-slate-50 py-24 sm:py-32">
      {/* Header */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
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
            Témoignages
          </p>

          <h2 className="mt-4 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
            Une plateforme pensée pour les équipes logistiques.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            Découvrez comment une gestion centralisée peut
            simplifier les opérations quotidiennes.
          </p>
        </motion.div>
      </div>

      {/* Marquees */}
      <div className="mt-16 space-y-5">
        {/* Ligne 1 → gauche */}
        <Marquee testimonials={testimonialsTop} />

        {/* Ligne 2 → droite */}
        <Marquee
          testimonials={testimonialsBottom}
          reverse
        />
      </div>
    </section>
  );
}

