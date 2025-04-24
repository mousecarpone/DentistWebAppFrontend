import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/Index.css";

function IndexNavBar() {
  const navigate = useNavigate();
  const location = useLocation();

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/our-practice", label: "Our Practice" },
    { path: "/community-outreach", label: "Community Outreach" },
    { path: "/services", label: "Dental Services" },
    { path: "/technology", label: "Technology" },
    { path: "/additional-info", label: "Additional Info" },
  ];

  return (
    <nav className="main-nav">
      {navLinks.map(({ path, label }) => (
        <button
          key={path}
          onClick={() => navigate(path)}
          className={location.pathname === path ? "nav-button active" : "nav-button"}
        >
          {label}
        </button>
      ))}
    </nav>
  );
}

export default IndexNavBar;
