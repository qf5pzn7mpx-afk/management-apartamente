
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import logo from './assets/logo.png';
import Navbar from './Navbar';
import mockApi from './api/mockApi';

function Dashboard() {
  const [meniuDeschis, setMeniuDeschis] = useState(false);
  const [chiriasi, setChiriasi] = useState([]);
  const [eroare, setEroare] = useState(null);

  // Încarcă chiriașii din server
  useEffect(() => {
    mockApi.getTenants().then((data) => setChiriasi(data)).catch(() => setChiriasi([]));
  }, []);

  const stergeChirias = async (id) => {
    const confirmare = window.confirm("Sigur vrei să ștergi acest chiriaș?");
    if (!confirmare) return;

      try {
        await mockApi.deleteTenant(id);
        setChiriasi((s) => s.filter((c) => c.id !== id));
      } catch (err) {
        console.error(err);
      }
  };

  const features = [
    {
      titlu: 'Organized tenant documents',
      text: 'Store and access leases, IDs, and files securely in one place.',
      icon: '📁',
    },
    {
      titlu: 'Streamlined rent invoicing',
      text: 'Automate invoice creation, delivery, and payment tracking.',
      icon: '💳',
    },
    {
      titlu: 'Maintenance made simple',
      text: 'Track repair requests and keep tenants informed from start to finish.',
      icon: '🛠️',
    },
    {
      titlu: 'Clear tenant communication',
      text: 'Manage updates, notices, and conversations in a clean workflow.',
      icon: '💬',
    },
  ];

  const plans = [
    {
      nume: 'STARTER',
      pret: '$19/mo',
      beneficii: ['Tenant document uploads', 'Basic invoice tracking', 'Maintenance tickets'],
    },
    {
      nume: 'GROWTH',
      pret: '$29/mo',
      beneficii: ['Automated rent reminders', 'Recurring invoices', 'Priority support'],
    },
    {
      nume: 'PRO',
      pret: '$49/mo',
      beneficii: ['Custom document templates', 'Bulk invoice generation', 'Advanced reports'],
    },
    {
      nume: 'ENTERPRISE',
      pret: '$79/mo',
      beneficii: ['Custom integrations', 'Dedicated account manager', 'Full support'],
    },
  ];

  const testimoniale = [
    {
      nume: 'Jamie Ellis',
      rol: 'Operations Lead',
      mesaj: 'Lease management is simple and efficient.',
    },
    {
      nume: 'Robin Avery',
      rol: 'Leasing Manager',
      mesaj: 'Tracking invoices is quick and reliable.',
    },
    {
      nume: 'Taylor Reed',
      rol: 'Property Coordinator',
      mesaj: 'Maintenance issues are resolved promptly.',
    },
    {
      nume: 'Casey Jordan',
      rol: 'Portfolio Manager',
      mesaj: 'We save valuable time every week.',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-slate-50">
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-6 py-20 md:px-8 lg:grid-cols-2 lg:py-24">
          <div className="max-w-2xl">
            <p className="mb-4 text-sm uppercase tracking-[0.28em] text-indigo-600">Platformă pentru proprietari</p>
            <h1 className="text-5xl font-semibold tracking-tight text-slate-900 sm:text-6xl">
              Gestionează proprietățile și chiriașii cu claritate
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
              Un dashboard profesional pentru facturi, documente și cereri de întreținere. Totul într-o experiență intuitivă, rapidă și modernă.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                to="/adauga-chirias"
                className="inline-flex items-center justify-center rounded-2xl bg-indigo-600 px-7 py-3.5 text-base font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:bg-indigo-700"
              >
                Adaugă chiriaș
              </Link>
              <Link
                to="/facturi"
                className="inline-flex items-center justify-center rounded-2xl border border-slate-300 bg-white px-7 py-3.5 text-base font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-100"
              >
                Gestionare Facturi
              </Link>
            </div>
          </div>

          <div className="relative flex justify-center lg:justify-end">
            <div className="absolute inset-x-0 top-12 hidden h-44 rounded-[32px] bg-indigo-200/20 blur-3xl lg:block"></div>
            <img
              src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80"
              alt="Casă primitoare"
              className="relative h-[320px] w-full max-w-xl rounded-[32px] object-cover shadow-[0_35px_80px_-35px_rgba(15,23,42,0.35)] sm:h-[420px] lg:h-[520px]"
            />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-slate-100 text-slate-900">
        <div className="mx-auto max-w-7xl px-6 py-20 md:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-sm uppercase tracking-[0.28em] text-indigo-600">Funcționalități esențiale</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
              Tot ce ai nevoie pentru administrare eficientă
            </h2>
            <p className="mt-6 text-lg leading-8 text-slate-600 sm:text-xl">
              Organizează documente, emite facturi și gestionează solicitările de întreținere dintr-un singur loc.
            </p>
          </div>

          <div className="mt-16 grid gap-6 md:grid-cols-2">
            {features.map((item, index) => (
              <div
                key={index}
                className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-lg sm:p-10"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-indigo-100 text-3xl">
                  {item.icon}
                </div>
                <h3 className="mt-6 text-2xl font-semibold text-slate-900">{item.titlu}</h3>
                <p className="mt-4 text-base leading-7 text-slate-600">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ⇣ SECȚIUNE DE CHIRIAȘI ⇣ */}
      <section className="bg-white text-slate-900">
        <div className="mx-auto max-w-7xl px-6 py-20 md:px-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-indigo-600">Chiriași</p>
              <h2 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
                Chiriași înregistrați în sistem
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
                Verifică rapid lista de chiriași, apartamentele alocate și datele de contact pentru fiecare locatar.
              </p>
            </div>
            {eroare && (
              <p className="rounded-3xl border border-red-200 bg-red-50 px-5 py-3 text-sm text-red-700">{eroare}</p>
            )}
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {chiriasi.length > 0 ? (
              chiriasi.map((ch) => (
                <div
                  key={ch.id}
                  className="rounded-[28px] border border-slate-200 bg-slate-50 p-6 shadow-sm transition hover:shadow-lg"
                >
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="text-xl font-semibold text-slate-900">{ch.nume}</h3>
                    <span className="rounded-full bg-indigo-100 px-3 py-1 text-sm font-semibold text-indigo-700">
                      Ap. {ch.apartament_numar || '–'}
                    </span>
                  </div>
                  <p className="mt-4 text-sm leading-6 text-slate-600">
                    Telefon: <span className="font-medium text-slate-900">{ch.telefon || '—'}</span>
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Email: <span className="font-medium text-slate-900">{ch.email || '—'}</span>
                  </p>

                  {/* ⇣ BUTONUL DE ȘTERGERE A FOST MUTAT AICI ⇣ */}
                  <button 
                    onClick={() => stergeChirias(ch.id)}
                    className="mt-6 w-full rounded-lg border border-red-500/30 bg-red-50 py-2 text-sm font-medium text-red-600 hover:bg-red-500 hover:text-white transition-colors duration-200"
                  >
                    Șterge Chiriaș
                  </button>
                </div>
              ))
            ) : (
              <p className="col-span-full mt-8 rounded-3xl border border-slate-200 bg-slate-50 px-6 py-8 text-center text-slate-600">
                Nu există chiriași înregistrați momentan.
              </p>
            )}
          </div>
        </div>
      </section>
      {/* ⇡ SFÂRȘIT SECȚIUNE DE CHIRIAȘI ⇡ */}

      {/* Secțiune Stabilitate */}
      <section className="bg-slate-50 text-slate-900">
        <div className="mx-auto max-w-7xl px-6 py-24 md:px-8">
          <div className="rounded-[32px] border border-slate-200 bg-white p-10 shadow-sm sm:p-14">
            <div className="grid gap-10 lg:grid-cols-3 lg:items-center lg:gap-8">
              <div className="lg:col-span-2">
                <p className="text-sm uppercase tracking-[0.28em] text-indigo-600">Stabilitate</p>
                <h2 className="mt-4 text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
                  99.9% uptime pentru aplicația ta de administrare
                </h2>
                <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600">
                  Construim o platformă fiabilă, cu performanță constantă și acces rapid la date, astfel încât tu să te concentrezi pe gestionarea proprietăților.
                </p>
              </div>
              <div className="rounded-[28px] bg-indigo-50 p-8 text-center">
                <p className="text-sm uppercase tracking-[0.3em] text-indigo-600">Disponibilitate</p>
                <div className="mt-6 text-6xl font-semibold text-indigo-700">99.9%</div>
                <p className="mt-4 text-sm leading-7 text-slate-600">Timp mediu de funcționare al platformei, susținut de o infrastructură sigură.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

export default Dashboard;
