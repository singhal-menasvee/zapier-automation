import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import Header from './components/Header/Header';
import HeroSection from './components/HeroSection/HeroSection';
import Features from './components/Features/Features';
import Footer from './components/Footer/Footer';
import Dashboard from './components/Dashboard/Dashboard';
import Canvas from './components/Canvas/Canvas';
import { AuthClient } from '@dfinity/auth-client';
import OAuth2Callback from './components/OAuth2Callback';
import './App.css';

const AppContent = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const hideLayout = location.pathname === '/dashboard' || location.pathname === '/Canvas';


  const [authClient, setAuthClient] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [principal, setPrincipal] = useState(null);

  useEffect(() => {
    const initAuth = async () => {
      const client = await AuthClient.create();
      setAuthClient(client);
      const authenticated = await client.isAuthenticated();
      setIsAuthenticated(authenticated);
      if (authenticated) {
        setPrincipal(client.getIdentity().getPrincipal().toText());
      }
    };
    initAuth();
  }, []);

  const login = async () => {
    if (!authClient) return;
    await authClient.login({
      onSuccess: () => {
        setIsAuthenticated(true);
        setPrincipal(authClient.getIdentity().getPrincipal().toText());
        navigate('/dashboard'); // Redirect after login
      },
      identityProvider: 'https://identity.ic0.app/#authorize',
    });
  };

  const logout = async () => {
    if (!authClient) return;
    await authClient.logout();
    setIsAuthenticated(false);
    setPrincipal(null);
    navigate('/'); // Redirect to landing page on logout
  };

  return (
    <div className="app">
      {!hideLayout && (
  <Header
    isAuthenticated={isAuthenticated}
    principal={principal}
    onLogin={login}
    onLogout={logout}
  />
)}

      <main>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <HeroSection isAuthenticated={isAuthenticated} />
                <Features />
              </>
            }
          />
          <Route 
          path="/dashboard" 
          element={<Dashboard authClient={authClient} />} 
          />
          <Route path= "/Canvas"
          element={<Canvas/>}
          />
          <Route path="/oauth2callback" element={<OAuth2Callback />} />
        </Routes>
      </main>
      {!hideLayout && <Footer />}

    </div>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
