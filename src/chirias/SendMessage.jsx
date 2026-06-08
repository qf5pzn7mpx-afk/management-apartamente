import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar';
import { AuthContext } from '../AuthContext';

export default function SendMessage() {
  const { user } = useContext(AuthContext) || {};
  const navigate = useNavigate();
  const [subiect, setSubiect] = useState('');
  const [mesaj, setMesaj] = useState('');
  const [categorie, setCategorie] = useState('General');
  const [loading, setLoading] = useState(false);
  const [succes, setSucces] = useState(false);
  const [eroare, setEroare] = useState('');

  const categorii = [
    { value: 'General', label: 'General', desc: 'General inquiry', icon: '💬' },
    { value: 'Maintenance', label: 'Maintenance', desc: 'Report an issue', icon: '🔧' },
    { value: 'Invoice', label: 'Invoice', desc: 'Payment question', icon: '🧾' },
    { value: 'Contract', label: 'Contract', desc: 'Lease related', icon: '📄' },
  ];

  const handleSubmit = async () => {
    if (!subiect.trim() || !mesaj.trim()) {
      setEroare('Please fill in the subject and message.');
      return;
    }
    setLoading(true);
    setEroare('');

    try {
      const token = localStorage.getItem('token') || '';
      
      await fetch('https://management-apartamente-api.onrender.com/api/contact', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({
          firstName: user?.name || 'Tenant',
          lastName: `(ID: ${user?.id || '?'})`,
          email: user?.email || 'tenant@email.com',
          message: `[${categorie}] ${subiect} - ${mesaj}`
        })
      });

      setSucces(true);
    } catch {
      setEroare('Could not send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ch-msg-root" style={{ minHeight: '100vh', backgroundColor: '#f9fafa', fontFamily: 'Helvetica, sans-serif' }}>
      <Navbar />
      <div className="ch-msg-container" style={{ maxWidth: '700px', margin: '0 auto', padding: '100px 30px 60px' }}>

        {/* Scoped responsive styles - injected at start of return */}
        <style>{`
          .ch-msg-root { }
          .ch-msg-container { }
          .ch-msg-categories { }
          .ch-msg-cat-btn { }
          .ch-msg-form { }
          .ch-msg-info { }
          .ch-msg-actions { }

          @media (max-width: 767px) {
            .ch-msg-container { padding: 60px 16px 40px !important; }
            .ch-msg-categories { grid-template-columns: 1fr !important; gap: 8px !important; }
            .ch-msg-cat-btn { text-align: left !important; }
            .ch-msg-form { padding: 20px !important; }
            input[data-label="Subject"], textarea[data-label="Message"] { width: 100% !important; }
            .ch-msg-info { padding: 12px !important; }
            .ch-msg-actions { display: block !important; }
            .ch-msg-actions button { width: 100% !important; display: block !important; margin-bottom: 10px !important; }
          }

          @media (min-width: 768px) and (max-width: 1024px) {
            .ch-msg-container { padding: 80px 20px 48px !important; }
            .ch-msg-categories { grid-template-columns: repeat(2,1fr) !important; }
            .ch-msg-actions { display:flex !important; justify-content:space-between !important; }
            .ch-msg-actions button { min-width:140px !important; }
          }
        `}</style>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '50px' }}>
          <div>
            <span style={{ fontSize: '13px', letterSpacing: '0.3em', color: '#888', textTransform: 'uppercase', display: 'block', marginBottom: '12px' }}>Tenant Portal</span>
            <h1 style={{ fontFamily: 'Forum, serif', fontSize: '52px', fontWeight: 400, color: '#1d1d1b', textTransform: 'uppercase', lineHeight: 1.1, margin: 0 }}>
              Message<br />Manager
            </h1>
          </div>
          <button
            onClick={() => navigate('/chirias/dashboard')}
            style={{ fontSize: '14px', color: '#1d1d1b', background: 'none', border: 'none', cursor: 'pointer', borderBottom: '1px solid #1d1d1b', paddingBottom: '2px', marginTop: '8px', fontFamily: 'Helvetica, sans-serif' }}
          >
            ← Dashboard
          </button>
        </div>

        {succes ? (
          <div style={{ background: '#fff', border: '1px solid rgba(29,29,27,0.12)', padding: '60px', textAlign: 'center' }}>
            <div style={{ width: '60px', height: '60px', border: '1px solid #1d1d1b', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', fontSize: '24px' }}>
              ✓
            </div>
            <h2 style={{ fontFamily: 'Forum, serif', fontSize: '32px', fontWeight: 400, color: '#1d1d1b', textTransform: 'uppercase', margin: '0 0 16px 0' }}>Message Sent!</h2>
            <p style={{ fontSize: '15px', color: '#666', lineHeight: 1.7, marginBottom: '40px' }}>
              Your manager will receive your message and respond as soon as possible.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                onClick={() => { setSucces(false); setSubiect(''); setMesaj(''); setCategorie('General'); }}
                style={{ padding: '12px 28px', border: '1px solid rgba(29,29,27,0.2)', background: '#fff', fontSize: '14px', color: '#1d1d1b', cursor: 'pointer', fontFamily: 'Helvetica, sans-serif', transition: 'all 0.2s' }}
                onMouseOver={e => { e.currentTarget.style.background = '#1d1d1b'; e.currentTarget.style.color = '#f9fafa'; }}
                onMouseOut={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#1d1d1b'; }}
              >
                Send Another
              </button>
              <button
                onClick={() => navigate('/chirias/dashboard')}
                style={{ padding: '12px 28px', border: 'none', background: '#1d1d1b', fontSize: '14px', color: '#f9fafa', cursor: 'pointer', fontFamily: 'Helvetica, sans-serif', transition: 'opacity 0.2s' }}
                onMouseOver={e => e.currentTarget.style.opacity = '0.8'}
                onMouseOut={e => e.currentTarget.style.opacity = '1'}
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        ) : (
          <div className="ch-msg-form" style={{ background: '#fff', border: '1px solid rgba(29,29,27,0.12)', padding: '50px' }}>

            {eroare && (
              <div style={{ background: '#fff0f0', border: '1px solid #ffcccc', padding: '14px 20px', marginBottom: '30px', color: '#cc0000', fontSize: '14px' }}>
                {eroare}
              </div>
            )}

            <div style={{ marginBottom: '36px' }}>
              <label style={{ display: 'block', fontSize: '11px', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#999', marginBottom: '12px' }}>Category *</label>
              <div className="ch-msg-categories" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                {categorii.map(cat => (
                  <button
                    key={cat.value}
                    className="ch-msg-cat-btn"
                    onClick={() => setCategorie(cat.value)}
                    style={{ padding: '16px 10px', border: `1px solid ${categorie === cat.value ? '#1d1d1b' : 'rgba(29,29,27,0.15)'}`, background: categorie === cat.value ? '#1d1d1b' : '#fff', cursor: 'pointer', textAlign: 'center', fontFamily: 'Helvetica, sans-serif', transition: 'all 0.2s' }}
                  >
                    <div style={{ fontSize: '20px', marginBottom: '6px' }}>{cat.icon}</div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: categorie === cat.value ? '#f9fafa' : '#1d1d1b', marginBottom: '4px' }}>{cat.label}</div>
                    <div style={{ fontSize: '11px', color: categorie === cat.value ? 'rgba(249,250,250,0.6)' : '#999' }}>{cat.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '36px' }}>
              <label style={{ display: 'block', fontSize: '11px', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#999', marginBottom: '12px' }}>Subject *</label>
              <input
                type="text"
                value={subiect}
                onChange={e => setSubiect(e.target.value)}
                placeholder="Ex: Question about my invoice"
                data-label="Subject"
                style={{ width: '100%', padding: '12px 0', border: 'none', borderBottom: '1px solid rgba(29,29,27,0.2)', background: 'transparent', fontSize: '16px', color: '#1d1d1b', outline: 'none', fontFamily: 'Helvetica, sans-serif', boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ marginBottom: '40px' }}>
              <label style={{ display: 'block', fontSize: '11px', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#999', marginBottom: '12px' }}>Message *</label>
              <textarea
                value={mesaj}
                onChange={e => setMesaj(e.target.value)}
                rows={6}
                placeholder="Write your message here..."
                data-label="Message"
                style={{ width: '100%', padding: '16px', border: '1px solid rgba(29,29,27,0.15)', background: '#fcfdf5', fontSize: '15px', color: '#1d1d1b', outline: 'none', fontFamily: 'Helvetica, sans-serif', resize: 'vertical', boxSizing: 'border-box', lineHeight: 1.7 }}
              />
              <div style={{ fontSize: '12px', color: '#999', marginTop: '6px', textAlign: 'right' }}>
                {mesaj.length} characters
              </div>
            </div>

            <div className="ch-msg-info" style={{ background: '#fcfdf5', border: '1px solid rgba(29,29,27,0.08)', padding: '16px 20px', marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '16px' }}>👤</span>
              <span style={{ fontSize: '13px', color: '#666' }}>
                Sending as <strong style={{ color: '#1d1d1b' }}>{user?.name || user?.email || 'Tenant'}</strong>
              </span>
            </div>

            <div className="ch-msg-actions" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(29,29,27,0.08)', paddingTop: '30px' }}>
              <button
                onClick={() => navigate('/chirias/dashboard')}
                style={{ fontSize: '14px', color: '#999', background: 'none', border: 'none', cursor: 'pointer', borderBottom: '1px solid #ccc', paddingBottom: '2px', fontFamily: 'Helvetica, sans-serif' }}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                style={{ background: loading ? '#999' : '#1d1d1b', color: '#f9fafa', border: 'none', padding: '14px 50px', fontSize: '14px', cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'Helvetica, sans-serif', letterSpacing: '0.05em', transition: 'opacity 0.2s' }}
                onMouseOver={e => { if (!loading) e.currentTarget.style.opacity = '0.8'; }}
                onMouseOut={e => e.currentTarget.style.opacity = '1'}
              >
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}