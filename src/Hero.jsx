import React from "react";
import { motion, useReducedMotion } from "framer-motion";

export default function Hero({ onStart, onDemo }) {
  const isMobile = window.innerWidth < 768;

  const buttonVariants = {
    hover: {
      scale: 1.1,
      transition: {
        duration: 0.2,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-5xl font-bold mb-8">Gestionare facturi</h1>
      <p className="text-xl text-gray-500 mb-8">Gestionează-ți facturile cu ușurință</p>
      <div className="flex flex-col md:flex-row md:items-center mb-8">
        <div className="md:w-1/2">
          <form className="flex flex-col">
            <button
              type="button"
              onClick={onStart}
              className="bg-green-500 text-white px-4 py-2 rounded-md mb-4"
            >
              Începe acum
            </button>
          </form>
        </div>
        <div className="md:w-1/2 md:ml-4">
          <h2 className="text-3xl font-semibold mb-4">Vezi demo</h2>
          <p className="text-xl text-gray-500 mb-8">Vizualizează cum funcționează aplicația</p>
          <button
            type="button"
            onClick={onDemo}
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
          >
            Vezi demo
          </button>
        </div>
      </div>
      <p className="text-center text-gray-500 mb-8">© 2026 GestionareFacturi</p>
    </div>
  );
}