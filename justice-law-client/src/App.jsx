import { Routes, Route, Navigate } from 'react-router-dom';

import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import AttorneyDashboard, { LegalTasksPage } from './pages/AttorneyDashboard';
import Attorneys from './pages/AttorneyManagement';
import ClientDashboard from './pages/ClientDashboard';
import Clients from './pages/admin/Clients';

import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import ComingSoon from './components/ComingSoon';

export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<Login />} />

      {/* Admin */}
      <Route path="/admin" element={<ProtectedRoute allowedRole="Admin"><Layout /></ProtectedRoute>}>
        <Route index element={<AdminDashboard />} />
        <Route path="clients" element={<Clients />} />
        <Route path="attorneys" element={<Attorneys />} />
        <Route path="cases" element={<ComingSoon title="Case Management" />} />
        <Route path="tasks" element={<ComingSoon title="Legal Tasks" />} />
      </Route>

      {/* Attorney (TEMPORARY: not protected while building, protect before merging) */}
      <Route path="/attorney" element={<AttorneyDashboard />} />
      <Route path="/attorney/tasks" element={<LegalTasksPage />} />

      {/* Client */}
      <Route path="/client" element={<ProtectedRoute allowedRole="Client"><Layout /></ProtectedRoute>}>
        <Route index element={<ClientDashboard />} />
      </Route>

      {/* TEMPORARY PREVIEW (no login): delete before committing */}
      <Route path="/preview/attorneys" element={<Attorneys />} />

      {/* Anything else goes to login */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}