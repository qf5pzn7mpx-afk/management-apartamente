import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Navbar from '../Navbar';

export default function TenantDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tenant, setTenant] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newInvoice, setNewInvoice] = useState({ amount: '', description: '' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token') || '';
        
        // Căutăm toți chiriașii și îl găsim pe cel corect după ID
        const tenantsRes = await fetch('https://management-apartamente-api.onrender.com/api/chiriasi', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        // Luăm facturile
        const invoicesRes = await fetch('https://management-apartamente-api.onrender.com/api/facturi', {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (tenantsRes.ok && invoicesRes.ok) {
          const tenantsData = await tenantsRes.json();
          const invoicesData = await invoicesRes.json();
          
          const foundTenant = tenantsData.find(t => t.id.toString() === id.toString());
          setTenant(foundTenant || null);
          
          // Filtrăm doar facturile acestui chiriaș
          const tenantInvoices = invoicesData.filter(i => i.chirias_id?.toString() === id.toString());
          setInvoices(tenantInvoices);
        }
      } catch (error) {
        console.error('Error fetching details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const addInvoice = async () => {
    if (!newInvoice.amount || !newInvoice.description) return;
    
    try {
      const token = localStorage.getItem('token');
      const payload = { 
        chirias_id: Number(id), 
        suma: Number(newInvoice.amount), 
        tip: newInvoice.description,
        data_emiterii: new Date().toISOString().split('T')[0],
        data_scadentei: new Date(Date.now() + 30*24*60*60*1000).toISOString().split('T')[0],
        status: 'Neplătită'
      };

      const response = await fetch('https://management-apartamente-api.onrender.com/api/facturi', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const result = await response.json();
        const createdInvoice = { id: result.id, ...payload };
        // Mapăm pentru a se potrivi vizual cu ce afișezi jos
        createdInvoice.amount = payload.suma;
        createdInvoice.description = payload.tip;
        
        setInvoices(s => [createdInvoice, ...s]);
        setNewInvoice({ amount: '', description: '' });
      }
    } catch (error) {
      console.error('Error adding invoice:', error);
    }
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafa', fontFamily: 'Helvetica, sans-serif' }}>
      <Navbar />
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '100px 30px', textAlign: 'center', color: '#999' }}>Loading...</div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafa', fontFamily: 'Helvetica, sans-serif' }}>
      <Navbar />
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '100px 30px 60px' }}>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '60px' }}>
          <div>
            <span style={{ fontSize: '13px', letterSpacing: '0.3em', color: '#888', textTransform: 'uppercase', display: 'block', marginBottom: '16px' }}>Tenant Details</span>
            <h1 style={{ fontFamily: 'Forum, serif', fontSize: '64px', fontWeight: 400, color: '#1d1d1b', lineHeight: 1.1, textTransform: 'uppercase', margin: 0 }}>
              {tenant ? (tenant.nume || tenant.name) : 'Unknown'}
            </h1>
          </div>
          <Link to="/manager/tenants" style={{ fontSize: '14px', color: '#1d1d1b', textDecoration: 'none', borderBottom: '1px solid #1d1d1b', paddingBottom: '2px', marginTop: '8px' }}>
            ← All Tenants
          </Link>
        </div>

        {tenant && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2px', marginBottom: '2px' }}>
            {[
              { label: 'APARTMENT', value: tenant.apartament_id || tenant.apartament_numar || '—' },
              { label: 'EMAIL', value: tenant.email || '—' },
              { label: 'PHONE', value: tenant.telefon || '—' },
              { label: 'STATUS', value: 'Active' },
            ].map(item => (
              <div key={item.label} style={{ border: '1px solid rgba(29,29,27,0.12)', padding: '24px', background: '#fff' }}>
                <div style={{ fontSize: '11px', letterSpacing: '0.2em', color: '#999', textTransform: 'uppercase', marginBottom: '10px' }}>{item.label}</div>
                <div style={{ fontSize: '16px', color: '#1d1d1b', fontWeight: 500, wordBreak: 'break-all' }}>{item.value}</div>
              </div>
            ))}
          </div>
        )}

        <div style={{ border: '1px solid rgba(29,29,27,0.12)', background: '#fff', marginBottom: '2px' }}>
          <div style={{ padding: '30px', borderBottom: '1px solid rgba(29,29,27,0.08)' }}>
            <span style={{ fontSize: '11px', letterSpacing: '0.25em', color: '#999', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Invoices</span>
            <h3 style={{ fontFamily: 'Forum, serif', fontSize: '28px', fontWeight: 400, color: '#1d1d1b', margin: 0 }}>Add New Invoice</h3>
          </div>
          <div style={{ padding: '30px', display: 'grid', gridTemplateColumns: '1fr 2fr auto', gap: '16px', alignItems: 'end', borderBottom: '1px solid rgba(29,29,27,0.08)' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11px', letterSpacing: '0.2em', color: '#999', textTransform: 'uppercase', marginBottom: '8px' }}>Amount (RON)</label>
              <input
                type="number"
                value={newInvoice.amount}
                onChange={e => setNewInvoice({ ...newInvoice, amount: e.target.value })}
                placeholder="500"
                style={{ width: '100%', padding: '10px 0', border: 'none', borderBottom: '1px solid rgba(29,29,27,0.2)', background: 'transparent', fontSize: '16px', color: '#1d1d1b', outline: 'none', fontFamily: 'Helvetica, sans-serif', boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '11px', letterSpacing: '0.2em', color: '#999', textTransform: 'uppercase', marginBottom: '8px' }}>Description</label>
              <input
                type="text"
                value={newInvoice.description}
                onChange={e => setNewInvoice({ ...newInvoice, description: e.target.value })}
                placeholder="Rent for January 2025"
                style={{ width: '100%', padding: '10px 0', border: 'none', borderBottom: '1px solid rgba(29,29,27,0.2)', background: 'transparent', fontSize: '16px', color: '#1d1d1b', outline: 'none', fontFamily: 'Helvetica, sans-serif', boxSizing: 'border-box' }}
              />
            </div>
            <button
              onClick={addInvoice}
              style={{ background: '#1d1d1b', color: '#f9fafa', border: 'none', padding: '12px 28px', fontSize: '13px', cursor: 'pointer', fontFamily: 'Helvetica, sans-serif', letterSpacing: '0.05em', whiteSpace: 'nowrap', transition: 'opacity 0.2s' }}
              onMouseOver={e => e.currentTarget.style.opacity = '0.8'}
              onMouseOut={e => e.currentTarget.style.opacity = '1'}
            >
              + Add Invoice
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', padding: '12px 30px', background: '#fcfdf5', borderBottom: '1px solid rgba(29,29,27,0.08)' }}>
            {['DESCRIPTION', 'AMOUNT', 'STATUS'].map(col => (
              <span key={col} style={{ fontSize: '11px', letterSpacing: '0.2em', color: '#999', textTransform: 'uppercase' }}>{col}</span>
            ))}
          </div>

          {invoices.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#999', fontSize: '14px' }}>No invoices yet.</div>
          ) : (
            invoices.map((inv, i) => (
              <div
                key={inv.id}
                style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', padding: '18px 30px', borderBottom: i < invoices.length - 1 ? '1px solid rgba(29,29,27,0.06)' : 'none', alignItems: 'center' }}
                onMouseOver={e => e.currentTarget.style.background = '#fcfdf5'}
                onMouseOut={e => e.currentTarget.style.background = 'transparent'}
              >
                <span style={{ fontSize: '15px', color: '#1d1d1b' }}>{inv.description || inv.tip || '—'}</span>
                <span style={{ fontSize: '15px', color: '#1d1d1b', fontWeight: 600 }}>{inv.amount || inv.suma} RON</span>
                <span style={{ display: 'inline-block', padding: '4px 14px', fontSize: '13px', background: inv.status === 'Plătită' ? '#e8f4e8' : '#fff0f0', color: inv.status === 'Plătită' ? '#2d7a2d' : '#cc0000', width: 'fit-content' }}>
                  {inv.status || 'Unpaid'}
                </span>
              </div>
            ))
          )}
        </div>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button
            onClick={() => navigate('/manager/tenants')}
            style={{ background: 'none', border: '1px solid rgba(29,29,27,0.2)', color: '#1d1d1b', padding: '12px 28px', fontSize: '13px', cursor: 'pointer', fontFamily: 'Helvetica, sans-serif', transition: 'all 0.2s' }}
            onMouseOver={e => { e.currentTarget.style.background = '#1d1d1b'; e.currentTarget.style.color = '#f9fafa'; }}
            onMouseOut={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = '#1d1d1b'; }}
          >
            ← Back to Tenants
          </button>
        </div>
      </div>
    </div>
  );
}