import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

function RaporteazaProblema() {
  const [titlu, setTitlu] = useState('');
  const [descriere, setDescriere] = useState('');
  const [urgenta, setUrgenta] = useState('Scăzută');
  const [poza, setPoza] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleSave = async () => {
    if (!titlu.trim() || !descriere.trim()) {
      alert('Te rugăm să completezi titlul și descrierea!');
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append('titlu', titlu);
    formData.append('descriere', descriere);
    formData.append('status', 'Nouă');
    formData.append('chirias_id', 1); 
    formData.append('apartament_id', 1);
    
    if (poza) {
      formData.append('poza', poza);
    }

    try {
      // Use mock API instead of uploading
      const payload = {
        titlu,
        descriere,
        status: 'Nouă',
        chirias_id: 1,
        apartament_id: 1,
        urgenta,
        poza: poza ? poza.name : null,
      };
      // lazy import mockApi to avoid circulars
      const { addMaintenance } = await import('./api/mockApi');
      await addMaintenance(payload);
      alert('Problema a fost raportată cu succes!');
      navigate('/');
    } catch (err) {
      alert('Nu s-a putut contacta serverul: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="flex flex-col items-center pt-10">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg border-t-4 border-orange-500">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Raportează o defecțiune</h2>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Titlu problemă</label>
            <input
              type="text"
              value={titlu}
              onChange={(e) => setTitlu(e.target.value)}
              placeholder="Ex: Robinet defect"
              className="w-full border p-2 rounded focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Descriere detaliată</label>
            <textarea
              rows="4"
              value={descriere}
              onChange={(e) => setDescriere(e.target.value)}
              className="w-full border p-2 rounded focus:ring-2 focus:ring-orange-500"
            ></textarea>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Încarcă Poză (opțional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setPoza(e.target.files[0])}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">Urgență</label>
            <select
              value={urgenta}
              onChange={(e) => setUrgenta(e.target.value)}
              className="w-full border p-2 rounded focus:ring-2 focus:ring-orange-500"
            >
              <option>Scăzută</option>
              <option>Medie</option>
              <option>Critică</option>
            </select>
          </div>

          <div className="flex justify-between items-center mt-8">
            <Link to="/" className="text-orange-600 font-medium">
              &larr; Înapoi
            </Link>
            <motion.button
              onClick={handleSave}
              disabled={loading}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
              whileHover={{ scale: loading ? 1 : 1.05 }}
              whileTap={{ scale: loading ? 1 : 0.95 }}
              className={`px-6 py-2 text-white rounded-lg transition-all duration-200 shadow-lg ${loading ? 'bg-gray-400 cursor-not-allowed shadow-none' : 'bg-gradient-to-r from-orange-500 via-orange-600 to-red-500 hover:shadow-[0_0_25px_rgba(251,146,60,0.45)]'}`}
            >
              {loading ? 'Se trimite...' : 'Trimite'}
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RaporteazaProblema;