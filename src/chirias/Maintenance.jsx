import React, { useContext, useState } from 'react';
import Navbar from '../Navbar';
import { AuthContext } from '../AuthContext';
import mockApi from '../api/mockApi';

export default function ChiriasMaintenance() {
  const { user } = useContext(AuthContext) || {};
  const [request, setRequest] = useState({ title: '', details: '' });

  const submit = () => {
    const payload = { tenantId: user?.id || 'guest', ...request, status: 'Deschis' };
    mockApi.addMaintenance(payload).then(() => {
      setRequest({ title: '', details: '' });
      alert('Raport trimis');
    }).catch(() => alert('Eroare la trimitere'));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />
      <main className="mx-auto max-w-6xl px-6 py-12">
        <h1 className="mb-6 text-2xl font-semibold">Raportează problemă</h1>
        <div className="rounded-md border border-slate-800 bg-slate-900/60 p-6">
          <label className="mb-2 block text-sm">Titlu</label>
          <input value={request.title} onChange={(e) => setRequest({ ...request, title: e.target.value })} className="mb-3 w-full rounded-md bg-slate-800/60 px-3 py-2 text-white" />
          <label className="mb-2 block text-sm">Detalii</label>
          <textarea value={request.details} onChange={(e) => setRequest({ ...request, details: e.target.value })} className="mb-3 w-full rounded-md bg-slate-800/60 px-3 py-2 text-white" rows={6} />
          <button onClick={submit} className="rounded-2xl bg-emerald-500 px-4 py-2 font-semibold text-white">Trimite</button>
        </div>
      </main>
    </div>
  );
}
