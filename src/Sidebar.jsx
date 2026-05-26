import { NavLink } from 'react-router-dom';
import { useState } from 'react';

export default function Sidebar({ role = 'manager', onFilter }) {
  const [filter, setFilter] = useState('');

  const handleFilterChange = (event) => {
    setFilter(event.target.value);

    if (onFilter) {
      onFilter(event.target.value);
    }
  };

  const common = [
    { to: '/', label: 'Home', icon: '🏠' },
  ];

  const manager = [
    { to: '/manager/dashboard', label: 'Dashboard', icon: '📊' },
    { to: '/manager/tenants', label: 'Chiriași', icon: '👥' },
    { to: '/facturi', label: 'Facturi', icon: '💳' },
    { to: '/documente', label: 'Documente', icon: '📁' },
    { to: '/mentenanta', label: 'Mentenanță', icon: '🛠️' },
  ];

  const chirias = [
    { to: '/chirias/dashboard', label: 'Dashboard', icon: '📊' },
    { to: '/chirias/invoices', label: 'Facturi', icon: '💳' },
    { to: '/chirias/documents', label: 'Documente', icon: '📁' },
    { to: '/chirias/maintenance', label: 'Mentenanță', icon: '🛠️' },
  ];

  const nav = role === 'manager' ? manager : chirias;

  return (
    <aside className="hidden w-72 shrink-0 md:block">
      <div className="sticky top-6 mx-4 rounded-2xl border border-slate-700 bg-slate-900/90 p-5 shadow-2xl backdrop-blur-xl">

        <div className="mb-6 flex items-center gap-3 px-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-yellow-400 text-lg font-bold text-black shadow-lg">
            MP
          </div>

          <div>
            <div className="text-sm font-bold text-white">
              ApartManager
            </div>

            <div className="text-xs uppercase tracking-[0.2em] text-slate-400">
              {role === 'manager' ? 'Panou Manager' : 'Panou Chiriaș'}
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-slate-400">
            Filtre Apartamente
          </h3>

          <select
            value={filter}
            onChange={handleFilterChange}
            className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white outline-none transition focus:border-yellow-400"
          >
            <option value="">Toate apartamentele</option>
            <option value="property_1">Apartament 1</option>
            <option value="property_2">Apartament 2</option>
            <option value="property_3">Apartament 3</option>
          </select>
        </div>

        <nav className="space-y-2">
          {[...common, ...nav].map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-yellow-400 text-black shadow-lg'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`
              }
            >
              <span className="text-xl">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="mt-8 rounded-2xl border border-slate-700 bg-slate-800/70 p-4">
          <div className="mb-2 text-sm text-slate-400">
            Plan activ
          </div>

          <div className="mb-3 text-lg font-bold text-white">
            Pro Business
          </div>

          <div className="text-xs text-slate-500">
            Următoarea factură: 01/06/2026
          </div>
        </div>
      </div>
    </aside>
  );
}