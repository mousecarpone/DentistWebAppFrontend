import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import "../styles/Portal.css";
import "../styles/Appointments.css"; 
import { getUserById, updateUser } from "../api";
import { jwtDecode } from "jwt-decode"; 

function UserProfile() {
  const [userData, setUserData] = useState({});
  const [editableFields, setEditableFields] = useState({
    username: false,  
  });

  // EDIT HERE TO ADD FIELDS :)
  const fieldsConfig = [
    {label: "Name",           key: "fullName",          editable: false,},
    {label: "Username",       key: "username",          editable: true,},
    {label: "Email",          key: "email",             editable: true,},
    {label: "Phone Number",   key: "phone_number",      editable: true,},
    {label: "Address",        key: "address",           editable: true,},
  ];

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("access");
      if (!token) return;

      let userId;
      try {
        const decoded = jwtDecode(token); 
        userId = decoded.user_id || decoded.id;
      } catch (err) {
        console.error("Failed to decode token:", err);
        return;
      }

      try {
        const userRes = await getUserById(userId);
        setUserData(userRes);
      } catch (err) {
        console.error("Failed to fetch user info:", err);
      }
    };

    fetchData();
  }, []);

  const handleChange = (field, value) => {
    setUserData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      await updateUser(userData.id, {
        // EDIT HERE TO ADD UPDATING FIELDS
        username: userData.username,
        email: userData.email,
        phone_number: userData.phone_number,
        address: userData.address,
      });
      alert("Profile updated successfully.");
    } catch (err) {
      console.error("Failed to update profile:", err);
      alert("Update failed.");
    }
  };

  const renderField = (label, value, fieldKey, editable = false) => (
    <div className="appointment-info-grid" style={{ marginBottom: "1rem" }}>
      <div><strong>{label}:</strong></div>
      <div>
        {editableFields[fieldKey] ? (
          <input
            type="text"
            value={value || ""}
            onChange={(e) => handleChange(fieldKey, e.target.value)}
          />
        ) : (
          <span>{value || "Not Provided"}</span>
        )}
        {editable && (
          <button
            className="confirm-button"
            style={{ marginLeft: "10px", padding: "6px 12px" }}
            onClick={() =>
              setEditableFields((prev) => ({
                ...prev,
                [fieldKey]: !prev[fieldKey]
              }))
            }
          >
            {editableFields[fieldKey] ? "Lock" : "Edit"}
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="page-container">
      <Sidebar activePage="profile" />
      <div className="dashboard-content">
        <h1 className="page-title">Update Info</h1>

        <div className="card" style={{ maxWidth: "600px", padding: "30px" }}>
        <h2>Your Info</h2>
          {fieldsConfig.map((field) => {
            let valueToDisplay;

            if (field.key === "fullName") {
              valueToDisplay = `${userData.first_name || ""} ${userData.last_name || ""}`.trim();
            } else {
              valueToDisplay = userData[field.key];
            }

            return (
              <React.Fragment key={field.key}>
                {renderField(
                  field.label,
                  valueToDisplay,
                  field.key === "fullName" ? "" : field.key,
                  field.editable
                )}
              </React.Fragment>
            );
          })}

          <h2>Emergency Contact</h2>


          <div style={{ marginTop: "20px", textAlign: "center" }}>
            <button className="confirm-button" onClick={handleSave}>
              Save Changes
            </button>
          </div>


        </div>
      </div>

      
    </div>
  );
  
}

export default UserProfile;
