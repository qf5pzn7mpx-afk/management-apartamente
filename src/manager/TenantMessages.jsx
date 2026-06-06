import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../Navbar';
import mockApi from '../api/mockApi';

const mockMessages = [
  { id: 1, tenantId: 1, tenantName: 'Ioana Popescu', apartment: '3A', message: 'Buna ziua, am o problema cu caloriferul din dormitor, nu mai incalzeste.', time: '10:24', date: 'Today', unread: true },
  { id: 2, tenantId: 2, tenantName: 'Andrei Ionescu', apartment: '5B', message: 'Multumesc pentru reparatia rapida la usa!', time: '09:11', date: 'Today', unread: false },
  { id: 3, tenantId: 3, tenantName: 'Maria Georgescu', apartment: '2C', message: 'Cand vine factura pentru luna aceasta?', time: 'Yesterday', date: 'Yesterday', unread: true },
];

export default function TenantMessages() {
  const [tenants, setTenants] = useState([]);
  const [selectedTenant, setSelectedTenant] = useState(null);
  const [messages, setMessages] = useState(mockMessages);
  const [newMessage, setNewMessage] = useState('');
  const [conversation, setConversation] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    mockApi.getTenants()
      .then(data => setTenants(Array.isArray(data) ? data : []))
      .catch(() => setTenants([]));
  }, []);

  const mockConversations = {
    1: [
      { id: 1, from: 'tenant', text: 'Buna ziua, am o problema cu caloriferul din dormitor, nu mai incalzeste.', time: '10:24' },
      { id: 2, from: 'manager', text: 'Buna ziua! Trimitem un tehnician maine intre 10-12. Va rog sa fiti acasa.', time: '10:45' },
      { id: 3, from: 'tenant', text: 'Multumesc, voi fi acasa!', time: '10:47' },
    ],
    2: [
      { id: 1, from: 'tenant', text: 'Multumesc pentru reparatia rapida la usa!', time: '09:11' },
      { id: 2, from: 'manager', text: 'Cu placere! Anuntati-ne daca mai aveti nevoie de ceva.', time: '09:30' },
    ],
    3: [
      { id: 1, from: 'tenant', text: 'Cand vine factura pentru luna aceasta?', time: 'Yesterday' },
    ],
  };

  const handleSelectTenant = (msg) => {
    setSelectedTenant(msg);
    setConversation(mockConversations[msg.tenantId] || []);
    setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, unread: false } : m));
  };

  const handleSend = () => {
    if (!newMessage.trim()) return;
    const nou = { id: Date.now(), from: 'manager', text: newMessage, time: new Date().toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit' }) };
    setConversation(prev => [...prev, nou]);
    setNewMessage('');
  };

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
            Tenant<br />Messages
          </h1>
          {unreadCount > 0 && (
            <div style={{ background: '#cc0000', color: '#fff', padding: '8px 20px', fontSize: '13px', fontFamily: 'Helvetica, sans-serif' }}>
              {unreadCount} unread message{unreadCount > 1 ? 's' : ''}
            </div>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: '2px', height: '600px' }}>

          <div style={{ border: '1px solid rgba(29,29,27,0.12)', background: '#fff', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(29,29,27,0.08)', background: '#fcfdf5' }}>
              <span style={{ fontSize: '11px', letterSpacing: '0.25em', color: '#999', textTransform: 'uppercase' }}>Conversations</span>
            </div>
            <div style={{ overflowY: 'auto', flex: 1 }}>
              {messages.map(msg => (
                <div
                  key={msg.id}
                  onClick={() => handleSelectTenant(msg)}
                  style={{
                    padding: '18px 20px',
                    borderBottom: '1px solid rgba(29,29,27,0.06)',
                    cursor: 'pointer',
                    background: selectedTenant?.id === msg.id ? '#f5f0eb' : msg.unread ? '#fcfdf5' : '#fff',
                    transition: 'background 0.15s',
                    display: 'flex',
                    gap: '12px',
                    alignItems: 'flex-start',
                  }}
                  onMouseOver={e => { if (selectedTenant?.id !== msg.id) e.currentTarget.style.background = '#f9faf5'; }}
                  onMouseOut={e => { if (selectedTenant?.id !== msg.id) e.currentTarget.style.background = msg.unread ? '#fcfdf5' : '#fff'; }}
                >
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#1d1d1b', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span style={{ color: '#f9fafa', fontSize: '14px', fontWeight: 600 }}>
                      {msg.tenantName[0]}
                    </span>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <span style={{ fontSize: '14px', color: '#1d1d1b', fontWeight: msg.unread ? 600 : 400 }}>{msg.tenantName}</span>
                      <span style={{ fontSize: '11px', color: '#999' }}>{msg.time}</span>
                    </div>
                    <div style={{ fontSize: '12px', color: '#888', marginBottom: '4px' }}>Apt. {msg.apartment}</div>
                    <div style={{ fontSize: '13px', color: '#555', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {msg.message}
                    </div>
                    {msg.unread && (
                      <div style={{ width: '8px', height: '8px', background: '#cc0000', borderRadius: '50%', marginTop: '6px' }} />
                    )}
                  </div>
                </div>
              ))}

              {tenants.filter(t => !messages.find(m => m.tenantId === t.id)).map(t => (
                <div
                  key={t.id}
                  onClick={() => handleSelectTenant({ id: t.id + 100, tenantId: t.id, tenantName: t.nume || t.name, apartment: t.apartament_id || '—', message: 'No messages yet', time: '', unread: false })}
                  style={{ padding: '18px 20px', borderBottom: '1px solid rgba(29,29,27,0.06)', cursor: 'pointer', background: '#fff', display: 'flex', gap: '12px', alignItems: 'center', transition: 'background 0.15s' }}
                  onMouseOver={e => e.currentTarget.style.background = '#fcfdf5'}
                  onMouseOut={e => e.currentTarget.style.background = '#fff'}
                >
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(29,29,27,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span style={{ color: '#1d1d1b', fontSize: '14px', fontWeight: 600 }}>
                      {(t.nume || t.name || '?')[0].toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <div style={{ fontSize: '14px', color: '#1d1d1b' }}>{t.nume || t.name}</div>
                    <div style={{ fontSize: '12px', color: '#999' }}>Apt. {t.apartament_id || '—'} · No messages</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {selectedTenant ? (
            <div style={{ border: '1px solid rgba(29,29,27,0.12)', background: '#fff', display: 'flex', flexDirection: 'column' }}>
              <div style={{ padding: '16px 24px', borderBottom: '1px solid rgba(29,29,27,0.08)', background: '#fcfdf5', display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#1d1d1b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ color: '#f9fafa', fontSize: '13px', fontWeight: 600 }}>{selectedTenant.tenantName[0]}</span>
                </div>
                <div>
                  <div style={{ fontSize: '15px', color: '#1d1d1b', fontWeight: 500 }}>{selectedTenant.tenantName}</div>
                  <div style={{ fontSize: '12px', color: '#999' }}>Apt. {selectedTenant.apartment}</div>
                </div>
                <Link
                  to={`/manager/tenants/${selectedTenant.tenantId}`}
                  style={{ marginLeft: 'auto', fontSize: '13px', color: '#1d1d1b', textDecoration: 'none', borderBottom: '1px solid #1d1d1b', paddingBottom: '1px' }}
                >
                  View Profile →
                </Link>
              </div>

              <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {conversation.length === 0 ? (
                  <div style={{ textAlign: 'center', color: '#999', fontSize: '14px', marginTop: '40px' }}>
                    No messages yet. Start the conversation!
                  </div>
                ) : (
                  conversation.map(msg => (
                    <div
                      key={msg.id}
                      style={{ display: 'flex', flexDirection: msg.from === 'manager' ? 'row-reverse' : 'row', gap: '10px', alignItems: 'flex-end' }}
                    >
                      <div style={{
                        maxWidth: '70%',
                        padding: '12px 16px',
                        background: msg.from === 'manager' ? '#1d1d1b' : '#f5f0eb',
                        color: msg.from === 'manager' ? '#f9fafa' : '#1d1d1b',
                        fontSize: '14px',
                        lineHeight: 1.6,
                      }}>
                        {msg.text}
                        <div style={{ fontSize: '11px', color: msg.from === 'manager' ? 'rgba(249,250,250,0.5)' : '#999', marginTop: '6px', textAlign: 'right' }}>
                          {msg.time}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div style={{ padding: '16px 24px', borderTop: '1px solid rgba(29,29,27,0.08)', display: 'flex', gap: '12px', alignItems: 'center' }}>
                <input
                  value={newMessage}
                  onChange={e => setNewMessage(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSend()}
                  placeholder="Type a message..."
                  style={{ flex: 1, padding: '12px 16px', border: '1px solid rgba(29,29,27,0.2)', background: '#fcfdf5', fontSize: '14px', color: '#1d1d1b', outline: 'none', fontFamily: 'Helvetica, sans-serif' }}
                />
                <button
                  onClick={handleSend}
                  style={{ background: '#1d1d1b', color: '#f9fafa', border: 'none', padding: '12px 24px', fontSize: '14px', cursor: 'pointer', fontFamily: 'Helvetica, sans-serif', transition: 'opacity 0.2s', whiteSpace: 'nowrap' }}
                  onMouseOver={e => e.currentTarget.style.opacity = '0.8'}
                  onMouseOut={e => e.currentTarget.style.opacity = '1'}
                >
                  Send →
                </button>
              </div>
            </div>
          ) : (
            <div style={{ border: '1px solid rgba(29,29,27,0.12)', background: '#fcfdf5', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
              <div style={{ fontSize: '48px' }}>💬</div>
              <h3 style={{ fontFamily: 'Forum, serif', fontSize: '24px', fontWeight: 400, color: '#1d1d1b', margin: 0 }}>Select a Conversation</h3>
              <p style={{ fontSize: '14px', color: '#999', margin: 0 }}>Choose a tenant from the left to view messages</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}