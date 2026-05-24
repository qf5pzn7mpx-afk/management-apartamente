import React from "react";
import { motion, useReducedMotion } from "framer-motion";

export default function Hero({ onStart, onDemo, imageSrc = "/images/apartment.jpg" }) {
  const shouldReduceMotion = useReducedMotion();

  const h1Initial = shouldReduceMotion ? {} : { opacity: 0, y: 40 };
  const h1Animate = shouldReduceMotion ? {} : { opacity: 1, y: 0 };

  const pInitial = shouldReduceMotion ? {} : { opacity: 0, y: 30 };
  const pAnimate = shouldReduceMotion ? {} : { opacity: 1, y: 0 };

  const divInitial = shouldReduceMotion ? {} : { opacity: 0, y: 20 };
  const divAnimate = shouldReduceMotion ? {} : { opacity: 1, y: 0 };

  return (
    <section
      aria-label="Hero"
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950"
    >
      {/* BACKGROUND IMAGE */}
      <img
        src={imageSrc}
        alt="Apartamente"
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover opacity-30"
      />

      {/* OVERLAY */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />

      {/* CONTENT */}
      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
        <motion.h1
          initial={h1Initial}
          animate={h1Animate}
          transition={{ duration: 0.8 }}
          className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-extrabold leading-tight text-white"
        >
          Gestionează apartamentele
          <span className="block text-yellow-400">inteligent</span>
        </motion.h1>

        <motion.p
          initial={pInitial}
          animate={pAnimate}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="mx-auto mt-6 max-w-2xl text-base sm:text-lg md:text-xl leading-7 text-slate-300"
        >
          Facturi, documente și mentenanță într-o singură platformă modernă pentru
          manageri și chiriași.
        </motion.p>

        {/* BUTTONS */}
        <motion.div
          initial={divInitial}
          animate={divAnimate}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <button
            type="button"
            onClick={onStart}
            aria-label="Începe acum"
            className="rounded-2xl bg-yellow-400 px-8 py-4 text-lg font-bold text-black shadow-xl transition hover:bg-yellow-300 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-yellow-300"
          >
            Începe acum
          </button>

          <button
            type="button"
            onClick={onDemo}
            aria-label="Vezi demo"
            className="rounded-2xl border border-slate-600 bg-slate-900/60 px-8 py-4 text-lg font-semibold text-white backdrop-blur-md transition hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-slate-600"
          >
            Vezi demo
          </button>
        </motion.div>
      </div>
    </section>
  );
}
