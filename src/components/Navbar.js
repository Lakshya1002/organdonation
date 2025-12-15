import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaUserPlus, FaHeartbeat, FaHospital, FaBell, FaHandshake } from 'react-icons/fa';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">OrganDonor</Link>
      </div>
      <ul className="navbar-links">
        <li><Link to="/"><FaHome /> Home</Link></li>
        <li><Link to="/donor-registration"><FaUserPlus /> Donor Registration</Link></li>
        <li><Link to="/recipient-registration"><FaUserPlus /> Recipient Registration</Link></li>
        <li><Link to="/organ-info"><FaHeartbeat /> Organ Info</Link></li>
        <li><Link to="/matching"><FaHandshake /> Matching</Link></li>
        <li><Link to="/alerts"><FaBell /> Alerts</Link></li>
        <li><Link to="/hospitals"><FaHospital /> Hospitals</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;