"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

const stats = [
  {
    value: 50,
    suffix: "+",
    label: "Colis gérés",
  },
  {
    value: 2500,
    suffix: "+",
    label: "Expéditions",
  },
  {
    value: 98,
    suffix: "%",
    label: "De visibilité",
  },
  {
    value: 24,
    suffix: "/7",
    label: "Accessible en ligne",
  },
];

function Counter({
  value,
  suffix,
  active,
}: {
  value: number;
  suffix: string;
  active: boolean;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!active) return;

    let start = 0;
    const duration = 1400;
    const steps = 50;
    const increment = value / steps;

    const timer = setInterval(() => {
      start += increment;

      if (start >= value) {
        setCount(value);
        clearInterval(timer);
        return;
      }

      setCount(Math.floor(start));
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value, active]);

  return (
    <>
      {count.toLocaleString("fr-FR")}
      {suffix}
    </>
  );
}

export function Stats() {
  const ref = useRef<HTMLDivElement>(null);

  const isInView = useInView(ref, {
    once: true,
    amount: 0.25,
  });

  return (
    <section
      ref={ref}
      className="border-y border-slate-100 bg-slate-50"
    >
      <div className="mx-auto grid max-w-7xl grid-cols-2 sm:grid-cols-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{
              opacity: 0,
              y: 15,
            }}
            animate={
              isInView
                ? {
                    opacity: 1,
                    y: 0,
                  }
                : {}
            }
            transition={{
              duration: 0.5,
              delay: index * 0.08,
            }}
            className={[
              "px-6 py-10 text-center sm:py-12",
              index % 2 !== 0
                ? "border-l border-slate-200"
                : "",
              index >= 2
                ? "border-t border-slate-200 sm:border-t-0"
                : "",
              index > 0 && index < 4
                ? "sm:border-l sm:border-slate-200"
                : "",
            ].join(" ")}
          >
            <p className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              <Counter
                value={stat.value}
                suffix={stat.suffix}
                active={isInView}
              />
            </p>

            <p className="mt-2 text-sm font-medium text-slate-500">
              {stat.label}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

