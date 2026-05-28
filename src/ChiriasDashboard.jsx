import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { motion } from 'framer-motion';
import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import mockApi from './api/mockApi';
import InvoiceBreakdown from './components/InvoiceBreakdown';

function SmallCard({ title, value, buttonText, to }) {
  return (
    <div className="rounded-2xl bg-slate-900/60 p-5 border border-white/6 shadow-lg">
      <p className="text-sm text-slate-400">{title}</p>

      <div className="mt-3 flex items-center justify-between">
        <div className="text-3xl font-bold text-white">{value}</div>

        <Link to={to} className="no-underline">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            className="
              rounded-full
              bg-[#F7E3A1]
              px-5 py-3
              text-sm font-bold text-slate-900
              shadow-[0_0_25px_rgba(247,227,161,0.35)]
              transition-all duration-300
              hover:shadow-[0_0_40px_rgba(247,227,161,0.55)]
            "
          >
            {buttonText}
          </motion.button>
        </Link>
      </div>
    </div>
  );
}

export default function ChiriasDashboard() {
  const { user } = useContext(AuthContext) || {};
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    if (!user) return;

    mockApi
      .getInvoices({ tenantId: user.id })
      .then((data) => setInvoices(data))
      .catch(() => setInvoices([]));
  }, [user]);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />

      <div className="mx-auto flex max-w-7xl gap-6 px-4 py-8">
        <Sidebar role="chirias" />

        <main className="flex-1">
          <motion.header
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="rounded-3xl bg-slate-900/60 border border-white/6 p-8 shadow-xl">
              <h1 className="text-4xl font-black text-white">
                Bun venit, {user?.name || 'Chiriaș'}
              </h1>

              <p className="mt-3 text-lg text-slate-400">
                Panoul tău personal
              </p>
            </div>
          </motion.header>

          <section className="grid gap-5 sm:grid-cols-3">
            <SmallCard
              title="Facturi restante"
              value={invoices.filter((i) => i.status !== 'Plătită').length}
              buttonText="Vezi detalii"
              to="/chirias/invoices"
            />

            <SmallCard
              title="Cereri mentenanță"
              value={1}
              buttonText="Trimite cerere"
              to="/chirias/maintenance"
            />

            <SmallCard
              title="Documente"
              value={3}
              buttonText="Vezi contracte"
              to="/chirias/documents"
            />
          </section>

          <section className="mt-8 grid gap-6 lg:grid-cols-2">
            <div className="rounded-3xl bg-slate-900/60 p-6 border border-white/6 shadow-xl">
              <h3 className="text-2xl font-bold text-white">
                Facturi recente
              </h3>

              <div className="mt-6 overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-sm text-slate-400 border-b border-white/10">
                      <th className="px-3 py-3">#</th>
                      <th className="px-3 py-3">Sumă</th>
                      <th className="px-3 py-3">Dată</th>
                      <th className="px-3 py-3">Status</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-white/6">
                    {invoices.slice(0, 8).map((f) => (
                      <tr
                        key={f.id}
                        className="transition hover:bg-white/5"
                      >
                        <td className="px-3 py-4 font-medium">{f.id}</td>

                        <td className="px-3 py-4">
                          {f.amount || f.suma || '—'}
                        </td>

                        <td className="px-3 py-4">
                          {f.data_emiterii || f.data || '—'}
                        </td>

                        <td className="px-3 py-4">
                          <span className="rounded-full bg-slate-800 px-3 py-1 text-sm text-slate-200">
                            {f.status || 'Neplătită'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-3xl bg-slate-900/60 p-6 border border-white/6 shadow-xl">
                <h3 className="text-2xl font-bold text-white">
                  Plăți: Plătite vs Neplătite
                </h3>

                <p className="mt-2 text-sm text-slate-400">
                  Vizualizare rapidă
                </p>

                <div className="mt-6 max-w-sm">
                  <InvoiceBreakdown />
                </div>
              </div>

              <div className="rounded-3xl bg-slate-900/60 p-6 border border-white/6 shadow-xl">
                <h3 className="text-2xl font-bold text-white">
                  Cereri mentenanță
                </h3>

                <p className="mt-2 text-sm text-slate-400">
                  Urmărește statusul cererilor tale.
                </p>

                <div className="mt-5 space-y-4">
                  <div className="rounded-2xl bg-slate-800/50 p-4 border border-white/5">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-base font-semibold">
                          Robinet scurgeri
                        </div>

                        <div className="text-sm text-slate-400">
                          Trimis acum 2 zile
                        </div>
                      </div>

                      <div className="rounded-full bg-amber-500/20 px-3 py-1 text-xs font-bold text-amber-300">
                        Nouă
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}