import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from './Navbar';
import { AuthContext } from './AuthContext';
import mockApi from './api/mockApi';

function Login() {
  const navigate = useNavigate();
  const { loginAs } = useContext(AuthContext);

  const [chiriasi, setChiriasi] = useState([]);
  const [selecting, setSelecting] = useState(false);
  const [selectedId, setSelectedId] = useState('');

  useEffect(() => {
    // prefetch chiriasi for selection (mock)
    mockApi.getTenants().then((data) => setChiriasi(data)).catch(() => setChiriasi([]));
  }, []);

  const handleManager = () => {
    loginAs('manager', { name: 'Manager' });
    navigate('/manager/dashboard');
  };

  const handleChiriasStart = () => {
    if (chiriasi.length === 0) {
      // fallback simulate a single tenant
      loginAs('chirias', { id: 'guest', name: 'Chiriaș' });
      navigate('/chirias/dashboard');
      return;
    }
    setSelectedId(chiriasi[0]?.id || '');
    setSelecting(true);
  };

  const handleChiriasConfirm = () => {
    const sel = chiriasi.find((c) => String(c.id) === String(selectedId)) || chiriasi[0];
    loginAs('chirias', { id: sel.id, name: sel.nume || sel.name || 'Chiriaș' });
    navigate('/chirias/dashboard');
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.18),_transparent_24%),radial-gradient(circle_at_bottom_right,_rgba(34,197,94,0.18),_transparent_24%),#0f172a] text-white">
      <Navbar />
      <div className="mx-auto flex min-h-[calc(100vh-80px)] flex-col items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-10 w-full text-center">
          <h1 className="text-3xl font-bold uppercase tracking-[0.35em] text-white sm:text-4xl">PAGINA DE AUTENTIFICARE</h1>
        </div>
        <motion.section initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, ease: 'easeOut' }} className="w-full max-w-6xl rounded-[36px] border border-white/10 bg-white/10 p-6 shadow-2xl shadow-slate-950/40 backdrop-blur-xl sm:p-10">
          <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-500/10 px-4 py-2 text-sm text-cyan-200">
                <span className="h-2.5 w-2.5 rounded-full bg-cyan-300/90" />
                Pagina de autentificare
              </div>
              <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">Alege cum te conectezi</h1>
              <p className="max-w-xl text-slate-200/80 leading-8">Selectează opțiunea potrivită pentru tine și continuă cu un acces rapid.</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 rounded-[32px] border border-slate-200/10 bg-slate-950/80 p-4 shadow-[0_35px_120px_rgba(15,23,42,0.30)] sm:p-6">
              <motion.div whileHover={{ y: -4, scale: 1.01 }} className="flex-1 rounded-3xl border border-sky-400/20 bg-slate-900/70 p-6 shadow-[0_24px_60px_rgba(59,130,246,0.18)] transition min-h-[20rem]">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm uppercase tracking-[0.25em] text-sky-300/80">Opțiune Manager</p>
                    <h2 className="mt-3 text-2xl font-semibold text-white">Sunt Manager</h2>
                  </div>
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-sky-500/15 text-sky-300 shadow-inner shadow-sky-500/10">M</div>
                </div>
                <p className="mt-5 text-sm leading-7 text-slate-300">Accesează panoul de administrare, gestionează apartamente și urgențe cu o perspectivă clară și rapidă.</p>
                <button type="button" onClick={handleManager} className="mt-6 inline-flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-sky-500 to-cyan-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/30 transition duration-200 hover:-translate-y-0.5 hover:shadow-sky-500/40">Continuă ca Manager</button>
              </motion.div>

              <motion.div whileHover={{ y: -4, scale: 1.01 }} className="flex-1 rounded-3xl border border-emerald-400/20 bg-slate-900/70 p-6 shadow-[0_24px_60px_rgba(16,185,129,0.18)] transition min-h-[20rem]">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm uppercase tracking-[0.25em] text-emerald-300/80">Opțiune Chiriaș</p>
                    <h2 className="mt-3 text-2xl font-semibold text-white">Sunt Chiriaș</h2>
                  </div>
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-emerald-500/15 text-emerald-300 shadow-inner shadow-emerald-500/10">C</div>
                </div>
                <p className="mt-5 text-sm leading-7 text-slate-300">Intră rapid în cont și gestionează facturile, cererile de mentenanță și documentele personale.</p>
                {!selecting ? (
                  <button type="button" onClick={handleChiriasStart} className="mt-6 inline-flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/30 transition duration-200 hover:-translate-y-0.5 hover:shadow-emerald-500/40">Continuă ca Chiriaș</button>
                ) : (
                  <div className="mt-6 w-full">
                    <label className="mb-2 block text-sm text-slate-200">Alege contul tău</label>
                    <select value={selectedId} onChange={(e) => setSelectedId(e.target.value)} className="w-full rounded-md bg-slate-800/60 px-3 py-2 text-white">
                      {chiriasi.map((c) => (
                        <option key={c.id} value={c.id}>{c.nume || c.name || `Chiriaș ${c.id}`}</option>
                      ))}
                    </select>
                    <div className="mt-3 flex gap-2">
                      <button type="button" onClick={handleChiriasConfirm} className="flex-1 rounded-2xl bg-emerald-500 px-4 py-2 font-semibold text-white">Conectează</button>
                      <button type="button" onClick={() => setSelecting(false)} className="rounded-2xl bg-slate-700 px-4 py-2 text-white">Renunță</button>
                    </div>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
}

export default Login;
