import { useContext, useEffect, useState } from 'react';
import Navbar from '../Navbar';
import { AuthContext } from '../AuthContext';

export default function ChiriasDocuments() {
  const { user } = useContext(AuthContext) || {};
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtruActiv, setFiltruActiv] = useState('All');

  useEffect(() => {
    if (!user) return;
    const fetchMyDocs = async () => {
      try {
        const token = localStorage.getItem('token') || '';
        const response = await fetch('https://management-apartamente-api.onrender.com/api/documente', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          
          const myDocs = (Array.isArray(data) ? data : []).filter(d => d.chirias_id?.toString() === user.id?.toString());
          setDocs(myDocs);
        }
      } catch (error) {
        console.error('Error fetching docs:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMyDocs();
  }, [user]);

  const getTipLabel = (tip) => {
    const labels = { contract: 'Contract', identitate: 'ID', factura: 'Invoice', alte: 'Other' };
    return labels[tip] || tip || 'Other';
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

  const docsFiltrate = filtruActiv === 'All'
    ? docs
    : docs.filter(d => getTipLabel(d.tip) === filtruActiv);

  const total = docs.length;
  const contracte = docs.filter(d => d.tip === 'contract').length;
  const semnate = docs.filter(d => d.status === 'Signed').length;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafa', fontFamily: 'Helvetica, sans-serif' }}>
      <Navbar />
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '100px 30px 60px' }}>

        <div style={{ marginBottom: '16px' }}>
          <span style={{ fontSize: '13px', letterSpacing: '0.3em', color: '#888', textTransform: 'uppercase' }}>Tenant Portal</span>
        </div>
        <h1 style={{ fontFamily: 'Forum, serif', fontSize: '64px', fontWeight: 400, color: '#1d1d1b', lineHeight: 1.1, textTransform: 'uppercase', margin: '0 0 60px 0' }}>
          My<br />Documents
        </h1>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2px', marginBottom: '2px' }}>
          {[
            { label: 'TOTAL', value: total },
            { label: 'CONTRACTS', value: contracte },
            { label: 'SIGNED', value: semnate },
          ].map(stat => (
            <div key={stat.label} style={{ border: '1px solid rgba(29,29,27,0.12)', padding: '30px', background: '#fff', textAlign: 'center' }}>
              <div style={{ fontSize: '11px', letterSpacing: '0.25em', color: '#999', textTransform: 'uppercase', marginBottom: '12px' }}>{stat.label}</div>
              <div style={{ fontFamily: 'Forum, serif', fontSize: '48px', color: '#1d1d1b', lineHeight: 1 }}>{loading ? '—' : stat.value}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', marginBottom: '2px' }}>
          {filtre.map(f => (
            <button
              key={f}
              onClick={() => setFiltruActiv(f)}
              style={{ padding: '10px 24px', fontSize: '14px', border: '1px solid rgba(29,29,27,0.2)', background: filtruActiv === f ? '#1d1d1b' : '#fff', color: filtruActiv === f ? '#f9fafa' : '#1d1d1b', cursor: 'pointer', fontFamily: 'Helvetica, sans-serif', marginRight: '-1px', transition: 'all 0.2s' }}
            >
              {f}
            </button>
          ))}
        </div>

        <div style={{ border: '1px solid rgba(29,29,27,0.12)', background: '#fff' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 100px', padding: '14px 24px', background: '#fcfdf5', borderBottom: '1px solid rgba(29,29,27,0.08)' }}>
            {['DOCUMENT', 'TYPE', 'DATE', 'STATUS', ''].map(col => (
              <span key={col} style={{ fontSize: '11px', letterSpacing: '0.25em', color: '#999', textTransform: 'uppercase' }}>{col}</span>
            ))}
          </div>

          {loading ? (
            <div style={{ padding: '60px', textAlign: 'center', color: '#999' }}>Loading documents...</div>
          ) : docsFiltrate.length === 0 ? (
            <div style={{ padding: '60px', textAlign: 'center', color: '#999' }}>
              <div style={{ fontSize: '32px', marginBottom: '16px' }}>📄</div>
              <div style={{ fontSize: '16px', marginBottom: '8px', color: '#1d1d1b' }}>No documents found</div>
              <div style={{ fontSize: '14px' }}>Your manager will upload documents here.</div>
            </div>
          ) : (
            docsFiltrate.map((doc, i) => {
              const status = doc.status || 'Pending';
              return (
                <div
                  key={doc.id}
                  style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 100px', padding: '20px 24px', borderBottom: i < docsFiltrate.length - 1 ? '1px solid rgba(29,29,27,0.06)' : 'none', alignItems: 'center', transition: 'background 0.15s' }}
                  onMouseOver={e => e.currentTarget.style.background = '#fcfdf5'}
                  onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{ width: '36px', height: '36px', background: '#fcfdf5', border: '1px solid rgba(29,29,27,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <svg width="16" height="18" viewBox="0 0 16 18" fill="none" stroke="#999" strokeWidth="1.5">
                        <path d="M9 1H3a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7z" />
                        <path d="M9 1L15 7H9z" />
                      </svg>
                    </div>
                    <div>
                      <div style={{ fontSize: '15px', color: '#1d1d1b', fontWeight: 500 }}>{doc.nume_fisier || doc.title || '—'}</div>
                      <div style={{ fontSize: '12px', color: '#999', marginTop: '2px' }}>{doc.marime || ''}</div>
                    </div>
                  </div>
                  <span style={{ fontSize: '14px', color: '#555' }}>{getTipLabel(doc.tip)}</span>
                  <span style={{ fontSize: '14px', color: '#555' }}>{doc.data_upload || doc.data || '—'}</span>
                  <span style={{ display: 'inline-block', padding: '4px 14px', fontSize: '13px', background: getStatusBg(status), color: getStatusColor(status) }}>
                    {status}
                  </span>
                  
                  <a
                    href={`https://management-apartamente-api.onrender.com${doc.cale}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ padding: '6px 14px', border: '1px solid rgba(29,29,27,0.2)', fontSize: '13px', color: '#1d1d1b', textDecoration: 'none', background: '#fff', transition: 'all 0.2s', display: 'inline-block', textAlign: 'center' }}
                    onMouseOver={e => { e.currentTarget.style.background = '#1d1d1b'; e.currentTarget.style.color = '#f9fafa'; }}
                    onMouseOut={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#1d1d1b'; }}
                  >
                    Open
                  </a>
                </div>
              );
            })
          )}
        </div>

        <div style={{ border: '1px solid rgba(29,29,27,0.12)', background: '#fcfdf5', padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '16px' }}>ℹ️</span>
            <span style={{ fontSize: '13px', color: '#666' }}>Documents are uploaded by your property manager. Contact them if you need a specific document.</span>
          </div>
        </div>

      </div>
    </div>
  );
}