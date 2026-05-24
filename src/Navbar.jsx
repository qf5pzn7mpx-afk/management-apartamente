import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from './AuthContext';

function Navbar() {
  const [meniuDeschis, setMeniuDeschis] = useState(false);

  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext) || {};
  const userRole = user?.role;

  const roleLabel = userRole === 'manager' ? 'Manager' : userRole === 'chirias' ? 'Chiriaș' : null;

  const handleLogout = () => {
    logout();
    setMeniuDeschis(false);
    navigate('/');
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <>
      <nav className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-950/95 backdrop-blur-md shadow-lg">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          
          {/* LOGO */}
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-yellow-400 shadow-md">
              <svg
                width="26"
                height="26"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#111827"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 10.5L12 3l9 7.5" />
                <path d="M5 9.5V21h14V9.5" />
                <path d="M9 21v-6h6v6" />
              </svg>
            </div>

            <div className="hidden sm:block">
              <h1 className="text-xl font-extrabold tracking-wide text-white">
                ApartManager
              </h1>
              <p className="text-xs tracking-[0.25em] text-slate-400 uppercase">
                Property Management
              </p>
            </div>
          </Link>

          {/* DESKTOP MENU */}
          <div className="hidden items-center gap-6 md:flex">
            <Link
              to="/"
              className="text-sm font-medium text-slate-200 transition hover:text-yellow-400"
            >
              Acasă
            </Link>

            {/* Role-specific dashboard link */}
            {userRole === 'manager' && (
              <Link
                to="/manager/dashboard"
                className="text-sm font-medium text-slate-200 transition hover:text-yellow-400"
              >
                Panou Manager
              </Link>
            )}

            {userRole === 'chirias' && (
              <Link
                to="/chirias/dashboard"
                className="text-sm font-medium text-slate-200 transition hover:text-yellow-400"
              >
                Panou Chiriaș
              </Link>
            )}

            <Link
              to="/contact"
              className="text-sm font-medium text-slate-200 transition hover:text-yellow-400"
            >
              Contact
            </Link>

            <Link
              to="/facturi"
              className="text-sm font-medium text-slate-200 transition hover:text-yellow-400"
            >
              Facturi
            </Link>

            <Link
              to="/mentenanta"
              className="text-sm font-medium text-slate-200 transition hover:text-yellow-400"
            >
              Mentenanță
            </Link>

            <Link
              to="/documente"
              className="text-sm font-medium text-slate-200 transition hover:text-yellow-400"
            >
              Documente
            </Link>

            {roleLabel && (
              <span className="rounded-full bg-yellow-400 px-4 py-2 text-xs font-bold text-black shadow-md">
                {roleLabel}
              </span>
            )}

            {userRole ? (
              <button
                onClick={handleLogout}
                className="rounded-xl bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-600"
              >
                Ieși
              </button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLoginClick}
                className="rounded-xl bg-yellow-400 px-5 py-2 text-sm font-bold text-black shadow-lg transition hover:bg-yellow-300"
              >
                Conectează-te
              </motion.button>
            )}
          </div>

          {/* MOBILE BUTTON */}
          <button
            onClick={() => setMeniuDeschis(!meniuDeschis)}
            className="flex h-11 w-11 items-center justify-center rounded-xl bg-yellow-400 text-black shadow-md md:hidden"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 7h16M4 12h16M4 17h16"
              />
            </svg>
          </button>
        </div>

        {/* MOBILE MENU */}
        <AnimatePresence>
          {meniuDeschis && (
            <motion.div
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="border-t border-slate-800 bg-slate-950 px-6 py-5 md:hidden"
            >
              <div className="flex flex-col gap-3">
                <Link
                  to="/"
                  onClick={() => setMeniuDeschis(false)}
                  className="rounded-xl px-4 py-3 text-slate-200 transition hover:bg-slate-800"
                >
                  Acasă
                </Link>

                {userRole === 'manager' && (
                  <Link to="/manager/dashboard" onClick={() => setMeniuDeschis(false)} className="rounded-xl px-4 py-3 text-slate-200 transition hover:bg-slate-800">Panou Manager</Link>
                )}

                {userRole === 'chirias' && (
                  <Link to="/chirias/dashboard" onClick={() => setMeniuDeschis(false)} className="rounded-xl px-4 py-3 text-slate-200 transition hover:bg-slate-800">Panou Chiriaș</Link>
                )}

                <Link
                  to="/contact"
                  onClick={() => setMeniuDeschis(false)}
                  className="rounded-xl px-4 py-3 text-slate-200 transition hover:bg-slate-800"
                >
                  Contact
                </Link>

                <Link
                  to="/facturi"
                  onClick={() => setMeniuDeschis(false)}
                  className="rounded-xl px-4 py-3 text-slate-200 transition hover:bg-slate-800"
                >
                  Facturi
                </Link>

                <Link
                  to="/mentenanta"
                  onClick={() => setMeniuDeschis(false)}
                  className="rounded-xl px-4 py-3 text-slate-200 transition hover:bg-slate-800"
                >
                  Mentenanță
                </Link>

                <Link
                  to="/documente"
                  onClick={() => setMeniuDeschis(false)}
                  className="rounded-xl px-4 py-3 text-slate-200 transition hover:bg-slate-800"
                >
                  Documente
                </Link>

                {userRole ? (
                  <button
                    onClick={handleLogout}
                    className="mt-3 rounded-xl bg-red-500 px-4 py-3 font-semibold text-white"
                  >
                    Ieși
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setMeniuDeschis(false);
                      handleLoginClick();
                    }}
                    className="mt-3 rounded-xl bg-yellow-400 px-4 py-3 font-bold text-black"
                  >
                    Conectează-te
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
}

export default Navbar;