import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';

function Contact() {
  const [nume, setNume] = useState('');
  const [email, setEmail] = useState('');
  const [subiect, setSubiect] = useState('');
  const [mesaj, setMesaj] = useState('');
  const [eroare, setEroare] = useState('');
  const [succes, setSucces] = useState('');
  const [loading, setLoading] = useState(false);

  const handleTrimite = async () => {
    if (!nume || !email || !mesaj) {
      setEroare('Numele, emailul și mesajul sunt obligatorii!');
      return;
    }

    setLoading(true);
    setEroare('');

    try {
      // Frontend-only: simulate success
      setTimeout(() => {
        setSucces('Mesajul a fost trimis cu succes! Te vom contacta în curând.');
        setNume('');
        setEmail('');
        setSubiect('');
        setMesaj('');
        setLoading(false);
      }, 700);
    } catch (err) {
      setEroare('Nu mă pot conecta la server: ' + err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1f1f1f] text-white">
      <Navbar />

      <div className="mx-auto max-w-2xl px-6 py-20">
        <p className="text-sm uppercase tracking-[0.25em] text-gray-400 text-center">Contact</p>
        <h1 className="mt-4 text-4xl font-light text-center leading-tight sm:text-5xl">
          Trimite-ne un mesaj
        </h1>
        <p className="mt-4 text-center text-gray-400">
          Suntem aici să te ajutăm. Completează formularul și te contactăm în cel mai scurt timp.
        </p>

        <div className="mt-12 bg-white/5 border border-white/10 rounded-[28px] p-8">

          {eroare && <div className="mb-6 p-3 bg-red-500/20 text-red-300 rounded-xl">{eroare}</div>}
          {succes && <div className="mb-6 p-3 bg-green-500/20 text-green-300 rounded-xl">{succes}</div>}

          <div className="mb-4">
            <label className="block text-gray-300 font-medium mb-2">Nume *</label>
            <input
              value={nume}
              onChange={(e) => setNume(e.target.value)}
              type="text"
              placeholder="Numele tău"
              className="w-full bg-white/10 border border-white/20 text-white p-3 rounded-xl placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-300 font-medium mb-2">Email *</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="email@exemplu.com"
              className="w-full bg-white/10 border border-white/20 text-white p-3 rounded-xl placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-300 font-medium mb-2">Subiect</label>
            <input
              value={subiect}
              onChange={(e) => setSubiect(e.target.value)}
              type="text"
              placeholder="Subiectul mesajului"
              className="w-full bg-white/10 border border-white/20 text-white p-3 rounded-xl placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-300 font-medium mb-2">Mesaj *</label>
            <textarea
              value={mesaj}
              onChange={(e) => setMesaj(e.target.value)}
              rows={5}
              placeholder="Scrie mesajul tău aici..."
              className="w-full bg-white/10 border border-white/20 text-white p-3 rounded-xl placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          <button
            onClick={handleTrimite}
            disabled={loading}
            className="w-full py-3.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? 'Se trimite...' : 'Trimite mesajul'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Contact;
