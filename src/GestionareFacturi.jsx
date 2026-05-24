import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import mockApi from './api/mockApi';

function GestionareFacturi() {
  const [facturi, setFacturi] = useState([]);
  const [loading, setLoading] = useState(true);
  const [eroare, setEroare] = useState('');

  useEffect(() => {
    mockApi.getInvoices().then((data) => {
      if (Array.isArray(data)) setFacturi(data);
      else setEroare('Format date invalid de la server.');
    }).catch(() => setEroare('Nu pot încărca facturile de la server.')).finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="py-10 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-indigo-600">Gestionare facturi</p>
                <h1 className="mt-3 text-3xl font-semibold text-slate-900 sm:text-4xl">Toate facturile tale într-un singur loc</h1>
                <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
                  Vizualizează facturile, urmărește statusul și adaugă rapid o nouă factură cu un singur click.
                </p>
              </div>
              <Link
                to="/adauga-factura"
                className="inline-flex items-center justify-center rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:bg-indigo-700"
              >
                + Adaugă factură
              </Link>
            </div>
          </div>

          <div className="space-y-6">
            {eroare && (
              <div className="rounded-3xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
                {eroare}
              </div>
            )}

            <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">Lista facturilor</h2>
                  <p className="mt-1 text-sm text-slate-500">Ultimele facturi emise și statusul lor actual.</p>
                </div>
                <span className="rounded-full bg-indigo-100 px-3 py-1 text-sm font-semibold text-indigo-700">
                  {loading ? 'Se încarcă...' : `${facturi.length} facturi`}
                </span>
              </div>

              {loading ? (
                <div className="mt-8 text-center text-slate-500">Se încarcă facturile…</div>
              ) : facturi.length === 0 ? (
                <div className="mt-8 rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-600">
                  Nu există facturi înregistrate încă.
                </div>
              ) : (
                <div className="mt-6 space-y-4">
                  {facturi.map((factura) => (
                    <div
                      key={factura.id}
                      className="rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                    >
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="text-sm font-semibold text-slate-900">Factura #{factura.id || '—'}</p>
                          <p className="mt-1 text-sm text-slate-600">Chiriaș: {factura.chirias_nume || factura.chirias_id || '—'}</p>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                          <span>Status: <span className="font-semibold text-slate-900">{factura.status || 'Neplătită'}</span></span>
                          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
                            {factura.tip || 'Chirie'}
                          </span>
                        </div>
                      </div>
                      <div className="mt-4 grid gap-4 sm:grid-cols-3">
                        <div>
                          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Sumă</p>
                          <p className="mt-2 text-lg font-semibold text-slate-900">{factura.suma ? factura.suma + ' RON' : '—'}</p>
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Emisă</p>
                          <p className="mt-2 text-sm text-slate-700">{factura.data_emiterii || '—'}</p>
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Scadentă</p>
                          <p className="mt-2 text-sm text-slate-700">{factura.data_scadentei || '—'}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GestionareFacturi;
