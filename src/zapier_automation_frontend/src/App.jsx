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
import Header from './components/Header/Header'; // ✅ keep Header since remote used it
import './App.css';

// Main app logic wrapped for Router access
const AppContent = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Hide layout for dashboard/canvas views
  const hideLayout =
    location.pathname.toLowerCase() === '/dashboard' ||
    location.pathname.toLowerCase() === '/canvas';

  const [authClient, setAuthClient] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [principal, setPrincipal] = useState(null);

  // Highlight.run initialization for monitoring
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

    // Initialize Internet Identity authentication
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

  // Login handler
  const login = async () => {
    if (!authClient) return;
    await authClient.login({
      onSuccess: () => {
        setIsAuthenticated(true);
        const userPrincipal = authClient.getIdentity().getPrincipal().toText();
        setPrincipal(userPrincipal);
        H.identify(userPrincipal, {
          principal: userPrincipal,
        });
        navigate('/dashboard'); // Redirect after login
      },
      identityProvider: 'https://identity.ic0.app/#authorize',
    });
  };

  // Logout handler
  const logout = async () => {
    if (!authClient) return;
    await authClient.logout();
    setIsAuthenticated(false);
    setPrincipal(null);
    navigate('/');
  };

  return (
    <div className="app">
      {/* Show header/footer unless on dashboard or canvas */}
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
          <Route
            path="/canvas"
            element={<Canvas />}
          />
          {/* Support both /oauth2callback and /OAuth2Callback */}
          <Route path="/oauth2callback" element={<OAuth2Callback />} />
          <Route path="/OAuth2Callback" element={<OAuth2Callback />} />
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
