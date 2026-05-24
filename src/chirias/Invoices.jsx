import React, { useContext, useEffect, useState } from 'react';
import Navbar from '../Navbar';
import { AuthContext } from '../AuthContext';
import mockApi from '../api/mockApi';

export default function ChiriasInvoices() {
  const { user } = useContext(AuthContext) || {};
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    if (!user) return;
    mockApi.getInvoices({ tenantId: user.id }).then((data) => setInvoices(data)).catch(() => setInvoices([]));
  }, [user]);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />
      <main className="mx-auto max-w-6xl px-6 py-12">
        <h1 className="mb-6 text-2xl font-semibold">Facturile mele</h1>
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
      </main>
    </div>
  );
}
