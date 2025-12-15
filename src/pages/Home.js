import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaHeart, FaUserPlus, FaHandsHelping, FaQuoteLeft, FaQuoteRight, FaArrowRight } from 'react-icons/fa';
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi';
import organDonationImage from '../assets/organ-donation.png'; // Import the image
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);

  const handleRegisterClick = () => {
    navigate('/donor-registration');
  };

  const testimonials = [
    {
      text: "Organ donation gave me a second chance at life. I’m forever grateful!",
      author: "Arjun Malhotra",
    },
    {
      text: "This platform made the process so easy and transparent. Thank you!",
      author: "Priya Mehta",
    },
    {
      text: "I’m proud to be a donor. It’s the best decision I’ve ever made.",
      author: "Ramesh Gupta",
    },
  ];

  const faqs = [
    {
      question: "Who can become an organ donor?",
      answer: "Anyone above the age of 18 can register as an organ donor.",
    },
    {
      question: "Is organ donation free?",
      answer: "Yes, organ donation is completely free of cost.",
    },
    {
      question: "How long does the process take?",
      answer: "The process is quick and can save lives in a matter of hours.",
    },
  ];

  const handleNextTestimonial = () => {
    setCurrentTestimonialIndex((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrevTestimonial = () => {
    setCurrentTestimonialIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <motion.div className="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      {/* Hero Section */}
      <div className="hero-section">
        <motion.h1 initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2, duration: 0.5 }}>
          Be a Hero, Save Lives
        </motion.h1>
        <motion.p initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4, duration: 0.5 }}>
          Join the movement to give the gift of life.
        </motion.p>
        <motion.button
          onClick={handleRegisterClick}
          whileHover={{ scale: 1.05, rotate: 3 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="cta-button"
        >
          Become a Donor <FaHeart className="btn-icon" />
        </motion.button>
      </div>

      {/* Stats Section */}
      <div className="stats-section">
        <h2>Our Mission in Numbers</h2>
        <div className="stats-grid">
          {[
            { icon: <FaHandsHelping />, value: 10000, label: "Lives Saved" },
            { icon: <FaUserPlus />, value: 5000, label: "Registered Donors" },
            { icon: <FaHeart />, value: 2000, label: "Transplants Per Year" },
          ].map((stat, index) => (
            <motion.div key={index} className="stat-card" whileHover={{ scale: 1.05 }}>
              <div className="stat-icon">{stat.icon}</div>
              <h3>{stat.value}+</h3>
              <p>{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* About Section */}
      <div className="about-section">
        <div className="about-content">
          <div className="about-text">
            <h2>Why Organ Donation Matters</h2>
            <p>
              Organ donation is the process of giving an organ or a part of an organ to someone in need of a transplant. It can save lives and improve the quality of life for many people. Join us in this noble cause and make a difference today!
            </p>
          </div>
          <div className="about-image">
            <img src={organDonationImage} alt="Organ Donation" />
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="how-it-works-section">
        <h2>How It Works</h2>
        <div className="steps-grid">
          {[
            { step: 1, title: "Register", description: "Sign up as a donor or recipient." },
            { step: 2, title: "Match", description: "We match donors with recipients based on compatibility." },
            { step: 3, title: "Donate", description: "Complete the donation process and save a life." },
          ].map((step, index) => (
            <motion.div key={index} className="step-card" whileHover={{ scale: 1.05 }}>
              <div className="step-number">{step.step}</div>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="testimonials-section">
        <h2>Hear From Our Donors</h2>
        <div className="testimonials-carousel">
          <button className="carousel-button prev" onClick={handlePrevTestimonial}>
            <FiArrowLeft />
          </button>
          <div className="testimonial-card">
            <FaQuoteLeft className="quote-icon" />
            <p>{testimonials[currentTestimonialIndex].text}</p>
            <FaQuoteRight className="quote-icon" />
            <h3>- {testimonials[currentTestimonialIndex].author}</h3>
          </div>
          <button className="carousel-button next" onClick={handleNextTestimonial}>
            <FiArrowRight />
          </button>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="faq-section">
        <h2>Frequently Asked Questions</h2>
        <div className="faq-grid">
          {faqs.map((faq, index) => (
            <motion.div key={index} className="faq-card" whileHover={{ scale: 1.02 }}>
              <h3>{faq.question}</h3>
              <p>{faq.answer}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Call-to-Action Section */}
      <div className="cta-section">
        <h2>Ready to Make a Difference?</h2>
        <p>Join us today and become a part of this life-saving mission.</p>
        <button onClick={handleRegisterClick}>
          Register Now <FaArrowRight />
        </button>
      </div>

      {/* Footer */}
      <div className="footer">
        <div className="footer-content">
          <div className="newsletter">
            <h3>Subscribe to Us</h3>
            <input type="email" placeholder="Enter your email" />
            <button>Subscribe</button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Home;