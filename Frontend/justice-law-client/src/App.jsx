import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import AttorneyDashboard from './pages/AttorneyDashboard';
import ClientDashboard from './pages/ClientDashboard';
import Clients from './pages/admin/Clients';
import ClientForm from './pages/admin/ClientForm';
import Cases from './pages/admin/Cases';
import CaseForm from './pages/admin/CaseForm';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import ComingSoon from './components/ComingSoon';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route path="/admin" element={<ProtectedRoute allowedRole="Admin"><Layout /></ProtectedRoute>}>
        <Route index element={<AdminDashboard />} />
        <Route path="clients" element={<Clients />} />
        <Route path="clients/new" element={<ClientForm />} />
        <Route path="clients/:clientNumber/edit" element={<ClientForm />} />
        <Route path="attorneys" element={<ComingSoon title="Attorney Management" />} />
        <Route path="cases" element={<Cases />} />
        <Route path="cases/new" element={<CaseForm />} />
        <Route path="cases/:caseNumber/edit" element={<CaseForm />} />
        <Route path="tasks" element={<ComingSoon title="Legal Tasks" />} />
      </Route>

      <Route path="/attorney" element={<ProtectedRoute allowedRole="Attorney"><Layout /></ProtectedRoute>}>
        <Route index element={<AttorneyDashboard />} />
        <Route path="cases" element={<ComingSoon title="My Cases" />} />
        <Route path="tasks" element={<ComingSoon title="Legal Tasks" />} />
      </Route>

      <Route path="/client" element={<ProtectedRoute allowedRole="Client"><Layout /></ProtectedRoute>}>
        <Route index element={<ClientDashboard />} />
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
