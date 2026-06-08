import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

function AdaugaChirias() {
  const [nume, setNume] = useState('');
  const [ap, setAp] = useState('');
  const [email, setEmail] = useState('');
  const [telefon, setTelefon] = useState('');
  const [dataInceput, setDataInceput] = useState('');
  const [dataSfarsit, setDataSfarsit] = useState('');
  const [chirie, setChirie] = useState('');
  const [eroare, setEroare] = useState('');
  const [loading, setLoading] = useState(false);
  const [succes, setSucces] = useState(false);
  const navigate = useNavigate();

  // Detectăm lățimea ecranului pentru a face ajustări fine pe mobil
  const [isMobil, setIsMobil] = useState(window.innerWidth < 600);

  useEffect(() => {
    const handleResize = () => setIsMobil(window.innerWidth < 600);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSave = async () => {
    if (!nume || !ap) {
      setEroare('Please fill in the name and apartment number!');
      return;
    }
    const token = localStorage.getItem('token');
    if (!token) {
      setEroare('Your session has expired. Please log in again.');
      return;
    }
    setLoading(true);
    setEroare('');
    try {
      const payload = {
        nume,
        apartament_numar: ap,
        email,
        telefon,
        data_inceput: dataInceput,
        data_sfarsit: dataSfarsit,
        chirie: chirie ? parseFloat(chirie) : 0
      };
      const response = await fetch('https://management-apartamente-api.onrender.com/api/chiriasi', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      if (response.status === 401 || response.status === 403) throw new Error('Invalid or expired login session.');
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save tenant');
      }
      setSucces(true);
      setTimeout(() => navigate('/manager/tenants'), 1500);
    } catch (err) {
      setEroare('Cannot connect to server: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    padding: '12px 0',
    border: 'none',
    borderBottom: '1px solid rgba(29,29,27,0.2)',
    background: 'transparent',
    fontSize: '16px',
    color: '#1d1d1b',
    outline: 'none',
    fontFamily: 'Helvetica, sans-serif',
    width: '100%',
    boxSizing: 'border-box',
  };

  const labelStyle = {
    fontSize: '11px',
    letterSpacing: '0.25em',
    textTransform: 'uppercase',
    color: '#999',
  };

  const fieldStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafa', fontFamily: 'Helvetica, sans-serif' }}>
      <Navbar />
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: isMobil ? '80px 16px 40px' : '100px 20px 60px' }}>

        {/* Antetul: Se aliniază pe verticală pe mobil și are un flux natural */}
        <div style={{ display: 'flex', flexDirection: isMobil ? 'column-reverse' : 'row', justifyContent: 'space-between', alignItems: isMobil ? 'flex-start' : 'flex-start', marginBottom: '40px', gap: '16px' }}>
          <div>
            <span style={{ fontSize: '13px', letterSpacing: '0.3em', color: '#888', textTransform: 'uppercase', display: 'block', marginBottom: '12px' }}>Manager Panel</span>
            <h1 style={{ fontFamily: 'Forum, serif', fontSize: 'clamp(32px, 6vw, 52px)', fontWeight: 400, color: '#1d1d1b', textTransform: 'uppercase', lineHeight: 1.1, margin: 0 }}>
              Add New<br />Tenant
            </h1>
          </div>
          <Link
            to="/manager/tenants"
            style={{ fontSize: '14px', color: '#1d1d1b', textDecoration: 'none', borderBottom: '1px solid #1d1d1b', paddingBottom: '2px', marginTop: '8px', whiteSpace: 'nowrap', alignSelf: isMobil ? 'flex-end' : 'auto' }}
          >
            ← Back
          </Link>
        </div>

        {eroare && (
          <div style={{ background: '#fff0f0', border: '1px solid #ffcccc', padding: '14px 20px', marginBottom: '24px', color: '#cc0000', fontSize: '14px', borderRadius: '2px' }}>
            {eroare}
          </div>
        )}

        {succes && (
          <div style={{ background: '#f0fff0', border: '1px solid #ccffcc', padding: '14px 20px', marginBottom: '24px', color: '#007700', fontSize: '14px' }}>
            ✓ Tenant added successfully! Redirecting...
          </div>
        )}

        <div style={{ background: '#fff', border: '1px solid rgba(29,29,27,0.12)', padding: isMobil ? '24px 20px' : 'clamp(24px, 5vw, 50px)' }}>

          <div style={{ marginBottom: '12px' }}>
            <span style={{ fontSize: '11px', letterSpacing: '0.25em', color: '#999', textTransform: 'uppercase' }}>Personal Information</span>
          </div>

          <div style={{ borderTop: '1px solid rgba(29,29,27,0.08)', paddingTop: '24px', marginBottom: '36px' }}>
            {/* Grid-ul folosește auto-fit; pe telefon va trece automat pe 1 singură coloană, pe tabletă/laptop pe 2 */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px 30px' }}>
              <div style={fieldStyle}>
                <label style={labelStyle}>Full Name *</label>
                <input
                  type="text"
                  value={nume}
                  onChange={e => setNume(e.target.value)}
                  placeholder="ex: Ion Popescu"
                  style={inputStyle}
                />
              </div>

              <div style={fieldStyle}>
                <label style={labelStyle}>Apartment Number *</label>
                <input
                  type="text"
                  value={ap}
                  onChange={e => setAp(e.target.value)}
                  placeholder="ex: 12A"
                  style={inputStyle}
                />
              </div>

              <div style={fieldStyle}>
                <label style={labelStyle}>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="email@exemplu.com"
                  style={inputStyle}
                />
              </div>

              <div style={fieldStyle}>
                <label style={labelStyle}>Phone</label>
                <input
                  type="text"
                  value={telefon}
                  onChange={e => setTelefon(e.target.value)}
                  placeholder="07xx xxx xxx"
                  style={inputStyle}
                />
              </div>
            </div>
          </div>

          <div style={{ marginBottom: '12px' }}>
            <span style={{ fontSize: '11px', letterSpacing: '0.25em', color: '#999', textTransform: 'uppercase' }}>Lease Details</span>
          </div>

          <div style={{ borderTop: '1px solid rgba(29,29,27,0.08)', paddingTop: '24px', marginBottom: '40px' }}>
            {/* Pe mobil foarte mic (sub 350px) minmax(180px) putea strica design-ul, acum e complet fluid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px 30px' }}>
              <div style={fieldStyle}>
                <label style={labelStyle}>Lease Start</label>
                <input 
                  type="date"
                  value={dataInceput}
                  onChange={e => setDataInceput(e.target.value)}
                  style={inputStyle}
                />
              </div>

              <div style={fieldStyle}>
                <label style={labelStyle}>Lease End</label>
                <input
                  type="date"
                  value={dataSfarsit}
                  onChange={e => setDataSfarsit(e.target.value)}
                  style={inputStyle}
                />
              </div>

              <div style={fieldStyle}>
                <label style={labelStyle}>Monthly Rent (RON)</label>
                <input
                  type="number"
                  value={chirie}
                  onChange={e => setChirie(e.target.value)}
                  placeholder="ex: 1500"
                  style={inputStyle}
                />
              </div>
            </div>
          </div>

          <div style={{ background: '#fcfdf5', border: '1px solid rgba(29,29,27,0.08)', padding: '16px 20px', marginBottom: '30px', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
            <span style={{ fontSize: '16px', flexShrink: 0 }}>ℹ️</span>
            <p style={{ margin: 0, fontSize: '13px', color: '#666', lineHeight: 1.6 }}>
              After adding the tenant, they will receive access to their personal dashboard where they can view documents, invoices and submit maintenance requests.
            </p>
          </div>

          {/* Zona de butoane: Pe laptop stau în linie, pe mobil butonul devine full-width, iar Cancel se mută dedesubt, centrat */}
          <div style={{ display: 'flex', flexDirection: isMobil ? 'column-reverse' : 'row', justifyContent: 'space-between', alignItems: 'center', gap: '20px', borderTop: '1px solid rgba(29,29,27,0.08)', paddingTop: '24px' }}>
            <Link
              to="/manager/tenants"
              style={{ fontSize: '14px', color: '#999', textDecoration: 'none', borderBottom: '1px solid #ccc', paddingBottom: '2px', textAlign: 'center' }}
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
                padding: '14px 40px',
                fontSize: '14px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontFamily: 'Helvetica, sans-serif',
                letterSpacing: '0.05em',
                transition: 'opacity 0.2s',
                width: isMobil ? '100%' : 'auto',
                minWidth: '160px',
                textAlign: 'center'
              }}
              onMouseOver={e => { if (!loading) e.currentTarget.style.opacity = '0.8'; }}
              onMouseOut={e => e.currentTarget.style.opacity = '1'}
            >
              {loading ? 'Saving...' : 'Save Tenant'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdaugaChirias;