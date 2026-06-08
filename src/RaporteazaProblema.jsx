import { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import { AuthContext } from './AuthContext';

function RaporteazaProblema() {
  const { user } = useContext(AuthContext) || {};
  const [titlu, setTitlu] = useState('');
  const [descriere, setDescriere] = useState('');
  const [urgenta, setUrgenta] = useState('Low');
  const [poza, setPoza] = useState(null);
  const [loading, setLoading] = useState(false);
  const [succes, setSucces] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const navigate = useNavigate();

  const handleSave = async () => {
    if (!titlu.trim() || !descriere.trim()) {
      alert('Te rugăm să completezi titlul și descrierea!');
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token') || '';

      const formData = new FormData();
      formData.append('titlu', titlu);
      formData.append('descriere', descriere);
      formData.append('status', 'Nouă');
      formData.append('urgenta', urgenta);
      formData.append('chirias_id', user?.id || 1);
      formData.append('apartament_id', 1);
      if (poza) formData.append('poza', poza);

      const response = await fetch('https://management-apartamente-api.onrender.com/api/mentenanta', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || 'Server error');
      }

      setSucces(true);
      setTimeout(() => navigate('/mentenanta'), 1500);
    } catch (err) {
      alert('Nu s-a putut contacta serverul: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const urgentaOptions = [
    { value: 'Low', label: 'Low', desc: 'Non-urgent, can wait', color: '#2d4a8a', bg: '#e8eef8' },
    { value: 'Medium', label: 'Medium', desc: 'Needs attention soon', color: '#8a5a2d', bg: '#f8f0e8' },
    { value: 'High', label: 'High', desc: 'Urgent, fix immediately', color: '#cc0000', bg: '#fff0f0' },
  ];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafa', fontFamily: 'Helvetica, sans-serif' }}>
      <Navbar />
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: isMobile ? '80px 20px 40px' : '100px 30px 60px' }}>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: isMobile ? '30px' : '50px' }}>
          <div>
            <span style={{ fontSize: '13px', letterSpacing: '0.3em', color: '#888', textTransform: 'uppercase', display: 'block', marginBottom: '12px' }}>03 — Tenant Platform</span>
            <h1 style={{ fontFamily: 'Forum, serif', fontSize: isMobile ? '36px' : '52px', fontWeight: 400, color: '#1d1d1b', textTransform: 'uppercase', lineHeight: 1.1, margin: 0 }}>
              Report<br />An Issue
            </h1>
          </div>
          <Link
            to="/mentenanta"
            style={{ fontSize: '14px', color: '#1d1d1b', textDecoration: 'none', borderBottom: '1px solid #1d1d1b', paddingBottom: '2px', marginTop: '8px' }}
          >
            ← Back
          </Link>
        </div>

        {succes && (
          <div style={{ background: '#f0fff0', border: '1px solid #ccffcc', padding: '14px 20px', marginBottom: '30px', color: '#007700', fontSize: '14px' }}>
            ✓ Issue reported successfully! Redirecting...
          </div>
        )}

        <div style={{ background: '#fff', border: '1px solid rgba(29,29,27,0.12)', padding: isMobile ? '24px' : '50px' }}>

          <div style={{ marginBottom: '36px' }}>
            <label style={{ display: 'block', fontSize: '11px', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#999', marginBottom: '12px' }}>Issue Title *</label>
            <input
              type="text"
              value={titlu}
              onChange={e => setTitlu(e.target.value)}
              placeholder="Ex: Broken faucet in bathroom"
              style={{ width: '100%', padding: '12px 0', border: 'none', borderBottom: '1px solid rgba(29,29,27,0.2)', background: 'transparent', fontSize: '16px', color: '#1d1d1b', outline: 'none', fontFamily: 'Helvetica, sans-serif', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ marginBottom: '36px' }}>
            <label style={{ display: 'block', fontSize: '11px', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#999', marginBottom: '12px' }}>Detailed Description *</label>
            <textarea
              value={descriere}
              onChange={e => setDescriere(e.target.value)}
              rows={5}
              placeholder="Describe the issue in detail so the manager can address it quickly..."
              style={{ width: '100%', padding: '16px', border: '1px solid rgba(29,29,27,0.15)', background: '#fcfdf5', fontSize: '16px', color: '#1d1d1b', outline: 'none', fontFamily: 'Helvetica, sans-serif', resize: 'vertical', boxSizing: 'border-box', lineHeight: 1.7 }}
            />
          </div>

          <div style={{ marginBottom: '36px' }}>
            <label style={{ display: 'block', fontSize: '11px', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#999', marginBottom: '12px' }}>Priority Level *</label>
            {/* Adaptăm grid-ul pentru a stivui elementele pe mobil */}
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: '10px' }}>
              {urgentaOptions.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setUrgenta(opt.value)}
                  style={{
                    padding: '16px',
                    border: `1px solid ${urgenta === opt.value ? opt.color : 'rgba(29,29,27,0.15)'}`,
                    background: urgenta === opt.value ? opt.bg : '#fff',
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontFamily: 'Helvetica, sans-serif',
                    transition: 'all 0.2s',
                  }}
                >
                  <div style={{ fontSize: '14px', fontWeight: 600, color: urgenta === opt.value ? opt.color : '#1d1d1b', marginBottom: '4px' }}>{opt.label}</div>
                  <div style={{ fontSize: '12px', color: '#999' }}>{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: isMobile ? '30px' : '50px' }}>
            <label style={{ display: 'block', fontSize: '11px', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#999', marginBottom: '12px' }}>Photo (optional)</label>
            <div
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={e => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f) setPoza(f); }}
              onClick={() => document.getElementById('fotoInput').click()}
              style={{
                border: `2px dashed ${dragOver ? '#1d1d1b' : 'rgba(29,29,27,0.2)'}`,
                padding: '40px 30px',
                textAlign: 'center',
                cursor: 'pointer',
                background: dragOver ? '#f5f5f0' : '#fcfdf5',
                transition: 'all 0.2s',
              }}
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="1.5" style={{ margin: '0 auto 14px' }}>
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
              {poza ? (
                <div>
                  <p style={{ fontSize: '14px', color: '#1d1d1b', margin: '0 0 6px 0', fontWeight: 500 }}>{poza.name}</p>
                  <p style={{ fontSize: '12px', color: '#999', margin: 0 }}>{(poza.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              ) : (
                <>
                  <p style={{ fontSize: '14px', color: '#999', margin: '0 0 6px 0' }}>Drag & drop or click to upload</p>
                  <p style={{ fontSize: '12px', color: '#bbb', margin: 0 }}>JPG, PNG up to 10MB</p>
                </>
              )}
              <input
                id="fotoInput"
                type="file"
                accept="image/*"
                onChange={e => setPoza(e.target.files[0])}
                style={{ display: 'none' }}
              />
            </div>
            {poza && (
              <div style={{ marginTop: '12px', position: 'relative', display: 'inline-block' }}>
                <img
                  src={URL.createObjectURL(poza)}
                  alt="preview"
                  style={{ height: '120px', width: 'auto', objectFit: 'cover', border: '1px solid rgba(29,29,27,0.12)' }}
                />
                <button
                  onClick={e => { e.stopPropagation(); setPoza(null); }}
                  style={{ position: 'absolute', top: '6px', right: '6px', background: '#1d1d1b', color: '#f9fafa', border: 'none', width: '24px', height: '24px', cursor: 'pointer', fontSize: '12px' }}
                >
                  ✕
                </button>
              </div>
            )}
          </div>

          {/* Adaptăm flex-direction pentru mobil: butoanele se vor așeza pe coloană */}
          <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(29,29,27,0.1)', paddingTop: '30px', gap: isMobile ? '20px' : '0' }}>
            <Link
              to="/mentenanta"
              style={{ fontSize: '14px', color: '#999', textDecoration: 'none', borderBottom: '1px solid #ccc', paddingBottom: '2px', order: isMobile ? 2 : 1 }}
            >
              Cancel
            </Link>
            <button
              onClick={handleSave}
              disabled={loading}
              style={{
                background: loading ? '#999' : '#1d1d1b',
                color: '#f9fafa',
                border: 'none',
                padding: '14px 50px',
                fontSize: '14px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontFamily: 'Helvetica, sans-serif',
                letterSpacing: '0.05em',
                transition: 'opacity 0.2s',
                width: isMobile ? '100%' : 'auto',
                order: isMobile ? 1 : 2
              }}
              onMouseOver={e => { if (!loading) e.currentTarget.style.opacity = '0.8'; }}
              onMouseOut={e => e.currentTarget.style.opacity = '1'}
            >
              {loading ? 'Submitting...' : 'Submit Request'}
            </button>
          </div>
        </div>

        <div style={{ border: '1px solid rgba(29,29,27,0.12)', background: '#fcfdf5', padding: '20px 24px', marginTop: '15px', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
          <span style={{ fontSize: '16px', marginTop: '2px' }}>💡</span>
          <span style={{ fontSize: '13px', color: '#666', lineHeight: 1.5 }}>
            For emergencies like flooding or gas leaks, please call your manager directly instead of submitting a request.
          </span>
        </div>
      </div>
    </div>
  );
}

export default RaporteazaProblema;