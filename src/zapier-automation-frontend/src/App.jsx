import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header/Header';
import HeroSection from './components/HeroSection/HeroSection';
import Features from './components/Features/Features';
import Footer from './components/Footer/Footer';
import Dashboard from './components/Dashboard/Dashboard';
import './App.css';

const AppContent = () => {
  const location = useLocation();
  const isDashboard = location.pathname === '/dashboard';

  return (
    <div className="app">
      {!isDashboard && <Header />}
      <main>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <HeroSection />
                <Features />
              </>
            }
          />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </main>
      {!isDashboard && <Footer />}
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
