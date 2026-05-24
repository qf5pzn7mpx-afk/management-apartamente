import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

function AdaugaFactura() {
  const [chiriasi, setChiriasi] = useState([]);
  const [chiriasId, setChiriasId] = useState('');
  const [suma, setSuma] = useState('');
  const [tip, setTip] = useState('Chirie');
  const [dataEmiterii, setDataEmiterii] = useState('');
  const [dataScadentei, setDataScadentei] = useState('');
  const [eroare, setEroare] = useState('');
  const [succes, setSucces] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    import('./api/mockApi').then(({ getTenants }) => getTenants().then((data) => setChiriasi(data))).catch(() => setEroare('Nu pot încărca lista de chiriași.'));
  }, []);

  const handleSave = async () => {
    if (!chiriasId || !suma || !dataEmiterii || !dataScadentei) {
      setEroare('Te rugăm să completezi toate câmpurile obligatorii!');
      return;
    }

    try {
      const payload = { chirias_id: parseInt(chiriasId), suma: parseFloat(suma), tip, data_emiterii: dataEmiterii, data_scadentei: dataScadentei, status: 'Neplătită' };
      const { addInvoice } = await import('./api/mockApi');
      await addInvoice(payload);
      setSucces('Factura a fost salvată cu succes!');
      setTimeout(() => navigate('/facturi'), 1500);
    } catch (err) {
      setEroare('Nu mă pot conecta la server: ' + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-black">
      <Navbar />
      <div className="flex flex-col items-center pt-10">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg border-t-4 border-blue-500">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Adaugă o factură nouă</h2>

          {eroare && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{eroare}</div>}
          {succes && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">{succes}</div>}

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Chiriaș *</label>
            <select
              value={chiriasId}
              onChange={(e) => setChiriasId(e.target.value)}
              className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 text-black"
            >
              <option value="">Selectează chiriaș</option>
              {chiriasi.map(ch => (
                <option key={ch.id} value={ch.id}>
                  {ch.nume} (Ap. {ch.apartament_id || '–'})
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Tip factură *</label>
            <select
              value={tip}
              onChange={(e) => setTip(e.target.value)}
              className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 text-black"
            >
              <option value="Chirie">Chirie</option>
              <option value="Întreținere">Întreținere</option>
              <option value="Curent">Curent</option>
              <option value="Gaz">Gaz</option>
              <option value="Altele">Altele</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Sumă (RON) *</label>
            <input
              value={suma}
              onChange={(e) => setSuma(e.target.value)}
              type="number"
              placeholder="ex: 500"
              className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 text-black"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Data emiterii *</label>
            <input
              value={dataEmiterii}
              onChange={(e) => setDataEmiterii(e.target.value)}
              type="date"
              className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 text-black"
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">Data scadenței *</label>
            <input
              value={dataScadentei}
              onChange={(e) => setDataScadentei(e.target.value)}
              type="date"
              className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 text-black"
            />
          </div>

          <div className="flex justify-between items-center mt-8">
            <Link to="/facturi" className="text-blue-600 font-medium hover:underline">
              &larr; Înapoi
            </Link>
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Salvează
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdaugaFactura;