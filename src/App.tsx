
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import 'ol/ol.css';

// Pages
import Index from './pages/Index';
import PropertyDetails from './pages/PropertyDetails';
import Properties from './pages/Properties';
import PropertiesForSale from './pages/PropertiesForSale';
import PropertiesForRent from './pages/PropertiesForRent';
import Loans from './pages/Loans';
import Contact from './pages/Contact';
import Agents from './pages/Agents';
import AgentDetails from './pages/AgentDetails';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import NotFound from './pages/NotFound';
import SiteMap from './pages/SiteMap';

// Components
import { Toaster } from "@/components/ui/toaster";
import ProtectedRoute from './components/ProtectedRoute';

// Context
import { AuthProvider } from './contexts/AuthContext';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading assets or data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-16 h-16 border-4 border-gray-200 border-t-black rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Index />} />
          <Route path="/properties" element={<Properties />} />
          <Route path="/properties-for-sale" element={<PropertiesForSale />} />
          <Route path="/properties-for-rent" element={<PropertiesForRent />} />
          <Route path="/property/:id" element={<PropertyDetails />} />
          <Route path="/loans" element={<Loans />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/agents" element={<Agents />} />
          <Route path="/agent/:id" element={<AgentDetails />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/sitemap" element={<SiteMap />} />
          
          {/* Protected Routes - Now all under the dashboard */}
          <Route path="/dashboard/*" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          
          {/* Redirect old routes to dashboard with appropriate tabs */}
          <Route path="/add-property" element={<Navigate to="/dashboard?tab=add-property" replace />} />
          <Route path="/notifications" element={<Navigate to="/dashboard?tab=notifications" replace />} />
          <Route path="/profile" element={<Navigate to="/dashboard?tab=profile" replace />} />
          
          {/* 404 and redirects */}
          <Route path="/404" element={<NotFound />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
        
        <Toaster />
      </AuthProvider>
    </Router>
  );
}

export default App;
