import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute';
import Navbar from './components/Navbar';

import Login           from './pages/Login';
import Register        from './pages/Register';
import OtpVerify       from './pages/OtpVerify';
import FaceCapture     from './pages/FaceCapture';
import Elections       from './pages/Elections';
import Vote            from './pages/Vote';
import Results         from './pages/Results';
import Blockchain      from './pages/Blockchain';
import About           from './pages/About';           // ✅ NEW
import AdminElections  from './pages/admin/AdminElections';
import AdminCandidates from './pages/admin/AdminCandidates';
import AdminUsers      from './pages/admin/AdminUsers';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          {/* Public */}
          <Route path="/login"        element={<Login />} />
          <Route path="/register"     element={<Register />} />
          <Route path="/otp-verify"   element={<OtpVerify />} />
          <Route path="/face-capture" element={<FaceCapture />} />
          <Route path="/about"        element={<About />} />  {/* ✅ NEW — public */}

          {/* Protected — Voter */}
          <Route path="/elections"   element={<ProtectedRoute><Elections /></ProtectedRoute>} />
          <Route path="/vote/:id"    element={<ProtectedRoute><Vote /></ProtectedRoute>} />
          <Route path="/results/:id" element={<ProtectedRoute><Results /></ProtectedRoute>} />
          <Route path="/blockchain"  element={<ProtectedRoute><Blockchain /></ProtectedRoute>} />

          {/* Protected — Admin */}
          <Route path="/admin/elections"  element={<AdminRoute><AdminElections /></AdminRoute>} />
          <Route path="/admin/candidates" element={<AdminRoute><AdminCandidates /></AdminRoute>} />
          <Route path="/admin/users"      element={<AdminRoute><AdminUsers /></AdminRoute>} />

          {/* Default */}
          <Route path="/"  element={<Navigate to="/elections" replace />} />
          <Route path="*"  element={<Navigate to="/elections" replace />} />
        </Routes>

        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: 'rgba(6,13,31,0.95)',
              color: '#e8f4ff',
              border: '1px solid rgba(0,212,255,0.2)',
              // ✅ NEW
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: '14px',
              backdropFilter: 'blur(12px)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.5), 0 0 20px rgba(0,100,200,0.1)',
            },
            success: { iconTheme: { primary: '#10d48e', secondary: 'rgba(6,13,31,0.95)' } },
            error:   { iconTheme: { primary: '#ff4757', secondary: 'rgba(6,13,31,0.95)' } },
          }}
        />
      </BrowserRouter>
    </AuthProvider>
  );
}
