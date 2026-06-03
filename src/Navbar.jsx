import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';

function Navbar() {
  const [meniuDeschis, setMeniuDeschis] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext) || {};
  const userRole = user?.role;

  const handleLogout = () => {
    logout();
    setMeniuDeschis(false);
    navigate('/');
  };

  const linkStyle = {
    fontSize: '14px',
    color: '#1d1d1b',
    textDecoration: 'none',
    fontFamily: 'Helvetica, sans-serif',
    transition: 'opacity 0.2s',
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    ...(userRole === 'manager' ? [{ to: '/manager/dashboard', label: 'Dashboard' }] : []),
    ...(userRole === 'chirias' ? [{ to: '/chirias/dashboard', label: 'Dashboard' }] : []),
    { to: '/facturi', label: 'Invoices' },
    { to: '/mentenanta', label: 'Maintenance' },
    { to: '/documente', label: 'Documents' },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <>
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000, background: '#f9fafa', borderBottom: '1px solid rgba(29,29,27,0.08)', fontFamily: 'Helvetica, sans-serif' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>

          <Link to="/" style={{ textDecoration: 'none' }}>
            <span style={{ fontWeight: 'bold', fontSize: '18px', color: '#1d1d1b', fontFamily: 'Helvetica, sans-serif' }}>EIF</span>
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }} className="desktop-nav">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                style={linkStyle}
                onMouseOver={e => e.currentTarget.style.opacity = '0.5'}
                onMouseOut={e => e.currentTarget.style.opacity = '1'}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {userRole && (
              <span style={{ fontSize: '12px', letterSpacing: '0.15em', color: '#888', textTransform: 'uppercase', display: 'none' }} className="role-badge">
                {userRole === 'manager' ? 'Manager' : 'Tenant'}
              </span>
            )}

            {userRole ? (
              <button
                onClick={handleLogout}
                style={{ background: 'none', border: '1px solid rgba(29,29,27,0.2)', padding: '8px 20px', fontSize: '13px', color: '#1d1d1b', cursor: 'pointer', fontFamily: 'Helvetica, sans-serif', transition: 'all 0.2s' }}
                onMouseOver={e => { e.currentTarget.style.background = '#1d1d1b'; e.currentTarget.style.color = '#f9fafa'; }}
                onMouseOut={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = '#1d1d1b'; }}
              >
                Sign Out
              </button>
            ) : (
              <button
                onClick={() => navigate('/login')}
                style={{ background: '#1d1d1b', border: 'none', padding: '10px 24px', fontSize: '13px', color: '#f9fafa', cursor: 'pointer', fontFamily: 'Helvetica, sans-serif', letterSpacing: '0.05em', transition: 'opacity 0.2s' }}
                onMouseOver={e => e.currentTarget.style.opacity = '0.8'}
                onMouseOut={e => e.currentTarget.style.opacity = '1'}
              >
                Sign In
              </button>
            )}

            <button
              onClick={() => setMeniuDeschis(!meniuDeschis)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px', display: 'flex', flexDirection: 'column', gap: '5px' }}
              className="hamburger-btn"
            >
              <span style={{ display: 'block', width: '24px', height: '1px', background: '#1d1d1b', transition: 'all 0.3s', transform: meniuDeschis ? 'translateY(6px) rotate(45deg)' : 'none' }} />
              <span style={{ display: 'block', width: '24px', height: '1px', background: '#1d1d1b', transition: 'all 0.3s', opacity: meniuDeschis ? 0 : 1 }} />
              <span style={{ display: 'block', width: '24px', height: '1px', background: '#1d1d1b', transition: 'all 0.3s', transform: meniuDeschis ? 'translateY(-6px) rotate(-45deg)' : 'none' }} />
            </button>
          </div>
        </div>

        {meniuDeschis && (
          <div style={{ position: 'fixed', top: '64px', left: 0, right: 0, bottom: 0, background: '#f9fafa', zIndex: 999, display: 'flex', flexDirection: 'column', padding: '60px 40px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
              {navLinks.map((link, i) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMeniuDeschis(false)}
                  style={{ fontFamily: 'Forum, serif', fontSize: '42px', fontWeight: 400, color: '#1d1d1b', textDecoration: 'none', padding: '16px 0', borderBottom: '1px solid rgba(29,29,27,0.08)', textTransform: 'uppercase', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'opacity 0.2s' }}
                  onMouseOver={e => e.currentTarget.style.opacity = '0.4'}
                  onMouseOut={e => e.currentTarget.style.opacity = '1'}
                >
                  <span>{link.label}</span>
                  <span style={{ fontSize: '24px', opacity: 0.3 }}>→</span>
                </Link>
              ))}
            </div>

            <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '40px', borderTop: '1px solid rgba(29,29,27,0.08)' }}>
              {userRole && (
                <span style={{ fontSize: '12px', letterSpacing: '0.2em', color: '#888', textTransform: 'uppercase' }}>
                  Signed in as {userRole === 'manager' ? 'Manager' : 'Tenant'}
                </span>
              )}
              {userRole ? (
                <button
                  onClick={handleLogout}
                  style={{ background: '#1d1d1b', border: 'none', padding: '14px 32px', fontSize: '14px', color: '#f9fafa', cursor: 'pointer', fontFamily: 'Helvetica, sans-serif', letterSpacing: '0.05em' }}
                >
                  Sign Out
                </button>
              ) : (
                <button
                  onClick={() => { setMeniuDeschis(false); navigate('/login'); }}
                  style={{ background: '#1d1d1b', border: 'none', padding: '14px 32px', fontSize: '14px', color: '#f9fafa', cursor: 'pointer', fontFamily: 'Helvetica, sans-serif', letterSpacing: '0.05em' }}
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        )}
      </nav>

      <style>{`
        .desktop-nav {
          display: flex;
        }
        .hamburger-btn {
          display: none;
        }
        @media (max-width: 768px) {
          .desktop-nav {
            display: none !important;
          }
          .hamburger-btn {
            display: flex !important;
          }
        }
        @media (min-width: 769px) {
          .hamburger-btn {
            display: flex;
          }
        }
      `}</style>
    </>
  );
}

export default Navbar;