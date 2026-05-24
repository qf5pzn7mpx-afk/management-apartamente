import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from './Navbar';

function AdaugaDocument() {
  const [numeDocument, setNumeDocument] = useState('');
  const [tipDocument, setTipDocument] = useState('contract');
  const [chiriasId, setChiriasId] = useState('');
  const [fisier, setFisier] = useState(null);
  const [chiriasi, setChiriasi] = useState([]);
  const [loading, setLoading] = useState(false);
  const [eroare, setEroare] = useState('');
  const [succes, setSucces] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    import('./api/mockApi').then(({ getTenants }) => getTenants().then((data) => { if (Array.isArray(data)) setChiriasi(data); })).catch(() => setEroare('Nu pot încărca lista chiriașilor'));
  }, []);

  const handleSave = async () => {
    if (!numeDocument.trim() || !chiriasId || !fisier) {
      setEroare('Te rugăm să completezi toate câmpurile și să alegi un fișier!');
      return;
    }

    setLoading(true);
    setEroare('');
    setSucces(false);

    const formData = new FormData();
    formData.append('nume_fisier', numeDocument);
    formData.append('tip', tipDocument);
    formData.append('chirias_id', chiriasId);
    formData.append('fisier', fisier);

    try {
      const payload = { nume_fisier: numeDocument, tip: tipDocument, chirias_id: chiriasId, fisier: fisier ? fisier.name : null };
      const { addDocument } = await import('./api/mockApi');
      await addDocument(payload);
      setSucces(true);
      setTimeout(() => {
        navigate('/documente');
      }, 1500);
    } catch (err) {
      setEroare('Eroare de conexiune: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const tipuriDisponibile = [
    { value: 'contract', label: 'Contract', icon: '📄' },
    { value: 'identitate', label: 'Act de identitate', icon: '🆔' },
    { value: 'factura', label: 'Factură', icon: '💳' },
    { value: 'alte', label: 'Alte documente', icon: '📁' }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="py-10 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm sm:p-10"
          >
            <div className="mb-8 flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-indigo-600">Încarcă document</p>
                <h1 className="mt-3 text-3xl font-semibold text-slate-900 sm:text-4xl">
                  Adaugă un document nou
                </h1>
              </div>
              <Link
                to="/documente"
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                ← Înapoi
              </Link>
            </div>

            {eroare && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-6 rounded-[24px] border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700"
              >
                {eroare}
              </motion.div>
            )}

            {succes && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-6 rounded-[24px] border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-700"
              >
                ✓ Document salvat cu succes! Redirecționare...
              </motion.div>
            )}

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-3">
                  Chiriaș *
                </label>
                <select
                  value={chiriasId}
                  onChange={(e) => setChiriasId(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 transition focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                >
                  <option value="">Selectează un chiriaș</option>
                  {chiriasi.map(chirias => (
                    <option key={chirias.id} value={chirias.id}>
                      {chirias.nume}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-3">
                  Tip document *
                </label>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {tipuriDisponibile.map(tip => (
                    <motion.button
                      key={tip.value}
                      type="button"
                      onClick={() => setTipDocument(tip.value)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`rounded-2xl border-2 p-4 text-center transition ${
                        tipDocument === tip.value
                          ? 'border-indigo-500 bg-indigo-50'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="text-2xl">{tip.icon}</div>
                      <div className="mt-2 text-xs font-semibold text-slate-900">
                        {tip.label}
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-3">
                  Nume document *
                </label>
                <input
                  type="text"
                  value={numeDocument}
                  onChange={(e) => setNumeDocument(e.target.value)}
                  placeholder="Ex: Contract_Închiriere_2024"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 transition focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-3">
                  Alege fișier (PDF, DOC, JPG, PNG) *
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    onChange={(e) => setFisier(e.target.files[0])}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 file:mr-4 file:rounded-full file:border-0 file:bg-indigo-100 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-indigo-700 transition hover:file:bg-indigo-200"
                  />
                </div>
                {fisier && (
                  <p className="mt-2 text-sm text-slate-600">
                    Fișier selectat: <span className="font-semibold">{fisier.name}</span>
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-3 pt-4 sm:flex-row sm:justify-end">
                <Link
                  to="/documente"
                  className="rounded-2xl border border-slate-200 bg-white px-6 py-3 text-center text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Anulează
                </Link>
                <motion.button
                  type="button"
                  onClick={handleSave}
                  disabled={loading}
                  whileHover={{ scale: loading ? 1 : 1.02 }}
                  whileTap={{ scale: loading ? 1 : 0.98 }}
                  className={`rounded-2xl px-6 py-3 text-center text-sm font-semibold text-white transition ${
                    loading
                      ? 'cursor-not-allowed bg-slate-400'
                      : 'bg-indigo-600 hover:bg-indigo-700'
                  }`}
                >
                  {loading ? 'Se salvează...' : 'Salvează document'}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default AdaugaDocument;
