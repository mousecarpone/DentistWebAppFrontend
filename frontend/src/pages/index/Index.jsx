import React from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/Portal.css";
import "../../styles/Index.css";

function Index() {
  const navigate = useNavigate();

  return (
    <div className="main-container">

      <header className="top-header">
        <div className="clinic-name">San Diego Dental Studio</div>
        <button className="portal-button" onClick={() => navigate("/login")}>
          Enter Portal
        </button>
      </header>

      <div className="hero-container">
        <div className="hero-overlay" />
        <div className="hero-text">
          <h1>Your Perfect Smile,<br></br>Our Commitment</h1>
        </div>
      </div>

      <nav className="main-nav">
        <button onClick={() => navigate("/")}>Home</button>
        <button onClick={() => navigate("/our-practice")}>Our Practice</button>
        <button onClick={() => navigate("/community-outreach")}>Community Outreach</button>
        <button onClick={() => navigate("/services")}>Dental Services</button>
        <button onClick={() => navigate("/technology")}>Technology</button>
        <button onClick={() => navigate("/additional-info")}>Additional Info</button>
      </nav>

      <section className="content-section">
        <h2>Welcome to San Diego Dental Studio in San Diego, CA</h2>
        <p>
          At San Diego Dental Studio, our skilled team of dentists, hygienists, and dental assistants
          is dedicated to providing outstanding general and cosmetic dentistry in the Sorrento
          Valley/Mira Mesa area. We invest in the latest dental technology, stay current with
          continuing education, and combine our collective expertise to ensure that your dental
          needs are met with precision and care.
        </p>
        <p>
          Whether you’re looking to maintain a healthy smile or transform it through cosmetic
          procedures, we offer a wide range of services tailored to your individual needs. We invite
          you to experience our modern, welcoming environment. Contact us today to schedule an
          appointment and let us help you achieve the smile you deserve.
        </p>
        <p className="italics">Your Smile. Our Mission.</p>
      </section>

      <footer className="footer">
        <p>© 2025 San Diego Dental Studio. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Index;
