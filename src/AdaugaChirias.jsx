import { useState } from 'react';
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

  const handleSave = async () => {
    if (!nume || !ap) {
      setEroare('Please fill in the name and apartment number!');
      return;
    }
    
    setLoading(true);
    setEroare('');
    
    try {
      // Conectarea directă la serverul de pe Render (Baza de date reală)
      const token = localStorage.getItem('token'); // Presupunem că managerul e logat și are token
      
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

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafa', fontFamily: 'Helvetica, sans-serif' }}>
      <Navbar />
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '100px 30px 60px' }}>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '50px' }}>
          <div>
            <span style={{ fontSize: '13px', letterSpacing: '0.3em', color: '#888', textTransform: 'uppercase', display: 'block', marginBottom: '12px' }}>Manager Panel</span>
            <h1 style={{ fontFamily: 'Forum, serif', fontSize: '52px', fontWeight: 400, color: '#1d1d1b', textTransform: 'uppercase', lineHeight: 1.1, margin: 0 }}>
              Add New<br />Tenant
            </h1>
          </div>
          <Link
            to="/manager/tenants"
            style={{ fontSize: '14px', color: '#1d1d1b', textDecoration: 'none', borderBottom: '1px solid #1d1d1b', paddingBottom: '2px', marginTop: '8px' }}
          >
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
            ✓ Tenant added successfully! Redirecting...
          </div>
        )}

        <div style={{ background: '#fff', border: '1px solid rgba(29,29,27,0.12)', padding: '50px' }}>

          <div style={{ marginBottom: '12px' }}>
            <span style={{ fontSize: '11px', letterSpacing: '0.25em', color: '#999', textTransform: 'uppercase' }}>Personal Information</span>
          </div>
          <div style={{ borderTop: '1px solid rgba(29,29,27,0.08)', paddingTop: '30px', marginBottom: '40px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '11px', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#999' }}>Full Name *</label>
              <input
                type="text"
                value={nume}
                onChange={e => setNume(e.target.value)}
                placeholder="ex: Ion Popescu"
                style={{ padding: '12px 0', border: 'none', borderBottom: '1px solid rgba(29,29,27,0.2)', background: 'transparent', fontSize: '16px', color: '#1d1d1b', outline: 'none', fontFamily: 'Helvetica, sans-serif' }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '11px', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#999' }}>Apartment Number *</label>
              <input
                type="text"
                value={ap}
                onChange={e => setAp(e.target.value)}
                placeholder="ex: 12A"
                style={{ padding: '12px 0', border: 'none', borderBottom: '1px solid rgba(29,29,27,0.2)', background: 'transparent', fontSize: '16px', color: '#1d1d1b', outline: 'none', fontFamily: 'Helvetica, sans-serif' }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '11px', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#999' }}>Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="email@exemplu.com"
                style={{ padding: '12px 0', border: 'none', borderBottom: '1px solid rgba(29,29,27,0.2)', background: 'transparent', fontSize: '16px', color: '#1d1d1b', outline: 'none', fontFamily: 'Helvetica, sans-serif' }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '11px', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#999' }}>Phone</label>
              <input
                type="text"
                value={telefon}
                onChange={e => setTelefon(e.target.value)}
                placeholder="07xx xxx xxx"
                style={{ padding: '12px 0', border: 'none', borderBottom: '1px solid rgba(29,29,27,0.2)', background: 'transparent', fontSize: '16px', color: '#1d1d1b', outline: 'none', fontFamily: 'Helvetica, sans-serif' }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '12px' }}>
            <span style={{ fontSize: '11px', letterSpacing: '0.25em', color: '#999', textTransform: 'uppercase' }}>Lease Details</span>
          </div>
          <div style={{ borderTop: '1px solid rgba(29,29,27,0.08)', paddingTop: '30px', marginBottom: '50px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '30px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '11px', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#999' }}>Lease Start</label>
              <input
                type="date"
                value={dataInceput}
                onChange={e => setDataInceput(e.target.value)}
                style={{ padding: '12px 0', border: 'none', borderBottom: '1px solid rgba(29,29,27,0.2)', background: 'transparent', fontSize: '15px', color: '#1d1d1b', outline: 'none', fontFamily: 'Helvetica, sans-serif' }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '11px', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#999' }}>Lease End</label>
              <input
                type="date"
                value={dataSfarsit}
                onChange={e => setDataSfarsit(e.target.value)}
                style={{ padding: '12px 0', border: 'none', borderBottom: '1px solid rgba(29,29,27,0.2)', background: 'transparent', fontSize: '15px', color: '#1d1d1b', outline: 'none', fontFamily: 'Helvetica, sans-serif' }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '11px', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#999' }}>Monthly Rent (RON)</label>
              <input
                type="number"
                value={chirie}
                onChange={e => setChirie(e.target.value)}
                placeholder="ex: 1500"
                style={{ padding: '12px 0', border: 'none', borderBottom: '1px solid rgba(29,29,27,0.2)', background: 'transparent', fontSize: '16px', color: '#1d1d1b', outline: 'none', fontFamily: 'Helvetica, sans-serif' }}
              />
            </div>
          </div>

          <div style={{ background: '#fcfdf5', border: '1px solid rgba(29,29,27,0.08)', padding: '20px', marginBottom: '40px', display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '8px', height: '8px', background: '#1d1d1b', borderRadius: '50%', flexShrink: 0 }} />
            <p style={{ margin: 0, fontSize: '13px', color: '#666', lineHeight: 1.6 }}>
              After adding the tenant, they will receive access to their personal dashboard where they can view documents, invoices and submit maintenance requests.
            </p>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Link
              to="/manager/tenants"
              style={{ fontSize: '14px', color: '#999', textDecoration: 'none', borderBottom: '1px solid #ccc', paddingBottom: '2px' }}
            >
              Cancel
            </Link>
            <button
              onClick={handleSave}
              disabled={loading}
              style={{ background: loading ? '#999' : '#1d1d1b', color: '#f9fafa', border: 'none', padding: '14px 50px', fontSize: '14px', cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'Helvetica, sans-serif', letterSpacing: '0.05em', transition: 'opacity 0.2s' }}
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