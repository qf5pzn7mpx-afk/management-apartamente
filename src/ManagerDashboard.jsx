import Navbar from './Navbar';
import { motion } from 'framer-motion';

function ManagerDashboard() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />
      <main className="mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-12">
        <motion.section initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, ease: 'easeOut' }} className="rounded-[32px] border border-white/10 bg-slate-900/80 p-10 shadow-2xl shadow-slate-950/40 backdrop-blur-xl">
          <div className="mb-12 space-y-4">
            <p className="text-sm uppercase tracking-[0.3em] text-sky-300/80">Manager Dashboard</p>
            <h1 className="text-4xl font-semibold text-white">Bine ai venit, Manager</h1>
            <p className="max-w-3xl text-slate-300 leading-8">Controlează proprietățile, monitorizează cererile de mentenanță și gestionează chiriașii de pe un singur panou modern.</p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
            <div className="rounded-3xl border border-slate-700/80 bg-slate-950/80 p-6 shadow-lg shadow-sky-500/5">
              <p className="text-sm uppercase tracking-[0.25em] text-sky-200/80">Rezumat rapid</p>
              <h2 className="mt-4 text-3xl font-semibold text-white">12</h2>
              <p className="mt-2 text-sm text-slate-400">Cereri de mentenanță active</p>
            </div>
            <div className="rounded-3xl border border-slate-700/80 bg-slate-950/80 p-6 shadow-lg shadow-cyan-500/5">
              <p className="text-sm uppercase tracking-[0.25em] text-cyan-200/80">Venit luna aceasta</p>
              <h2 className="mt-4 text-3xl font-semibold text-white">32.400 lei</h2>
              <p className="mt-2 text-sm text-slate-400">Facturi în curs de procesare</p>
            </div>
            <div className="rounded-3xl border border-slate-700/80 bg-slate-950/80 p-6 shadow-lg shadow-violet-500/5">
              <p className="text-sm uppercase tracking-[0.25em] text-violet-200/80">Chiriași</p>
              <h2 className="mt-4 text-3xl font-semibold text-white">24</h2>
              <p className="mt-2 text-sm text-slate-400">Utilizatori conectați în prezent</p>
            </div>
          </div>
        </motion.section>
      </main>
    </div>
  );
}

export default ManagerDashboard;
