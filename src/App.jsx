import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AnimatedBackground from './components/AnimatedBackground';
import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './components/DashboardLayout';
import DashboardHome from './pages/DashboardHome';
import Users from './pages/Users';
import Documents from './pages/Documents';
import Metrics from './pages/Metrics';
import Management from './pages/Management';
import EnvDebug from './components/EnvDebug';

function App() {
  return (
    <Router>
      <div className="relative min-h-screen">
        <AnimatedBackground />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardHome />} />
            <Route path="users" element={<Users />} />
            <Route path="documents" element={<Documents />} />
            <Route path="metrics" element={<Metrics />} />
            <Route path="management" element={<Management />} />
          </Route>

          <Route path="/debug" element={<EnvDebug />} />
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

