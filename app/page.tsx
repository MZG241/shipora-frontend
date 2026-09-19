import type { Metadata } from "next";

import { Features } from "./(landing)/components/Features";
import { FinalCta } from "./(landing)/components/FinalCTA";
import { Footer } from "./(landing)/components/Footer";
import { Hero } from "./(landing)/components/Hero";
import { HowItWorks } from "./(landing)/components/HowItWorks";
import { Navbar } from "./(landing)/components/Navbar";
import { Pricing } from "./(landing)/components/Pricing";
import { Stats } from "./(landing)/components/Stats";
import { Testimonials } from "./(landing)/components/Testimonials";
import { WhyShipora } from "./(landing)/components/WhyShipora";

export const metadata: Metadata = {
  title: "Shipora | Plateforme de gestion logistique",
  description:
    "Shipora simplifie la gestion des opérations logistiques : expéditions, colis, clients, tarifs, facturation, paiements et suivi des colis.",
  keywords: [
    "gestion logistique",
    "logiciel logistique",
    "plateforme logistique",
    "gestion des expéditions",
    "gestion des expéditions application",
    "gestion des expéditions Gabon",
    "gestion des colis",
    "suivi colis",
    "tracking colis",
    "logiciel transport",
    "facturation logistique",
    "Shipora",
  ],
  openGraph: {
    title: "Shipora | Simplifiez votre gestion logistique",
    description:
      "Centralisez vos expéditions, colis, clients, tarifs, factures et paiements avec Shipora.",
    type: "website",
    siteName: "Shipora",
    locale: "fr_FR",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shipora | Simplifiez votre gestion logistique",
    description:
      "La plateforme moderne pour gérer vos opérations logistiques.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Stats />
        <Features />
        <Pricing />
        <HowItWorks />
        <WhyShipora />
        <Testimonials />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}

