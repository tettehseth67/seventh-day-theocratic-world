/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import MainLayout from './components/layout/MainLayout';
import AdminLayout from './components/layout/AdminLayout';
import HomePage from './pages/HomePage';
import EventsPage from './pages/EventsPage';
import SermonsPage from './pages/SermonsPage';
import GivePage from './pages/GivePage';
import DirectoryPage from './pages/DirectoryPage';
import LivestreamPage from './pages/LivestreamPage';
import EventDetailsPage from './pages/EventDetailsPage';
import AdminPage from './pages/AdminPage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import DonationsPage from './pages/DonationsPage';
import NotificationsPage from './pages/NotificationsPage';
import AboutPage from './pages/AboutPage';
import SermonDetailsPage from './pages/SermonDetailsPage';
import { AnimatePresence, motion } from 'motion/react';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { Toaster } from '@/components/ui/sonner';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <AppContent />
        <Toaster position="top-center" />
      </Router>
    </AuthProvider>
  );
}

function AppContent() {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');
  const isLoginPage = location.pathname === '/login';

  // For Admin Routes
  if (isAdminPath) {
    return (
      <ProtectedRoute allowedRoles={['admin']}>
        <AdminLayout>
          <Routes>
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/admin/:tab" element={<AdminPage />} />
          </Routes>
        </AdminLayout>
      </ProtectedRoute>
    );
  }

  // For Login Page (No Layout)
  if (isLoginPage) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    );
  }

  // Default Public Layout
  return (
    <MainLayout>
      <AnimatePresence mode="wait">
        <motion.div
           key={location.pathname}
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           exit={{ opacity: 0 }}
           transition={{ duration: 0.3 }}
        >
          <Routes location={location}>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/sermons" element={<SermonsPage />} />
          <Route path="/sermons/:id" element={<SermonDetailsPage />} />
          <Route path="/give" element={<GivePage />} />
          <Route path="/directory" element={
            <ProtectedRoute allowedRoles={['admin', 'member']}>
              <DirectoryPage />
            </ProtectedRoute>
          } />
          <Route path="/livestream" element={<LivestreamPage />} />
          <Route path="/events/:id" element={<EventDetailsPage />} />
          <Route path="/profile" element={
            <ProtectedRoute allowedRoles={['admin', 'member']}>
              <ProfilePage />
            </ProtectedRoute>
          } />
          <Route path="/donations" element={
            <ProtectedRoute allowedRoles={['admin', 'member']}>
              <DonationsPage />
            </ProtectedRoute>
          } />
          <Route path="/notifications" element={
            <ProtectedRoute allowedRoles={['admin', 'member']}>
              <NotificationsPage />
            </ProtectedRoute>
          } />
          {/* Redirect any stray admin attempts to the protected flow */}
          <Route path="/admin/*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
    </MainLayout>
  );
}
