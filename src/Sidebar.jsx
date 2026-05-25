import { NavLink } from 'react-router-dom';

export default function Sidebar({ role = 'manager' }) {
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
      <div className="sticky top-6 mx-4 rounded-2xl bg-gradient-to-b from-slate-900/60 to-slate-900/40 p-4 shadow-lg border border-white/6">
        <div className="mb-6 flex items-center gap-3 px-2">
          <div className="h-11 w-11 rounded-xl bg-indigo-600/80 flex items-center justify-center text-lg">MP</div>
          <div>
            <div className="text-sm font-semibold text-white">Management</div>
            <div className="text-xs text-slate-400">Panou {role === 'manager' ? 'Manager' : 'Chiriaș'}</div>
          </div>
        </div>

        <nav className="space-y-1">
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${isActive ? 'bg-indigo-600/20 text-white' : 'text-slate-300 hover:bg-white/5'}`}
            >
              <span className="text-xl">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="mt-6 border-t border-white/4 pt-4 text-sm text-slate-400 px-2">
          <div className="mb-2">Plan: <span className="text-slate-200 font-semibold">Pro</span></div>
          <div className="text-xs">Următoarea factură: 01/06/2026</div>
        </div>
      </div>
    </aside>
  );
}
