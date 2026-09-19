
"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

const links = [
  {
    label: "Fonctionnalités",
    href: "#features",
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

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 30);
    }

    handleScroll();

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header className="fixed left-0 right-0 top-0 z-50 px-4 pt-4 sm:px-6">
      <motion.div
        animate={{
          maxWidth: scrolled ? 1024 : 1280,
          borderRadius: scrolled ? 18 : 0,
          boxShadow: scrolled
            ? "0 10px 35px rgba(15, 23, 42, 0.08)"
            : "0 0 0 rgba(0,0,0,0)",
          borderColor: scrolled
            ? "rgba(226, 232, 240, 0.9)"
            : "rgba(226, 232, 240, 0)",
        }}
        transition={{
          duration: 0.35,
          ease: "easeOut",
        }}
        className="mx-auto w-full border bg-white/90 backdrop-blur-xl"
      >
        <div className="flex h-[72px] items-center justify-between px-5 sm:px-7">
          {/* Logo */}
          <Link
            href="/"
            className="relative z-50 shrink-0"
          >
            <Image
              src="/shipora.png"
              alt="Shipora"
              width={200}
              height={200}
              priority
              className="h-28 w-auto object-contain"
            />
          </Link>

          {/* Desktop navigation */}
          <nav className="hidden items-center gap-8 md:flex">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-semibold text-slate-600 transition-colors hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop actions */}
          <div className="hidden items-center gap-4 md:flex">
            <Link
              href="/login"
              className="text-sm font-semibold text-slate-700 transition-colors hover:text-primary"
            >
              Se connecter
            </Link>

            <Link
              href="/register"
              className="rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-primary-dark"
            >
              Commencer
            </Link>
          </div>

          {/* Mobile button */}
          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="relative z-50 rounded-lg p-2 text-slate-700 md:hidden"
            aria-label="Menu"
          >
            {open ? (
              <X size={24} />
            ) : (
              <Menu size={24} />
            )}
          </button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{
                opacity: 0,
                height: 0,
              }}
              animate={{
                opacity: 1,
                height: "auto",
              }}
              exit={{
                opacity: 0,
                height: 0,
              }}
              transition={{
                duration: 0.25,
              }}
              className="overflow-hidden border-t border-slate-100 md:hidden"
            >
              <nav className="flex flex-col gap-5 px-5 py-6">
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="text-base font-semibold text-slate-700"
                  >
                    {link.label}
                  </Link>
                ))}

                <div className="mt-1 flex flex-col gap-3 border-t border-slate-100 pt-5">
                  <Link
                    href="/login"
                    onClick={() => setOpen(false)}
                    className="text-center font-semibold text-slate-700"
                  >
                    Se connecter
                  </Link>

                  <Link
                    href="/register"
                    onClick={() => setOpen(false)}
                    className="rounded-xl bg-primary px-5 py-3 text-center font-bold text-white"
                  >
                    Commencer
                  </Link>
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </header>
  );
}

