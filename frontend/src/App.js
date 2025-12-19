import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CallProvider } from './context/CallContext';
import CallManager from './components/CallManager';
import ThemeToggle from './components/ThemeToggle';

// Pages (we'll create these)
import Landing from './pages/Landing';
import Login from './pages/Login';
import RegisterStudent from './pages/RegisterStudent';
import RegisterTeacher from './pages/RegisterTeacher';
import StudentDashboard from './pages/StudentDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import TeacherSearch from './pages/TeacherSearch';
import TeacherProfile from './pages/TeacherProfile';
import ChatPage from './pages/ChatPage';
import WalletPage from './pages/WalletPage';
import PaymentHistory from './pages/PaymentHistory';
import StudentProgress from './pages/StudentProgress';
import SettingsPage from './pages/SettingsPage';
import EditProfile from './pages/EditProfile';
import EditStudentProfile from './pages/EditStudentProfile';
import HelpPage from './pages/HelpPage';

// Protected Route Component
const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function AppRoutes() {
  const { isAuthenticated, user } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Landing />} />
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to={user?.role === 'student' ? '/dashboard' : '/teacher-dashboard'} /> : <Login />}
      />
      <Route
        path="/register/student"
        element={isAuthenticated ? <Navigate to="/dashboard" /> : <RegisterStudent />}
      />
      <Route
        path="/register/teacher"
        element={isAuthenticated ? <Navigate to="/teacher-dashboard" /> : <RegisterTeacher />}
      />

      {/* Protected Routes - Student */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute requiredRole="student">
            <StudentDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/search"
        element={
          <ProtectedRoute requiredRole="student">
            <TeacherSearch />
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/:id"
        element={
          <ProtectedRoute>
            <TeacherProfile />
          </ProtectedRoute>
        }
      />

      {/* Protected Routes - Teacher */}
      <Route
        path="/teacher-dashboard"
        element={
          <ProtectedRoute requiredRole="teacher">
            <TeacherDashboard />
          </ProtectedRoute>
        }
      />

      {/* Protected Routes - Teacher */}
      <Route
        path="/teacher-dashboard"
        element={
          <ProtectedRoute requiredRole="teacher">
            <TeacherDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/wallet"
        element={
          <ProtectedRoute requiredRole="teacher">
            <WalletPage />
          </ProtectedRoute>
        }
      />

      {/* Protected Routes - Student */}
      <Route
        path="/progress"
        element={
          <ProtectedRoute requiredRole="student">
            <StudentProgress />
          </ProtectedRoute>
        }
      />

      {/* Protected Routes - Both */}
      <Route
        path="/chat"
        element={
          <ProtectedRoute>
            <ChatPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <SettingsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/help"
        element={
          <HelpPage />
        }
      />

      {/* Edit Profile - Teacher */}
      <Route
        path="/edit-profile"
        element={
          <ProtectedRoute requiredRole="teacher">
            <EditProfile />
          </ProtectedRoute>
        }
      />

      {/* Edit Profile - Student */}
      <Route
        path="/edit-student-profile"
        element={
          <ProtectedRoute requiredRole="student">
            <EditStudentProfile />
          </ProtectedRoute>
        }
      />

      {/* Payment History - Both */}
      <Route
        path="/payments/history"
        element={
          <ProtectedRoute>
            <PaymentHistory />
          </ProtectedRoute>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <CallProvider>
        <Router>
          <div className="App relative">
            <ThemeToggle />
            <CallManager />
            <AppRoutes />
          </div>
        </Router>
      </CallProvider>
    </AuthProvider>
  );
}

export default App;
