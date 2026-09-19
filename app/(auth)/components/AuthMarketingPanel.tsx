"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";

const slides = [
  {
    image:
      "https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?auto=format&fit=crop&w=1600&q=85",
    eyebrow: "GESTION LOGISTIQUE",
    title: "Gérez toute votre logistique au même endroit.",
    description:
      "Centralisez vos expéditions, colis, clients et opérations dans une seule plateforme.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?auto=format&fit=crop&w=1600&q=85",
    eyebrow: "SUIVI DES EXPÉDITIONS",
    title: "Gardez le contrôle de vos expéditions.",
    description:
      "Suivez chaque colis et donnez à votre entreprise une meilleure visibilité sur ses opérations.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1600&q=85",
    eyebrow: "VISIBILITÉ",
    title: "Une meilleure visibilité pour votre entreprise.",
    description:
      "Shipora vous aide à prendre de meilleures décisions grâce à des données centralisées et accessibles.",
  },
];

export function AuthMarketingPanel() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((current) =>
        current === slides.length - 1 ? 0 : current + 1,
      );
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  const slide = slides[currentSlide];

  return (
    <section className="relative hidden min-h-screen overflow-hidden bg-slate-950 lg:block lg:w-1/2">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
        >
          <Image
            src={slide.image}
            alt=""
            fill
            priority={currentSlide === 0}
            className="object-cover"
            sizes="50vw"
          />

          <div className="absolute inset-0 bg-slate-950/55" />
        </motion.div>
      </AnimatePresence>

      {/* Logo */}
      <div className="absolute left-10 top-10 z-10">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#1677FF]">
            <span className="text-lg font-bold text-white">S</span>
          </div>

          <span className="text-xl font-bold tracking-tight text-white">
            Shipora
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="absolute inset-x-0 bottom-0 z-10 p-10 xl:p-14">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.5 }}
            className="max-w-xl"
          >
            <span className="mb-4 block text-sm font-semibold tracking-[0.18em] text-blue-300">
              {slide.eyebrow}
            </span>

            <h1 className="text-4xl font-bold leading-tight text-white xl:text-5xl">
              {slide.title}
            </h1>

            <p className="mt-5 max-w-lg text-base leading-7 text-slate-200">
              {slide.description}
            </p>

            <div className="mt-8 flex items-center gap-2 text-sm font-medium text-white">
              <span>Découvrir Shipora</span>
              <ArrowRight className="h-4 w-4" />
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Indicators */}
        <div className="mt-10 flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              type="button"
              aria-label={`Afficher la présentation ${index + 1}`}
              onClick={() => setCurrentSlide(index)}
              className={`h-1.5 rounded-full transition-all ${
                index === currentSlide
                  ? "w-8 bg-white"
                  : "w-2 bg-white/40"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}