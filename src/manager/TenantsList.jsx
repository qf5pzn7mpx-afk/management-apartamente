import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../Navbar';
import mockApi from '../api/mockApi';

export default function TenantsList() {
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    mockApi.getTenants()
      .then(data => setTenants(Array.isArray(data) ? data : []))
      .catch(() => setTenants([]))
      .finally(() => setLoading(false));
  }, []);

  const filtrati = tenants.filter(t =>
    (t.nume || t.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (t.email || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafa', fontFamily: 'Helvetica, sans-serif' }}>
      <Navbar />
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '100px 30px 60px' }}>

        <div style={{ marginBottom: '16px' }}>
          <span style={{ fontSize: '13px', letterSpacing: '0.3em', color: '#888', textTransform: 'uppercase' }}>Manager Panel</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '60px' }}>
          <h1 style={{ fontFamily: 'Forum, serif', fontSize: '64px', fontWeight: 400, color: '#1d1d1b', lineHeight: 1.1, textTransform: 'uppercase', margin: 0 }}>
            All<br />Tenants
          </h1>
          <button
            onClick={() => navigate('/adauga-chirias')}
            style={{ background: '#1d1d1b', color: '#f9fafa', border: 'none', padding: '14px 32px', fontSize: '14px', cursor: 'pointer', fontFamily: 'Helvetica, sans-serif', letterSpacing: '0.05em', transition: 'opacity 0.2s' }}
            onMouseOver={e => e.currentTarget.style.opacity = '0.8'}
            onMouseOut={e => e.currentTarget.style.opacity = '1'}
          >
            + Add Tenant
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2px', marginBottom: '2px' }}>
          {[
            { label: 'TOTAL TENANTS', value: tenants.length },
            { label: 'ACTIVE', value: tenants.length },
            { label: 'APARTMENTS', value: [...new Set(tenants.map(t => t.apartament_id || t.apartament_numar).filter(Boolean))].length },
          ].map(stat => (
            <div key={stat.label} style={{ border: '1px solid rgba(29,29,27,0.12)', padding: '30px', background: '#fff', textAlign: 'center' }}>
              <div style={{ fontSize: '11px', letterSpacing: '0.25em', color: '#999', textTransform: 'uppercase', marginBottom: '12px' }}>{stat.label}</div>
              <div style={{ fontFamily: 'Forum, serif', fontSize: '48px', color: '#1d1d1b', lineHeight: 1 }}>{loading ? '—' : stat.value}</div>
            </div>
          ))}
        </div>

        <div style={{ border: '1px solid rgba(29,29,27,0.12)', background: '#fff', marginBottom: '2px' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(29,29,27,0.08)', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="1.5">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ border: 'none', outline: 'none', fontSize: '15px', color: '#1d1d1b', background: 'transparent', width: '100%', fontFamily: 'Helvetica, sans-serif' }}
            />
            {search && (
              <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#999', fontSize: '18px' }}>✕</button>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1.5fr 1fr 80px', padding: '12px 24px', background: '#fcfdf5', borderBottom: '1px solid rgba(29,29,27,0.08)' }}>
            {['NAME', 'APARTMENT', 'EMAIL', 'PHONE', ''].map(col => (
              <span key={col} style={{ fontSize: '11px', letterSpacing: '0.2em', color: '#999', textTransform: 'uppercase' }}>{col}</span>
            ))}
          </div>

          {loading ? (
            <div style={{ padding: '60px', textAlign: 'center', color: '#999' }}>Loading tenants...</div>
          ) : filtrati.length === 0 ? (
            <div style={{ padding: '60px', textAlign: 'center', color: '#999' }}>
              {search ? `No tenants found for "${search}"` : 'No tenants registered yet.'}
            </div>
          ) : (
            filtrati.map((t, i) => (
              <div
                key={t.id}
                style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1.5fr 1fr 80px', padding: '20px 24px', borderBottom: i < filtrati.length - 1 ? '1px solid rgba(29,29,27,0.06)' : 'none', alignItems: 'center', cursor: 'pointer', transition: 'background 0.15s' }}
                onMouseOver={e => e.currentTarget.style.background = '#fcfdf5'}
                onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                onClick={() => navigate(`/manager/tenants/${t.id}`)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#1d1d1b', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span style={{ color: '#f9fafa', fontSize: '14px', fontWeight: 600 }}>
                      {(t.nume || t.name || '?')[0].toUpperCase()}
                    </span>
                  </div>
                  <span style={{ fontSize: '15px', color: '#1d1d1b', fontWeight: 500 }}>{t.nume || t.name || '—'}</span>
                </div>
                <span style={{ fontSize: '14px', color: '#555' }}>{t.apartament_id || t.apartament_numar || '—'}</span>
                <span style={{ fontSize: '14px', color: '#555' }}>{t.email || '—'}</span>
                <span style={{ fontSize: '14px', color: '#555' }}>{t.telefon || '—'}</span>
                <span style={{ fontSize: '13px', color: '#1d1d1b', borderBottom: '1px solid rgba(29,29,27,0.3)', paddingBottom: '1px', cursor: 'pointer' }}>
                  View →
                </span>
              </div>
            ))
          )}
        </div>

        <div style={{ border: '1px solid rgba(29,29,27,0.12)', background: '#fcfdf5', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '13px', color: '#999' }}>
            Showing <strong style={{ color: '#1d1d1b' }}>{filtrati.length}</strong> of <strong style={{ color: '#1d1d1b' }}>{tenants.length}</strong> tenants
          </span>
          <Link to="/manager/dashboard" style={{ fontSize: '13px', color: '#1d1d1b', textDecoration: 'none', borderBottom: '1px solid #1d1d1b', paddingBottom: '1px' }}>
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}