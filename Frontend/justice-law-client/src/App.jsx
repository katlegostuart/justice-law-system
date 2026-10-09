import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import AttorneyDashboard, { LegalTasksPage } from './pages/AttorneyDashboard';
import ClientDashboard from './pages/ClientDashboard';
import Clients from './pages/admin/Clients';
import ClientForm from './pages/admin/ClientForm';
import Cases from './pages/admin/Cases';
import CaseForm from './pages/admin/CaseForm';
import Attorneys from './pages/admin/Attorneys';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import ComingSoon from './components/ComingSoon';
import { DataProvider } from './context/DataContext';

export default function App() {
  return (
    <DataProvider>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/admin" element={<ProtectedRoute allowedRole="Admin"><Layout /></ProtectedRoute>}>
          <Route index element={<AdminDashboard />} />
          <Route path="clients" element={<Clients />} />
          <Route path="clients/new" element={<ClientForm />} />
          <Route path="clients/edit/:id" element={<ClientForm />} />
          <Route path="cases" element={<Cases />} />
          <Route path="cases/new" element={<CaseForm />} />
          <Route path="attorneys" element={<Attorneys />} />
          <Route path="tasks" element={<ComingSoon title="Legal Tasks" />} />
        </Route>

        <Route path="/attorney" element={<ProtectedRoute allowedRole="Attorney"><Layout /></ProtectedRoute>}>
          <Route index element={<AttorneyDashboard />} />
          <Route path="cases" element={<ComingSoon title="My Cases" />} />
          <Route path="tasks" element={<LegalTasksPage />} />
        </Route>

        <Route path="/client" element={<ProtectedRoute allowedRole="Client"><Layout /></ProtectedRoute>}>
          <Route index element={<ClientDashboard />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </DataProvider>
  );
}