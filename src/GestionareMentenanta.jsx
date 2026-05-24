import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';

function GestionareMentenanta() {
  const [cereri, setCereri] = useState([]);
  const [loading, setLoading] = useState(true);
  const [eroare, setEroare] = useState('');

  const incarcaCereri = () => {
    setLoading(true);
    import('./api/mockApi').then(m => m.getMaintenance()).then((data) => {
      if (Array.isArray(data)) setCereri(data);
      else setEroare('Datele de la server nu sunt în formatul așteptat.');
    }).catch(() => setEroare('Nu am putut încărca cererile.')).finally(() => setLoading(false));
  };

  useEffect(() => {
    incarcaCereri();
  }, []);

  const schimbaStatus = async (id, statusNou) => {
    try {
      const { updateMaintenanceStatus } = await import('./api/mockApi');
      await updateMaintenanceStatus(id, statusNou);
      incarcaCereri();
    } catch (err) {
      alert("Nu am putut actualiza statusul.");
    }
  };

  const totalNoi = cereri.filter((item) => item.status === 'Nouă').length;
  const totalInProgres = cereri.filter((item) => item.status === 'În lucru').length;
  const totalFinalizate = cereri.filter((item) => item.status === 'Rezolvată').length;

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="py-10 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          {}
          <div className="mb-8 rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-indigo-600">Admin Panel</p>
                <h1 className="mt-3 text-3xl font-semibold text-slate-900">Mentenanță Active</h1>
              </div>
              <Link to="/raporteaza-problema" className="rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-700 transition">
                + Adaugă cerere
              </Link>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
            {}
            <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-slate-900 mb-6">Solicitări Primite</h2>
              
              <div className="space-y-4">
                {cereri.map((cerere) => (
                  <div key={cerere.id} className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
                    <div className="flex flex-col md:flex-row gap-6">
                      {}
                      {cerere.poza && (
                        <div className="h-32 w-32 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-white">
                          <img 
                            src={cerere.poza || ''} 
                          />
                        </div>
                      )}

                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className={`text-xs font-bold uppercase tracking-wider px-2 py-1 rounded ${cerere.status === 'Nouă' ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'}`}>
                            {cerere.status}
                          </span>
                          <span className="text-xs text-slate-400">{cerere.data_crearii}</span>
                        </div>
                        
                        <h3 className="mt-2 text-lg font-bold text-slate-900">{cerere.titlu}</h3>
                        <p className="mt-1 text-sm text-slate-600 leading-relaxed">{cerere.descriere}</p>
                        
                        {}
                        <div className="mt-4 flex gap-2">
                          <button 
                            onClick={() => schimbaStatus(cerere.id, 'În lucru')}
                            className="text-xs font-semibold bg-white border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 transition"
                          >
                            Setează "În lucru"
                          </button>
                          <button 
                            onClick={() => schimbaStatus(cerere.id, 'Rezolvată')}
                            className="text-xs font-semibold bg-white border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-green-50 hover:text-green-600 transition"
                          >
                            Marchează Finalizat
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {}
            <div className="space-y-6">
              <div className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
                <h2 className="text-xl font-semibold text-slate-900 mb-6">Statistici</h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-orange-50 rounded-2xl">
                    <span className="text-sm font-medium text-orange-700">Cereri Noi</span>
                    <span className="text-2xl font-bold text-orange-700">{totalNoi}</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-blue-50 rounded-2xl">
                    <span className="text-sm font-medium text-blue-700">În lucru</span>
                    <span className="text-2xl font-bold text-blue-700">{totalInProgres}</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-green-50 rounded-2xl">
                    <span className="text-sm font-medium text-green-700">Rezolvate</span>
                    <span className="text-2xl font-bold text-green-700">{totalFinalizate}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GestionareMentenanta;