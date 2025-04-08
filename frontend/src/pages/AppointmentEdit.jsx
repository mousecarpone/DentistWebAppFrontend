import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import "../styles/Portal.css";
import "../styles/Appointments.css";

function AppointmentEdit() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [appointment, setAppointment] = useState(null);
    const [dentists, setDentists] = useState([]);
    const [rescheduling, setRescheduling] = useState(false);
    const [canceling, setCanceling] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState("");
    const [availableTimes, setAvailableTimes] = useState([]);
    const [loadingTimes, setLoadingTimes] = useState(false);
    const [showToast, setShowToast] = useState(false);

    // Fetch appointment + dentist list
    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem("access");
            const headers = { Authorization: `Bearer ${token}` };

            try {
                const apptRes = await axios.get(`http://127.0.0.1:8000/appointments/${id}/`, { headers });
                setAppointment(apptRes.data);
            } catch (err) {
                console.error("❌ Failed to fetch appointment:", err);
            }

            try {
                const dentistRes = await axios.get("http://127.0.0.1:8000/users/dentists/", { headers });
                setDentists(dentistRes.data);
            } catch (err) {
                console.error("❌ Failed to fetch dentists:", err);
            }
        };

        fetchData();
    }, [id]);

    // Fetch time slots on date change
    useEffect(() => {
        const fetchTimes = async () => {
            if (!appointment?.dentist?.id || !selectedDate) return;

            const dateStr = selectedDate.toISOString().split("T")[0];
            const token = localStorage.getItem("access");
            const headers = { Authorization: `Bearer ${token}` };

            setLoadingTimes(true);
            try {
                const res = await axios.get(
                    `http://127.0.0.1:8000/appointments/time-slots/?dentist_id=${appointment.dentist.id}&date=${dateStr}`,
                    { headers }
                );
                setAvailableTimes(res.data.available_slots || []);
            } catch (err) {
                console.error("❌ Failed to fetch available times:", err);
                setAvailableTimes([]);
            } finally {
                setLoadingTimes(false);
            }
        };

        fetchTimes();
    }, [appointment, selectedDate]);

    const handleReschedule = async () => {
        try {
            const token = localStorage.getItem("access");
            const headers = { Authorization: `Bearer ${token}` };

            const dateStr = selectedDate.toISOString().split("T")[0];
            const [hour, minute, modifier] = selectedTime.match(/(\d+):(\d+)\s?(am|pm)/i).slice(1);
            let hours = parseInt(hour);
            if (modifier.toLowerCase() === "pm" && hours !== 12) hours += 12;
            if (modifier.toLowerCase() === "am" && hours === 12) hours = 0;
            const timeStr = `${String(hours).padStart(2, '0')}:${minute}:00`;
            const appointmentDate = `${dateStr}T${timeStr}`;

            const updatedData = {
                appointment_date: appointmentDate,
                dentist_id: appointment.dentist?.id,
                patient_id: appointment.patient?.id,
                service_ids: appointment.services?.map((s) => s.id) || [],
                notes: appointment.notes || ""
            };

            
            await axios.put(`http://127.0.0.1:8000/appointments/${id}/`, updatedData, {
                headers: { "Content-Type": "application/json", ...headers }
            });

            navigate("/appointments");
        } catch (err) {
            console.error("❌ Failed to reschedule:", err);
            alert("Could not reschedule.");
        }
    };

    const handleCancel = async () => {
        try {
            const token = localStorage.getItem("access");
            const headers = { Authorization: `Bearer ${token}` };

            await axios.delete(`http://127.0.0.1:8000/appointments/${id}/`, { headers });

            setShowToast(true);
            setTimeout(() => {
                setShowToast(false);
                navigate("/appointments");
            }, 2000);
        } catch (err) {
            console.error("❌ Failed to cancel:", err);
            alert("Could not cancel appointment.");
        }
    };

    const disableDates = ({ date }) => {
        return date < new Date() || date.getDay() === 0 || date.getDay() === 6;
    };

    const toggleReschedule = () => {
        setRescheduling(true);
        setCanceling(false);
        setSelectedDate(null);
        setSelectedTime("");
        setAvailableTimes([]);
    };

    const toggleCancel = () => {
        setCanceling(true);
        setRescheduling(false);
    };

    const getDentistName = () => {
        if (!appointment?.dentist) return "Unknown Dentist";
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
        <>
            {showToast && (
                <div className="toast-notification">
                    Your appointment has been successfully cancelled.
                </div>
            )}
            <div className="page-container">
                <Sidebar activePage="appointments" />
                <div className="dashboard-content">
                    <h1 className="page-title">Edit Appointment</h1>
                    {appointment ? (
                        <div className="dashboard-sections">
                            {/* Summary */}
                            <div className="card step" style={{ alignSelf: "flex-start" }}>
                                <div className="step-number completed">✔</div>
                                <h2>Appointment Summary</h2>
                                <p>
                                    You’ll be meeting with <strong>{getDentistName()}</strong> on <strong>{new Date(appointment.appointment_date).toLocaleDateString()}</strong> at <strong>{new Date(appointment.appointment_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</strong> for <strong>{appointment.services?.map(s => s.name).join(", ")}</strong>.
                                    {appointment.notes && <> You added a note saying “{appointment.notes}”.</>}
                                </p>
                                <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                                    <button className="confirm-button" onClick={toggleReschedule}>Reschedule</button>
                                    <button className="confirm-button" onClick={toggleCancel}>Cancel Appointment</button>
                                </div>
                            </div>

                            {/* Reschedule */}
                            {rescheduling && (
                                <>
                                    <div className="card step fade-in">
                                        <div className={`step-number ${selectedDate ? "completed" : ""}`}>{selectedDate ? "✔" : "1"}</div>
                                        <h2>Select new date</h2>
                                        <p className="instruction-text">Choose your new appointment date:</p>
                                        <Calendar onChange={setSelectedDate} value={selectedDate} tileDisabled={disableDates} />
                                    </div>

                                    <div className="card step fade-in">
                                        <div className={`step-number ${selectedTime ? "completed" : ""}`}>{selectedTime ? "✔" : "2"}</div>
                                        <h2>Select new time</h2>
                                        <p className="instruction-text">Choose a time:</p>
                                        <div className="actions-grid times">
                                            {loadingTimes ? (
                                                <p>Loading available times...</p>
                                            ) : availableTimes.length > 0 ? (
                                                availableTimes.map((time) => (
                                                    <button
                                                        key={time}
                                                        className={`selectable-button ${selectedTime === time ? "selected" : ""}`}
                                                        onClick={() => setSelectedTime(time)}
                                                    >
                                                        {time}
                                                    </button>
                                                ))
                                            ) : (
                                                selectedDate && <p>No available times for this date.</p>
                                            )}
                                        </div>
                                    </div>

                                    {selectedDate && selectedTime && (
                                        <div style={{ marginTop: "20px" }}>
                                            <button
                                                className="confirm-button"
                                                onClick={handleReschedule}
                                            >
                                                Confirm New Time
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}

                            {/* Cancel */}
                            {canceling && (
                                <div className="card step fade-in">
                                    <div className="step-number">1</div>
                                    <h2>Cancel Appointment</h2>
                                    <p>This action cannot be undone. Are you sure you want to cancel?</p>
                                    <button className="confirm-button" onClick={handleCancel}>
                                        Yes, Cancel Appointment
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <p>Loading appointment info...</p>
                    )}
                </div>
            </div>
        </>
    );
}

export default AppointmentEdit;
