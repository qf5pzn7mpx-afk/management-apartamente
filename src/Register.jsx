import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function Register() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [parola, setParola] = useState('');
  const [confirmaParola, setConfirmaParola] = useState('');
  const [nume, setNume] = useState('');
  const [rol, setRol] = useState(null);
  const [mesaj, setMesaj] = useState({ tip: '', text: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMesaj({ tip: '', text: '' });

    if (parola !== confirmaParola) {
      setMesaj({ tip: 'eroare', text: 'Passwords do not match.' });
      return;
    }

    if (parola.length < 6) {
      setMesaj({ tip: 'eroare', text: 'Password must be at least 6 characters long.' });
      return;
    }

    setLoading(true);

    try {
     
      const validRole = rol ? rol.toLowerCase() : 'chirias';

      const response = await fetch('https://management-apartamente-api.onrender.com/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, parola, rol: validRole, nume }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMesaj({ tip: 'eroare', text: data.error || 'An error occurred while creating the account.' });
        setLoading(false);
        return;
      }

      setMesaj({ tip: 'succes', text: 'Account created successfully! Redirecting to login...' });
      setTimeout(() => navigate('/login'), 2000);
    } catch {
      setMesaj({ tip: 'eroare', text: 'Server connection error.' });
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f0eb', fontFamily: 'Helvetica, sans-serif', display: 'flex', flexDirection: 'column' }}>

      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 50px', background: 'transparent', position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000 }}>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <span style={{ fontFamily: 'Helvetica, sans-serif', fontWeight: 'bold', fontSize: '18px', color: '#1d1d1b' }}>EIF</span>
        </Link>
        <Link to="/login" style={{ fontSize: '14px', color: '#1d1d1b', textDecoration: 'none', borderBottom: '1px solid #1d1d1b', paddingBottom: '2px' }}>
          Sign In
        </Link>
      </header>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '120px 30px 60px' }}>
        <div style={{ width: '100%', maxWidth: '580px' }}>

          {!rol ? (
            <div>
              <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#e8f4e8', padding: '8px 16px', marginBottom: '30px' }}>
                  <div style={{ width: '8px', height: '8px', background: '#2d7a2d', borderRadius: '50%' }} />
                  <span style={{ fontSize: '12px', letterSpacing: '0.2em', color: '#2d7a2d', textTransform: 'uppercase' }}>New Account</span>
                </div>
                <h1 style={{ fontFamily: 'Forum, serif', fontSize: '56px', fontWeight: 400, color: '#1d1d1b', textTransform: 'uppercase', lineHeight: 1.1, margin: '0 0 20px 0' }}>
                  Create Your Account
                </h1>
                <p style={{ fontSize: '16px', color: '#888', lineHeight: 1.7, margin: 0 }}>
                  Select your role to get started
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '40px' }}>
                <button
                  onClick={() => setRol('manager')}
                  style={{ padding: '30px', border: '1px solid rgba(29,29,27,0.15)', background: '#fff', cursor: 'pointer', textAlign: 'left', fontFamily: 'Helvetica, sans-serif', transition: 'all 0.2s', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                  onMouseOver={e => { e.currentTarget.style.background = '#1d1d1b'; e.currentTarget.style.borderColor = '#1d1d1b'; e.currentTarget.style.color = '#fff' }}
                  onMouseOut={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = 'rgba(29,29,27,0.15)'; e.currentTarget.style.color = '#1d1d1b' }}
                >
                  <div>
                    <div style={{ fontSize: '20px', color: 'inherit', fontWeight: 500, marginBottom: '6px' }}>Manager</div>
                    <div style={{ fontSize: '14px', color: 'inherit', opacity: 0.6 }}>Full access to all properties, tenants and invoices</div>
                  </div>
                  <span style={{ fontSize: '24px', color: 'inherit' }}>→</span>
                </button>

                <button
                  onClick={() => setRol('chirias')}
                  style={{ padding: '30px', border: '1px solid rgba(29,29,27,0.15)', background: '#fff', cursor: 'pointer', textAlign: 'left', fontFamily: 'Helvetica, sans-serif', transition: 'all 0.2s', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                  onMouseOver={e => { e.currentTarget.style.background = '#1d1d1b'; e.currentTarget.style.borderColor = '#1d1d1b'; e.currentTarget.style.color = '#fff' }}
                  onMouseOut={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = 'rgba(29,29,27,0.15)'; e.currentTarget.style.color = '#1d1d1b' }}
                >
                  <div>
                    <div style={{ fontSize: '20px', color: 'inherit', fontWeight: 500, marginBottom: '6px' }}>Tenant</div>
                    <div style={{ fontSize: '14px', color: 'inherit', opacity: 0.6 }}>Access your documents, invoices and maintenance requests</div>
                  </div>
                  <span style={{ fontSize: '24px', color: 'inherit' }}>→</span>
                </button>
              </div>

              <div style={{ borderTop: '1px solid rgba(29,29,27,0.1)', paddingTop: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '14px', color: '#999' }}>Already have an account?</span>
                <Link to="/login" style={{ fontSize: '14px', color: '#1d1d1b', textDecoration: 'none', borderBottom: '1px solid #1d1d1b', paddingBottom: '1px' }}>
                  Sign in here →
                </Link>
              </div>
            </div>
          ) : (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '50px' }}>
                <button
                  onClick={() => { setRol(null); setMesaj({ tip: '', text: '' }); }}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', color: '#999', padding: 0, fontFamily: 'Helvetica, sans-serif' }}
                >
                  ← Back
                </button>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#e8f4e8', padding: '6px 14px' }}>
                  <div style={{ width: '6px', height: '6px', background: '#2d7a2d', borderRadius: '50%' }} />
                  <span style={{ fontSize: '11px', letterSpacing: '0.2em', color: '#2d7a2d', textTransform: 'uppercase' }}>
                    {rol === 'manager' ? 'Manager' : 'Tenant'} Registration
                  </span>
                </div>
              </div>

              <h2 style={{ fontFamily: 'Forum, serif', fontSize: '48px', fontWeight: 400, color: '#1d1d1b', textTransform: 'uppercase', margin: '0 0 50px 0', lineHeight: 1.1 }}>
                Create Your<br />Account
              </h2>

              {mesaj.text && (
                <div style={{ padding: '14px 20px', marginBottom: '30px', fontSize: '14px', background: mesaj.tip === 'eroare' ? '#fff0f0' : '#f0fff0', border: `1px solid ${mesaj.tip === 'eroare' ? '#ffcccc' : '#ccffcc'}`, color: mesaj.tip === 'eroare' ? '#cc0000' : '#007700' }}>
                  {mesaj.text}
                </div>
              )}

              <div style={{ background: '#fff', border: '1px solid rgba(29,29,27,0.12)', padding: '50px' }}>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '11px', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#999' }}>Full Name *</label>
                    <input
                      type="text"
                      value={nume}
                      onChange={e => setNume(e.target.value)}
                      placeholder="John Smith"
                      required
                      style={{ padding: '12px 0', border: 'none', borderBottom: '1px solid rgba(29,29,27,0.2)', background: 'transparent', fontSize: '16px', color: '#1d1d1b', outline: 'none', fontFamily: 'Helvetica, sans-serif' }}
                    />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '11px', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#999' }}>Email *</label>
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      required
                      style={{ padding: '12px 0', border: 'none', borderBottom: '1px solid rgba(29,29,27,0.2)', background: 'transparent', fontSize: '16px', color: '#1d1d1b', outline: 'none', fontFamily: 'Helvetica, sans-serif' }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label style={{ fontSize: '11px', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#999' }}>Password *</label>
                      <input
                        type="password"
                        value={parola}
                        onChange={e => setParola(e.target.value)}
                        placeholder="Min. 6 characters"
                        required
                        minLength="6"
                        style={{ padding: '12px 0', border: 'none', borderBottom: '1px solid rgba(29,29,27,0.2)', background: 'transparent', fontSize: '16px', color: '#1d1d1b', outline: 'none', fontFamily: 'Helvetica, sans-serif' }}
                      />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label style={{ fontSize: '11px', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#999' }}>Confirm Password *</label>
                      <input
                        type="password"
                        value={confirmaParola}
                        onChange={e => setConfirmaParola(e.target.value)}
                        placeholder="••••••••"
                        required
                        style={{ padding: '12px 0', border: 'none', borderBottom: '1px solid rgba(29,29,27,0.2)', background: 'transparent', fontSize: '16px', color: '#1d1d1b', outline: 'none', fontFamily: 'Helvetica, sans-serif' }}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    style={{ background: loading ? '#999' : '#1d1d1b', color: '#f9fafa', border: 'none', padding: '18px', fontSize: '15px', cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'Helvetica, sans-serif', letterSpacing: '0.05em', transition: 'opacity 0.2s', marginTop: '10px' }}
                    onMouseOver={e => { if (!loading) e.currentTarget.style.opacity = '0.8'; }}
                    onMouseOut={e => e.currentTarget.style.opacity = '1'}
                  >
                    {loading ? 'Creating account...' : 'Create Account'}
                  </button>
                </form>
              </div>

              <div style={{ borderTop: '1px solid rgba(29,29,27,0.1)', marginTop: '30px', paddingTop: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '14px', color: '#999' }}>Already have an account?</span>
                <Link to="/login" style={{ fontSize: '14px', color: '#1d1d1b', textDecoration: 'none', borderBottom: '1px solid #1d1d1b', paddingBottom: '1px' }}>
                  Sign in here →
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Register;