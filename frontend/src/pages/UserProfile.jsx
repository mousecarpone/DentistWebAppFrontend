import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import "../styles/Portal.css";
import "../styles/Appointments.css"; 
import { 
  getUserById, 
  updateUser, 
  getPatientId, 
  getPatientById, 
  updatePatient 
} from "../api";
import { jwtDecode } from "jwt-decode"; 

function UserProfile() {
  const [userData, setUserData] = useState({});
  const [editableFields, setEditableFields] = useState({
    username: false,
  });

  const [patientData, setPatientData] = useState(null);
  const [editablePatientFields, setEditablePatientFields] = useState({});

  const fieldsConfig = [
    { label: "Name",         key: "fullName",     editable: false },
    { label: "Username",     key: "username",     editable: true  },
    { label: "Email",        key: "email",        editable: true  },
    { label: "Phone Number", key: "phone_number", editable: true  },
    { label: "Address",      key: "address",      editable: true  },
  ];

  const patientFieldsConfig = [
    { label: "Emergency Contact Name",  key: "emergency_contact_name",  editable: true },
    { label: "Emergency Contact Phone", key: "emergency_contact_phone", editable: true },
    { label: "Medical History", key: "medical_history", editable: true },
    { label: "Insurance Provider", key: "insurance_provider", editable: true },
    { label: "Insurance Policy Number", key: "insurance_policy_number", editable: true },
  ];

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("access");
      if (!token) {
        console.log("No access token found in localStorage");
        return;
      }

      let userId;
      try {
        const decoded = jwtDecode(token);
        console.log("Decoded token:", decoded);
        userId = decoded.user_id || decoded.id;
        console.log("Extracted userId:", userId);
      } catch (err) {
        console.error("Failed to decode token:", err);
        return;
      }

      if (!userId) {
        console.error("No user_id in decoded token. Cannot fetch user.");
        return;
      }

      try {
        const userRes = await getUserById(userId);
        console.log("Fetched userRes:", userRes);
        setUserData(userRes);

        if (userRes.user_type === "patient") {
          console.log("User is patient. Attempting to fetch patient data...");
          try {
            const pId = await getPatientId();
            console.log("Patient ID from getPatientId():", pId);

            if (pId) {
              const pRes = await getPatientById(pId);
              console.log("Fetched patient data:", pRes);
              setPatientData(pRes);
            } else {
              console.log("No patient ID returned from getPatientId().");
            }
          } catch (err) {
            console.error("Failed to fetch patient data:", err);
          }
        } else {
          console.log("User is not a patient. Skipping patient fetch.");
        }
      } catch (err) {
        console.error("Failed to fetch user info:", err);
      }
    };

    fetchData();
  }, []);

  const handleChange = (field, value) => {
    setUserData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePatientChange = (field, value) => {
    setPatientData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      console.log("handleSave() called.");
      console.log("Current userData:", userData);

      const userPayload = {
        username: userData.username,
        email: userData.email,
        phone_number: userData.phone_number,
        address: userData.address,
      };
      console.log("User update payload:", userPayload);

      if (!userData.id) {
        console.error("No user ID found; cannot update user.");
      } else {

        const userUpdateResponse = await updateUser(userData.id, userPayload);
        console.log("User update response:", userUpdateResponse);
      }

      if (userData.user_type === "patient" && patientData?.id) {
        console.log("User is patient. Attempting to update patient data.");
        console.log("Current patientData:", patientData);

        const patientPayload = {
          emergency_contact_name:  patientData.emergency_contact_name,
          emergency_contact_phone: patientData.emergency_contact_phone,
          medical_history:  patientData.medical_history,
          insurance_provider:  patientData.insurance_provider,
          insurance_policy_number: patientData.insurance_policy_number,
        };
        console.log("Patient update payload:", patientPayload);

        const patientUpdateResponse = await updatePatient(patientData.id, patientPayload);
        console.log("Patient update response:", patientUpdateResponse);
      }

      alert("Profile updated successfully.");
    } catch (err) {
      console.error("Failed to update profile:", err);
      alert("Update failed.");
    }
  };

  const renderField = (label, value, fieldKey, editable = false) => (
    <div className="appointment-info-grid" style={{ marginBottom: "1rem" }} key={fieldKey}>
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

  const renderPatientField = (label, value, fieldKey, editable = false) => (
    <div className="appointment-info-grid" style={{ marginBottom: "1rem" }} key={fieldKey}>
      <div><strong>{label}:</strong></div>
      <div>
        {editablePatientFields[fieldKey] ? (
          <input
            type="text"
            value={value || ""}
            onChange={(e) => handlePatientChange(fieldKey, e.target.value)}
          />
        ) : (
          <span>{value || "Not Provided"}</span>
        )}
        {editable && (
          <button
            className="confirm-button"
            style={{ marginLeft: "10px", padding: "6px 12px" }}
            onClick={() =>
              setEditablePatientFields((prev) => ({
                ...prev,
                [fieldKey]: !prev[fieldKey]
              }))
            }
          >
            {editablePatientFields[fieldKey] ? "Lock" : "Edit"}
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
              return renderField(
                field.label,
                valueToDisplay,
                "",
                field.editable
              );
            } else {
              valueToDisplay = userData[field.key] || "";
              return renderField(
                field.label,
                valueToDisplay,
                field.key,
                field.editable
              );
            }
          })}

          <h2>Additional Info</h2>
          {userData.user_type === "patient" && patientData && (
            <>
              {patientFieldsConfig.map((pField) => {
                const val = patientData[pField.key] || "";
                return renderPatientField(
                  pField.label,
                  val,
                  pField.key,
                  pField.editable
                );
              })}
            </>
          )}

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
