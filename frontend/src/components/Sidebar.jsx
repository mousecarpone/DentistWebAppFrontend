import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { 
  FaTachometerAlt, FaCalendarAlt, FaHistory, FaFolderOpen, FaComments, 
  FaUserCog, FaUserCircle, FaSignOutAlt 
} from "react-icons/fa";
import "../styles/Sidebar.css";

function Sidebar({ activePage }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    navigate("/login");
  };

  return (
    <div className="sidebar">
      <ul className="menu">
        <li>
          <NavLink to="/dashboard" className={activePage === "dashboard" ? "active" : ""}>
            <FaTachometerAlt className="icon" /> Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink to="/appointments" className={activePage === "appointments" ? "active" : ""}>
            <FaCalendarAlt className="icon" /> Appointments
          </NavLink>
        </li>
        <li>
          <NavLink to="/history" className={activePage === "history" ? "active" : ""}>
            <FaHistory className="icon" /> History
          </NavLink>
        </li>
        <li>
          <NavLink to="/documents" className={activePage === "documents" ? "active" : ""}>
            <FaFolderOpen className="icon" /> Documents
          </NavLink>
        </li>
        <li>
          <NavLink to="/inbox" className={activePage === "messages" ? "active" : ""}>
            <FaComments className="icon" /> Messages
          </NavLink>
        </li>
      </ul>

      {/* Support & Settings Section */}
      <ul className="bottom-menu">
        <li>
          <NavLink to="/profile" className={activePage === "profile" ? "active" : ""}>
            <FaUserCog className="icon" /> User Info
          </NavLink>
        </li>
      </ul>

      <button className="logout-button" onClick={handleLogout}>
        <FaSignOutAlt className="icon" /> Log Out
      </button>
    </div>
  );
}

export default Sidebar;
