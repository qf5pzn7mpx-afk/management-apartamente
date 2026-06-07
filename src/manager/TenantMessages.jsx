import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../Navbar';

const categoryColors = {
  Maintenance: { bg: '#fff0f0', color: '#cc0000' },
  Invoice: { bg: '#f8f0e8', color: '#8a5a2d' },
  Contract: { bg: '#e8eef8', color: '#2d4a8a' },
  General: { bg: '#f0f0f0', color: '#555' },
};

export default function TenantMessages() {
  const [messages, setMessages] = useState([]);
  const [selected, setSelected] = useState(null);
  const [filtruActiv, setFiltruActiv] = useState('All');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const token = localStorage.getItem('token') || '';
        const response = await fetch('https://management-apartamente-api.onrender.com/api/contact', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.ok) {
          const data = await response.json();
          
          const formattedMessages = data.map(msg => {
            
            let category = 'General';
            let cleanSubject = msg.message || 'No message';
            
            const match = msg.message?.match(/^\[(.*?)\] (.*)/);
            if (match) {
              category = match[1];
              cleanSubject = match[2];
            }

            return {
              id: msg.id,
              tenantId: msg.lastName?.replace(/[^0-9]/g, '') || null, 
              tenantName: msg.firstName || 'Unknown',
              apartment: '—', 
              subject: msg.message?.substring(0, 30) + '...' || 'Contact Form',
              message: cleanSubject,
              date: msg.data_trimiterii?.split(' ')[0] || '',
              time: msg.data_trimiterii?.split(' ')[1] || '',
              unread: true, 
              category: category,
              rawEmail: msg.email
            };
          });

          setMessages(formattedMessages);
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  const handleSelect = (msg) => {
    setSelected(msg);
    setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, unread: false } : m));
  };

  const filtre = ['All', 'Unread', 'Maintenance', 'Invoice', 'Contract', 'General'];

  const messageFiltrate = messages.filter(m => {
    if (filtruActiv === 'All') return true;
    if (filtruActiv === 'Unread') return m.unread;
    return m.category === filtruActiv;
  });

  const unreadCount = messages.filter(m => m.unread).length;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafa', fontFamily: 'Helvetica, sans-serif' }}>
      <Navbar />
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '100px 30px 60px' }}>

        <div style={{ marginBottom: '16px' }}>
          <span style={{ fontSize: '13px', letterSpacing: '0.3em', color: '#888', textTransform: 'uppercase' }}>Manager Panel</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' }}>
          <h1 style={{ fontFamily: 'Forum, serif', fontSize: '64px', fontWeight: 400, color: '#1d1d1b', lineHeight: 1.1, textTransform: 'uppercase', margin: 0 }}>
            Tenant<br />Inbox
          </h1>
          {unreadCount > 0 && (
            <div style={{ background: '#cc0000', color: '#fff', padding: '8px 20px', fontSize: '13px', alignSelf: 'flex-end' }}>
              {unreadCount} unread
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: '0', marginBottom: '2px' }}>
          {filtre.map(f => (
            <button
              key={f}
              onClick={() => setFiltruActiv(f)}
              style={{ padding: '10px 20px', fontSize: '13px', border: '1px solid rgba(29,29,27,0.2)', background: filtruActiv === f ? '#1d1d1b' : '#fff', color: filtruActiv === f ? '#f9fafa' : '#1d1d1b', cursor: 'pointer', fontFamily: 'Helvetica, sans-serif', marginRight: '-1px', transition: 'all 0.2s' }}
            >
              {f}
              {f === 'Unread' && unreadCount > 0 && (
                <span style={{ marginLeft: '6px', background: '#cc0000', color: '#fff', borderRadius: '50%', width: '18px', height: '18px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px' }}>
                  {unreadCount}
                </span>
              )}
            </button>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: selected ? '380px 1fr' : '1fr', gap: '2px' }}>

          <div style={{ border: '1px solid rgba(29,29,27,0.12)', background: '#fff' }}>
            {!selected && (
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 100px', padding: '12px 24px', background: '#fcfdf5', borderBottom: '1px solid rgba(29,29,27,0.08)' }}>
                {['FROM', 'SUBJECT', 'DATE', ''].map(col => (
                  <span key={col} style={{ fontSize: '11px', letterSpacing: '0.2em', color: '#999', textTransform: 'uppercase' }}>{col}</span>
                ))}
              </div>
            )}

            {loading ? (
              <div style={{ padding: '60px', textAlign: 'center', color: '#999', fontSize: '14px' }}>Loading messages...</div>
            ) : messageFiltrate.length === 0 ? (
              <div style={{ padding: '60px', textAlign: 'center', color: '#999', fontSize: '14px' }}>No messages found.</div>
            ) : (
              messageFiltrate.map((msg, i) => (
                <div
                  key={msg.id}
                  onClick={() => handleSelect(msg)}
                  style={{
                    padding: selected ? '16px 20px' : '20px 24px',
                    borderBottom: i < messageFiltrate.length - 1 ? '1px solid rgba(29,29,27,0.06)' : 'none',
                    cursor: 'pointer',
                    background: selected?.id === msg.id ? '#f5f0eb' : msg.unread ? '#fcfdf5' : '#fff',
                    transition: 'background 0.15s',
                    display: selected ? 'block' : 'grid',
                    gridTemplateColumns: selected ? 'none' : '2fr 1fr 1fr 100px',
                    alignItems: 'center',
                    gap: selected ? '0' : '0',
                  }}
                  onMouseOver={e => { if (selected?.id !== msg.id) e.currentTarget.style.background = '#fcfdf5'; }}
                  onMouseOut={e => { if (selected?.id !== msg.id) e.currentTarget.style.background = msg.unread ? '#fcfdf5' : '#fff'; }}
                >
                  {selected ? (
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                        {msg.unread && <div style={{ width: '6px', height: '6px', background: '#cc0000', borderRadius: '50%', flexShrink: 0 }} />}
                        <span style={{ fontSize: '14px', color: '#1d1d1b', fontWeight: msg.unread ? 600 : 400 }}>{msg.tenantName}</span>
                      </div>
                      <div style={{ fontSize: '12px', color: '#555', marginBottom: '2px', paddingLeft: msg.unread ? '16px' : '0' }}>{msg.subject}</div>
                      <div style={{ fontSize: '11px', color: '#999', paddingLeft: msg.unread ? '16px' : '0' }}>{msg.date}</div>
                    </div>
                  ) : (
                    <>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        {msg.unread && <div style={{ width: '6px', height: '6px', background: '#cc0000', borderRadius: '50%', flexShrink: 0 }} />}
                        <div>
                          <div style={{ fontSize: '15px', color: '#1d1d1b', fontWeight: msg.unread ? 600 : 400 }}>{msg.tenantName}</div>
                          <div style={{ fontSize: '12px', color: '#999' }}>{msg.rawEmail}</div>
                        </div>
                      </div>
                      <div style={{ fontSize: '14px', color: '#555', paddingRight: '20px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{msg.subject}</div>
                      <div style={{ fontSize: '13px', color: '#999' }}>{msg.date}</div>
                      <span style={{ display: 'inline-block', padding: '3px 10px', fontSize: '11px', background: categoryColors[msg.category]?.bg || '#f0f0f0', color: categoryColors[msg.category]?.color || '#555' }}>
                        {msg.category}
                      </span>
                    </>
                  )}
                </div>
              ))
            )}
          </div>

          {selected && (
            <div style={{ border: '1px solid rgba(29,29,27,0.12)', background: '#fff', display: 'flex', flexDirection: 'column' }}>
              <div style={{ padding: '24px 30px', borderBottom: '1px solid rgba(29,29,27,0.08)', background: '#fcfdf5', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: '11px', letterSpacing: '0.2em', color: '#999', textTransform: 'uppercase', marginBottom: '8px' }}>Message</div>
                  <h3 style={{ fontFamily: 'Forum, serif', fontSize: '22px', fontWeight: 400, color: '#1d1d1b', margin: '0 0 8px 0' }}>{selected.subject}</h3>
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <span style={{ fontSize: '13px', color: '#555' }}>From: <strong>{selected.tenantName}</strong> ({selected.rawEmail})</span>
                    <span style={{ display: 'inline-block', padding: '3px 10px', fontSize: '11px', background: categoryColors[selected.category]?.bg || '#f0f0f0', color: categoryColors[selected.category]?.color || '#555' }}>
                      {selected.category}
                    </span>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '13px', color: '#999' }}>{selected.date}</div>
                  <div style={{ fontSize: '13px', color: '#999' }}>{selected.time}</div>
                </div>
              </div>

              <div style={{ padding: '30px', flex: 1 }}>
                <p style={{ fontSize: '15px', color: '#1d1d1b', lineHeight: 1.8, margin: 0 }}>{selected.message}</p>
              </div>

              <div style={{ padding: '20px 30px', borderTop: '1px solid rgba(29,29,27,0.08)', display: 'flex', gap: '12px' }}>
                {selected.tenantId && selected.tenantId !== '?' && (
                  <Link
                    to={`/manager/tenants/${selected.tenantId}`}
                    style={{ padding: '10px 20px', border: '1px solid rgba(29,29,27,0.2)', fontSize: '13px', color: '#1d1d1b', textDecoration: 'none', transition: 'all 0.2s' }}
                    onMouseOver={e => { e.currentTarget.style.background = '#1d1d1b'; e.currentTarget.style.color = '#f9fafa'; }}
                    onMouseOut={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#1d1d1b'; }}
                  >
                    View Tenant Profile →
                  </Link>
                )}
                {selected.category === 'Maintenance' && (
                  <Link
                    to="/mentenanta"
                    style={{ padding: '10px 20px', border: '1px solid #ffcccc', background: '#fff0f0', fontSize: '13px', color: '#cc0000', textDecoration: 'none' }}
                  >
                    Go to Maintenance →
                  </Link>
                )}
                {selected.category === 'Invoice' && (
                  <Link
                    to="/facturi"
                    style={{ padding: '10px 20px', border: '1px solid #f0d0a0', background: '#f8f0e8', fontSize: '13px', color: '#8a5a2d', textDecoration: 'none' }}
                  >
                    Go to Invoices →
                  </Link>
                )}
                <button
                  onClick={() => setSelected(null)}
                  style={{ marginLeft: 'auto', padding: '10px 20px', border: 'none', background: 'none', fontSize: '13px', color: '#999', cursor: 'pointer', fontFamily: 'Helvetica, sans-serif' }}
                >
                  ✕ Close
                </button>
              </div>
            </div>
          )}
        </div>

        <div style={{ border: '1px solid rgba(29,29,27,0.12)', background: '#fcfdf5', padding: '16px 24px', marginTop: '2px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '13px', color: '#999' }}>
            Showing <strong style={{ color: '#1d1d1b' }}>{messageFiltrate.length}</strong> of <strong style={{ color: '#1d1d1b' }}>{messages.length}</strong> messages
          </span>
          <Link to="/manager/dashboard" style={{ fontSize: '13px', color: '#1d1d1b', textDecoration: 'none', borderBottom: '1px solid #1d1d1b', paddingBottom: '1px' }}>
            ← Back to Dashboard
          </Link>
        </div>

      </div>
    </div>
  );
}