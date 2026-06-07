import Navbar from './Navbar';
import { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';

export default function ChiriasDashboard() {
  const { user } = useContext(AuthContext) || {};
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    const fetchMyInvoices = async () => {
      try {
        const token = localStorage.getItem('token') || '';
        const response = await fetch('https://management-apartamente-api.onrender.com/api/facturi', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          
          const myInvoices = (Array.isArray(data) ? data : []).filter(i => i.chirias_id?.toString() === user.id?.toString());
          setInvoices(myInvoices);
        }
      } catch (error) {
        console.error("Error fetching dashboard invoices:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMyInvoices();
  }, [user]);

  const facturiRestante = invoices.filter(i => i.status !== 'Plătită');
  const facturiPlatite = invoices.filter(i => i.status === 'Plătită');

  const getStatusBg = (status) => status === 'Plătită' ? '#e8f4e8' : status === 'În așteptare' ? '#f8f0e8' : '#fff0f0';
  const getStatusColor = (status) => status === 'Plătită' ? '#2d7a2d' : status === 'În așteptare' ? '#8a5a2d' : '#cc0000';

  const quickLinks = [
    { label: 'My Invoices', desc: 'View and pay your bills', link: '/chirias/invoices', icon: '🧾' },
    { label: 'My Documents', desc: 'Contracts and agreements', link: '/chirias/documents', icon: '📄' },
    { label: 'Maintenance', desc: 'Report or track issues', link: '/chirias/maintenance', icon: '🔧' },
    { label: 'Message Manager', desc: 'Send a message', link: '/chirias/message', icon: '💬' },
  ];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafa', fontFamily: 'Helvetica, sans-serif' }}>
      <Navbar />
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '100px 30px 60px' }}>

        <div style={{ marginBottom: '16px' }}>
          <span style={{ fontSize: '13px', letterSpacing: '0.3em', color: '#888', textTransform: 'uppercase' }}>Tenant Portal</span>
        </div>
        <h1 style={{ fontFamily: 'Forum, serif', fontSize: '64px', fontWeight: 400, color: '#1d1d1b', lineHeight: 1.1, textTransform: 'uppercase', margin: '0 0 60px 0' }}>
          Welcome Back,<br />{user?.name || user?.email?.split('@')[0] || 'Tenant'}
        </h1>

        {facturiRestante.length > 0 && (
          <div style={{ background: '#fff0f0', border: '1px solid #ffcccc', padding: '16px 24px', marginBottom: '40px', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ fontSize: '18px' }}>⚠️</span>
            <p style={{ margin: 0, fontSize: '14px', color: '#cc0000' }}>
              You have <strong>{facturiRestante.length}</strong> unpaid invoice{facturiRestante.length > 1 ? 's' : ''} pending.
            </p>
            <Link to="/chirias/invoices" style={{ marginLeft: 'auto', fontSize: '13px', color: '#cc0000', textDecoration: 'none', borderBottom: '1px solid #cc0000', whiteSpace: 'nowrap' }}>
              Pay now →
            </Link>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2px', marginBottom: '2px' }}>
          {[
            { label: 'UNPAID INVOICES', value: loading ? '—' : facturiRestante.length, color: facturiRestante.length > 0 ? '#cc0000' : '#1d1d1b' },
            { label: 'PAID INVOICES', value: loading ? '—' : facturiPlatite.length, color: '#2d7a2d' },
            { label: 'TOTAL INVOICES', value: loading ? '—' : invoices.length, color: '#1d1d1b' },
          ].map(stat => (
            <div key={stat.label} style={{ border: '1px solid rgba(29,29,27,0.12)', padding: '30px', background: '#fff', textAlign: 'center' }}>
              <div style={{ fontSize: '11px', letterSpacing: '0.25em', color: '#999', textTransform: 'uppercase', marginBottom: '12px' }}>{stat.label}</div>
              <div style={{ fontFamily: 'Forum, serif', fontSize: '48px', color: stat.color, lineHeight: 1 }}>{stat.value}</div>
            </div>
          ))}
        </div>

        <div style={{ border: '1px solid rgba(29,29,27,0.12)', padding: '30px', background: '#fcfdf5', marginBottom: '2px' }}>
          <div style={{ marginBottom: '20px' }}>
            <span style={{ fontSize: '11px', letterSpacing: '0.25em', color: '#999', textTransform: 'uppercase' }}>Quick Access</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
            {quickLinks.map(item => (
              <button
                key={item.label}
                onClick={() => navigate(item.link)}
                style={{ padding: '24px 20px', border: '1px solid rgba(29,29,27,0.12)', background: '#fff', cursor: 'pointer', textAlign: 'left', fontFamily: 'Helvetica, sans-serif', transition: 'all 0.2s' }}
                onMouseOver={e => { e.currentTarget.style.background = '#1d1d1b'; e.currentTarget.style.borderColor = '#1d1d1b'; }}
                onMouseOut={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = 'rgba(29,29,27,0.12)'; }}
              >
                <div style={{ fontSize: '24px', marginBottom: '12px' }}>{item.icon}</div>
                <div style={{ fontSize: '14px', color: 'inherit', fontWeight: 600, marginBottom: '4px' }}>{item.label}</div>
                <div style={{ fontSize: '12px', color: '#999' }}>{item.desc}</div>
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2px', marginBottom: '2px' }}>
          <div style={{ border: '1px solid rgba(29,29,27,0.12)', padding: '40px', background: '#fff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '30px' }}>
              <div>
                <span style={{ fontSize: '11px', letterSpacing: '0.25em', color: '#999', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Billing</span>
                <h3 style={{ fontFamily: 'Forum, serif', fontSize: '24px', fontWeight: 400, color: '#1d1d1b', margin: 0 }}>Recent Invoices</h3>
              </div>
              <Link to="/chirias/invoices" style={{ fontSize: '13px', color: '#1d1d1b', textDecoration: 'none', borderBottom: '1px solid #1d1d1b', paddingBottom: '1px' }}>
                View All →
              </Link>
            </div>

            {loading ? (
              <div style={{ padding: '30px', textAlign: 'center', color: '#999', fontSize: '14px' }}>Loading...</div>
            ) : invoices.length === 0 ? (
              <div style={{ padding: '30px', textAlign: 'center', border: '1px dashed rgba(29,29,27,0.15)', color: '#999', fontSize: '14px' }}>No invoices yet.</div>
            ) : (
              <div style={{ border: '1px solid rgba(29,29,27,0.08)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '60px 1fr 1fr 1fr', padding: '10px 16px', background: '#fcfdf5', borderBottom: '1px solid rgba(29,29,27,0.08)' }}>
                  {['#', 'AMOUNT', 'DATE', 'STATUS'].map(col => (
                    <span key={col} style={{ fontSize: '10px', letterSpacing: '0.2em', color: '#999', textTransform: 'uppercase' }}>{col}</span>
                  ))}
                </div>
                {invoices.slice(0, 5).map((f, i) => (
                  <div
                    key={f.id}
                    style={{ display: 'grid', gridTemplateColumns: '60px 1fr 1fr 1fr', padding: '14px 16px', borderBottom: i < 4 ? '1px solid rgba(29,29,27,0.06)' : 'none', alignItems: 'center', transition: 'background 0.15s' }}
                    onMouseOver={e => e.currentTarget.style.background = '#fcfdf5'}
                    onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <span style={{ fontSize: '13px', color: '#999' }}>#{f.id}</span>
                    <span style={{ fontSize: '14px', color: '#1d1d1b', fontWeight: 600 }}>{f.suma || f.amount || '—'} RON</span>
                    <span style={{ fontSize: '13px', color: '#555' }}>{f.data_emiterii || '—'}</span>
                    <span style={{ display: 'inline-block', padding: '3px 10px', fontSize: '12px', background: getStatusBg(f.status), color: getStatusColor(f.status) }}>
                      {f.status || 'Unpaid'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ border: '1px solid rgba(29,29,27,0.12)', padding: '40px', background: '#fff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '30px' }}>
              <div>
                <span style={{ fontSize: '11px', letterSpacing: '0.25em', color: '#999', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Maintenance</span>
                <h3 style={{ fontFamily: 'Forum, serif', fontSize: '24px', fontWeight: 400, color: '#1d1d1b', margin: 0 }}>My Requests</h3>
              </div>
              <Link to="/chirias/maintenance" style={{ fontSize: '13px', color: '#1d1d1b', textDecoration: 'none', borderBottom: '1px solid #1d1d1b', paddingBottom: '1px' }}>
                View All →
              </Link>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
              <div
                style={{ padding: '16px', border: '1px solid rgba(29,29,27,0.1)', background: '#fcfdf5', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'background 0.15s' }}
                onMouseOver={e => e.currentTarget.style.background = '#f5f0eb'}
                onMouseOut={e => e.currentTarget.style.background = '#fcfdf5'}
              >
                <div>
                  <div style={{ fontSize: '14px', color: '#1d1d1b', fontWeight: 500, marginBottom: '4px' }}>Robinet scurgeri</div>
                  <div style={{ fontSize: '12px', color: '#999' }}>Trimis acum 2 zile</div>
                </div>
                <span style={{ fontSize: '12px', padding: '4px 12px', background: '#f8f0e8', color: '#8a5a2d' }}>Nouă</span>
              </div>
            </div>

            <button
              onClick={() => navigate('/chirias/maintenance')}
              style={{ width: '100%', padding: '14px', border: '1px dashed rgba(29,29,27,0.2)', background: 'transparent', cursor: 'pointer', fontFamily: 'Helvetica, sans-serif', fontSize: '14px', color: '#1d1d1b', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              onMouseOver={e => { e.currentTarget.style.background = '#1d1d1b'; e.currentTarget.style.color = '#f9fafa'; e.currentTarget.style.borderColor = '#1d1d1b'; }}
              onMouseOut={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#1d1d1b'; e.currentTarget.style.borderColor = 'rgba(29,29,27,0.2)'; }}
            >
              + Report New Issue
            </button>
          </div>
        </div>

        <div style={{ border: '1px solid rgba(29,29,27,0.12)', padding: '30px 40px', background: '#1d1d1b', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ fontFamily: 'Forum, serif', fontSize: '24px', fontWeight: 400, color: '#f9fafa', margin: '0 0 8px 0' }}>Need Help?</h3>
            <p style={{ fontSize: '14px', color: 'rgba(249,250,250,0.6)', margin: 0 }}>Send a message directly to your property manager.</p>
          </div>
          <button
            onClick={() => navigate('/chirias/message')}
            style={{ background: '#f9fafa', color: '#1d1d1b', border: 'none', padding: '12px 28px', fontSize: '14px', cursor: 'pointer', fontFamily: 'Helvetica, sans-serif', letterSpacing: '0.05em', transition: 'opacity 0.2s' }}
            onMouseOver={e => e.currentTarget.style.opacity = '0.8'}
            onMouseOut={e => e.currentTarget.style.opacity = '1'}
          >
            Message Manager →
          </button>
        </div>

      </div>
    </div>
  );
}