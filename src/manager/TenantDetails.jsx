import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../Navbar';
import mockApi from '../api/mockApi';

export default function TenantDetails() {
  const { id } = useParams();
  const [tenant, setTenant] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [newInvoice, setNewInvoice] = useState({ amount: '', description: '' });

  useEffect(() => {
    mockApi.getTenant(id).then((data) => setTenant(data)).catch(() => setTenant(null));
    mockApi.getInvoices({ tenantId: id }).then((data) => setInvoices(data)).catch(() => setInvoices([]));
  }, [id]);

  const addInvoice = () => {
    const payload = { tenantId: Number(id), amount: newInvoice.amount, description: newInvoice.description };
    mockApi.addInvoice(payload).then((created) => setInvoices((s) => [created, ...s])).catch(() => setInvoices((s) => [{ id: Date.now(), ...payload }, ...s]));
    setNewInvoice({ amount: '', description: '' });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />
      <main className="mx-auto max-w-6xl px-6 py-12">
        <h1 className="mb-4 text-2xl font-semibold">Detalii chiriaș</h1>
        {tenant ? (
          <div className="mb-6 rounded-xl border border-slate-800 bg-slate-900/60 p-6">
            <h2 className="text-xl font-bold">{tenant.nume || tenant.name}</h2>
            <p className="text-sm text-slate-300">ID: {tenant.id}</p>
          </div>
        ) : (
          <p>Se încarcă...</p>
        )}

        <section className="mb-8">
          <h3 className="mb-3 text-lg font-semibold">Facturi</h3>
          <div className="mb-4 flex gap-2">
            <input value={newInvoice.amount} onChange={(e) => setNewInvoice({ ...newInvoice, amount: e.target.value })} placeholder="Suma" className="rounded-md bg-slate-800/60 px-3 py-2 text-white" />
            <input value={newInvoice.description} onChange={(e) => setNewInvoice({ ...newInvoice, description: e.target.value })} placeholder="Descriere" className="rounded-md bg-slate-800/60 px-3 py-2 text-white" />
            <button onClick={addInvoice} className="rounded-md bg-yellow-400 px-3 py-2 font-semibold text-black">Adaugă</button>
          </div>

          <div className="grid gap-4">
            {invoices.map((inv) => (
              <div key={inv.id} className="rounded-md border border-slate-800 bg-slate-900/60 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-300">{inv.description}</p>
                    <h4 className="text-lg font-semibold">{inv.amount} lei</h4>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
