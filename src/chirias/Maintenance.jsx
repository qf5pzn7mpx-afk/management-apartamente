import { useContext, useState } from 'react';
import Navbar from '../Navbar';
import { AuthContext } from '../AuthContext';
import { useNavigate } from 'react-router-dom';

export default function ChiriasMaintenance() {
  const { user } = useContext(AuthContext) || {};
  const navigate = useNavigate();
  const [titlu, setTitlu] = useState('');
  const [detalii, setDetalii] = useState('');
  const [urgenta, setUrgenta] = useState('Low');
  const [poza, setPoza] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const [succes, setSucces] = useState(false);
  const [eroare, setEroare] = useState('');

  const urgentaOptions = [
    { value: 'Low', label: 'Low', desc: 'Non-urgent, can wait', color: '#2d4a8a', bg: '#e8eef8' },
    { value: 'Medium', label: 'Medium', desc: 'Needs attention soon', color: '#8a5a2d', bg: '#f8f0e8' },
    { value: 'High', label: 'High', desc: 'Urgent, fix immediately', color: '#cc0000', bg: '#fff0f0' },
  ];

  const handleSubmit = async () => {
    if (!titlu.trim() || !detalii.trim()) {
      setEroare('Please fill in the title and details.');
      return;
    }
    setLoading(true);
    setEroare('');

    try {
      const token = localStorage.getItem('token') || '';
      
      const formData = new FormData();
      formData.append('titlu', titlu);
      formData.append('descriere', `[Urgency: ${urgenta}] ${detalii}`);
      formData.append('chirias_id', user?.id || '');
      formData.append('status', 'Nouă');
      
      if (poza) {
        formData.append('poza', poza); // Numele trebuie să se potrivească cu upload.single('poza') din backend
      }

      const response = await fetch('https://management-apartamente-api.onrender.com/api/mentenanta', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
          // Nu pune Content-Type aici, îl setează browserul automat pentru FormData
        },
        body: formData
      });

      if (!response.ok) throw new Error("Failed to save to database");

      setSucces(true);
      setTitlu('');
      setDetalii('');
      setPoza(null);
      setUrgenta('Low');
    } catch (err) {
      setEroare('Could not submit request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ch-maint-root" style={{ minHeight: '100vh', backgroundColor: '#f9fafa', fontFamily: 'Helvetica, sans-serif' }}>
      <Navbar />
      <div className="ch-maint-container" style={{ maxWidth: '800px', margin: '0 auto', padding: '100px 30px 60px' }}>

        {/* Scoped responsive styles - injected at start of return */}
        <style>{`
          .ch-maint-root { }
          .ch-maint-container { }
          .ch-maint-form { }
          .ch-maint-priority { }
          .ch-maint-priority-btn { }
          .ch-maint-dropzone { }
          .ch-maint-actions { }

          @media (max-width: 767px) {
            .ch-maint-container { padding: 60px 16px 40px !important; }
            .ch-maint-form { padding: 20px !important; }
            .ch-maint-priority { grid-template-columns: 1fr !important; gap: 12px !important; }
            .ch-maint-priority-btn { width: 100% !important; text-align: left !important; }
            .ch-maint-dropzone { padding: 20px !important; }
            .ch-maint-actions { display: block !important; }
            .ch-maint-actions button { display: block !important; width: 100% !important; margin-bottom: 10px !important; }
            .ch-maint-container img { max-width: 100% !important; height: auto !important; }
          }

          @media (min-width: 768px) and (max-width: 1024px) {
            .ch-maint-container { padding: 80px 20px 48px !important; }
            .ch-maint-form { padding: 36px !important; }
            .ch-maint-priority { grid-template-columns: repeat(3,1fr) !important; }
            .ch-maint-actions { display: flex !important; justify-content: space-between !important; }
            .ch-maint-actions button { min-width: 140px !important; }
          }
        `}</style>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '50px' }}>
          <div>
            <span style={{ fontSize: '13px', letterSpacing: '0.3em', color: '#888', textTransform: 'uppercase', display: 'block', marginBottom: '12px' }}>Tenant Portal</span>
            <h1 style={{ fontFamily: 'Forum, serif', fontSize: '52px', fontWeight: 400, color: '#1d1d1b', textTransform: 'uppercase', lineHeight: 1.1, margin: 0 }}>
              Report<br />An Issue
            </h1>
          </div>
          <button
            onClick={() => navigate('/chirias/dashboard')}
            style={{ fontSize: '14px', color: '#1d1d1b', background: 'none', border: 'none', cursor: 'pointer', borderBottom: '1px solid #1d1d1b', paddingBottom: '2px', marginTop: '8px', fontFamily: 'Helvetica, sans-serif' }}
          >
            ← Dashboard
          </button>
        </div>

        {succes && (
          <div style={{ background: '#f0fff0', border: '1px solid #ccffcc', padding: '20px 24px', marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '14px' }}>
            <span style={{ fontSize: '20px' }}>✓</span>
            <div>
              <div style={{ fontSize: '15px', color: '#007700', fontWeight: 500, marginBottom: '4px' }}>Request submitted successfully!</div>
              <div style={{ fontSize: '13px', color: '#555' }}>Your property manager will review it shortly.</div>
            </div>
            <button
              onClick={() => setSucces(false)}
              style={{ marginLeft: 'auto', background: 'none', border: '1px solid #ccffcc', padding: '8px 16px', fontSize: '13px', color: '#007700', cursor: 'pointer', fontFamily: 'Helvetica, sans-serif' }}
            >
              New Request
            </button>
          </div>
        )}

        {eroare && (
          <div style={{ background: '#fff0f0', border: '1px solid #ffcccc', padding: '14px 20px', marginBottom: '30px', color: '#cc0000', fontSize: '14px' }}>
            {eroare}
          </div>
        )}

        <div className="ch-maint-form" style={{ background: '#fff', border: '1px solid rgba(29,29,27,0.12)', padding: '50px' }}>

          <div style={{ marginBottom: '36px' }}>
            <label style={{ display: 'block', fontSize: '11px', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#999', marginBottom: '12px' }}>Issue Title *</label>
            <input
              type="text"
              value={titlu}
              onChange={e => setTitlu(e.target.value)}
              placeholder="Ex: Leaking faucet in bathroom"
              style={{ width: '100%', padding: '12px 0', border: 'none', borderBottom: '1px solid rgba(29,29,27,0.2)', background: 'transparent', fontSize: '16px', color: '#1d1d1b', outline: 'none', fontFamily: 'Helvetica, sans-serif', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ marginBottom: '36px' }}>
            <label style={{ display: 'block', fontSize: '11px', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#999', marginBottom: '12px' }}>Details *</label>
            <textarea
              value={detalii}
              onChange={e => setDetalii(e.target.value)}
              rows={5}
              placeholder="Describe the issue in detail so the manager can address it quickly..."
              style={{ width: '100%', padding: '16px', border: '1px solid rgba(29,29,27,0.15)', background: '#fcfdf5', fontSize: '15px', color: '#1d1d1b', outline: 'none', fontFamily: 'Helvetica, sans-serif', resize: 'vertical', boxSizing: 'border-box', lineHeight: 1.7 }}
            />
          </div>

          <div style={{ marginBottom: '36px' }}>
            <label style={{ display: 'block', fontSize: '11px', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#999', marginBottom: '12px' }}>Priority Level *</label>
            <div className="ch-maint-priority" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
              {urgentaOptions.map(opt => (
                <button
                  key={opt.value}
                  className="ch-maint-priority-btn"
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

          <div style={{ marginBottom: '50px' }}>
            <label style={{ display: 'block', fontSize: '11px', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#999', marginBottom: '12px' }}>Photo (optional)</label>
            <div
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={e => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f) setPoza(f); }}
              onClick={() => document.getElementById('fotoInput').click()}
              className="ch-maint-dropzone"
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
              <input id="fotoInput" type="file" accept="image/*" onChange={e => setPoza(e.target.files[0])} style={{ display: 'none' }} />
            </div>

            {poza && (
              <div data-label="Preview" style={{ marginTop: '12px', position: 'relative', display: 'inline-block' }}>
                <img
                  src={URL.createObjectURL(poza)}
                  alt="preview"
                  style={{ height: '120px', width: 'auto', objectFit: 'cover', border: '1px solid rgba(29,29,27,0.12)' }}
                />
                <button
                  onClick={() => setPoza(null)}
                  style={{ position: 'absolute', top: '6px', right: '6px', background: '#1d1d1b', color: '#f9fafa', border: 'none', width: '24px', height: '24px', cursor: 'pointer', fontSize: '12px' }}
                >
                  ✕
                </button>
              </div>
            )}
          </div>

          <div className="ch-maint-actions" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(29,29,27,0.08)', paddingTop: '30px' }}>
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
              {loading ? 'Submitting...' : 'Submit Request'}
            </button>
          </div>
        </div>

        <div style={{ border: '1px solid rgba(29,29,27,0.12)', background: '#fcfdf5', padding: '20px 24px', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '16px' }}>💡</span>
          <span style={{ fontSize: '13px', color: '#666' }}>
            For emergencies like flooding or gas leaks, please call your manager directly instead of submitting a request.
          </span>
        </div>
      </div>
    </div>
  );
}