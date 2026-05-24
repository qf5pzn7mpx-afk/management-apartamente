import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

function AdaugaChirias() {
  const [nume, setNume] = useState('');
  const [ap, setAp] = useState('');
  const [email, setEmail] = useState('');
  const [telefon, setTelefon] = useState('');
  const [eroare, setEroare] = useState('');
  const navigate = useNavigate();

  const handleSave = async () => {
    if (!nume || !ap) {
      setEroare('Te rugăm să completezi numele și numărul apartamentului!');
      return;
    }

    try {
      const { addTenant } = await import('./api/mockApi');
      await addTenant({ nume: nume, apartament_id: ap, email: email, telefon: telefon });
      navigate('/');
    } catch (err) {
      setEroare('Nu mă pot conecta la server: ' + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-black">
      <Navbar />
      <div className="flex flex-col items-center pt-10">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg border-t-4 border-indigo-500">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Adaugă Chiriaș Nou</h2>

          {eroare && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded border border-red-200">
              {eroare}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium mb-1">Nume Complet *</label>
              <input
                type="text"
                value={nume}
                onChange={(e) => setNume(e.target.value)}
                className="w-full border p-2 rounded focus:ring-2 focus:ring-indigo-500 text-black"
                placeholder="ex: Ion Popescu"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">Număr Apartament *</label>
              <input
                type="text"
                value={ap}
                onChange={(e) => setAp(e.target.value)}
                className="w-full border p-2 rounded focus:ring-2 focus:ring-indigo-500 text-black"
                placeholder="ex: 12A"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border p-2 rounded focus:ring-2 focus:ring-indigo-500 text-black"
                placeholder="email@exemplu.com"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">Telefon</label>
              <input
                type="text"
                value={telefon}
                onChange={(e) => setTelefon(e.target.value)}
                className="w-full border p-2 rounded focus:ring-2 focus:ring-indigo-500 text-black"
                placeholder="07xx xxx xxx"
              />
            </div>
          </div>

          <div className="flex justify-between items-center mt-8">
            <Link to="/" className="text-indigo-600 font-medium hover:underline">
              &larr; Înapoi
            </Link>
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition shadow-sm"
            >
              Salvează Chiriaș
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdaugaChirias;