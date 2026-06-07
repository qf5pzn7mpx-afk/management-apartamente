import { useContext, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from './AuthContext';

function Login() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [email, setEmail] = useState('');
  const [parola, setParola] = useState('');
  const [eroare, setEroare] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEroare('');
    setLoading(true);

    try {
      const response = await fetch('https://management-apartamente-api.onrender.com/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, parola }),
      });

      const data = await response.json();

      if (!response.ok) {
        setEroare(data.error || 'Authentication error. Please check your credentials.');
        setLoading(false);
        return;
      }

     
      const serverRole = String(data.rol || 'chirias').toLowerCase();

     
      login({ id: data.id, role: serverRole, email }, data.token);

    
      if (serverRole === 'manager') {
        navigate('/manager/dashboard');
      } else {
        navigate('/chirias/dashboard');
      }
    } catch {
      setEroare('Server connection error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafa', fontFamily: 'Helvetica, sans-serif' }}>

      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 50px', background: '#f9fafa', borderBottom: '1px solid rgba(29,29,27,0.08)', position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000 }}>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <span style={{ fontFamily: 'Helvetica, sans-serif', fontWeight: 'bold', fontSize: '18px', color: '#1d1d1b' }}>EIF</span>
        </Link>
        <Link to="/register" style={{ fontSize: '14px', color: '#1d1d1b', textDecoration: 'none', borderBottom: '1px solid #1d1d1b', paddingBottom: '2px' }}>
          Create Account
        </Link>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: '100vh' }}>

        <div style={{ background: '#1d1d1b', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '120px 80px' }}>
          <span style={{ fontSize: '13px', letterSpacing: '0.3em', color: 'rgba(249,250,250,0.5)', textTransform: 'uppercase', marginBottom: '24px', display: 'block' }}>
            Welcome Back
          </span>
          <h1 style={{ fontFamily: 'Forum, serif', fontSize: '64px', fontWeight: 400, color: '#f9fafa', lineHeight: 1.1, textTransform: 'uppercase', margin: '0 0 30px 0' }}>
            Sign In<br />To Your<br />Account
          </h1>
          <p style={{ fontSize: '16px', color: 'rgba(249,250,250,0.6)', lineHeight: 1.8, maxWidth: '340px', margin: '0 0 50px 0' }}>
            Access your property management dashboard and stay on top of everything.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {['Tenant Documents', 'Invoice Management', 'Maintenance Requests'].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ width: '6px', height: '6px', background: 'rgba(249,250,250,0.4)', borderRadius: '50%' }} />
                <span style={{ fontSize: '14px', color: 'rgba(249,250,250,0.5)' }}>{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '120px 80px', background: '#f9fafa' }}>
          <div>
            <span style={{ fontSize: '13px', letterSpacing: '0.3em', color: '#888', textTransform: 'uppercase', marginBottom: '16px', display: 'block' }}>
              Secure Login
            </span>
            <h2 style={{ fontFamily: 'Forum, serif', fontSize: '40px', fontWeight: 400, color: '#1d1d1b', textTransform: 'uppercase', margin: '0 0 50px 0' }}>
              Enter Your<br />Credentials
            </h2>

            {eroare && (
              <div style={{ background: '#fff0f0', border: '1px solid #ffcccc', padding: '14px 20px', marginBottom: '24px', color: '#cc0000', fontSize: '14px' }}>
                {eroare}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '11px', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#999' }}>Email *</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  placeholder="your@email.com"
                  style={{ padding: '12px 0', border: 'none', borderBottom: '1px solid rgba(29,29,27,0.3)', background: 'transparent', fontSize: '16px', color: '#1d1d1b', outline: 'none', fontFamily: 'Helvetica, sans-serif' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '11px', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#999' }}>Password *</label>
                <input
                  type="password"
                  value={parola}
                  onChange={e => setParola(e.target.value)}
                  required
                  placeholder="••••••••"
                  style={{ padding: '12px 0', border: 'none', borderBottom: '1px solid rgba(29,29,27,0.3)', background: 'transparent', fontSize: '16px', color: '#1d1d1b', outline: 'none', fontFamily: 'Helvetica, sans-serif' }}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{ background: loading ? '#999' : '#1d1d1b', color: '#f9fafa', border: 'none', padding: '16px', fontSize: '15px', cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'Helvetica, sans-serif', letterSpacing: '0.05em', marginTop: '10px', transition: 'opacity 0.2s' }}
                onMouseOver={e => { if (!loading) e.currentTarget.style.opacity = '0.8'; }}
                onMouseOut={e => e.currentTarget.style.opacity = '1'}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <p style={{ marginTop: '30px', fontSize: '14px', color: '#999' }}>
              Don't have an account?{' '}
              <Link to="/register" style={{ color: '#1d1d1b', textDecoration: 'none', borderBottom: '1px solid #1d1d1b', paddingBottom: '1px' }}>
                Register here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;