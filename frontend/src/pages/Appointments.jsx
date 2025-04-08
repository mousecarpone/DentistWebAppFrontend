import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import "../styles/Portal.css";
import "../styles/Appointments.css";

function Appointments() {
    const [appointments, setAppointments] = useState([]);
    const [dentists, setDentists] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const token = localStorage.getItem("access");
                const response = await axios.get("http://127.0.0.1:8000/appointments/", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setAppointments(response.data);
            } catch (error) {
                console.error("❌ Failed to fetch appointments:", error);
            } finally {
                setLoading(false);
            }
        };

        const fetchDentists = async () => {
            try {
                const token = localStorage.getItem("access");
                const response = await axios.get("http://127.0.0.1:8000/users/dentists/", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setDentists(response.data);
            } catch (err) {
                console.error("❌ Failed to fetch dentists:", err);
            }
        };

        fetchAppointments();
        fetchDentists();
    }, []);

    const getDentistName = (appointment) => {
        if (!appointment || !appointment.dentist || !appointment.dentist.id) return "Unknown Dentist";

        const match = dentists.find((doc) => doc.id === appointment.dentist.id);
        if (match && match.user) {
            const hasNames = match.user.first_name || match.user.last_name;
            return hasNames
                ? `Dr. ${match.user.first_name || ""} ${match.user.last_name || ""}`.trim()
                : `Dr. ${match.user.username}`;
        }

        return `Dr. ${appointment.dentist.username || "Unknown"}`;
    };

    return (
        <div className="page-container">
            <Sidebar activePage="appointments" />
            <div className="dashboard-content">
                <h1 className="page-title">Your Appointments</h1>
                <div className="appointments-controls">
                    <button
                        className="confirm-button"
                        onClick={() => navigate("/appointment/create")}
                    >
                        Create New Appointment
                    </button>
                </div>
                <p></p>
                <p></p>
                {loading ? (
                    <p>Loading appointments...</p>
                ) : appointments.length > 0 ? (
                    <div className="dashboard-sections">
                        {appointments
  .sort((a, b) => new Date(b.appointment_date) - new Date(a.appointment_date)) // newest first
  .map((appt) => (
    <div key={appt.id} className="card">
                                <div className="appointment-info-grid">
                                    <div><strong>Dentist:</strong></div>
                                    <div>{getDentistName(appt)}</div>

                                    <div><strong>Date:</strong></div>
                                    <div>{new Date(appt.appointment_date).toLocaleDateString()}</div>

                                    <div><strong>Time:</strong></div>
                                    <div>{new Date(appt.appointment_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>

                                    <div><strong>Reason:</strong></div>
<div>
    {appt.services && appt.services.length > 0
        ? appt.services.map(service => service.name).join(", ")
        : "N/A"}
</div>

                                    <div><strong>Notes:</strong></div>
                                    <div>{appt.notes || "None"}</div>
                                </div>

                                {new Date(appt.appointment_date) > new Date() ? (
  <button
    className="confirm-button"
    onClick={() => navigate(`/appointment/edit/${appt.id}`)}
  >
    Edit Appointment
  </button>
) : (
  <p style={{ fontStyle: "italic", color: "#888", marginTop: "10px" }}>
    This appointment has already occurred.
  </p>
)}

                            </div>
                        ))}
                    </div>
                ) : (
                    <p>You have no appointments yet.</p>
                )}
            </div>
        </div>
    );
}

export default Appointments;
