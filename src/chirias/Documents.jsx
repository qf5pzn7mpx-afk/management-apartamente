import React, { useContext, useEffect, useState } from 'react';
import Navbar from '../Navbar';
import { AuthContext } from '../AuthContext';
import mockApi from '../api/mockApi';

export default function ChiriasDocuments() {
  const { user } = useContext(AuthContext) || {};
  const [docs, setDocs] = useState([]);

  useEffect(() => {
    if (!user) return;
    mockApi.getDocuments({ tenantId: user.id }).then((data) => setDocs(data)).catch(() => setDocs([]));
  }, [user]);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />
      <main className="mx-auto max-w-6xl px-6 py-12">
        <h1 className="mb-6 text-2xl font-semibold">Documentele mele</h1>
        <div className="grid gap-4">
          {docs.map((d) => (
            <div key={d.id} className="rounded-md border border-slate-800 bg-slate-900/60 p-4">
              <a href={d.url} className="text-sky-300 underline">{d.title}</a>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
