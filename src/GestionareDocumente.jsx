import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';

function GestionareDocumente() {
  const [documente, setDocumente] = useState([]);
  const [chiriasi, setChiriasi] = useState([]);
  const [loading, setLoading] = useState(true);
  const [eroare, setEroare] = useState('');

  useEffect(() => {
    Promise.all([
      import('./api/mockApi').then(m => m.getDocuments()),
      import('./api/mockApi').then(m => m.getTenants())
    ])
      .then(([dataDoc, dataChir]) => {
        if (Array.isArray(dataDoc)) setDocumente(dataDoc);
        if (Array.isArray(dataChir)) setChiriasi(dataChir);
      })
      .catch(() => setEroare('Nu am putut încărca documentele.'))
      .finally(() => setLoading(false));
  }, []);

  const stergeDocument = async (id) => {
    const confirmare = window.confirm("Sigur vrei să ștergi acest document? Această acțiune nu poate fi anulată.");
    if (!confirmare) return;

    try {
      const { deleteDocument } = await import('./api/mockApi');
      await deleteDocument(id);
      setDocumente(documente.filter((doc) => doc.id !== id));
    } catch (err) {
      alert("Nu am putut contacta serverul: " + err.message);
    }
  };

  const getChiriasNume = (chiriasId) => {
    const chirias = chiriasi.find(ch => ch.id === chiriasId);
    return chirias ? chirias.nume : 'Chiriaș necunoscut';
  };

  const getIconForTip = (tip) => {
    const icons = {
      'contract': '📄',
      'identitate': '🆔',
      'factura': '💳',
      'alte': '📁'
    };
    return icons[tip] || '📄';
  };

  const totalDocumente = documente.length;
  const documenteContracte = documente.filter(doc => doc.tip === 'contract').length;
  const documenteIdentitate = documente.filter(doc => doc.tip === 'identitate').length;

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="py-10 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-indigo-600">Documente chiriaș</p>
                <h1 className="mt-3 text-3xl font-semibold text-slate-900 sm:text-4xl">
                  Gestionați toate documentele chiriașilor într-un singur loc
                </h1>
                <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
                  Încărcați contracte, acte de identitate și alte documente importante. Organizați totul pentru acces rapid și securizat.
                </p>
              </div>
              <Link
                to="/adauga-document"
                className="inline-flex items-center justify-center rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:bg-indigo-700"
              >
                + Încarcă document
              </Link>
            </div>
          </div>

          {eroare && (
            <div className="mb-6 rounded-3xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
              {eroare}
            </div>
          )}

          <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
            <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">Biblioteca documente</h2>
                  <p className="mt-2 text-sm text-slate-500">Toate documentele chiriașilor organizate și securizate.</p>
                </div>
                <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">
                  {loading ? 'Se încarcă…' : `${totalDocumente} documente`}
                </span>
              </div>

              {loading ? (
                <div className="mt-10 rounded-[28px] border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-slate-500">
                  Se încarcă documentele...
                </div>
              ) : documente.length === 0 ? (
                <div className="mt-10 rounded-[28px] border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-slate-600">
                  Nu există documente încărcate.
                </div>
              ) : (
                <div className="mt-6 space-y-4">
                  {documente.map((document) => (
                    <div
                      key={document.id}
                      className="rounded-[28px] border border-slate-200 bg-slate-50 p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                    >
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-100 text-2xl">
                            {getIconForTip(document.tip)}
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-slate-900">{document.nume_fisier}</h3>
                            <p className="text-sm text-slate-600">Chiriaș: {getChiriasNume(document.chirias_id)}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
                            {document.tip}
                          </span>
                          
                          {/* BUTON NOU DE DESCĂRCARE */}
                          <a 
                            href={document.cale || '#'} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                          >
                            Deschide
                          </a>
                          
                          <button 
                            onClick={() => stergeDocument(document.id)}
                            className="rounded-2xl bg-red-100 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-200"
                          >
                            Șterge
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                <h2 className="text-xl font-semibold text-slate-900">Rezumat documente</h2>
                <div className="mt-6 grid gap-4">
                  <div className="rounded-3xl bg-slate-50 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Total documente</p>
                        <p className="mt-2 text-2xl font-semibold text-slate-900">{loading ? '–' : totalDocumente}</p>
                      </div>
                      <div className="text-3xl">📁</div>
                    </div>
                  </div>
                  <div className="rounded-3xl bg-slate-50 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Contracte</p>
                        <p className="mt-2 text-2xl font-semibold text-slate-900">{loading ? '–' : documenteContracte}</p>
                      </div>
                      <div className="text-3xl">📄</div>
                    </div>
                  </div>
                  <div className="rounded-3xl bg-slate-50 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Acte identitate</p>
                        <p className="mt-2 text-2xl font-semibold text-slate-900">{loading ? '–' : documenteIdentitate}</p>
                      </div>
                      <div className="text-3xl">🆔</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                <h2 className="text-xl font-semibold text-slate-900">Sfat rapid</h2>
                <p className="mt-4 text-sm leading-7 text-slate-600">
                  Încărcați documentele imediat ce chiriașii le furnizează. Organizați-le pe tipuri pentru a le găsi rapid când aveți nevoie.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GestionareDocumente;