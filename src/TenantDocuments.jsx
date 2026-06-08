import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const typeIcon = {
  Contract: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" width="22" height="22">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  ),
  ID: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" width="22" height="22">
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <circle cx="8" cy="12" r="2" />
      <line x1="13" y1="10" x2="19" y2="10" />
      <line x1="13" y1="14" x2="17" y2="14" />
    </svg>
  ),
  Invoice: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" width="22" height="22">
      <rect x="2" y="3" width="20" height="18" rx="2" />
      <line x1="2" y1="9" x2="22" y2="9" />
      <line x1="8" y1="3" x2="8" y2="9" />
      <line x1="16" y1="3" x2="16" y2="9" />
      <line x1="6" y1="14" x2="10" y2="14" />
      <line x1="6" y1="18" x2="10" y2="18" />
    </svg>
  ),
  Other: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" width="22" height="22">
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
    </svg>
  ),
};

const statusStyle = {
  Signed: { bg: '#eaf4ec', color: '#2d7a45' },
  Verified: { bg: '#e8f0fc', color: '#2a5cbf' },
  Pending: { bg: '#fdf5e8', color: '#b07d1a' },
};

export default function TenantDocuments() {
  const [documents, setDocuments] = useState([]);
  const [filter, setFilter] = useState('All');
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [loadingDocs, setLoadingDocs] = useState(true);

  // Detectăm dacă e ecran de mobil
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const token = localStorage.getItem('token') || '';
        const response = await fetch('https://management-apartamente-api.onrender.com/api/documente', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
         
          const formattedDocs = data.map(doc => ({
            id: doc.id,
            name: doc.titlu || 'Unnamed Document',
            type: doc.tip || 'Other',
            date: doc.data_incarcare || new Date().toISOString().split('T')[0],
            status: 'Pending', 
            size: 'N/A'
          }));
          setDocuments(formattedDocs);
        }
      } catch (error) {
        console.error('Error fetching documents:', error);
      } finally {
        setLoadingDocs(false);
      }
    };

    fetchDocuments();
  }, []);

  const types = ['All', 'Contract', 'ID', 'Invoice', 'Other'];
  const filtered = filter === 'All' ? documents : documents.filter(d => d.type === filter);

  const handleUpload = () => {
    setUploading(true);
    setTimeout(() => { 
      setUploading(false); 
      setUploaded(true); 
      
      const newDoc = {
        id: Date.now(),
        name: 'New Uploaded File',
        type: 'Other',
        date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        status: 'Pending',
        size: '1.2 MB'
      };
      setDocuments(prev => [newDoc, ...prev]);

      setTimeout(() => setUploaded(false), 3000); 
    }, 1800);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafa', fontFamily: 'Helvetica, sans-serif', color: '#1d1d1b' }}>

      {/* Header */}
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: isMobile ? '16px 20px' : '20px 50px', backgroundColor: '#f9fafa',
        borderBottom: '1px solid rgba(29,29,27,0.08)',
      }}>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <span style={{ fontFamily: 'Helvetica, sans-serif', fontWeight: 'bold', fontSize: '18px', color: '#1d1d1b' }}>EIF</span>
        </Link>
        {/* Ascundem link-urile centrale pe mobil pentru un aspect curat */}
        <nav style={{ display: isMobile ? 'none' : 'flex', gap: '30px' }}>
          {['Services', 'Benefits', 'Testimonials'].map(item => (
            <a key={item} href={`/#${item.toLowerCase()}`} style={{ fontSize: '16px', textDecoration: 'none', color: '#1d1d1b' }}>{item}</a>
          ))}
        </nav>
        <Link to="/#contact" style={{ fontSize: '16px', textDecoration: 'none', color: '#1d1d1b' }}>Contact Us</Link>
      </header>

      <div style={{ paddingTop: '100px', maxWidth: '966px', margin: '0 auto', padding: isMobile ? '80px 16px 60px' : '100px 20px 80px' }}>

        {/* Hero block */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          style={{ marginBottom: isMobile ? '40px' : '70px' }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
            <div>
              <p style={{ fontSize: '12px', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(29,29,27,0.4)', marginBottom: '16px' }}>01 — Tenant Platform</p>
              <h1 style={{
                fontFamily: '"Forum", serif', fontSize: isMobile ? '36px' : '52px', fontWeight: 400,
                lineHeight: 1.1, textTransform: 'uppercase', color: '#1d1d1b', margin: 0,
              }}>
                Tenant<br />Documents
              </h1>
              <p style={{ marginTop: '20px', fontSize: '16px', color: 'rgba(29,29,27,0.6)', maxWidth: '420px', lineHeight: 1.7 }}>
                Upload, sign and manage all your rental agreements and personal documents securely in one place.
              </p>
            </div>

            {/* Stats */}
            <div style={{ display: 'flex', gap: '2px', alignSelf: isMobile ? 'flex-start' : 'flex-end', marginTop: isMobile ? '20px' : '0' }}>
              {[{ n: documents.length, label: 'Total' }, { n: documents.filter(d => d.status === 'Signed').length, label: 'Signed' }, { n: documents.filter(d => d.status === 'Pending').length, label: 'Pending' }].map(({ n, label }) => (
                <div key={label} style={{
                  background: '#fcfdf5', border: '1px solid rgba(29,29,27,0.1)',
                  padding: isMobile ? '16px 20px' : '24px 28px', minWidth: isMobile ? '70px' : '90px', textAlign: 'center',
                }}>
                  <div style={{ fontFamily: '"Forum", serif', fontSize: isMobile ? '24px' : '32px', color: '#1d1d1b' }}>{n}</div>
                  <div style={{ fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(29,29,27,0.45)', marginTop: '4px' }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Filter + Upload row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}
        >
          <div style={{ display: 'flex', gap: '2px', flexWrap: 'wrap' }}>
            {types.map(t => (
              <button key={t} onClick={() => setFilter(t)} style={{
                background: filter === t ? '#1d1d1b' : '#fcfdf5',
                color: filter === t ? '#f9fafa' : '#1d1d1b',
                border: '1px solid rgba(29,29,27,0.1)',
                padding: '9px 20px', fontSize: '13px', cursor: 'pointer',
                fontFamily: 'Helvetica, sans-serif', letterSpacing: '0.05em',
                transition: 'all 0.2s ease',
              }}>{t}</button>
            ))}
          </div>

          <button onClick={handleUpload} disabled={uploading} style={{
            background: uploading ? 'rgba(29,29,27,0.5)' : '#1d1d1b',
            color: '#f9fafa', border: 'none', width: isMobile ? '100%' : 'auto',
            padding: '10px 28px', fontSize: '13px', cursor: uploading ? 'not-allowed' : 'pointer',
            fontFamily: 'Helvetica, sans-serif', letterSpacing: '0.08em',
            transition: 'opacity 0.2s',
          }}>
            {uploading ? 'Uploading…' : '+ Upload Document'}
          </button>
        </motion.div>

        {uploaded && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{
              background: '#eaf4ec', border: '1px solid rgba(45,122,69,0.2)',
              padding: '14px 24px', marginBottom: '24px', fontSize: '14px', color: '#2d7a45',
            }}
          >
            ✓ Document uploaded successfully.
          </motion.div>
        )}

        {/* Documents list - adăugat overflowX pentru mobile */}
        <div style={{ border: '1px solid rgba(29,29,27,0.1)', background: '#fcfdf5', overflowX: 'auto' }}>
          <div style={{ minWidth: '700px' }}>
            {/* Table header */}
            <div style={{
              display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 120px',
              padding: '16px 32px', borderBottom: '1px solid rgba(29,29,27,0.08)',
            }}>
              {['Document', 'Type', 'Date', 'Status', ''].map(h => (
                <span key={h} style={{ fontSize: '11px', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(29,29,27,0.4)' }}>{h}</span>
              ))}
            </div>

            {loadingDocs ? (
               <div style={{ padding: '60px 32px', textAlign: 'center', color: 'rgba(29,29,27,0.4)', fontSize: '15px' }}>
               Loading documents...
             </div>
            ) : filtered.length === 0 ? (
              <div style={{ padding: '60px 32px', textAlign: 'center', color: 'rgba(29,29,27,0.4)', fontSize: '15px' }}>
                No documents found.
              </div>
            ) : (
              filtered.map((doc, i) => (
                <motion.div
                  key={doc.id}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.07, duration: 0.4 }}
                  style={{
                    display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 120px',
                    padding: '22px 32px', alignItems: 'center',
                    borderBottom: i < filtered.length - 1 ? '1px solid rgba(29,29,27,0.06)' : 'none',
                    transition: 'background 0.2s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(29,29,27,0.02)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ color: 'rgba(29,29,27,0.5)' }}>{typeIcon[doc.type] || typeIcon.Other}</div>
                    <div>
                      <div style={{ fontSize: '15px', fontWeight: 400, color: '#1d1d1b' }}>{doc.name}</div>
                      <div style={{ fontSize: '12px', color: 'rgba(29,29,27,0.4)', marginTop: '2px' }}>{doc.size}</div>
                    </div>
                  </div>
                  <span style={{ fontSize: '13px', color: 'rgba(29,29,27,0.6)' }}>{doc.type}</span>
                  <span style={{ fontSize: '13px', color: 'rgba(29,29,27,0.6)' }}>{doc.date}</span>
                  <div>
                    <span style={{
                      display: 'inline-block',
                      background: statusStyle[doc.status]?.bg || '#fdf5e8',
                      color: statusStyle[doc.status]?.color || '#b07d1a',
                      padding: '4px 12px', fontSize: '12px', letterSpacing: '0.08em',
                    }}>{doc.status}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                    <button style={{
                      background: 'none', border: '1px solid rgba(29,29,27,0.2)',
                      padding: '6px 14px', fontSize: '12px', cursor: 'pointer',
                      color: '#1d1d1b', fontFamily: 'Helvetica, sans-serif',
                      transition: 'background 0.2s',
                    }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(29,29,27,0.05)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'none'}
                    >Open</button>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* Features block */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          style={{
            marginTop: '2px', background: '#3d4f6b', display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(3,1fr)', gap: '2px',
          }}
        >
          {[
            { icon: '🔒', title: 'Secure Storage', desc: 'All documents encrypted and stored safely.' },
            { icon: '✍️', title: 'Digital Signing', desc: 'Sign contracts directly from your browser.' },
            { icon: '📬', title: 'Instant Access', desc: 'Access your documents anytime, anywhere.' },
          ].map(({ icon, title, desc }) => (
            <div key={title} style={{ padding: '40px 32px', background: 'rgba(255,255,255,0.04)' }}>
              <div style={{ fontSize: '24px', marginBottom: '14px' }}>{icon}</div>
              <div style={{ fontFamily: '"Forum", serif', fontSize: '18px', color: '#f9fafa', marginBottom: '8px' }}>{title}</div>
              <div style={{ fontSize: '13px', color: 'rgba(249,250,250,0.55)', lineHeight: 1.6 }}>{desc}</div>
            </div>
          ))}
        </motion.div>

        {/* Back link */}
        <div style={{ marginTop: '60px', textAlign: 'center' }}>
          <Link to="/" style={{
            fontFamily: 'Helvetica, sans-serif', fontSize: '14px', color: '#1d1d1b',
            textDecoration: 'none', borderBottom: '1px solid #1d1d1b', paddingBottom: '2px',
          }}>← Back to Home</Link>
        </div>
      </div>
    </div>
  );
}