
import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Flags from './pages/Flags';
import Activities from './pages/Activities';
import LawGovernance from './pages/LawGovernance';
import ReportCrime from './pages/ReportCrime';
import Scan from './pages/Scan';
import Rewards from './pages/Rewards';
import NotFound from './pages/NotFound';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import SubmitActivity from './pages/SubmitActivity';
import ActivityDetail from './pages/ActivityDetail';
import HealthInitiatives from './pages/HealthInitiatives';
import AdminDashboard from './pages/AdminDashboard';
import ImproveScore from './pages/ImproveScore';
import PoliceLogin from './pages/PoliceLogin';
import PoliceProtectedRoute from './components/PoliceProtectedRoute';
import PoliceLayout from './components/layout/PoliceLayout';
import PoliceDashboard from './pages/PoliceDashboard';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <HashRouter>
        <Routes>
          {/* Citizen Routes */}
          <Route path="/login" element={<Login />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="profile" element={<Profile />} />
              <Route path="flags" element={<Flags />} />
              <Route path="activities" element={<Activities />} />
              <Route path="activity-detail" element={<ActivityDetail />} />
              <Route path="law-governance" element={<LawGovernance />} />
              <Route path="health-initiatives" element={<HealthInitiatives />} />
              <Route path="report-crime" element={<ReportCrime />} />
              <Route path="scan" element={<Scan />} />
              <Route path="rewards" element={<Rewards />} />
              <Route path="submit-activity" element={<SubmitActivity />} />
              <Route path="admin" element={<AdminDashboard />} />
              <Route path="improve-score" element={<ImproveScore />} />
            </Route>
          </Route>

          {/* Police Routes */}
          <Route path="/police/login" element={<PoliceLogin />} />
          <Route element={<PoliceProtectedRoute />}>
            <Route path="/police" element={<PoliceLayout />}>
              <Route index element={<PoliceDashboard />} />
            </Route>
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </HashRouter>
    </AuthProvider>
  );
};

export default App;
