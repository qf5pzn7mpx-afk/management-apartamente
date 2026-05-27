import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from './Navbar';

function Register() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [parola, setParola] = useState('');
  const [rol, setRol] = useState('chirias'); 
  const [mesaj, setMesaj] = useState({ tip: '', text: '' }); 
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMesaj({ tip: '', text: '' });
    setLoading(true);

    try {
      const response = await fetch('https://management-apartamente-api.onrender.com/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, parola, rol }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMesaj({ tip: 'eroare', text: data.error || 'A apărut o eroare la crearea contului.' });
        setLoading(false);
        return;
      }

      setMesaj({ tip: 'succes', text: 'Cont creat cu succes! Te redirecționăm spre login...' });
      
      
      setTimeout(() => {
        navigate('/'); 
      }, 2000);

    } catch (err) {
      setMesaj({ tip: 'eroare', text: 'Eroare de conexiune la server.' });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.18),_transparent_24%),radial-gradient(circle_at_bottom_right,_rgba(34,197,94,0.18),_transparent_24%),#0f172a] text-white">
      <Navbar />
      <div className="mx-auto flex min-h-[calc(100vh-80px)] flex-col items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
        
        <motion.section 
          initial={{ opacity: 0, y: 30 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.65, ease: 'easeOut' }} 
          className="w-full max-w-md rounded-[36px] border border-white/10 bg-slate-950/80 p-8 shadow-2xl shadow-slate-950/40 backdrop-blur-xl sm:p-10"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-semibold tracking-tight text-white">Creare Cont Nou</h2>
            <p className="mt-2 text-sm text-slate-400">Completează datele de mai jos pentru a te înregistra.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-300">Rolul tău</label>
              <select 
                value={rol} 
                onChange={(e) => setRol(e.target.value)} 
                className="w-full rounded-xl border border-slate-700 bg-slate-800/60 px-4 py-3 text-white focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
              >
                <option value="chirias">Chiriaș</option>
                <option value="manager">Manager</option>
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-300">Adresa de Email</label>
              <input 
                type="email" 
                placeholder="exemplu@email.com" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
                className="w-full rounded-xl border border-slate-700 bg-slate-800/60 px-4 py-3 text-white placeholder-slate-500 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500" 
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-300">Parola</label>
              <input 
                type="password" 
                placeholder="••••••••" 
                value={parola} 
                onChange={(e) => setParola(e.target.value)} 
                required 
                minLength="6"
                className="w-full rounded-xl border border-slate-700 bg-slate-800/60 px-4 py-3 text-white placeholder-slate-500 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500" 
              />
            </div>

            {/* Afișarea mesajelor de eroare sau succes */}
            {mesaj.text && (
              <div className={`rounded-xl p-3 text-sm text-center ${mesaj.tip === 'eroare' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'}`}>
                {mesaj.text}
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-sky-500/30 transition duration-200 hover:-translate-y-0.5 hover:shadow-sky-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Se procesează...' : 'Înregistrează-te'}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-slate-400">
            Ai deja un cont?{' '}
            <Link to="/" className="font-semibold text-sky-400 hover:text-sky-300 transition-colors">
              Loghează-te aici
            </Link>
          </div>
        </motion.section>
      </div>
    </div>
  );
}

export default Register;