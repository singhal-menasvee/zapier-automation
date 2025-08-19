import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import HeroSection from './components/HeroSection/HeroSection';
import Features from './components/Features/Features';
import Footer from './components/Footer/Footer';
import Dashboard from './components/Dashboard/Dashboard';
import Canvas from './components/Canvas/Canvas';
import { AuthClient } from '@dfinity/auth-client';
import OAuth2Callback from './components/OAuth2Callback';
import { H } from 'highlight.run';
import './App.css';

const AppContent = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const hideLayout = location.pathname === '/dashboard' || location.pathname === '/Canvas';

  const [authClient, setAuthClient] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [principal, setPrincipal] = useState(null);

  useEffect(() => {
    H.init('qe9845od', {
      serviceName: "frontend-app",
      tracingOrigins: true,
      networkRecording: {
        enabled: true,
        recordHeadersAndBody: true,
        urlBlocklist: [
          "https://www.googleapis.com/identitytoolkit",
          "https://securetoken.googleapis.com",
        ],
      },
    });

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
        const userPrincipal = authClient.getIdentity().getPrincipal().toText();
        setPrincipal(userPrincipal);
        H.identify(userPrincipal, { principal: userPrincipal });
        navigate('/dashboard');
      },
      identityProvider: 'https://identity.ic0.app/#authorize',
    });
  };

  const logout = async () => {
    if (!authClient) return;
    await authClient.logout();
    setIsAuthenticated(false);
    setPrincipal(null);
    navigate('/');
  };

  return (
    <div className="app">
      {!hideLayout && (
        <header className="navbar" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '10px 20px',
          backgroundColor: '#0d1b2a',
          color: 'white'
        }}>
          {/* Left side: logo + site name */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img src="/icplogo.png" alt="ICP Logo" style={{ width: '50px', height: 'auto' }} />
            <h1 style={{ margin: 0, fontSize: '1.5rem' }}>Decentral Flow</h1>
          </div>

          {/* Right side: login/logout */}
          <div>
            {isAuthenticated ? (
              <>
                <span style={{ marginRight: '10px' }}>{principal}</span>
                <button
                  onClick={logout}
                  style={{
                    padding: '5px 15px',
                    backgroundColor: '#1b263b',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer'
                  }}
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={login}
                style={{
                  padding: '5px 15px',
                  backgroundColor: '#1b263b',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer'
                }}
              >
                Login
              </button>
            )}
          </div>
        </header>
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
          <Route path="/dashboard" element={<Dashboard authClient={authClient} />} />
          <Route path="/Canvas" element={<Canvas />} />
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

