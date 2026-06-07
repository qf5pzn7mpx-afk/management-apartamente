import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

function AdaugaDocument() {
  const [numeDocument, setNumeDocument] = useState('');
  const [tipDocument, setTipDocument] = useState('contract');
  const [chiriasId, setChiriasId] = useState('');
  const [fisier, setFisier] = useState(null);
  const [chiriasi, setChiriasi] = useState([]);
  const [loading, setLoading] = useState(false);
  const [eroare, setEroare] = useState('');
  const [succes, setSucces] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchTenants = async () => {
      try {
        const token = localStorage.getItem('token') || '';
        const response = await fetch('https://management-apartamente-api.onrender.com/api/chiriasi', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setChiriasi(Array.isArray(data) ? data : []);
        } else {
          setEroare('Nu pot încărca lista chiriașilor de pe server.');
        }
      } catch (err) {
        setEroare('Eroare de conexiune la server.');
        console.error(err);
      }
    };
    fetchTenants();
  }, []);

  const handleSave = async () => {
    if (!numeDocument.trim() || !chiriasId || !fisier) {
      setEroare('Te rugăm să completezi toate câmpurile și să alegi un fișier!');
      return;
    }
    setLoading(true);
    setEroare('');
    
    try {
      const token = localStorage.getItem('token') || '';
      
      const formData = new FormData();
      formData.append('nume_fisier', numeDocument);
      formData.append('tip', tipDocument);
      formData.append('chirias_id', chiriasId);
      formData.append('fisier', fisier); 

      const response = await fetch('https://management-apartamente-api.onrender.com/api/documente', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
          
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Eroare la salvarea documentului.');
      }

      setSucces(true);
      setTimeout(() => navigate('/documente'), 1500);
    } catch (err) {
      setEroare('Eroare: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const tipuri = [
    { value: 'contract', label: 'Contract' },
    { value: 'identitate', label: 'ID' },
    { value: 'factura', label: 'Invoice' },
    { value: 'alte', label: 'Other' },
  ];

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) setFisier(dropped);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafa', fontFamily: 'Helvetica, sans-serif' }}>
      <Navbar />
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '60px 30px' }}>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '50px' }}>
          <div>
            <span style={{ fontSize: '13px', letterSpacing: '0.3em', color: '#888', textTransform: 'uppercase' }}>01 — Tenant Platform</span>
            <h1 style={{ fontFamily: 'Forum, serif', fontSize: '52px', fontWeight: 400, color: '#1d1d1b', textTransform: 'uppercase', lineHeight: 1.1, margin: '12px 0 0 0' }}>
              Upload<br />Document
            </h1>
          </div>
          <Link
            to="/documente"
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
            ✓ Document salvat cu succes! Redirecționare...
          </div>
        )}

        <div style={{ background: '#fff', border: '1px solid rgba(29,29,27,0.12)', padding: '50px' }}>

          <div style={{ marginBottom: '36px' }}>
            <label style={{ display: 'block', fontSize: '11px', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#999', marginBottom: '12px' }}>Tenant *</label>
            <select
              value={chiriasId}
              onChange={(e) => setChiriasId(e.target.value)}
              style={{ width: '100%', padding: '12px 16px', border: '1px solid rgba(29,29,27,0.2)', background: '#f9fafa', fontSize: '15px', color: '#1d1d1b', outline: 'none', fontFamily: 'Helvetica, sans-serif' }}
            >
              <option value="">Select a tenant</option>
              {chiriasi.map(c => (
                <option key={c.id} value={c.id}>{c.nume || c.name}</option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: '36px' }}>
            <label style={{ display: 'block', fontSize: '11px', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#999', marginBottom: '12px' }}>Document Type *</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
              {tipuri.map(tip => (
                <button
                  key={tip.value}
                  onClick={() => setTipDocument(tip.value)}
                  style={{
                    padding: '14px',
                    border: `1px solid ${tipDocument === tip.value ? '#1d1d1b' : 'rgba(29,29,27,0.2)'}`,
                    background: tipDocument === tip.value ? '#1d1d1b' : '#fff',
                    color: tipDocument === tip.value ? '#f9fafa' : '#1d1d1b',
                    fontSize: '13px',
                    cursor: 'pointer',
                    fontFamily: 'Helvetica, sans-serif',
                    transition: 'all 0.2s',
                    letterSpacing: '0.05em',
                  }}
                >
                  {tip.label}
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: '36px' }}>
            <label style={{ display: 'block', fontSize: '11px', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#999', marginBottom: '12px' }}>Document Name *</label>
            <input
              type="text"
              value={numeDocument}
              onChange={(e) => setNumeDocument(e.target.value)}
              placeholder="Ex: Rental Agreement 2024"
              style={{ width: '100%', padding: '12px 16px', border: '1px solid rgba(29,29,27,0.2)', background: '#f9fafa', fontSize: '15px', color: '#1d1d1b', outline: 'none', fontFamily: 'Helvetica, sans-serif', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ marginBottom: '50px' }}>
            <label style={{ display: 'block', fontSize: '11px', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#999', marginBottom: '12px' }}>File (PDF, DOC, JPG, PNG) *</label>
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => document.getElementById('fileInput').click()}
              style={{
                border: `2px dashed ${dragOver ? '#1d1d1b' : 'rgba(29,29,27,0.2)'}`,
                padding: '50px 30px',
                textAlign: 'center',
                cursor: 'pointer',
                background: dragOver ? '#f5f5f0' : '#fcfdf5',
                transition: 'all 0.2s',
              }}
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="1.5" style={{ margin: '0 auto 16px' }}>
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              {fisier ? (
                <p style={{ fontSize: '14px', color: '#1d1d1b', margin: 0 }}>
                  <strong>{fisier.name}</strong> — {(fisier.size / 1024 / 1024).toFixed(2)} MB
                </p>
              ) : (
                <>
                  <p style={{ fontSize: '14px', color: '#999', margin: '0 0 6px 0' }}>Drag & drop or click to select</p>
                  <p style={{ fontSize: '12px', color: '#bbb', margin: 0 }}>PDF, DOC, JPG, PNG</p>
                </>
              )}
              <input
                id="fileInput"
                type="file"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                onChange={(e) => setFisier(e.target.files[0])}
                style={{ display: 'none' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Link
              to="/documente"
              style={{ fontSize: '14px', color: '#999', textDecoration: 'none', borderBottom: '1px solid #ccc', paddingBottom: '2px' }}
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
              }}
              onMouseOver={e => { if (!loading) e.currentTarget.style.opacity = '0.8'; }}
              onMouseOut={e => e.currentTarget.style.opacity = '1'}
            >
              {loading ? 'Saving...' : 'Save Document'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdaugaDocument;