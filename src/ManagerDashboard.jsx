import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import mockApi from './api/mockApi';
import RevenueChart from './components/RevenueChart';
import MaintenanceChart from './components/MaintenanceChart';
import InvoiceBreakdown from './components/InvoiceBreakdown';

function StatCard({ title, value, subtitle, color = 'bg-indigo-600' }) {
  return (
    <div className="rounded-2xl bg-slate-900/60 p-5 border border-white/6 shadow-sm">
      <p className="text-xs uppercase tracking-wider text-slate-400">{title}</p>
      <div className="mt-2 flex items-baseline justify-between gap-4">
        <h3 className="text-2xl font-bold text-white">{value}</h3>
        <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold text-white ${color}`}>Live</span>
      </div>
      <p className="mt-2 text-sm text-slate-400">{subtitle}</p>
    </div>
  );
}

export default function ManagerDashboard() {
  const [tenants, setTenants] = useState([]);

  useEffect(() => {
    mockApi.getTenants().then((data) => setTenants(data)).catch(() => setTenants([]));
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />
      <div className="mx-auto flex max-w-7xl gap-6 px-4 py-8">
        <Sidebar role="manager" />

        <main className="flex-1">
          <motion.header initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold">Manager Dashboard</h1>
              <p className="text-sm text-slate-400">Gestionează chiriași, facturi și mentenanță</p>
            </div>
          </motion.header>

          <section className="grid gap-4 md:grid-cols-3">
            <StatCard title="Chiriași" value={tenants.length} subtitle="Total chiriași înregistrați" color="bg-indigo-600" />
            <StatCard title="Mentenanță" value="12" subtitle="Cereri active" color="bg-amber-500" />
            <StatCard title="Venit (Luna)" value="32.400 RON" subtitle="Estimare veniturilor" color="bg-emerald-500" />
          </section>

          <section className="mt-8 grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl bg-slate-900/60 p-6 border border-white/6">
              <h3 className="text-lg font-semibold">Analiză venituri</h3>
              <p className="text-sm text-slate-400">Grafic lună curentă</p>
              <div className="mt-4">
                <RevenueChart months={6} />
              </div>
            </div>

            <div className="rounded-2xl bg-slate-900/60 p-6 border border-white/6">
              <h3 className="text-lg font-semibold">Cereri de mentenanță</h3>
              <p className="text-sm text-slate-400">Distribuție pe status</p>
              <div className="mt-4">
                <MaintenanceChart />
              </div>
            </div>
          </section>

          <section className="mt-6">
            <div className="rounded-2xl bg-slate-900/60 p-6 border border-white/6">
              <h3 className="text-lg font-semibold">Plăți: Plătite vs Neplătite</h3>
              <div className="mt-4 max-w-sm">
                <InvoiceBreakdown />
              </div>
            </div>
          </section>

          <section className="mt-8">
            <div className="rounded-2xl bg-slate-900/60 p-6 border border-white/6">
              <h3 className="text-lg font-semibold">Tabel chiriași</h3>
              <div className="mt-4 overflow-x-auto">
                <table className="w-full table-auto text-left">
                  <thead>
                    <tr className="text-sm text-slate-400">
                      <th className="px-3 py-2">Nume</th>
                      <th className="px-3 py-2">Apartament</th>
                      <th className="px-3 py-2">Email</th>
                      <th className="px-3 py-2">Telefon</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/6">
                    {tenants.slice(0, 10).map((t) => (
                      <tr key={t.id} className="hover:bg-white/2">
                        <td className="px-3 py-3">{t.nume || t.name}</td>
                        <td className="px-3 py-3">{t.apartament_id || t.apartament_numar || '—'}</td>
                        <td className="px-3 py-3 text-slate-300">{t.email || '—'}</td>
                        <td className="px-3 py-3 text-slate-300">{t.telefon || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
