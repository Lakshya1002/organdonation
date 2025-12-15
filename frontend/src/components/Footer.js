import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>© 2023 OrganDonor. All rights reserved.</p>
        <div className="social-media">
          <a href="https://facebook.com"><FaFacebook /></a>
          <a href="https://twitter.com"><FaTwitter /></a>
          <a href="https://instagram.com"><FaInstagram /></a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;