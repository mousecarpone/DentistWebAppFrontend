import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import "../styles/Portal.css";
import "../styles/Appointments.css";
import { getMyMedicalHistory, getUserAppointments, getDentists } from "../api";

function History() {
  const [medicalHistory, setMedicalHistory] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [dentists, setDentists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [medHist, apptData, dentistData] = await Promise.all([
          getMyMedicalHistory(),
          getUserAppointments(),
          getDentists()
        ]);
        setMedicalHistory(medHist);
        setAppointments(apptData);
        setDentists(dentistData);
      } catch (err) {
        console.error("Failed to fetch history data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getDentistName = (dentist) => {
    const match = dentists.find((doc) => doc.id === dentist?.id);
    if (match?.user) {
      const { first_name, last_name, username } = match.user;
      return first_name || last_name
        ? `Dr. ${first_name || ""} ${last_name || ""}`.trim()
        : `Dr. ${username}`;
    }
    return `Dr. ${dentist?.username || "Unknown"}`;
  };

  return (
    <div className="page-container">
      <Sidebar activePage="history" />
      <div className="dashboard-content appointments-inner">
        <h1 className="page-title">Medical & Appointment History</h1>

        {loading ? (
          <p>Loading history...</p>
        ) : (
          <>
            <div className="appointment-section">
              <h2>Past Appointments</h2>
              <div className="appointments-list">
                {appointments.length > 0 ? (
                  appointments
                    .filter((a) => new Date(a.appointment_date) < new Date())
                    .sort((a, b) => new Date(b.appointment_date) - new Date(a.appointment_date))
                    .map((appt) => (
                      <div className="card" key={appt.id}>
                        <div className="appointment-info-grid">
                          <div><strong>Dentist:</strong></div>
                          <div>{getDentistName(appt.dentist)}</div>

                          <div><strong>Date:</strong></div>
                          <div>{new Date(appt.appointment_date).toLocaleDateString()}</div>

                          <div><strong>Time:</strong></div>
                          <div>{new Date(appt.appointment_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>

                          <div><strong>Reason:</strong></div>
                          <div>{appt.services?.map(s => s.name).join(", ") || "N/A"}</div>

                          <div><strong>Notes:</strong></div>
                          <div>{appt.notes || "None"}</div>
                        </div>
                      </div>
                    ))
                ) : (
                  <p>No past appointments recorded.</p>
                )}
              </div>
            </div>

            <div className="appointment-section">
              <h2>Medical History</h2>
              <div className="appointments-list">
                {medicalHistory.length > 0 ? (
                  medicalHistory.map((entry) => (
                    <div className="card" key={entry.id}>
                      <div className="appointment-info-grid">
                        <div><strong>Conditions:</strong></div>
                        <div>{entry.conditions || "None reported"}</div>

                        <div><strong>Medications:</strong></div>
                        <div>{entry.medications || "None listed"}</div>

                        <div><strong>Allergies:</strong></div>
                        <div>{entry.allergies || "None"}</div>

                        <div><strong>Additional Notes:</strong></div>
                        <div>{entry.notes || "N/A"}</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No medical history available.</p>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default History;
