import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { OrganProvider } from './context/OrganContext';
import Home from './pages/Home';
import DonorRegistration from './pages/DonorRegistration';
import RecipientRegistration from './pages/RecipientRegistration';
import OrganInfo from './pages/OrganInfo';
import Matching from './pages/Matching';
import Alerts from './pages/Alerts';
import Hospitals from './pages/Hospitals';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import './App.css';

function App() {
  return (
    <OrganProvider>
      <Router>
        <div className="app-container">
          <Navbar />
          <div className="content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/donor-registration" element={<DonorRegistration />} />
              <Route path="/recipient-registration" element={<RecipientRegistration />} />
              <Route path="/organ-info" element={<OrganInfo />} />
              <Route path="/matching" element={<Matching />} />
              <Route path="/alerts" element={<Alerts />} />
              <Route path="/hospitals" element={<Hospitals />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </Router>
    </OrganProvider>
  );
}

export default App;
