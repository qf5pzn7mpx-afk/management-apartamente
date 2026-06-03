import Navbar from './Navbar';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import mockApi from './api/mockApi';
import RevenueChart from './components/RevenueChart';
import MaintenanceChart from './components/MaintenanceChart';
import InvoiceBreakdown from './components/InvoiceBreakdown';

export default function ManagerDashboard() {
  const [tenants, setTenants] = useState([]);
  const [documente, setDocumente] = useState([]);
  const [cereri, setCereri] = useState([]);
  const [facturi, setFacturi] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      mockApi.getTenants().catch(() => []),
      import('./api/mockApi').then(m => m.getDocuments()).catch(() => []),
      import('./api/mockApi').then(m => m.getMaintenance ? m.getMaintenance() : []).catch(() => []),
      mockApi.getInvoices ? mockApi.getInvoices().catch(() => []) : Promise.resolve([]),
    ]).then(([t, d, c, f]) => {
      setTenants(Array.isArray(t) ? t : []);
      setDocumente(Array.isArray(d) ? d : []);
      setCereri(Array.isArray(c) ? c : []);
      setFacturi(Array.isArray(f) ? f : []);
    }).finally(() => setLoading(false));
  }, []);

  const cereriUrgente = cereri.filter(c => c.prioritate === 'High' && c.status !== 'Rezolvată');
  const facturiNeplatite = facturi.filter(f => f.status === 'Neplătită');

  const quickActions = [
    { label: 'Add Tenant', icon: '👤', link: '/adauga-chirias', desc: 'Register a new tenant' },
    { label: 'Add Invoice', icon: '🧾', link: '/adauga-factura', desc: 'Create a new invoice' },
    { label: 'New Request', icon: '🔧', link: '/raporteaza-problema', desc: 'Report maintenance issue' },
    { label: 'Add Document', icon: '📄', link: '/adauga-document', desc: 'Upload a document' },
  ];

  const stats = [
    { label: 'TENANTS', value: loading ? '—' : tenants.length, sub: 'Total registered', link: '/manager/tenants' },
    { label: 'MAINTENANCE', value: loading ? '—' : cereri.length, sub: 'Active requests', link: '/mentenanta' },
    { label: 'REVENUE', value: '32.400 RON', sub: 'This month', link: '/facturi' },
    { label: 'DOCUMENTS', value: loading ? '—' : documente.length, sub: 'Total uploaded', link: '/documente' },
  ];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafa', fontFamily: 'Helvetica, sans-serif' }}>
      <Navbar />
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '100px 30px 60px' }}>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>

          <div style={{ marginBottom: '16px' }}>
            <span style={{ fontSize: '13px', letterSpacing: '0.3em', color: '#888', textTransform: 'uppercase' }}>Manager Panel</span>
          </div>
          <h1 style={{ fontFamily: 'Forum, serif', fontSize: '64px', fontWeight: 400, color: '#1d1d1b', lineHeight: 1.1, textTransform: 'uppercase', margin: '0 0 60px 0' }}>
            Manager<br />Dashboard
          </h1>

          {(cereriUrgente.length > 0 || facturiNeplatite.length > 0) && (
            <div style={{ background: '#fff0f0', border: '1px solid #ffcccc', padding: '16px 24px', marginBottom: '40px', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <span style={{ fontSize: '18px' }}>⚠️</span>
              <div>
                {cereriUrgente.length > 0 && (
                  <p style={{ margin: '0 0 4px 0', fontSize: '14px', color: '#cc0000' }}>
                    <strong>{cereriUrgente.length}</strong> urgent maintenance request{cereriUrgente.length > 1 ? 's' : ''} need attention
                  </p>
                )}
                {facturiNeplatite.length > 0 && (
                  <p style={{ margin: 0, fontSize: '14px', color: '#cc0000' }}>
                    <strong>{facturiNeplatite.length}</strong> unpaid invoice{facturiNeplatite.length > 1 ? 's' : ''} pending
                  </p>
                )}
              </div>
              <Link to="/facturi" style={{ marginLeft: 'auto', fontSize: '13px', color: '#cc0000', textDecoration: 'none', borderBottom: '1px solid #cc0000', paddingBottom: '1px', whiteSpace: 'nowrap' }}>
                View all →
              </Link>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2px', marginBottom: '2px' }}>
            {stats.map(stat => (
              <Link key={stat.label} to={stat.link} style={{ textDecoration: 'none' }}>
                <div
                  style={{ border: '1px solid rgba(29,29,27,0.12)', padding: '30px', background: '#fff', transition: 'all 0.2s', cursor: 'pointer', height: '100%', boxSizing: 'border-box' }}
                  onMouseOver={e => { e.currentTarget.style.background = '#1d1d1b'; e.currentTarget.querySelector('.stat-value').style.color = '#f9fafa'; e.currentTarget.querySelector('.stat-label').style.color = 'rgba(249,250,250,0.5)'; e.currentTarget.querySelector('.stat-sub').style.color = 'rgba(249,250,250,0.4)'; }}
                  onMouseOut={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.querySelector('.stat-value').style.color = '#1d1d1b'; e.currentTarget.querySelector('.stat-label').style.color = '#999'; e.currentTarget.querySelector('.stat-sub').style.color = '#999'; }}
                >
                  <div className="stat-label" style={{ fontSize: '11px', letterSpacing: '0.25em', color: '#999', textTransform: 'uppercase', marginBottom: '16px' }}>{stat.label}</div>
                  <div className="stat-value" style={{ fontFamily: 'Forum, serif', fontSize: '36px', color: '#1d1d1b', lineHeight: 1, marginBottom: '10px', transition: 'color 0.2s' }}>{stat.value}</div>
                  <div className="stat-sub" style={{ fontSize: '13px', color: '#999', transition: 'color 0.2s' }}>{stat.sub}</div>
                </div>
              </Link>
            ))}
          </div>

          <div style={{ border: '1px solid rgba(29,29,27,0.12)', padding: '30px', background: '#fcfdf5', marginBottom: '2px' }}>
            <div style={{ marginBottom: '20px' }}>
              <span style={{ fontSize: '11px', letterSpacing: '0.25em', color: '#999', textTransform: 'uppercase' }}>Quick Actions</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
              {quickActions.map(action => (
                <button
                  key={action.label}
                  onClick={() => navigate(action.link)}
                  style={{ padding: '20px', border: '1px solid rgba(29,29,27,0.12)', background: '#fff', cursor: 'pointer', textAlign: 'left', fontFamily: 'Helvetica, sans-serif', transition: 'all 0.2s' }}
                  onMouseOver={e => { e.currentTarget.style.background = '#1d1d1b'; e.currentTarget.style.borderColor = '#1d1d1b'; }}
                  onMouseOut={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = 'rgba(29,29,27,0.12)'; }}
                >
                  <div style={{ fontSize: '22px', marginBottom: '10px' }}>{action.icon}</div>
                  <div style={{ fontSize: '14px', color: 'inherit', fontWeight: 600, marginBottom: '4px' }}>{action.label}</div>
                  <div style={{ fontSize: '12px', color: '#999' }}>{action.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2px', marginBottom: '2px' }}>
            <div style={{ border: '1px solid rgba(29,29,27,0.12)', padding: '40px', background: '#fff' }}>
              <span style={{ fontSize: '11px', letterSpacing: '0.25em', color: '#999', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Revenue Analysis</span>
              <h3 style={{ fontFamily: 'Forum, serif', fontSize: '24px', fontWeight: 400, color: '#1d1d1b', margin: '0 0 30px 0' }}>Monthly Overview</h3>
              <RevenueChart months={6} />
            </div>

            <div style={{ border: '1px solid rgba(29,29,27,0.12)', padding: '40px', background: '#fff' }}>
              <span style={{ fontSize: '11px', letterSpacing: '0.25em', color: '#999', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Maintenance</span>
              <h3 style={{ fontFamily: 'Forum, serif', fontSize: '24px', fontWeight: 400, color: '#1d1d1b', margin: '0 0 30px 0' }}>Requests by Status</h3>
              <MaintenanceChart />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2px', marginBottom: '2px' }}>
            <div style={{ border: '1px solid rgba(29,29,27,0.12)', padding: '40px', background: '#fff' }}>
              <span style={{ fontSize: '11px', letterSpacing: '0.25em', color: '#999', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Invoices</span>
              <h3 style={{ fontFamily: 'Forum, serif', fontSize: '24px', fontWeight: 400, color: '#1d1d1b', margin: '0 0 30px 0' }}>Paid vs Unpaid</h3>
              <InvoiceBreakdown />
            </div>

            <div style={{ border: '1px solid rgba(29,29,27,0.12)', padding: '40px', background: '#fff' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                <div>
                  <span style={{ fontSize: '11px', letterSpacing: '0.25em', color: '#999', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Urgent</span>
                  <h3 style={{ fontFamily: 'Forum, serif', fontSize: '24px', fontWeight: 400, color: '#1d1d1b', margin: 0 }}>Needs Attention</h3>
                </div>
              </div>
              {cereriUrgente.length === 0 && facturiNeplatite.length === 0 ? (
                <div style={{ padding: '30px', textAlign: 'center', border: '1px dashed rgba(29,29,27,0.15)', color: '#999', fontSize: '14px' }}>
                  ✓ All clear — nothing urgent
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {cereriUrgente.slice(0, 3).map(c => (
                    <div key={c.id} style={{ padding: '14px 16px', background: '#fff0f0', border: '1px solid #ffcccc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontSize: '14px', color: '#cc0000', fontWeight: 500 }}>{c.titlu || 'Maintenance Issue'}</div>
                        <div style={{ fontSize: '12px', color: '#999', marginTop: '2px' }}>High Priority</div>
                      </div>
                      <Link to="/mentenanta" style={{ fontSize: '12px', color: '#cc0000', textDecoration: 'none', borderBottom: '1px solid #cc0000' }}>View →</Link>
                    </div>
                  ))}
                  {facturiNeplatite.slice(0, 3).map(f => (
                    <div key={f.id} style={{ padding: '14px 16px', background: '#f8f0e8', border: '1px solid #f0d0a0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontSize: '14px', color: '#8a5a2d', fontWeight: 500 }}>Invoice #{f.id} — {f.suma} RON</div>
                        <div style={{ fontSize: '12px', color: '#999', marginTop: '2px' }}>{f.chirias_nume || 'Unknown tenant'}</div>
                      </div>
                      <Link to="/facturi" style={{ fontSize: '12px', color: '#8a5a2d', textDecoration: 'none', borderBottom: '1px solid #8a5a2d' }}>View →</Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div style={{ border: '1px solid rgba(29,29,27,0.12)', padding: '40px', background: '#fff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '30px' }}>
              <div>
                <span style={{ fontSize: '11px', letterSpacing: '0.25em', color: '#999', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Tenants</span>
                <h3 style={{ fontFamily: 'Forum, serif', fontSize: '24px', fontWeight: 400, color: '#1d1d1b', margin: 0 }}>Recent Tenants</h3>
              </div>
              <Link to="/manager/tenants" style={{ fontSize: '13px', color: '#1d1d1b', textDecoration: 'none', borderBottom: '1px solid #1d1d1b', paddingBottom: '2px' }}>
                View All →
              </Link>
            </div>

            <div style={{ border: '1px solid rgba(29,29,27,0.12)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1.5fr 1fr', padding: '12px 20px', background: '#fcfdf5', borderBottom: '1px solid rgba(29,29,27,0.08)' }}>
                {['NAME', 'APARTMENT', 'EMAIL', 'PHONE'].map(col => (
                  <span key={col} style={{ fontSize: '11px', letterSpacing: '0.2em', color: '#999', textTransform: 'uppercase' }}>{col}</span>
                ))}
              </div>
              {loading ? (
                <div style={{ padding: '40px', textAlign: 'center', color: '#999', fontSize: '14px' }}>Loading...</div>
              ) : tenants.length === 0 ? (
                <div style={{ padding: '40px', textAlign: 'center', color: '#999', fontSize: '14px' }}>No tenants found.</div>
              ) : (
                tenants.slice(0, 6).map((t, i) => (
                  <div
                    key={t.id}
                    style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1.5fr 1fr', padding: '16px 20px', borderBottom: i < Math.min(tenants.length, 6) - 1 ? '1px solid rgba(29,29,27,0.06)' : 'none', alignItems: 'center', transition: 'background 0.15s', cursor: 'pointer' }}
                    onMouseOver={e => e.currentTarget.style.background = '#fcfdf5'}
                    onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                    onClick={() => navigate(`/manager/tenants/${t.id}`)}
                  >
                    <span style={{ fontSize: '15px', color: '#1d1d1b', fontWeight: 500 }}>{t.nume || t.name || '—'}</span>
                    <span style={{ fontSize: '14px', color: '#555' }}>{t.apartament_id || t.apartament_numar || '—'}</span>
                    <span style={{ fontSize: '14px', color: '#555' }}>{t.email || '—'}</span>
                    <span style={{ fontSize: '14px', color: '#555' }}>{t.telefon || '—'}</span>
                  </div>
                ))
              )}
            </div>

            <div style={{ marginTop: '16px', textAlign: 'right' }}>
              <button
                onClick={() => navigate('/adauga-chirias')}
                style={{ background: '#1d1d1b', color: '#f9fafa', border: 'none', padding: '12px 28px', fontSize: '13px', cursor: 'pointer', fontFamily: 'Helvetica, sans-serif', letterSpacing: '0.05em', transition: 'opacity 0.2s' }}
                onMouseOver={e => e.currentTarget.style.opacity = '0.8'}
                onMouseOut={e => e.currentTarget.style.opacity = '1'}
              >
                + Add New Tenant
              </button>
            </div>
          </div>

        </motion.div>
      </div>
    </div>
  );
}