
import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import { FaEdit } from "react-icons/fa";
import "../styles/Portal.css";

// Helper to decode JWT
const decodeJWT = (token) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

function UserProfile() {
  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState({});
  const [editField, setEditField] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("access");
        const decoded = decodeJWT(token);
        const userId = decoded?.user_id;

        if (!userId) {
          console.warn("⚠️ Could not find user_id in token.");
          return;
        }

        const res = await axios.get(`http://127.0.0.1:8000/users/${userId}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUserData(res.data);
        setFormData(res.data);
      } catch (err) {
        console.error("❌ Failed to fetch user info:", err);
      }
    };

    fetchUser();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const token = localStorage.getItem("access");
      await axios.put(`http://127.0.0.1:8000/users/${userData.id}/`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserData(formData);
      setEditField(null);
      alert("✅ Profile updated!");
    } catch (err) {
      console.error("❌ Failed to update profile:", err);
      alert("Failed to update profile.");
    } finally {
      setIsSaving(false);
    }
  };

  const renderField = (label, name) => (
    <div style={{ marginBottom: "20px" }}>
      <strong>{label}:</strong>{" "}
      {editField === name ? (
        <>
          <input
            name={name}
            value={formData[name] || ""}
            onChange={handleChange}
            style={{ marginLeft: "10px" }}
          />
        </>
      ) : (
        <>
          <span style={{ marginLeft: "10px" }}>{userData?.[name] || "—"}</span>
          <FaEdit
            onClick={() => setEditField(name)}
            style={{ marginLeft: "10px", cursor: "pointer" }}
          />
        </>
      )}
    </div>
  );

  return (
    <div className="page-container">
      <Sidebar activePage="settings" />
      <div className="dashboard-content">
        <h1 className="page-title">My Info</h1>
        {userData ? (
          <form onSubmit={handleSubmit} className="card" style={{ maxWidth: "600px" }}>
            {renderField("Username", "username")}
            {renderField("First Name", "first_name")}
            {renderField("Last Name", "last_name")}
            {renderField("Email", "email")}
            {renderField("Phone Number", "phone_number")}
            {renderField("Address", "address")}
            <button className="confirm-button" type="submit" disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </form>
        ) : (
          <p>Loading user info...</p>
        )}
      </div>
    </div>
  );
}

export default UserProfile;
