import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../Navbar';
import mockApi from '../api/mockApi';

export default function TenantsList() {
  const [tenants, setTenants] = useState([]);

  useEffect(() => {
    mockApi.getTenants().then((data) => setTenants(data)).catch(() => setTenants([]));
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />
      <main className="mx-auto max-w-6xl px-6 py-12">
        <h1 className="mb-6 text-2xl font-semibold">Lista chiriașilor</h1>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tenants.map((t) => (
            <div key={t.id} className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
              <h2 className="text-lg font-semibold">{t.nume || t.name || `Chiriaș ${t.id}`}</h2>
              <p className="text-sm text-slate-300">ID: {t.id}</p>
              <div className="mt-4 flex gap-2">
                <Link to={`/manager/tenants/${t.id}`} className="rounded-md bg-yellow-400 px-3 py-2 text-sm font-semibold text-black">Vezi</Link>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
