import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';

function GestionareDocumente() {
  const [documente, setDocumente] = useState([]);
  const [chiriasi, setChiriasi] = useState([]);
  const [loading, setLoading] = useState(true);
  const [eroare, setEroare] = useState('');
  const [filtruActiv, setFiltruActiv] = useState('All');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token') || '';
        
        // Luăm documentele
        const docsRes = await fetch('https://management-apartamente-api.onrender.com/api/documente', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        // Luăm chiriașii (pentru a le potrivi numele cu ID-ul)
        const tenantsRes = await fetch('https://management-apartamente-api.onrender.com/api/chiriasi', {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (docsRes.ok && tenantsRes.ok) {
          const docsData = await docsRes.json();
          const tenantsData = await tenantsRes.json();
          
          setDocumente(Array.isArray(docsData) ? docsData : []);
          setChiriasi(Array.isArray(tenantsData) ? tenantsData : []);
        } else {
           setEroare('Nu am putut încărca datele de pe server.');
        }
      } catch (err) {
        setEroare('Eroare de conexiune la server.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const stergeDocument = async (id) => {
    if (!window.confirm("Sigur vrei să ștergi acest document?")) return;
    try {
      const token = localStorage.getItem('token') || '';
      const response = await fetch(`https://management-apartamente-api.onrender.com/api/documente/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        setDocumente(documente.filter((doc) => doc.id !== id));
      } else {
        alert("Eroare la ștergerea documentului de pe server.");
      }
    } catch (err) {
      alert("Eroare: " + err.message);
    }
  };

  const getChiriasNume = (chiriasId) => {
    const chirias = chiriasi.find(ch => ch.id?.toString() === chiriasId?.toString());
    return chirias ? chirias.nume : 'Necunoscut';
  };

  const getTipLabel = (tip) => {
    const labels = { contract: 'Contract', identitate: 'ID', factura: 'Invoice', alte: 'Other' };
    return labels[tip] || tip || 'Other';
  };

  const getStatusLabel = (doc) => {
    if (doc.status) return doc.status;
    if (doc.tip === 'contract') return 'Signed';
    if (doc.tip === 'identitate') return 'Verified';
    return 'Pending';
  };

  const getStatusBg = (status) => {
    if (status === 'Signed') return '#e8f4e8';
    if (status === 'Verified') return '#e8eef8';
    return '#f8f0e8';
  };

  const getStatusColor = (status) => {
    if (status === 'Signed') return '#2d7a2d';
    if (status === 'Verified') return '#2d4a8a';
    return '#8a5a2d';
  };

  const filtre = ['All', 'Contract', 'ID', 'Invoice', 'Other'];

  const documenteFiltrate = filtruActiv === 'All'
    ? documente
    : documente.filter(doc => getTipLabel(doc.tip) === filtruActiv);

  const total = documente.length;
  const signed = documente.filter(d => getStatusLabel(d) === 'Signed').length;
  const pending = documente.filter(d => getStatusLabel(d) === 'Pending').length;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafa', fontFamily: 'Helvetica, sans-serif' }}>
      <Navbar />
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '60px 30px' }}>

        <div style={{ marginBottom: '16px' }}>
          <span style={{ fontSize: '13px', letterSpacing: '0.3em', color: '#888', textTransform: 'uppercase' }}>01 — Tenant Platform</span>
        </div>
        <h1 style={{ fontFamily: 'Forum, serif', fontSize: '64px', fontWeight: 400, color: '#1d1d1b', lineHeight: 1.1, margin: '0 0 20px 0', textTransform: 'uppercase' }}>
          Tenant<br />Documents
        </h1>

        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '50px', gap: '40px' }}>
          <p style={{ fontSize: '16px', color: '#666', lineHeight: 1.7, maxWidth: '420px', margin: 0 }}>
            Upload, sign and manage all your rental agreements and personal documents securely in one place.
          </p>
          <div style={{ display: 'flex', gap: '2px', flexShrink: 0 }}>
            {[{ label: 'TOTAL', value: total }, { label: 'SIGNED', value: signed }, { label: 'PENDING', value: pending }].map(stat => (
              <div key={stat.label} style={{ border: '1px solid rgba(29,29,27,0.15)', padding: '24px 36px', textAlign: 'center', background: '#fff' }}>
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
                  padding: '10px 24px',
                  fontSize: '14px',
                  border: '1px solid rgba(29,29,27,0.2)',
                  background: filtruActiv === f ? '#1d1d1b' : '#fff',
                  color: filtruActiv === f ? '#f9fafa' : '#1d1d1b',
                  cursor: 'pointer',
                  fontFamily: 'Helvetica, sans-serif',
                  marginRight: '-1px',
                  transition: 'all 0.2s',
                }}
              >
                {f}
              </button>
            ))}
          </div>
          <Link
            to="/adauga-document"
            style={{
              background: '#1d1d1b',
              color: '#f9fafa',
              padding: '12px 28px',
              fontSize: '14px',
              textDecoration: 'none',
              fontFamily: 'Helvetica, sans-serif',
              letterSpacing: '0.05em',
            }}
          >
            + Upload Document
          </Link>
        </div>

        <div style={{ border: '1px solid rgba(29,29,27,0.12)', background: '#fff' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 120px', padding: '14px 24px', borderBottom: '1px solid rgba(29,29,27,0.1)', background: '#fcfdf5' }}>
            {['DOCUMENT', 'TYPE', 'DATE', 'STATUS', ''].map(col => (
              <span key={col} style={{ fontSize: '11px', letterSpacing: '0.25em', color: '#999', textTransform: 'uppercase' }}>{col}</span>
            ))}
          </div>

          {loading ? (
            <div style={{ padding: '60px', textAlign: 'center', color: '#999' }}>Se încarcă...</div>
          ) : documenteFiltrate.length === 0 ? (
            <div style={{ padding: '60px', textAlign: 'center', color: '#999' }}>Nu există documente.</div>
          ) : (
            documenteFiltrate.map((doc, i) => {
              const status = getStatusLabel(doc);
              return (
                <div
                  key={doc.id}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '2fr 1fr 1fr 1fr 120px',
                    padding: '20px 24px',
                    borderBottom: i < documenteFiltrate.length - 1 ? '1px solid rgba(29,29,27,0.08)' : 'none',
                    alignItems: 'center',
                  }}
                  onMouseOver={e => e.currentTarget.style.background = '#fcfdf5'}
                  onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <svg width="18" height="20" viewBox="0 0 18 20" fill="none" stroke="#999" strokeWidth="1.5">
                      <path d="M10 1H3a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z" />
                      <path d="M10 1L16 7H10z" />
                    </svg>
                    <div>
                      <div style={{ fontSize: '15px', color: '#1d1d1b', fontWeight: 500 }}>{doc.nume_fisier || doc.title}</div>
                      <div style={{ fontSize: '12px', color: '#999', marginTop: '2px' }}>
                         For: {getChiriasNume(doc.chirias_id)}
                      </div>
                    </div>
                  </div>
                  <span style={{ fontSize: '14px', color: '#555' }}>{getTipLabel(doc.tip)}</span>
                  <span style={{ fontSize: '14px', color: '#555' }}>{doc.data_upload || doc.data || '-'}</span>
                  <span style={{ display: 'inline-block', padding: '4px 14px', fontSize: '13px', background: getStatusBg(status), color: getStatusColor(status) }}>
                    {status}
                  </span>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <a
                      href={`https://management-apartamente-api.onrender.com${doc.cale}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ padding: '6px 14px', border: '1px solid rgba(29,29,27,0.2)', fontSize: '13px', color: '#1d1d1b', textDecoration: 'none', background: '#fff' }}
                    >
                      Open
                    </a>
                    <button
                      onClick={() => stergeDocument(doc.id)}
                      style={{ padding: '6px 10px', border: '1px solid rgba(200,0,0,0.2)', fontSize: '13px', color: '#cc0000', background: '#fff0f0', cursor: 'pointer' }}
                    >
                      x
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

export default GestionareDocumente;