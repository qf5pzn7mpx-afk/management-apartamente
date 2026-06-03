import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import mockApi from './api/mockApi';

function GestionareFacturi() {
  const [facturi, setFacturi] = useState([]);
  const [loading, setLoading] = useState(true);
  const [eroare, setEroare] = useState('');
  const [filtruActiv, setFiltruActiv] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [paginaCurenta, setPaginaCurenta] = useState(1);
  const facturiPerPagina = 8;

  useEffect(() => {
    mockApi.getInvoices()
      .then((data) => { if (Array.isArray(data)) setFacturi(data); })
      .catch(() => setEroare('Nu pot încărca facturile.'))
      .finally(() => setLoading(false));
  }, []);

  const getStatusBg = (status) => {
    if (status === 'Plătită') return '#e8f4e8';
    if (status === 'Neplătită') return '#fff0f0';
    return '#f8f0e8';
  };

  const getStatusColor = (status) => {
    if (status === 'Plătită') return '#2d7a2d';
    if (status === 'Neplătită') return '#cc0000';
    return '#8a5a2d';
  };

  const filtre = ['All', 'Plătită', 'Neplătită', 'În așteptare'];

  const facturiFiltrate = facturi.filter(f => {
    const matchStatus = filtruActiv === 'All' || f.status === filtruActiv;
    const matchSearch = f.chirias_nume?.toLowerCase().includes(searchTerm.toLowerCase()) || f.id?.toString().includes(searchTerm);
    return matchStatus && matchSearch;
  });

  const totalPlatite = facturi.filter(f => f.status === 'Plătită').length;
  const totalNeplatite = facturi.filter(f => f.status === 'Neplătită').length;
  const totalAsteptare = facturi.filter(f => f.status === 'În așteptare').length;

  const indexUltima = paginaCurenta * facturiPerPagina;
  const indexPrima = indexUltima - facturiPerPagina;
  const facturiCurente = facturiFiltrate.slice(indexPrima, indexUltima);
  const totalPagini = Math.ceil(facturiFiltrate.length / facturiPerPagina);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafa', fontFamily: 'Helvetica, sans-serif' }}>
      <Navbar />
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '60px 30px' }}>

        <div style={{ marginBottom: '16px' }}>
          <span style={{ fontSize: '13px', letterSpacing: '0.3em', color: '#888', textTransform: 'uppercase' }}>02 — Tenant Platform</span>
        </div>
        <h1 style={{ fontFamily: 'Forum, serif', fontSize: '64px', fontWeight: 400, color: '#1d1d1b', lineHeight: 1.1, margin: '0 0 20px 0', textTransform: 'uppercase' }}>
          Invoice<br />Management
        </h1>

        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '50px', gap: '40px' }}>
          <p style={{ fontSize: '16px', color: '#666', lineHeight: 1.7, maxWidth: '420px', margin: 0 }}>
            Track rent payments, utility bills and all invoices automatically. Never miss a payment deadline again.
          </p>
          <div style={{ display: 'flex', gap: '2px', flexShrink: 0 }}>
            {[{ label: 'PAID', value: totalPlatite }, { label: 'UNPAID', value: totalNeplatite }, { label: 'PENDING', value: totalAsteptare }].map(stat => (
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

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '30px', gap: '20px' }}>
          <div style={{ display: 'flex' }}>
            {filtre.map(f => (
              <button
                key={f}
                onClick={() => { setFiltruActiv(f); setPaginaCurenta(1); }}
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
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <input
              type="text"
              placeholder="Search tenant or ID..."
              value={searchTerm}
              onChange={e => { setSearchTerm(e.target.value); setPaginaCurenta(1); }}
              style={{ padding: '10px 16px', border: '1px solid rgba(29,29,27,0.2)', background: '#fff', fontSize: '14px', fontFamily: 'Helvetica, sans-serif', outline: 'none', width: '220px' }}
            />
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <Link
                to="/manager/dashboard"
                style={{ padding: '12px 28px', fontSize: '14px', textDecoration: 'none', fontFamily: 'Helvetica, sans-serif', letterSpacing: '0.05em', border: '1px solid rgba(29,29,27,0.2)', color: '#1d1d1b', background: '#fff', whiteSpace: 'nowrap', transition: 'all 0.2s' }}
                onMouseOver={e => { e.currentTarget.style.background = '#1d1d1b'; e.currentTarget.style.color = '#f9fafa'; }}
                onMouseOut={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#1d1d1b'; }}
              >
                ← Dashboard
              </Link>
              <Link
                to="/adauga-factura"
                style={{ background: '#1d1d1b', color: '#f9fafa', padding: '12px 28px', fontSize: '14px', textDecoration: 'none', fontFamily: 'Helvetica, sans-serif', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}
                onMouseOver={e => e.currentTarget.style.opacity = '0.8'}
                onMouseOut={e => e.currentTarget.style.opacity = '1'}
              >
                + Add Invoice
              </Link>
            </div>
          </div>
        </div>

        <div style={{ border: '1px solid rgba(29,29,27,0.12)', background: '#fff' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '80px 1.5fr 1fr 1fr 1fr 1fr', padding: '14px 24px', borderBottom: '1px solid rgba(29,29,27,0.1)', background: '#fcfdf5' }}>
            {['ID', 'TENANT', 'AMOUNT', 'ISSUED', 'DUE DATE', 'STATUS'].map(col => (
              <span key={col} style={{ fontSize: '11px', letterSpacing: '0.25em', color: '#999', textTransform: 'uppercase' }}>{col}</span>
            ))}
          </div>

          {loading ? (
            <div style={{ padding: '60px', textAlign: 'center', color: '#999' }}>Se încarcă...</div>
          ) : facturiCurente.length === 0 ? (
            <div style={{ padding: '60px', textAlign: 'center', color: '#999' }}>Nu există facturi.</div>
          ) : (
            facturiCurente.map((factura, i) => (
              <div
                key={factura.id}
                style={{ display: 'grid', gridTemplateColumns: '80px 1.5fr 1fr 1fr 1fr 1fr', padding: '20px 24px', borderBottom: i < facturiCurente.length - 1 ? '1px solid rgba(29,29,27,0.08)' : 'none', alignItems: 'center' }}
                onMouseOver={e => e.currentTarget.style.background = '#fcfdf5'}
                onMouseOut={e => e.currentTarget.style.background = 'transparent'}
              >
                <span style={{ fontSize: '14px', color: '#999' }}>#{factura.id}</span>
                <span style={{ fontSize: '15px', color: '#1d1d1b', fontWeight: 500 }}>{factura.chirias_nume || '—'}</span>
                <span style={{ fontSize: '15px', color: '#1d1d1b', fontWeight: 600 }}>{factura.suma || 0} RON</span>
                <span style={{ fontSize: '14px', color: '#555' }}>{factura.data_emiterii || '—'}</span>
                <span style={{ fontSize: '14px', color: '#555' }}>{factura.data_scadentei || '—'}</span>
                <span style={{ display: 'inline-block', padding: '4px 14px', fontSize: '13px', background: getStatusBg(factura.status), color: getStatusColor(factura.status) }}>
                  {factura.status || 'Neplătită'}
                </span>
              </div>
            ))
          )}
        </div>

        {totalPagini > 1 && (
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginTop: '40px' }}>
            {Array.from({ length: totalPagini }, (_, i) => (
              <button
                key={i}
                onClick={() => setPaginaCurenta(i + 1)}
                style={{
                  width: '40px', height: '40px', border: '1px solid rgba(29,29,27,0.2)',
                  background: paginaCurenta === i + 1 ? '#1d1d1b' : '#fff',
                  color: paginaCurenta === i + 1 ? '#f9fafa' : '#1d1d1b',
                  cursor: 'pointer', fontSize: '14px', fontFamily: 'Helvetica, sans-serif',
                }}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default GestionareFacturi;