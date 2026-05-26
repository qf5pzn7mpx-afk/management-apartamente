import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Home() {

  const buttonVariants = {
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.2,
        ease: 'easeOut',
      },
    },
  };

  return (
    <div className="min-h-screen bg-[#020B2D] flex flex-col items-center justify-center text-center px-6">

      {/* TITLU */}
      <h1 className="text-8xl font-black text-white tracking-tight leading-tight">
        Gestionează apartamente inteligent
      </h1>

      {/* SUBTITLU */}
      <p className="mt-8 text-4xl font-semibold text-slate-200 max-w-4xl">
        Gestionează apartamentul tău cu inteligență
      </p>

      {/* BUTON INCEPE ACUM */}
      <div className="mt-16 flex justify-center">
        <Link to="/login" className="no-underline">
          <motion.button
            variants={buttonVariants}
            whileHover="hover"
            whileTap={{ scale: 0.97 }}
            className="
              flex items-center justify-center gap-4
              w-[520px]
              rounded-full
              bg-[#F7E3A1]
              px-12 py-10
              text-4xl font-black text-slate-900
              shadow-[0_0_55px_rgba(247,227,161,0.55)]
              transition-all duration-300
              hover:shadow-[0_0_80px_rgba(247,227,161,0.85)]
              hover:-translate-y-1
              no-underline
              border-2 border-[#e7d48b]
            "
          >
            🏠
            Începe acum
          </motion.button>
        </Link>
      </div>

      {/* CONTACT */}
      <div className="mt-20 flex flex-col items-center">
        <h2 className="text-6xl font-black text-white">
          Contact
        </h2>

        <p className="mt-6 text-3xl font-medium text-slate-200">
          Contactează-ne pentru mai multe informații
        </p>

        <Link to="/contact" className="no-underline mt-10">
          <motion.button
            variants={buttonVariants}
            whileHover="hover"
            whileTap={{ scale: 0.97 }}
            className="
              flex items-center justify-center gap-4
              w-[320px]
              rounded-full
              bg-[#F7E3A1]
              px-10 py-6
              text-3xl font-bold text-slate-900
              shadow-[0_0_45px_rgba(247,227,161,0.5)]
              transition-all duration-300
              hover:shadow-[0_0_70px_rgba(247,227,161,0.8)]
              hover:-translate-y-1
              no-underline
            "
          >
            ✉️
            Contactează-ne
          </motion.button>
        </Link>
      </div>

      {/* FOOTER */}
      <footer className="mt-24 text-3xl font-semibold text-slate-300">
        © 2026 ApartManager
      </footer>

    </div>
  );
}