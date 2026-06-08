import { NavLink } from 'react-router-dom';
import { useState } from 'react';

export default function Sidebar({ role = 'manager', onFilter }) {
  const [filter, setFilter] = useState('');
  const [isOpen, setIsOpen] = useState(false); // Starea pentru meniul pe mobil

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
    if (onFilter) {
      onFilter(event.target.value);
    }
  };

  // Când un link este apăsat pe mobil, închidem meniul
  const handleLinkClick = () => {
    setIsOpen(false);
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
    <>
      {/* Buton Hamburger pentru Mobil (vizibil doar pe ecrane mici) */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-4 left-4 z-40 rounded-lg bg-slate-900 p-2 text-white shadow-lg md:hidden"
      >
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Overlay întunecat pentru fundal pe mobil */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar-ul propriu-zis */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 shrink-0 transform transition-transform duration-300 ease-in-out md:relative md:block md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="mx-4 my-4 h-[calc(100vh-2rem)] overflow-y-auto rounded-2xl border border-slate-700 bg-slate-900/90 p-5 shadow-2xl backdrop-blur-xl md:sticky md:top-6 md:my-0 md:h-auto">
          
          {/* Buton X pentru închidere pe mobil */}
          <button 
            onClick={() => setIsOpen(false)} 
            className="absolute right-4 top-4 text-slate-400 hover:text-white md:hidden"
          >
             <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
             </svg>
          </button>

          <div className="mb-6 flex items-center gap-3 px-2 mt-4 md:mt-0">
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
                onClick={handleLinkClick} // Închide meniul la click pe mobil
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
    </>
  );
}