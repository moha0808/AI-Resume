import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store';

// Layout
import DashboardLayout from './components/layout/DashboardLayout';

// Lazy pages
const LandingPage = lazy(() => import('./pages/Landing/LandingPage'));
const LoginPage = lazy(() => import('./pages/Auth/LoginPage'));
const RegisterPage = lazy(() => import('./pages/Auth/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('./pages/Auth/ForgotPasswordPage'));
const DashboardPage = lazy(() => import('./pages/Dashboard/DashboardPage'));
const ResumeUploadPage = lazy(() => import('./pages/Dashboard/ResumeUploadPage'));
const ResumeAnalysisPage = lazy(() => import('./pages/Dashboard/ResumeAnalysisPage'));
const SkillGapPage = lazy(() => import('./pages/Dashboard/SkillGapPage'));
const JobsPage = lazy(() => import('./pages/Dashboard/JobsPage'));
const ImprovePage = lazy(() => import('./pages/Dashboard/ImprovePage'));
const BuilderPage = lazy(() => import('./pages/Dashboard/BuilderPage'));
const InterviewPage = lazy(() => import('./pages/Dashboard/InterviewPage'));
const ProfilePage = lazy(() => import('./pages/Dashboard/ProfilePage'));
const AdminPage = lazy(() => import('./pages/Admin/AdminPage'));

const PageLoader = () => (
  <div className="min-h-screen bg-dark flex items-center justify-center">
    <div className="relative">
      <div className="w-16 h-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-primary text-xs font-bold">AI</span>
      </div>
    </div>
  </div>
);

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  return !isAuthenticated ? children : <Navigate to="/dashboard" replace />;
};

function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1E293B',
            color: '#F1F5F9',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '12px',
            backdropFilter: 'blur(8px)',
          },
          success: { iconTheme: { primary: '#4F46E5', secondary: '#fff' } },
          error: { iconTheme: { primary: '#EF4444', secondary: '#fff' } },
        }}
      />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Public */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

          {/* Protected Dashboard */}
          <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
            <Route index element={<DashboardPage />} />
            <Route path="upload" element={<ResumeUploadPage />} />
            <Route path="analysis/:id" element={<ResumeAnalysisPage />} />
            <Route path="skills" element={<SkillGapPage />} />
            <Route path="jobs" element={<JobsPage />} />
            <Route path="improve" element={<ImprovePage />} />
            <Route path="builder" element={<BuilderPage />} />
            <Route path="interview" element={<InterviewPage />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>

          {/* Admin */}
          <Route path="/admin" element={<ProtectedRoute><AdminPage /></ProtectedRoute>} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
