import React, { useState, useEffect } from 'react';
import './App.css'; // This will import Bootstrap CSS
// Corrected import paths based on your file structure image
// Assuming App.jsx is in src/zapier-automation-frontend/src/
import LeftSidebar from './components/Canvas/Sidebar/LeftSidebar';
import TopBar from './components/TopBar/TopBar'; // TopBar is directly under components
// Dashboard import removed
import MainPanel from './components/Canvas/MainPanel/MainPanel'; // Corrected: MainPanel is under Canvas
import OAuth2Callback from './components/Canvas/GoogleCalenderPanel/OAuth2Callback'; // Corrected: OAuth2Callback is under GoogleCalenderPanel
import { AuthClient } from "@dfinity/auth-client";
// Placeholder for a simple loading state or error message display
const LoadingOrError = ({ message }) => (<div className="d-flex align-items-center justify-content-center min-vh-100 bg-dark text-white">
    <p>{message}</p>
  </div>);
const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [authClient, setAuthClient] = useState(null);
    const [loadingAuth, setLoadingAuth] = useState(true);
    const [activeSidebarItem, setActiveSidebarItem] = useState('tools'); // Default view changed to 'tools'
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const client = await AuthClient.create();
                setAuthClient(client);
                if (await client.isAuthenticated()) {
                    setIsAuthenticated(true);
                }
            }
            catch (error) {
                console.error("Failed to initialize AuthClient:", error);
            }
            finally {
                setLoadingAuth(false);
            }
        };
        checkAuth();
    }, []);
    const handleLogin = async () => {
        if (authClient) {
            // Simplified identityProvider URL for local development
            // This explicitly targets localhost:8000 (or your DFX replica port)
            const identityProviderUrl = process.env.DFX_NETWORK === "ic"
                ? "https://identity.ic0.app/#authorize"
                : `${window.location.protocol}//${window.location.hostname}:8000/?canisterId=${process.env.CANISTER_ID_INTERNET_IDENTITY}#authorize`;
            console.log("Attempting to login with identityProvider:", identityProviderUrl);
            console.log("CANISTER_ID_INTERNET_IDENTITY:", process.env.CANISTER_ID_INTERNET_IDENTITY);
            try {
                await authClient.login({
                    identityProvider: identityProviderUrl,
                    onSuccess: () => {
                        setIsAuthenticated(true);
                    },
                    onError: (error) => {
                        console.error("Login failed:", error);
                        // Provide a more user-friendly message for popup blockers
                        alert("Login failed. Please check your browser's popup blocker settings or console for details.");
                    }
                });
            }
            catch (e) {
                console.error("AuthClient login call failed:", e);
                // This catch block will specifically capture errors from the login() call itself,
                // which might include issues with popup blocking.
                alert("Login process blocked. Please ensure popups are allowed for this site.");
            }
        }
    };
    const handleLogout = async () => {
        if (authClient) {
            await authClient.logout();
            setIsAuthenticated(false);
        }
    };
    // Function to handle navigation from LeftSidebar
    const handleSidebarNavigate = (itemName) => {
        setActiveSidebarItem(itemName);
    };
    // Determine which main content component to render
    const renderMainContent = () => {
        switch (activeSidebarItem) {
            case 'tools': // This will be your workflow builder
                return <MainPanel />;
            case 'workflows':
                return <LoadingOrError message="Workflows List - Coming Soon!"/>;
            case 'templates':
                return <LoadingOrError message="Templates - Coming Soon!"/>;
            case 'logs':
                return <LoadingOrError message="Logs - Coming Soon!"/>;
            case 'settings':
                return <LoadingOrError message="Settings - Coming Soon!"/>;
            default: // If no specific item is active, default to MainPanel
                return <MainPanel />;
        }
    };
    // Simple routing for OAuth2Callback
    const isOAuthCallback = window.location.pathname.includes('oauth2-callback') || window.location.search.includes('code=');
    if (isOAuthCallback) {
        return <OAuth2Callback />;
    }
    if (loadingAuth) {
        return (<div className="d-flex flex-column align-items-center justify-content-center min-vh-100 bg-dark text-white p-4">
        <p className="h5">Loading authentication...</p>
      </div>);
    }
    if (!isAuthenticated) {
        return (<div className="d-flex flex-column align-items-center justify-content-center min-vh-100 bg-dark text-white p-4">
        <h1 className="display-4 fw-bold mb-4 text-center">Welcome to DecentralFlow</h1>
        <p className="lead mb-5 text-center text-secondary">Automate Everything, On-Chain & Off</p>
        <button onClick={handleLogin} className="btn btn-primary btn-lg shadow-sm">
          Login with Internet Identity
        </button>
      </div>);
    }
    return (<div className="d-flex min-vh-100 bg-dark text-white"> {/* app-container equivalent */}
      <LeftSidebar onNavigate={handleSidebarNavigate} activeItem={activeSidebarItem}/>
      <div className="d-flex flex-column flex-grow-1">
        <TopBar principal={authClient?.getIdentity()?.getPrincipal().toString()} onLogout={handleLogout}/>
        <div className="p-4 flex-grow-1 overflow-auto"> {/* main-content equivalent */}
          {renderMainContent()}
        </div>
      </div>
    </div>);
};
export default App;
