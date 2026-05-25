import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { motion } from 'framer-motion';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';
import mockApi from './api/mockApi';
import InvoiceBreakdown from './components/InvoiceBreakdown';

function SmallCard({ title, value, hint }) {
  return (
    <div className="rounded-2xl bg-slate-900/60 p-4 border border-white/6">
      <p className="text-xs text-slate-400">{title}</p>
      <div className="mt-2 flex items-baseline justify-between">
        <div className="text-xl font-semibold text-white">{value}</div>
        <div className="text-xs text-slate-300">{hint}</div>
      </div>
    </div>
  );
}

export default function ChiriasDashboard() {
  const { user } = useContext(AuthContext) || {};
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    if (!user) return;
    mockApi.getInvoices({ tenantId: user.id }).then((data) => setInvoices(data)).catch(() => setInvoices([]));
  }, [user]);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />
      <div className="mx-auto flex max-w-7xl gap-6 px-4 py-8">
        <Sidebar role="chirias" />

        <main className="flex-1">
          <motion.header initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold">Bun venit, {user?.name || 'Chiriaș'}</h1>
              <p className="text-sm text-slate-400">Panoul tău personal</p>
            </div>
          </motion.header>

          <section className="grid gap-4 sm:grid-cols-3">
            <SmallCard title="Facturi restante" value={invoices.filter(i => i.status !== 'Plătită').length} hint="Vezi detalii" />
            <SmallCard title="Cereri mentenanță" value={1} hint="Trimite o nouă cerere" />
            <SmallCard title="Documente" value={3} hint="Vezi contractele" />
          </section>

          <section className="mt-8 grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl bg-slate-900/60 p-6 border border-white/6">
              <h3 className="text-lg font-semibold">Facturi recente</h3>
              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-sm text-slate-400">
                      <th className="px-3 py-2">#</th>
                      <th className="px-3 py-2">Sumă</th>
                      <th className="px-3 py-2">Dată</th>
                      <th className="px-3 py-2">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/6">
                    {invoices.slice(0, 8).map((f) => (
                      <tr key={f.id} className="hover:bg-white/2">
                        <td className="px-3 py-3">{f.id}</td>
                        <td className="px-3 py-3">{f.amount || f.suma || '—'}</td>
                        <td className="px-3 py-3">{f.data_emiterii || f.data || '—'}</td>
                        <td className="px-3 py-3 text-sm text-slate-300">{f.status || 'Neplătită'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-2xl bg-slate-900/60 p-6 border border-white/6">
                <h3 className="text-lg font-semibold">Plăți: Plătite vs Neplătite</h3>
                <p className="text-sm text-slate-400">Vizualizare rapidă</p>
                <div className="mt-4 max-w-sm">
                  <InvoiceBreakdown />
                </div>
              </div>

              <div className="rounded-2xl bg-slate-900/60 p-6 border border-white/6">
                <h3 className="text-lg font-semibold">Cereri mentenanță</h3>
                <p className="text-sm text-slate-400 mt-2">Urmărește statusul cererilor tale.</p>
                <div className="mt-4 space-y-3">
                  <div className="rounded-md bg-slate-800/40 p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-semibold">Robinet scurgeri</div>
                        <div className="text-xs text-slate-400">Trimis acum 2 zile</div>
                      </div>
                      <div className="text-xs text-amber-400">Nouă</div>
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
