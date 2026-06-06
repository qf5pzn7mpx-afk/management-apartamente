import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import TenantMessages from './manager/TenantMessages';
import SendMessage from './chirias/SendMessage';

import mockApi from './api/mockApi';

import Dashboard from './Dashboard';
import Home from './Home';
import Login from './Login';
import Register from './Register';
import ProtectedRoute from './ProtectedRoute';
import { AuthProvider } from './AuthContext';

import AdaugaChirias from './AdaugaChirias';
import AdaugaFactura from './AdaugaFactura';
import AdaugaDocument from './AdaugaDocument';
import GestionareFacturi from './GestionareFacturi';
import GestionareMentenanta from './GestionareMentenanta';
import GestionareDocumente from './GestionareDocumente';
import Contact from './Contact';
import RaporteazaProblema from './RaporteazaProblema';

import ManagerDashboard from './ManagerDashboard';
import ChiriasDashboard from './ChiriasDashboard';

import TenantsList from './manager/TenantsList';
import TenantDetails from './manager/TenantDetails';

import ChiriasInvoices from './chirias/Invoices';
import ChiriasDocuments from './chirias/Documents';
import ChiriasMaintenance from './chirias/Maintenance';

import TenantDocuments from './TenantDocuments';

function App() {
  const [mesajServer, setMesajServer] = useState('Loading...');
  const [chiriasi, setChiriasi] = useState([]);

  useEffect(() => {
    mockApi.initMock();

    mockApi
      .getTenants()
      .then((data) => setChiriasi(data))
      .catch(() => setChiriasi([]));

    fetch('https://management-apartamente-api.onrender.com/api/test')
      .then((res) => res.json())
      .then((data) => setMesajServer(data.message)) // Am schimbat din .mesaj în .message
      .catch(() =>
        setMesajServer('Error: Backend server is offline.') // Tradus în engleză
      );
  }, []);

  const adaugaChirias = (nou) => {
    setChiriasi([...chiriasi, { id: Date.now(), ...nou }]);
  };

  return (
    <div className="App">
      <div
        style={{
          padding: '10px',
          backgroundColor: '#e0f7fa',
          textAlign: 'center',
          marginBottom: '20px',
          borderRadius: '8px',
        }}
      >
        <strong>Server Status: </strong>
        <span
          style={{
            // Am adăugat semnul ? și căutăm cuvântul Error în loc de Eroare
            color: mesajServer?.includes('Error') ? 'red' : 'blue',
          }}
        >
          {mesajServer}
        </span>
      </div>

      <AuthProvider>
        <BrowserRouter>
          <Routes>

            <Route path="/" element={<Home />} />

            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/tenant-documents" element={<TenantDocuments />} />
            <Route path="/manager/messages" element={<ProtectedRoute allowedRoles={['manager']}><TenantMessages /></ProtectedRoute>} />

<Route path="/chirias/message" element={<ProtectedRoute allowedRoles={['chirias']}><SendMessage /></ProtectedRoute>} />

            <Route path="/manager" element={<Navigate to="/manager/dashboard" replace />} />
            <Route path="/chirias" element={<Navigate to="/chirias/dashboard" replace />} />

            <Route path="/manager/dashboard" element={<ProtectedRoute allowedRoles={['manager']}><ManagerDashboard /></ProtectedRoute>} />
            <Route path="/manager/tenants" element={<ProtectedRoute allowedRoles={['manager']}><TenantsList /></ProtectedRoute>} />
            <Route path="/manager/tenants/:id" element={<ProtectedRoute allowedRoles={['manager']}><TenantDetails /></ProtectedRoute>} />

            <Route path="/chirias/dashboard" element={<ProtectedRoute allowedRoles={['chirias']}><ChiriasDashboard /></ProtectedRoute>} />
            <Route path="/chirias/invoices" element={<ProtectedRoute allowedRoles={['chirias']}><ChiriasInvoices /></ProtectedRoute>} />
            <Route path="/chirias/maintenance" element={<ProtectedRoute allowedRoles={['chirias']}><ChiriasMaintenance /></ProtectedRoute>} />
            <Route path="/chirias/documents" element={<ProtectedRoute allowedRoles={['chirias']}><ChiriasDocuments /></ProtectedRoute>} />

            <Route path="/dashboard" element={<Dashboard chiriasi={chiriasi} />} />
            <Route path="/adauga-chirias" element={<AdaugaChirias adaugaChirias={adaugaChirias} />} />
            <Route path="/adauga-factura" element={<AdaugaFactura />} />
            <Route path="/adauga-document" element={<AdaugaDocument />} /> 

            <Route path="/facturi" element={<ProtectedRoute allowedRoles={['manager']}><GestionareFacturi /></ProtectedRoute>} />
            <Route path="/mentenanta" element={<ProtectedRoute allowedRoles={['manager']}><GestionareMentenanta /></ProtectedRoute>} />
            <Route path="/documente" element={<ProtectedRoute allowedRoles={['manager']}><GestionareDocumente /></ProtectedRoute>} />

            <Route path="/raporteaza-problema" element={<RaporteazaProblema />} />

          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}

export default App;