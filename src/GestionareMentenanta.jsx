import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';

function GestionareMentenanta() {
  const [cereri, setCereri] = useState([]);
  const [loading, setLoading] = useState(true);
  const [eroare, setEroare] = useState('');
  const [filtruActiv, setFiltruActiv] = useState('All');

  const incarcaCereri = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token') || '';
      
      
      const [mentRes, chiriasiRes] = await Promise.all([
        fetch('https://management-apartamente-api.onrender.com/api/mentenanta', { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch('https://management-apartamente-api.onrender.com/api/chiriasi', { headers: { 'Authorization': `Bearer ${token}` } })
      ]);

      if (mentRes.ok && chiriasiRes.ok) {
        const mentData = await mentRes.json();
        const chiriasiData = await chiriasiRes.json();
        
        // Asociem chirias_id cu numele real al chiriașului
        const cereriMapate = mentData.map(c => {
          const chirias = chiriasiData.find(ch => ch.id?.toString() === c.chirias_id?.toString());
          return { ...c, chirias_nume: chirias ? (chirias.nume || chirias.name) : 'Necunoscut' };
        });
        
        setCereri(cereriMapate);
      } else {
        setEroare('Nu am putut încărca cererile de pe server.');
      }
    } catch (err) {
      console.error(err);
      setEroare('Eroare de conexiune la server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    incarcaCereri(); 
  }, []);

  const schimbaStatus = async (id, statusNou) => {
    try {
      const token = localStorage.getItem('token') || '';
      const response = await fetch(`https://management-apartamente-api.onrender.com/api/mentenanta/${id}/status`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ status: statusNou })
      });

      if (response.ok) {
        incarcaCereri(); 
      } else {
        alert("Nu am putut actualiza statusul pe server.");
      }
    } catch (err) {
      console.error(err);
      alert("Eroare de rețea. Nu am putut actualiza statusul.");
    }
  };

  const getPrioritateBg = (prioritate) => {
    if (prioritate === 'High') return '#fff0f0';
    if (prioritate === 'Medium') return '#f8f0e8';
    return '#f0f8ff';
  };

  const getPrioritateColor = (prioritate) => {
    if (prioritate === 'High') return '#cc0000';
    if (prioritate === 'Medium') return '#8a5a2d';
    return '#2d4a8a';
  };

  const getStatusBg = (status) => {
    if (status === 'Rezolvată') return '#e8f4e8';
    if (status === 'În lucru') return '#e8eef8';
    return '#f8f0e8';
  };

  const getStatusColor = (status) => {
    if (status === 'Rezolvată') return '#2d7a2d';
    if (status === 'În lucru') return '#2d4a8a';
    return '#8a5a2d';
  };

  const filtre = ['All', 'Nouă', 'În lucru', 'Rezolvată'];

  const cereriFilrate = filtruActiv === 'All' ? cereri : cereri.filter(c => c.status === filtruActiv);

  const totalNoi = cereri.filter(c => c.status === 'Nouă').length;
  const totalInProgres = cereri.filter(c => c.status === 'În lucru').length;
  const totalFinalizate = cereri.filter(c => c.status === 'Rezolvată').length;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafa', fontFamily: 'Helvetica, sans-serif' }}>
      <Navbar />
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '60px 30px' }}>

        <div style={{ marginBottom: '16px' }}>
          <span style={{ fontSize: '13px', letterSpacing: '0.3em', color: '#888', textTransform: 'uppercase' }}>03 — Tenant Platform</span>
        </div>
        <h1 style={{ fontFamily: 'Forum, serif', fontSize: '64px', fontWeight: 400, color: '#1d1d1b', lineHeight: 1.1, margin: '0 0 20px 0', textTransform: 'uppercase' }}>
          Maintenance<br />Requests
        </h1>

        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '50px', gap: '40px' }}>
          <p style={{ fontSize: '16px', color: '#666', lineHeight: 1.7, maxWidth: '420px', margin: 0 }}>
            Report issues, track repair progress and communicate directly with your property manager in real time.
          </p>
          <div style={{ display: 'flex', gap: '2px', flexShrink: 0 }}>
            {[{ label: 'NEW', value: totalNoi }, { label: 'IN PROGRESS', value: totalInProgres }, { label: 'RESOLVED', value: totalFinalizate }].map(stat => (
              <div key={stat.label} style={{ border: '1px solid rgba(29,29,27,0.15)', padding: '24px 30px', textAlign: 'center', background: '#fff' }}>
                <div style={{ fontFamily: 'Forum, serif', fontSize: '42px', color: '#1d1d1b', lineHeight: 1 }}>{loading ? '-' : stat.value}</div>
                <div style={{ fontSize: '11px', letterSpacing: '0.2em', color: '#999', marginTop: '8px', textTransform: 'uppercase' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {eroare && (
          <div style={{ background: '#fff0f0', border: '1px solid #ffcccc', padding: '14px 20px', marginBottom: '30px', color: '#cc0000', fontSize: '14px' }}>
            {eroare}
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '30px' }}>
          <div style={{ display: 'flex' }}>
            {filtre.map(f => (
              <button
                key={f}
                onClick={() => setFiltruActiv(f)}
                style={{
                  padding: '10px 24px', fontSize: '14px',
                  border: '1px solid rgba(29,29,27,0.2)',
                  background: filtruActiv === f ? '#1d1d1b' : '#fff',
                  color: filtruActiv === f ? '#f9fafa' : '#1d1d1b',
                  cursor: 'pointer', fontFamily: 'Helvetica, sans-serif',
                  marginRight: '-1px', transition: 'all 0.2s',
                }}
              >
                {f}
              </button>
            ))}
          </div>
          <Link
            to="/raporteaza-problema"
            style={{ background: '#1d1d1b', color: '#f9fafa', padding: '12px 28px', fontSize: '14px', textDecoration: 'none', fontFamily: 'Helvetica, sans-serif', letterSpacing: '0.05em' }}
          >
            + New Request
          </Link>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {loading ? (
            <div style={{ padding: '60px', textAlign: 'center', color: '#999', background: '#fff', border: '1px solid rgba(29,29,27,0.12)' }}>Se încarcă...</div>
          ) : cereriFilrate.length === 0 ? (
            <div style={{ padding: '60px', textAlign: 'center', color: '#999', background: '#fff', border: '1px solid rgba(29,29,27,0.12)' }}>Nu există cereri.</div>
          ) : (
            cereriFilrate.map((cerere) => (
              <div
                key={cerere.id}
                style={{ background: '#fff', border: '1px solid rgba(29,29,27,0.12)', padding: '30px', display: 'grid', gridTemplateColumns: '1fr auto', gap: '20px', alignItems: 'start' }}
                onMouseOver={e => e.currentTarget.style.background = '#fcfdf5'}
                onMouseOut={e => e.currentTarget.style.background = '#fff'}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                    <span style={{ fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', padding: '4px 12px', background: getStatusBg(cerere.status), color: getStatusColor(cerere.status) }}>
                      {cerere.status || 'Nouă'}
                    </span>
                    {cerere.prioritate && (
                      <span style={{ fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', padding: '4px 12px', background: getPrioritateBg(cerere.prioritate), color: getPrioritateColor(cerere.prioritate) }}>
                        {cerere.prioritate}
                      </span>
                    )}
                    <span style={{ fontSize: '12px', color: '#999', marginLeft: 'auto' }}>{cerere.data_raportarii || cerere.data_crearii || ''}</span>
                  </div>

                  <h3 style={{ fontFamily: 'Forum, serif', fontSize: '22px', color: '#1d1d1b', margin: '0 0 8px 0' }}>{cerere.titlu}</h3>
                  <p style={{ fontSize: '14px', color: '#666', lineHeight: 1.7, margin: '0 0 16px 0' }}>{cerere.descriere}</p>

                  {cerere.chirias_nume && (
                    <p style={{ fontSize: '13px', color: '#999', margin: 0 }}>
                      Tenant: <strong style={{ color: '#1d1d1b' }}>{cerere.chirias_nume}</strong>
                    </p>
                  )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '160px' }}>
                  {cerere.poza && (
                    <img 
                      src={cerere.poza.startsWith('http') ? cerere.poza : `https://management-apartamente-api.onrender.com${cerere.poza}`} 
                      alt="issue" 
                      style={{ width: '100%', height: '100px', objectFit: 'cover', border: '1px solid rgba(29,29,27,0.1)', marginBottom: '8px' }} 
                    />
                  )}
                  <button
                    onClick={() => schimbaStatus(cerere.id, 'În lucru')}
                    style={{ padding: '8px 16px', border: '1px solid rgba(29,29,27,0.2)', background: '#fff', fontSize: '13px', color: '#1d1d1b', cursor: 'pointer', fontFamily: 'Helvetica, sans-serif', transition: 'all 0.2s' }}
                    onMouseOver={e => e.currentTarget.style.background = '#1d1d1b' & (e.currentTarget.style.color = '#fff')}
                  >
                    Set In Progress
                  </button>
                  <button
                    onClick={() => schimbaStatus(cerere.id, 'Rezolvată')}
                    style={{ padding: '8px 16px', border: '1px solid #2d7a2d', background: '#e8f4e8', fontSize: '13px', color: '#2d7a2d', cursor: 'pointer', fontFamily: 'Helvetica, sans-serif', transition: 'all 0.2s' }}
                  >
                    Mark Resolved
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default GestionareMentenanta;