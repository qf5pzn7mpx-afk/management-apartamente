import { useState } from 'react';
import Navbar from './Navbar';

function Contact() {
  const [nume, setNume] = useState('');
  const [email, setEmail] = useState('');
  const [subiect, setSubiect] = useState('');
  const [mesaj, setMesaj] = useState('');
  const [eroare, setEroare] = useState('');
  const [succes, setSucces] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleTrimite = () => {
    if (!nume || !email || !mesaj) {
      setEroare('Numele, emailul și mesajul sunt obligatorii!');
      return;
    }
    setLoading(true);
    setEroare('');
    setTimeout(() => {
      setSucces(true);
      setNume('');
      setEmail('');
      setSubiect('');
      setMesaj('');
      setLoading(false);
    }, 700);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafa', fontFamily: 'Helvetica, sans-serif' }}>
      <Navbar />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: '100vh' }}>

        <div style={{ background: '#1d1d1b', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '120px 80px' }}>
          <span style={{ fontSize: '13px', letterSpacing: '0.3em', color: 'rgba(249,250,250,0.5)', textTransform: 'uppercase', marginBottom: '24px', display: 'block' }}>
            Contact
          </span>
          <h1 style={{ fontFamily: 'Forum, serif', fontSize: '64px', fontWeight: 400, color: '#f9fafa', lineHeight: 1.1, textTransform: 'uppercase', margin: '0 0 30px 0' }}>
            Get In<br />Touch
          </h1>
          <p style={{ fontSize: '16px', color: 'rgba(249,250,250,0.6)', lineHeight: 1.8, maxWidth: '340px', margin: '0 0 60px 0' }}>
            Suntem aici să te ajutăm. Completează formularul și te contactăm în cel mai scurt timp.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            {[
              { label: 'Email', value: 'contact@eif.ro' },
              { label: 'Phone', value: '+40 721 234 567' },
              { label: 'Address', value: 'Str. Victoriei 12, București' },
            ].map(item => (
              <div key={item.label} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <div style={{ width: '1px', background: 'rgba(249,250,250,0.2)', height: '40px', marginTop: '4px', flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: '11px', letterSpacing: '0.2em', color: 'rgba(249,250,250,0.4)', textTransform: 'uppercase', marginBottom: '4px' }}>{item.label}</div>
                  <div style={{ fontSize: '15px', color: '#f9fafa' }}>{item.value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '120px 80px', background: '#f9fafa' }}>

          {!succes ? (
            <div>
              <span style={{ fontSize: '13px', letterSpacing: '0.3em', color: '#888', textTransform: 'uppercase', marginBottom: '16px', display: 'block' }}>
                Send Message
              </span>
              <h2 style={{ fontFamily: 'Forum, serif', fontSize: '40px', fontWeight: 400, color: '#1d1d1b', textTransform: 'uppercase', margin: '0 0 50px 0' }}>
                We'd Love To<br />Hear From You
              </h2>

              {eroare && (
                <div style={{ background: '#fff0f0', border: '1px solid #ffcccc', padding: '14px 20px', marginBottom: '24px', color: '#cc0000', fontSize: '14px' }}>
                  {eroare}
                </div>
              )}

              <div style={{ background: '#fff', border: '1px solid rgba(29,29,27,0.12)', padding: '40px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label style={{ fontSize: '11px', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#999' }}>Name *</label>
                      <input
                        type="text"
                        value={nume}
                        onChange={e => setNume(e.target.value)}
                        placeholder="Ion Popescu"
                        style={{ padding: '12px 0', border: 'none', borderBottom: '1px solid rgba(29,29,27,0.2)', background: 'transparent', fontSize: '15px', color: '#1d1d1b', outline: 'none', fontFamily: 'Helvetica, sans-serif' }}
                      />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label style={{ fontSize: '11px', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#999' }}>Email *</label>
                      <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="email@exemplu.com"
                        style={{ padding: '12px 0', border: 'none', borderBottom: '1px solid rgba(29,29,27,0.2)', background: 'transparent', fontSize: '15px', color: '#1d1d1b', outline: 'none', fontFamily: 'Helvetica, sans-serif' }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '11px', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#999' }}>Subject</label>
                    <input
                      type="text"
                      value={subiect}
                      onChange={e => setSubiect(e.target.value)}
                      placeholder="Subiectul mesajului"
                      style={{ padding: '12px 0', border: 'none', borderBottom: '1px solid rgba(29,29,27,0.2)', background: 'transparent', fontSize: '15px', color: '#1d1d1b', outline: 'none', fontFamily: 'Helvetica, sans-serif' }}
                    />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '11px', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#999' }}>Message *</label>
                    <textarea
                      value={mesaj}
                      onChange={e => setMesaj(e.target.value)}
                      rows={5}
                      placeholder="Scrie mesajul tău aici..."
                      style={{ padding: '12px 0', border: 'none', borderBottom: '1px solid rgba(29,29,27,0.2)', background: 'transparent', fontSize: '15px', color: '#1d1d1b', outline: 'none', fontFamily: 'Helvetica, sans-serif', resize: 'none', lineHeight: 1.7 }}
                    />
                  </div>

                  <button
                    onClick={handleTrimite}
                    disabled={loading}
                    style={{ background: loading ? '#999' : '#1d1d1b', color: '#f9fafa', border: 'none', padding: '16px', fontSize: '14px', cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'Helvetica, sans-serif', letterSpacing: '0.05em', transition: 'opacity 0.2s', marginTop: '10px' }}
                    onMouseOver={e => { if (!loading) e.currentTarget.style.opacity = '0.8'; }}
                    onMouseOut={e => e.currentTarget.style.opacity = '1'}
                  >
                    {loading ? 'Sending...' : 'Send Message'}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: '60px', height: '60px', border: '1px solid #1d1d1b', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 30px', fontSize: '24px' }}>
                ✓
              </div>
              <h2 style={{ fontFamily: 'Forum, serif', fontSize: '40px', fontWeight: 400, color: '#1d1d1b', textTransform: 'uppercase', margin: '0 0 20px 0' }}>
                Message Sent!
              </h2>
              <p style={{ fontSize: '16px', color: '#666', lineHeight: 1.7, marginBottom: '40px' }}>
                Mulțumim pentru mesaj. Te vom contacta în cel mai scurt timp.
              </p>
              <button
                onClick={() => setSucces(false)}
                style={{ background: 'none', border: '1px solid rgba(29,29,27,0.2)', padding: '12px 30px', fontSize: '14px', color: '#1d1d1b', cursor: 'pointer', fontFamily: 'Helvetica, sans-serif', transition: 'all 0.2s' }}
                onMouseOver={e => { e.currentTarget.style.background = '#1d1d1b'; e.currentTarget.style.color = '#f9fafa'; }}
                onMouseOut={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = '#1d1d1b'; }}
              >
                Send Another Message
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Contact;