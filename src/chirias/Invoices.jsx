import { useContext, useEffect, useState } from 'react';
import Navbar from '../Navbar';
import { AuthContext } from '../AuthContext';
import mockApi from '../api/mockApi';

export default function ChiriasInvoices() {
  const { user } = useContext(AuthContext) || {};
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtruActiv, setFiltruActiv] = useState('All');
  const [platModal, setPlatModal] = useState(null);
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [paying, setPaying] = useState(false);
  const [platitIds, setPlatitIds] = useState([]);

  useEffect(() => {
    if (!user) return;
    mockApi.getInvoices({ tenantId: user.id })
      .then(data => setInvoices(Array.isArray(data) ? data : []))
      .catch(() => setInvoices([]))
      .finally(() => setLoading(false));
  }, [user]);

  const getStatusBg = (status) => {
    if (status === 'Plătită' || platitIds.includes(status?.id)) return '#e8f4e8';
    if (status === 'În așteptare') return '#f8f0e8';
    return '#fff0f0';
  };

  const getStatusColor = (status) => {
    if (status === 'Plătită') return '#2d7a2d';
    if (status === 'În așteptare') return '#8a5a2d';
    return '#cc0000';
  };

  const filtre = ['All', 'Plătită', 'Neplătită', 'În așteptare'];

  const invoicesFiltrate = filtruActiv === 'All'
    ? invoices
    : invoices.filter(i => {
        const status = platitIds.includes(i.id) ? 'Plătită' : (i.status || 'Neplătită');
        return status === filtruActiv;
      });

  const totalDatorat = invoices
    .filter(i => !platitIds.includes(i.id) && i.status !== 'Plătită')
    .reduce((sum, i) => sum + parseFloat(i.suma || i.amount || 0), 0);

  const handlePay = () => {
    if (!cardNumber || !cardName || !cardExpiry || !cardCvv) return;
    setPaying(true);
    setTimeout(() => {
      setPlatitIds(prev => [...prev, platModal.id]);
      setPaying(false);
      setPlatModal(null);
      setCardNumber('');
      setCardName('');
      setCardExpiry('');
      setCardCvv('');
    }, 1500);
  };

  const formatCard = (val) => {
    return val.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
  };

  const formatExpiry = (val) => {
    const clean = val.replace(/\D/g, '').slice(0, 4);
    if (clean.length >= 3) return clean.slice(0, 2) + '/' + clean.slice(2);
    return clean;
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafa', fontFamily: 'Helvetica, sans-serif' }}>
      <Navbar />
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '100px 30px 60px' }}>

        <div style={{ marginBottom: '16px' }}>
          <span style={{ fontSize: '13px', letterSpacing: '0.3em', color: '#888', textTransform: 'uppercase' }}>Tenant Portal</span>
        </div>
        <h1 style={{ fontFamily: 'Forum, serif', fontSize: '64px', fontWeight: 400, color: '#1d1d1b', lineHeight: 1.1, textTransform: 'uppercase', margin: '0 0 60px 0' }}>
          My<br />Invoices
        </h1>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2px', marginBottom: '2px' }}>
          {[
            { label: 'TOTAL INVOICES', value: invoices.length },
            { label: 'UNPAID', value: invoices.filter(i => !platitIds.includes(i.id) && i.status !== 'Plătită').length },
            { label: 'AMOUNT DUE', value: `${totalDatorat} RON` },
          ].map(stat => (
            <div key={stat.label} style={{ border: '1px solid rgba(29,29,27,0.12)', padding: '30px', background: '#fff', textAlign: 'center' }}>
              <div style={{ fontSize: '11px', letterSpacing: '0.25em', color: '#999', textTransform: 'uppercase', marginBottom: '12px' }}>{stat.label}</div>
              <div style={{ fontFamily: 'Forum, serif', fontSize: '40px', color: '#1d1d1b', lineHeight: 1 }}>{loading ? '—' : stat.value}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '2px 0' }}>
          <div style={{ display: 'flex' }}>
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
        </div>

        <div style={{ border: '1px solid rgba(29,29,27,0.12)', background: '#fff' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr 1fr 1fr 1fr 120px', padding: '14px 24px', background: '#fcfdf5', borderBottom: '1px solid rgba(29,29,27,0.08)' }}>
            {['ID', 'DESCRIPTION', 'AMOUNT', 'DATE', 'STATUS', ''].map(col => (
              <span key={col} style={{ fontSize: '11px', letterSpacing: '0.2em', color: '#999', textTransform: 'uppercase' }}>{col}</span>
            ))}
          </div>

          {loading ? (
            <div style={{ padding: '60px', textAlign: 'center', color: '#999' }}>Loading...</div>
          ) : invoicesFiltrate.length === 0 ? (
            <div style={{ padding: '60px', textAlign: 'center', color: '#999' }}>No invoices found.</div>
          ) : (
            invoicesFiltrate.map((inv, i) => {
              const isPaid = platitIds.includes(inv.id) || inv.status === 'Plătită';
              const status = isPaid ? 'Plătită' : (inv.status || 'Neplătită');
              return (
                <div
                  key={inv.id}
                  style={{ display: 'grid', gridTemplateColumns: '80px 1fr 1fr 1fr 1fr 120px', padding: '20px 24px', borderBottom: i < invoicesFiltrate.length - 1 ? '1px solid rgba(29,29,27,0.06)' : 'none', alignItems: 'center', transition: 'background 0.15s' }}
                  onMouseOver={e => e.currentTarget.style.background = '#fcfdf5'}
                  onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                >
                  <span style={{ fontSize: '14px', color: '#999' }}>#{inv.id}</span>
                  <span style={{ fontSize: '14px', color: '#1d1d1b' }}>{inv.description || inv.tip || '—'}</span>
                  <span style={{ fontSize: '15px', color: '#1d1d1b', fontWeight: 600 }}>{inv.suma || inv.amount || '—'} RON</span>
                  <span style={{ fontSize: '14px', color: '#555' }}>{inv.data_emiterii || inv.data || '—'}</span>
                  <span style={{ display: 'inline-block', padding: '4px 14px', fontSize: '13px', background: getStatusBg(status), color: getStatusColor(status) }}>
                    {status}
                  </span>
                  {!isPaid ? (
                    <button
                      onClick={() => setPlatModal(inv)}
                      style={{ background: '#1d1d1b', color: '#f9fafa', border: 'none', padding: '8px 16px', fontSize: '13px', cursor: 'pointer', fontFamily: 'Helvetica, sans-serif', transition: 'opacity 0.2s' }}
                      onMouseOver={e => e.currentTarget.style.opacity = '0.8'}
                      onMouseOut={e => e.currentTarget.style.opacity = '1'}
                    >
                      Pay Now
                    </button>
                  ) : (
                    <span style={{ fontSize: '13px', color: '#2d7a2d' }}>✓ Paid</span>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {platModal && (
        <div
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
          onClick={() => setPlatModal(null)}
        >
          <div
            style={{ background: '#fff', width: '100%', maxWidth: '520px', padding: '0', overflow: 'hidden' }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ background: '#1d1d1b', padding: '30px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '11px', letterSpacing: '0.2em', color: 'rgba(249,250,250,0.5)', textTransform: 'uppercase', marginBottom: '6px' }}>Payment</div>
                <h3 style={{ fontFamily: 'Forum, serif', fontSize: '28px', fontWeight: 400, color: '#f9fafa', margin: 0 }}>Invoice #{platModal.id}</h3>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '11px', letterSpacing: '0.2em', color: 'rgba(249,250,250,0.5)', textTransform: 'uppercase', marginBottom: '6px' }}>Amount Due</div>
                <div style={{ fontFamily: 'Forum, serif', fontSize: '32px', color: '#f9fafa' }}>{platModal.suma || platModal.amount} RON</div>
              </div>
            </div>

            <div style={{ padding: '40px' }}>
              <div style={{ background: '#fcfdf5', border: '1px solid rgba(29,29,27,0.08)', padding: '20px', marginBottom: '30px', borderRadius: '2px' }}>
                <div style={{ fontSize: '11px', letterSpacing: '0.15em', color: '#999', textTransform: 'uppercase', marginBottom: '8px' }}>Invoice Details</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#1d1d1b' }}>
                  <span>{platModal.tip || platModal.description || 'Invoice'}</span>
                  <strong>{platModal.suma || platModal.amount} RON</strong>
                </div>
                {platModal.data_scadentei && (
                  <div style={{ fontSize: '12px', color: '#999', marginTop: '6px' }}>Due: {platModal.data_scadentei}</div>
                )}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div>
                  <label style={{ fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#999', display: 'block', marginBottom: '8px' }}>Card Number</label>
                  <input
                    value={cardNumber}
                    onChange={e => setCardNumber(formatCard(e.target.value))}
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                    style={{ width: '100%', padding: '12px 0', border: 'none', borderBottom: '1px solid rgba(29,29,27,0.2)', background: 'transparent', fontSize: '16px', color: '#1d1d1b', outline: 'none', fontFamily: 'Helvetica, sans-serif', letterSpacing: '0.1em', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#999', display: 'block', marginBottom: '8px' }}>Cardholder Name</label>
                  <input
                    value={cardName}
                    onChange={e => setCardName(e.target.value)}
                    placeholder="Ion Popescu"
                    style={{ width: '100%', padding: '12px 0', border: 'none', borderBottom: '1px solid rgba(29,29,27,0.2)', background: 'transparent', fontSize: '16px', color: '#1d1d1b', outline: 'none', fontFamily: 'Helvetica, sans-serif', boxSizing: 'border-box' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                  <div>
                    <label style={{ fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#999', display: 'block', marginBottom: '8px' }}>Expiry Date</label>
                    <input
                      value={cardExpiry}
                      onChange={e => setCardExpiry(formatExpiry(e.target.value))}
                      placeholder="MM/YY"
                      maxLength={5}
                      style={{ width: '100%', padding: '12px 0', border: 'none', borderBottom: '1px solid rgba(29,29,27,0.2)', background: 'transparent', fontSize: '16px', color: '#1d1d1b', outline: 'none', fontFamily: 'Helvetica, sans-serif', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#999', display: 'block', marginBottom: '8px' }}>CVV</label>
                    <input
                      value={cardCvv}
                      onChange={e => setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                      placeholder="123"
                      maxLength={3}
                      type="password"
                      style={{ width: '100%', padding: '12px 0', border: 'none', borderBottom: '1px solid rgba(29,29,27,0.2)', background: 'transparent', fontSize: '16px', color: '#1d1d1b', outline: 'none', fontFamily: 'Helvetica, sans-serif', boxSizing: 'border-box' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '14px 16px', background: '#f0fff0', border: '1px solid #ccffcc' }}>
                  <span style={{ fontSize: '16px' }}>🔒</span>
                  <span style={{ fontSize: '12px', color: '#555' }}>Your payment is secured with 256-bit SSL encryption</span>
                </div>

                <div style={{ display: 'flex', gap: '12px', paddingTop: '10px' }}>
                  <button
                    onClick={() => setPlatModal(null)}
                    style={{ flex: 1, padding: '14px', border: '1px solid rgba(29,29,27,0.2)', background: '#fff', fontSize: '14px', color: '#1d1d1b', cursor: 'pointer', fontFamily: 'Helvetica, sans-serif', transition: 'all 0.2s' }}
                    onMouseOver={e => e.currentTarget.style.background = '#f9fafa'}
                    onMouseOut={e => e.currentTarget.style.background = '#fff'}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handlePay}
                    disabled={paying}
                    style={{ flex: 2, padding: '14px', border: 'none', background: paying ? '#999' : '#1d1d1b', fontSize: '14px', color: '#f9fafa', cursor: paying ? 'not-allowed' : 'pointer', fontFamily: 'Helvetica, sans-serif', letterSpacing: '0.05em', transition: 'opacity 0.2s' }}
                    onMouseOver={e => { if (!paying) e.currentTarget.style.opacity = '0.8'; }}
                    onMouseOut={e => e.currentTarget.style.opacity = '1'}
                  >
                    {paying ? 'Processing...' : `Pay ${platModal.suma || platModal.amount} RON`}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}