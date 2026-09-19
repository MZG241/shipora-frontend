import Image from "next/image";
import Link from "next/link";
import {
  Mail,
  Phone,
  MessageCircle,
} from "lucide-react";

const productLinks = [
  {
    label: "Fonctionnalités",
    href: "#features",
  },
  {
    label: "Tarifs",
    href: "#pricing",
  },
  {
    label: "Comment ça marche",
    href: "#how-it-works",
  },
  {
    label: "Suivre un colis",
    href: "/track",
  },
];

const accountLinks = [
  {
    label: "Se connecter",
    href: "/login",
  },
  {
    label: "Créer un compte",
    href: "/register",
  },
];

const whatsappNumber = "250786121522";

const whatsappMessage = encodeURIComponent(
  "Bonjour, je souhaite avoir une démonstration de Shipora."
);

export function Footer() {
  return (
    <>
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-12 py-14 md:grid-cols-[1.4fr_1fr_1fr_1.3fr]">
            <div>
              <Link href="/">
                <Image
                  src="/shipora.png"
                  alt="Shipora"
                  width={200}
                  height={200}
                  className="h-28 w-auto object-contain"
                />
              </Link>

              <p className="mt-5 max-w-sm text-sm leading-7 text-slate-500">
                La plateforme moderne pour simplifier la gestion
                des opérations logistiques.
              </p>

              <div className="mt-6 flex items-center gap-3">
                <a
                  href={`https://wa.me/${whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp"
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:border-primary hover:bg-primary-light hover:text-primary"
                >
                  <MessageCircle size={18} />
                </a>

              
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold text-slate-950">
                Produit
              </h3>

              <nav className="mt-5 space-y-3">
                {productLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block text-sm font-medium text-slate-500 transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>

            <div>
              <h3 className="text-sm font-bold text-slate-950">
                Compte
              </h3>

              <nav className="mt-5 space-y-3">
                {accountLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block text-sm font-medium text-slate-500 transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>

            <div>
              <h3 className="text-sm font-bold text-slate-950">
                Contact
              </h3>

              <div className="mt-5 space-y-4">
                <a
                  href={`tel:+${whatsappNumber}`}
                  className="flex items-center gap-3 text-sm font-medium text-slate-500 transition-colors hover:text-primary"
                >
                  <Phone
                    size={17}
                    className="shrink-0 text-primary"
                  />
                  +250 786 121 522
                </a>

                <a
                  href="mailto:info@shipora.com"
                  className="flex items-center gap-3 text-sm font-medium text-slate-500 transition-colors hover:text-primary"
                >
                  <Mail
                    size={17}
                    className="shrink-0 text-primary"
                  />
                  info@shipora.com
                </a>

                <a
                  href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-white transition hover:bg-primary-dark"
                >
                  <MessageCircle size={17} />
                  Demander une démo
                </a>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 border-t border-slate-100 py-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-400">
              © {new Date().getFullYear()} Shipora. Tous droits réservés.
            </p>

            <div className="flex gap-6">
              <Link
                href="/privacy"
                className="text-sm text-slate-400 transition-colors hover:text-slate-600"
              >
                Confidentialité
              </Link>

              <Link
                href="/terms"
                className="text-sm text-slate-400 transition-colors hover:text-slate-600"
              >
                Conditions
              </Link>
            </div>
          </div>
        </div>
      </footer>

      <a
        href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contacter Shipora sur WhatsApp"
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-white shadow-lg shadow-green-500/25 transition hover:scale-105 hover:bg-green-600 sm:bottom-8 sm:right-8"
      >
        <MessageCircle size={25} />

        <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-green-500 opacity-20" />
      </a>
    </>
  );
}

