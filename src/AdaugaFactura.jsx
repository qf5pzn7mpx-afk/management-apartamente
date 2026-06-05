import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

function AdaugaFactura() {
  const [chiriasi, setChiriasi] = useState([]);
  const [chiriasId, setChiriasId] = useState('');
  const [amount, setAmount] = useState('');
  const [tip, setTip] = useState(null);
  const [dataEmiterii, setDataEmiterii] = useState('');
  const [dataScadentei, setDataScadentei] = useState('');
  const [eroare, setEroare] = useState('');
  const [succes, setSucces] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    import('./api/mockApi').then(({ getTenants }) =>
      getTenants().then(data => setChiriasi(Array.isArray(data) ? data : []))
    ).catch(() => setEroare('Cannot load tenants list.'));
  }, []);

  const handleSave = async () => {
    // Detector inteligent de câmpuri goale
    const missingFields = [];
    if (!chiriasId) missingFields.push('Tenant');
    if (!amount) missingFields.push('Amount');
    if (!tip) missingFields.push('Invoice Type');
    if (!dataEmiterii) missingFields.push('Issue Date');
    if (!dataScadentei) missingFields.push('Due Date');

    // Dacă lipsește ceva, afișăm exact ce anume lipsește
    if (missingFields.length > 0) {
      setEroare(`Please fill in all required fields! Missing: ${missingFields.join(', ')}`);
      return;
    }

    setLoading(true);
    setEroare('');
    try {
      const payload = { 
        chirias_id: parseInt(chiriasId), 
        suma: parseFloat(amount), 
        tip: tip, 
        data_emiterii: dataEmiterii, 
        data_scadentei: dataScadentei, 
        status: 'Unpaid' 
      };

      const response = await fetch('https://management-apartamente-api.onrender.com/api/facturi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Error saving invoice');
      }

      setSucces(true);
      setTimeout(() => navigate('/facturi'), 1500);
    } catch (err) {
      setEroare('Cannot connect to server: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const tipuri = [
    { value: 'Rent', label: 'Rent', icon: '🏠', desc: 'Monthly rent payment' },
    { value: 'Maintenance', label: 'Maintenance', icon: '🔧', desc: 'Building maintenance fee' },
    { value: 'Electricity', label: 'Electricity', icon: '⚡', desc: 'Electric bill' },
    { value: 'Gas', label: 'Gas', icon: '🔥', desc: 'Gas bill' },
    { value: 'Other', label: 'Other', icon: '📋', desc: 'Other expenses' },
  ];

  const chirias = chiriasi.find(c => String(c.id) === String(chiriasId));

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafa', fontFamily: 'Helvetica, sans-serif' }}>
      <Navbar />
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '100px 30px 60px' }}>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '50px' }}>
          <div>
            <span style={{ fontSize: '13px', letterSpacing: '0.3em', color: '#888', textTransform: 'uppercase', display: 'block', marginBottom: '12px' }}>02 — Invoice Management</span>
            <h1 style={{ fontFamily: 'Forum, serif', fontSize: '52px', fontWeight: 400, color: '#1d1d1b', textTransform: 'uppercase', lineHeight: 1.1, margin: 0 }}>
              Create New<br />Invoice
            </h1>
          </div>
          <Link to="/facturi" style={{ fontSize: '14px', color: '#1d1d1b', textDecoration: 'none', borderBottom: '1px solid #1d1d1b', paddingBottom: '2px', marginTop: '8px' }}>
            ← Back
          </Link>
        </div>

        {eroare && (
          <div style={{ background: '#fff0f0', border: '1px solid #ffcccc', padding: '14px 20px', marginBottom: '30px', color: '#cc0000', fontSize: '14px' }}>
            {eroare}
          </div>
        )}
        {succes && (
          <div style={{ background: '#f0fff0', border: '1px solid #ccffcc', padding: '14px 20px', marginBottom: '30px', color: '#007700', fontSize: '14px' }}>
            ✓ Invoice created successfully! Redirecting...
          </div>
        )}

        <div style={{ background: '#fff', border: '1px solid rgba(29,29,27,0.12)', padding: '50px' }}>

          <div style={{ marginBottom: '12px' }}>
            <span style={{ fontSize: '11px', letterSpacing: '0.25em', color: '#999', textTransform: 'uppercase' }}>Select Tenant *</span>
          </div>
          <div style={{ borderTop: '1px solid rgba(29,29,27,0.08)', paddingTop: '30px', marginBottom: '40px' }}>
            <select
              value={chiriasId}
              onChange={e => setChiriasId(e.target.value)}
              style={{ width: '100%', padding: '14px 16px', border: '1px solid rgba(29,29,27,0.2)', background: '#fcfdf5', fontSize: '15px', color: chiriasId ? '#1d1d1b' : '#999', outline: 'none', fontFamily: 'Helvetica, sans-serif', cursor: 'pointer' }}
            >
              <option value="">Select a tenant...</option>
              {chiriasi.map(ch => (
                <option key={ch.id} value={ch.id}>
                  {ch.nume} — Apt. {ch.apartament_id || '–'}
                </option>
              ))}
            </select>

            {chirias && (
              <div style={{ marginTop: '16px', padding: '16px 20px', background: '#fcfdf5', border: '1px solid rgba(29,29,27,0.08)', display: 'flex', gap: '30px' }}>
                <div>
                  <div style={{ fontSize: '11px', color: '#999', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '4px' }}>Name</div>
                  <div style={{ fontSize: '14px', color: '#1d1d1b', fontWeight: 500 }}>{chirias.nume}</div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: '#999', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '4px' }}>Apartment</div>
                  <div style={{ fontSize: '14px', color: '#1d1d1b', fontWeight: 500 }}>{chirias.apartament_id || '—'}</div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: '#999', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '4px' }}>Email</div>
                  <div style={{ fontSize: '14px', color: '#1d1d1b', fontWeight: 500 }}>{chirias.email || '—'}</div>
                </div>
              </div>
            )}
          </div>

          <div style={{ marginBottom: '12px' }}>
            <span style={{ fontSize: '11px', letterSpacing: '0.25em', color: '#999', textTransform: 'uppercase' }}>Invoice Type *</span>
          </div>
          <div style={{ borderTop: '1px solid rgba(29,29,27,0.08)', paddingTop: '30px', marginBottom: '40px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px' }}>
              {tipuri.map(t => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setTip(t.value)}
                  style={{ padding: '16px 10px', border: `1px solid ${tip === t.value ? '#1d1d1b' : 'rgba(29,29,27,0.15)'}`, background: tip === t.value ? '#1d1d1b' : '#fff', cursor: 'pointer', textAlign: 'center', fontFamily: 'Helvetica, sans-serif', transition: 'all 0.2s' }}
                >
                  <div style={{ fontSize: '20px', marginBottom: '8px' }}>{t.icon}</div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: tip === t.value ? '#f9fafa' : '#1d1d1b', marginBottom: '4px' }}>{t.label}</div>
                  <div style={{ fontSize: '11px', color: tip === t.value ? 'rgba(249,250,250,0.6)' : '#999', lineHeight: 1.3 }}>{t.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: '12px' }}>
            <span style={{ fontSize: '11px', letterSpacing: '0.25em', color: '#999', textTransform: 'uppercase' }}>Amount & Dates</span>
          </div>
          <div style={{ borderTop: '1px solid rgba(29,29,27,0.08)', paddingTop: '30px', marginBottom: '50px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '30px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '11px', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#999' }}>Amount (RON) *</label>
              <input
                type="number"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                placeholder="ex: 1500"
                style={{ padding: '12px 0', border: 'none', borderBottom: '1px solid rgba(29,29,27,0.2)', background: 'transparent', fontSize: '16px', color: '#1d1d1b', outline: 'none', fontFamily: 'Helvetica, sans-serif' }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '11px', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#999' }}>Issue Date *</label>
              <input
                type="date"
                value={dataEmiterii}
                onChange={e => setDataEmiterii(e.target.value)}
                style={{ padding: '12px 0', border: 'none', borderBottom: '1px solid rgba(29,29,27,0.2)', background: 'transparent', fontSize: '15px', color: '#1d1d1b', outline: 'none', fontFamily: 'Helvetica, sans-serif' }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '11px', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#999' }}>Due Date *</label>
              <input
                type="date"
                value={dataScadentei}
                onChange={e => setDataScadentei(e.target.value)}
                style={{ padding: '12px 0', border: 'none', borderBottom: '1px solid rgba(29,29,27,0.2)', background: 'transparent', fontSize: '15px', color: '#1d1d1b', outline: 'none', fontFamily: 'Helvetica, sans-serif' }}
              />
            </div>
          </div>

          {chiriasId && amount && tip && dataEmiterii && dataScadentei && (
            <div style={{ background: '#fcfdf5', border: '1px solid rgba(29,29,27,0.08)', padding: '20px 24px', marginBottom: '40px' }}>
              <div style={{ fontSize: '11px', letterSpacing: '0.2em', color: '#999', textTransform: 'uppercase', marginBottom: '14px' }}>Invoice Preview</div>
              <div style={{ display: 'flex', gap: '40px' }}>
                <div>
                  <div style={{ fontSize: '11px', color: '#999', marginBottom: '4px' }}>TENANT</div>
                  <div style={{ fontSize: '15px', color: '#1d1d1b', fontWeight: 500 }}>{chirias?.nume || '—'}</div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: '#999', marginBottom: '4px' }}>TYPE</div>
                  <div style={{ fontSize: '15px', color: '#1d1d1b', fontWeight: 500 }}>{tip}</div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: '#999', marginBottom: '4px' }}>AMOUNT</div>
                  <div style={{ fontSize: '15px', color: '#1d1d1b', fontWeight: 500 }}>{amount} RON</div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: '#999', marginBottom: '4px' }}>DUE DATE</div>
                  <div style={{ fontSize: '15px', color: '#1d1d1b', fontWeight: 500 }}>{dataScadentei}</div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: '#999', marginBottom: '4px' }}>STATUS</div>
                  <div style={{ fontSize: '13px', padding: '3px 12px', background: '#fff0f0', color: '#cc0000', display: 'inline-block' }}>Unpaid</div>
                </div>
              </div>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(29,29,27,0.08)', paddingTop: '30px' }}>
            <Link to="/facturi" style={{ fontSize: '14px', color: '#999', textDecoration: 'none', borderBottom: '1px solid #ccc', paddingBottom: '2px' }}>
              Cancel
            </Link>
            <button
              onClick={handleSave}
              disabled={loading}
              style={{ background: loading ? '#999' : '#1d1d1b', color: '#f9fafa', border: 'none', padding: '14px 50px', fontSize: '14px', cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'Helvetica, sans-serif', letterSpacing: '0.05em', transition: 'opacity 0.2s' }}
              onMouseOver={e => { if (!loading) e.currentTarget.style.opacity = '0.8'; }}
              onMouseOut={e => e.currentTarget.style.opacity = '1'}
            >
              {loading ? 'Saving...' : 'Create Invoice'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdaugaFactura;