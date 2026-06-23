import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './services/auth';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import ResumeAnalyzer from './pages/ResumeAnalyzer';
import JobMatchScore from './pages/JobMatchScore';
import Interviews from './pages/Interviews';
import InternshipRecommendation from './pages/InternshipRecommendation';
import AISuggestions from './pages/AISuggestions';

// Protected layout wrapper
const ProtectedLayout = ({ children, title }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar navigation */}
      <Sidebar />

      {/* Main viewport area */}
      <div className="flex-1 flex flex-col pl-64 min-h-screen">
        <Navbar title={title} />
        <main className="flex-1 p-8 mt-16 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />

      {/* Protected Dashboards */}
      <Route
        path="/dashboard"
        element={
          <ProtectedLayout title="📊 Dashboard">
            <Dashboard />
          </ProtectedLayout>
        }
      />
      <Route
        path="/home"
        element={
          <ProtectedLayout title="🏠 Home">
            <Home />
          </ProtectedLayout>
        }
      />
      <Route
        path="/resume"
        element={
          <ProtectedLayout title="📄 Resume Analyzer">
            <ResumeAnalyzer />
          </ProtectedLayout>
        }
      />
      <Route
        path="/match-score"
        element={
          <ProtectedLayout title="💼 Job Match Score">
            <JobMatchScore />
          </ProtectedLayout>
        }
      />
      <Route
        path="/interviews"
        element={
          <ProtectedLayout title="🎤 Mock Interview">
            <Interviews />
          </ProtectedLayout>
        }
      />
      <Route
        path="/internships"
        element={
          <ProtectedLayout title="🎯 Internship Recommendation">
            <InternshipRecommendation />
          </ProtectedLayout>
        }
      />
      <Route
        path="/suggestions"
        element={
          <ProtectedLayout title="💡 AI Suggestions">
            <AISuggestions />
          </ProtectedLayout>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
