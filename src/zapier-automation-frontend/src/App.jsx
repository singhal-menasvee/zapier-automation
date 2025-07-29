import React, { useState, useEffect } from 'react';
import './App.css'; // This will import Bootstrap CSS

// Corrected import paths based on your file structure image
import LeftSidebar from './components/Canvas/Sidebar/LeftSidebar';
import TopBar from './components/TopBar/TopBar';
import MainPanel from './components/Canvas/MainPanel/MainPanel';
import OAuth2Callback from './components/Canvas/GoogleCalenderPanel/OAuth2Callback';
// Removed LoginMethodSelector import
import { AuthClient } from "@dfinity/auth-client";

// Placeholder for a simple loading state or error message display
const LoadingOrError = ({ message }) => (
  <div className="d-flex align-items-center justify-content-center min-vh-100 bg-dark text-white">
    <p>{message}</p>
  </div>
);

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authClient, setAuthClient] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [activeSidebarItem, setActiveSidebarItem] = useState('tools'); // Default view

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const client = await AuthClient.create();
        setAuthClient(client);
        if (await client.isAuthenticated()) {
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Failed to initialize AuthClient:", error);
      } finally {
        setLoadingAuth(false);
      }
    };
    checkAuth();
  }, []);

  // Renamed from handleLoginWithInternetIdentity back to handleLogin
  const handleLogin = async () => {
    if (authClient) {
      // Using the DFX_WEBSERVER_PORT injected from vite.config.js
      // Fallback to 8000 if not defined (though it should be from vite.config.js)
      const dfxWebserverPort = process.env.DFX_WEBSERVER_PORT || 8000;
      const identityProviderUrl =
        process.env.DFX_NETWORK === "ic"
          ? "https://identity.ic0.app/#authorize"
          : `http://${window.location.hostname}:${dfxWebserverPort}/?canisterId=${process.env.CANISTER_ID_INTERNET_IDENTITY}#authorize`;

      console.log("Attempting to login with Internet Identity:", identityProviderUrl);
      console.log("CANISTER_ID_INTERNET_IDENTITY:", process.env.CANISTER_ID_INTERNET_IDENTITY);
      console.log("DFX_WEBSERVER_PORT:", dfxWebserverPort);

      try {
        await authClient.login({
          identityProvider: identityProviderUrl,
          onSuccess: () => {
            setIsAuthenticated(true);
          },
          onError: (error) => {
            console.error("Internet Identity login failed:", error);
            alert("Internet Identity login failed. Please check your browser's popup blocker settings or console for details.");
          }
        });
      } catch (e) {
        console.error("AuthClient login call failed:", e);
        alert("Internet Identity login process blocked. Please ensure popups are allowed for this site.");
      }
    }
  };

  const handleLogout = async () => {
    if (authClient) {
      await authClient.logout();
      setIsAuthenticated(false);
    }
  };

  const handleSidebarNavigate = (itemName) => {
    setActiveSidebarItem(itemName);
  };

  const renderMainContent = () => {
    switch (activeSidebarItem) {
      case 'tools':
        return <MainPanel />;
      case 'workflows':
        return <LoadingOrError message="Workflows List - Coming Soon!" />;
      case 'templates':
        return <LoadingOrError message="Templates - Coming Soon!" />;
      case 'logs':
        return <LoadingOrError message="Logs - Coming Soon!" />;
      case 'settings':
        return <LoadingOrError message="Settings - Coming Soon!" />;
      default:
        return <MainPanel />;
    }
  };

  const isOAuthCallback = window.location.pathname.includes('oauth2-callback') || window.location.search.includes('code=');

  if (isOAuthCallback) {
    return <OAuth2Callback />;
  }

  if (loadingAuth) {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center min-vh-100 bg-dark text-white p-4">
        <p className="h5">Loading authentication...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center min-vh-100 bg-dark text-white p-4">
        <h1 className="display-4 fw-bold mb-4 text-center">Welcome to DecentralFlow</h1>
        <p className="lead mb-5 text-center text-secondary">Automate Everything, On-Chain & Off</p>
        <button
          onClick={handleLogin} // Now directly calls handleLogin for Internet Identity
          className="btn btn-primary btn-lg shadow-sm"
        >
          Login with Internet Identity
        </button>
      </div>
    );
  }

  return (
    <div className="d-flex min-vh-100 bg-dark text-white">
      <LeftSidebar onNavigate={handleSidebarNavigate} activeItem={activeSidebarItem} />
      <div className="d-flex flex-column flex-grow-1">
        <TopBar
          principal={authClient?.getIdentity()?.getPrincipal().toString()}
          onLogout={handleLogout}
        />
        <div className="p-4 flex-grow-1 overflow-auto">
          {renderMainContent()}
        </div>
      </div>
    </div>
  );
};

export default App;
