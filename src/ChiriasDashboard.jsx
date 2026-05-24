import Navbar from './Navbar';
import { motion } from 'framer-motion';

function ChiriasDashboard() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />
      <main className="mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-12">
        <motion.section initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, ease: 'easeOut' }} className="rounded-[32px] border border-white/10 bg-slate-900/80 p-10 shadow-2xl shadow-slate-950/40 backdrop-blur-xl">
          <div className="mb-12 space-y-4">
            <p className="text-sm uppercase tracking-[0.3em] text-emerald-300/80">Chiriaș Dashboard</p>
            <h1 className="text-4xl font-semibold text-white">Bine ai venit, Chiriaș</h1>
            <p className="max-w-3xl text-slate-300 leading-8">Urmărește facturile, trimite cereri de mentenanță și accesează documentele importante dintr-un singur loc.</p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
            <div className="rounded-3xl border border-slate-700/80 bg-slate-950/80 p-6 shadow-lg shadow-emerald-500/5">
              <p className="text-sm uppercase tracking-[0.25em] text-emerald-200/80">Facturi</p>
              <h2 className="mt-4 text-3xl font-semibold text-white">5</h2>
              <p className="mt-2 text-sm text-slate-400">Facturi restante și în curs</p>
            </div>
            <div className="rounded-3xl border border-slate-700/80 bg-slate-950/80 p-6 shadow-lg shadow-lime-500/5">
              <p className="text-sm uppercase tracking-[0.25em] text-lime-200/80">Mentenanță</p>
              <h2 className="mt-4 text-3xl font-semibold text-white">1</h2>
              <p className="mt-2 text-sm text-slate-400">Raportare deschisă</p>
            </div>
            <div className="rounded-3xl border border-slate-700/80 bg-slate-950/80 p-6 shadow-lg shadow-teal-500/5">
              <p className="text-sm uppercase tracking-[0.25em] text-teal-200/80">Documente</p>
              <h2 className="mt-4 text-3xl font-semibold text-white">Shuffle</h2>
              <p className="mt-2 text-sm text-slate-400">Accesează contracte și chitanțe</p>
            </div>
          </div>
        </motion.section>
      </main>
    </div>
  );
}

export default ChiriasDashboard;
