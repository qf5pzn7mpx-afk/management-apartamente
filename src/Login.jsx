import { useContext, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Am adăugat 'Link'
import { motion } from 'framer-motion';
import Navbar from './Navbar';
import { AuthContext } from './AuthContext';

function Login() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [activeForm, setActiveForm] = useState(null); 
  const [email, setEmail] = useState('');
  const [parola, setParola] = useState('');
  const [eroare, setEroare] = useState('');

  const handleOpenForm = (role) => {
    setActiveForm(role);
    setEroare('');
    setEmail('');
    setParola('');
  };

  const handleSubmit = async (e, rolAsteptat) => {
    e.preventDefault();
    setEroare('');

    try {
      const response = await fetch('http://localhost:5001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, parola }),
      });

      const data = await response.json();

      if (!response.ok) {
        setEroare(data.error || 'Eroare la autentificare.');
        return;
      }

      if (data.rol !== rolAsteptat) {
        setEroare(`Acest cont nu are permisiuni de ${rolAsteptat}!`);
        return;
      }

      login({ id: data.id, role: data.rol, email: email }, data.token);

      if (data.rol === 'manager') {
        navigate('/manager/dashboard');
      } else {
        navigate('/chirias/dashboard');
      }
    } catch (err) {
      setEroare('Eroare de conexiune la server.');
    }
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
              <p className="max-w-xl text-slate-200/80 leading-8">Selectează opțiunea potrivită pentru tine și introdu datele de acces.</p>
              
              {/* NOU: Secțiunea pentru redirecționare către Înregistrare */}
              <div className="mt-4 rounded-2xl bg-white/5 border border-white/10 p-4">
                <p className="text-sm text-slate-300">
                  Nu ai încă un cont?{' '}
                  <Link to="/register" className="font-semibold text-sky-400 transition hover:text-sky-300 hover:underline">
                    Înregistrează-te acum
                  </Link>
                </p>
              </div>

            </div>

            <div className="flex flex-col sm:flex-row gap-4 rounded-[32px] border border-slate-200/10 bg-slate-950/80 p-4 shadow-[0_35px_120px_rgba(15,23,42,0.30)] sm:p-6">
              
              {/* CARD MANAGER */}
              <motion.div whileHover={{ y: -4, scale: 1.01 }} className="flex-1 rounded-3xl border border-sky-400/20 bg-slate-900/70 p-6 shadow-[0_24px_60px_rgba(59,130,246,0.18)] transition min-h-[20rem]">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm uppercase tracking-[0.25em] text-sky-300/80">Opțiune Manager</p>
                    <h2 className="mt-3 text-2xl font-semibold text-white">Sunt Manager</h2>
                  </div>
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-sky-500/15 text-sky-300 shadow-inner shadow-sky-500/10">M</div>
                </div>
                
                {activeForm !== 'manager' ? (
                  <>
                    <p className="mt-5 text-sm leading-7 text-slate-300">Accesează panoul de administrare, gestionează apartamente și urgențe cu o perspectivă clară și rapidă.</p>
                    <button type="button" onClick={() => handleOpenForm('manager')} className="mt-6 inline-flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-sky-500 to-cyan-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/30 transition duration-200 hover:-translate-y-0.5 hover:shadow-sky-500/40">Continuă ca Manager</button>
                  </>
                ) : (
                  <form onSubmit={(e) => handleSubmit(e, 'manager')} className="mt-6 w-full space-y-3">
                    <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full rounded-md border border-slate-700 bg-slate-800/60 px-3 py-2 text-white placeholder-slate-400 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500" />
                    <input type="password" placeholder="Parola" value={parola} onChange={(e) => setParola(e.target.value)} required className="w-full rounded-md border border-slate-700 bg-slate-800/60 px-3 py-2 text-white placeholder-slate-400 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500" />
                    {eroare && activeForm === 'manager' && <p className="text-xs text-red-400">{eroare}</p>}
                    <div className="mt-3 flex gap-2">
                      <button type="submit" className="flex-1 rounded-2xl bg-sky-500 px-4 py-2 font-semibold text-white transition hover:bg-sky-400">Loghează-te</button>
                      <button type="button" onClick={() => setActiveForm(null)} className="rounded-2xl bg-slate-700 px-4 py-2 text-white transition hover:bg-slate-600">Înapoi</button>
                    </div>
                  </form>
                )}
              </motion.div>

              {/* CARD CHIRIAȘ */}
              <motion.div whileHover={{ y: -4, scale: 1.01 }} className="flex-1 rounded-3xl border border-emerald-400/20 bg-slate-900/70 p-6 shadow-[0_24px_60px_rgba(16,185,129,0.18)] transition min-h-[20rem]">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm uppercase tracking-[0.25em] text-emerald-300/80">Opțiune Chiriaș</p>
                    <h2 className="mt-3 text-2xl font-semibold text-white">Sunt Chiriaș</h2>
                  </div>
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-emerald-500/15 text-emerald-300 shadow-inner shadow-emerald-500/10">C</div>
                </div>
                
                {activeForm !== 'chirias' ? (
                  <>
                    <p className="mt-5 text-sm leading-7 text-slate-300">Intră rapid în cont și gestionează facturile, cererile de mentenanță și documentele personale.</p>
                    <button type="button" onClick={() => handleOpenForm('chirias')} className="mt-6 inline-flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/30 transition duration-200 hover:-translate-y-0.5 hover:shadow-emerald-500/40">Continuă ca Chiriaș</button>
                  </>
                ) : (
                  <form onSubmit={(e) => handleSubmit(e, 'chirias')} className="mt-6 w-full space-y-3">
                    <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full rounded-md border border-slate-700 bg-slate-800/60 px-3 py-2 text-white placeholder-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500" />
                    <input type="password" placeholder="Parola" value={parola} onChange={(e) => setParola(e.target.value)} required className="w-full rounded-md border border-slate-700 bg-slate-800/60 px-3 py-2 text-white placeholder-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500" />
                    {eroare && activeForm === 'chirias' && <p className="text-xs text-red-400">{eroare}</p>}
                    <div className="mt-3 flex gap-2">
                      <button type="submit" className="flex-1 rounded-2xl bg-emerald-500 px-4 py-2 font-semibold text-white transition hover:bg-emerald-400">Loghează-te</button>
                      <button type="button" onClick={() => setActiveForm(null)} className="rounded-2xl bg-slate-700 px-4 py-2 text-white transition hover:bg-slate-600">Înapoi</button>
                    </div>
                  </form>
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