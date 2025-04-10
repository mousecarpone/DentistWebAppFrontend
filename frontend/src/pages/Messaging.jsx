import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import "../styles/Portal.css";
import {
  getMessages,
  sendMessage,
  updateMessage,
  deleteMessage,
  replyToMessage,
  getDentists
} from "../api";

function Messaging() {
  const [messages, setMessages] = useState([]);
  const [selectedDentist, setSelectedDentist] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [dentists, setDentists] = useState([]);
  const [expandedMessageId, setExpandedMessageId] = useState(null);
  const [replyTextMap, setReplyTextMap] = useState({});

  useEffect(() => {
    fetchMessages();
    fetchDentists();
  }, []);

  const fetchMessages = async () => {
    try {
      const data = await getMessages();
      setMessages(data);
    } catch (err) {
      console.error("Failed to fetch messages:", err);
    }
  };

  const fetchDentists = async () => {
    try {
      const dentistData = await getDentists();
      setDentists(dentistData);
    } catch (error) {
      console.error("Failed to fetch dentist list:", error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!selectedDentist || !subject || !body) {
      alert("Please select a dentist, subject, and message body.");
      return;
    }

    try {
      const dentistObj = dentists.find((d) => d.id === parseInt(selectedDentist));
      if (!dentistObj) {
        alert("Invalid dentist selected.");
        return;
      }

      const dentistUserId = dentistObj.user.id;

      await sendMessage({
        recipient_id: dentistUserId,
        subject,
        body,
      });

      alert("Message sent successfully!");
      setSelectedDentist("");
      setSubject("");
      setBody("");

      fetchMessages();
    } catch (err) {
      console.error("Failed to send message:", err);
      alert("Send message failed.");
    }
  };

  const toggleExpand = (msgId) => {
    setExpandedMessageId((prev) => (prev === msgId ? null : msgId));
  };

  const markAsRead = async (msg) => {
    if (msg.is_read) return;

    try {
      await updateMessage(msg.id, {
        recipient_id: msg.recipient?.id, 
        subject: msg.subject,
        body: msg.body,
        is_read: false,
      });
      fetchMessages();
    } catch (err) {
      console.error("Failed to mark as read:", err);
    }
  };

  const handleDelete = async (msg) => {
    if (!window.confirm("Are you sure you want to delete this message?")) return;

    try {
      await deleteMessage(msg.id);
      alert("Message deleted.");
      fetchMessages();
    } catch (err) {
      console.error("Failed to delete message:", err);
    }
  };

  const handleReply = async (msg) => {
    const replyBody = replyTextMap[msg.id] || "";
    if (!replyBody) {
      alert("Please enter a reply message.");
      return;
    }
    try {
      const recipientId = msg.sender?.id;

      await replyToMessage(msg.id, {
        subject: `Re: ${msg.subject}`,
        body: replyBody,
        recipient_id: recipientId,
      });

      alert("Reply sent!");
      setReplyTextMap((prev) => ({ ...prev, [msg.id]: "" }));
      fetchMessages();
    } catch (err) {
      console.error("Failed to send reply:", err);
    }
  };

  const renderMessageCard = (msg) => {
    const isExpanded = expandedMessageId === msg.id;
    const replyText = replyTextMap[msg.id] || "";

    return (
      <div className="card" key={msg.id} style={{ marginBottom: "1rem" }}>
        <p>
          <strong>Subject:</strong> {msg.subject}, <b>To:</b> {msg.recipient?.username},{" "}
          <b>Date:</b> {new Date(msg.created_at).toLocaleString()}
        </p>
        <button
          className="link"
          onClick={() => {
            toggleExpand(msg.id);
            markAsRead(msg);
          }}
        >
          {isExpanded ? "Collapse" : "Expand"}
        </button>
        {isExpanded && (
          <div style={{ marginTop: "1rem" }}>
            <p>{msg.body}</p>

            <div style={{ marginTop: "1rem" }}>
              <textarea
                rows="3"
                placeholder="Type your reply..."
                value={replyText}
                onChange={(e) =>
                  setReplyTextMap((prev) => ({
                    ...prev,
                    [msg.id]: e.target.value,
                  }))
                }
              />
              <button
                style={{ marginLeft: "10px" }}
                className="confirm-button"
                onClick={() => handleReply(msg)}
              >
                Send Reply
              </button>
            </div>

            <button
              className="danger-button"
              style={{ marginTop: "10px" }}
              onClick={() => handleDelete(msg)}
            >
              Delete
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="page-container">
      <Sidebar activePage="messaging" />
      <div className="dashboard-content">
        <h1 className="page-title">Messaging</h1>

        <div className="dashboard-sections two-column">
          <div className="left-column">
            <div className="card upload-card">
              <form onSubmit={handleSendMessage}>
                <label>Select Dentist:</label>
                <select
                  value={selectedDentist}
                  onChange={(e) => setSelectedDentist(e.target.value)}
                  required
                >
                  <option value="">--Choose a Dentist--</option>
                  {dentists.map((dent) => (
                    <option key={dent.id} value={dent.id}>
                      Dr. {dent.user?.last_name}
                    </option>
                  ))}
                </select>

                <label>Subject:</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                />

                <label>Message Body:</label>
                <textarea
                  rows="3"
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  required
                />

                <button
                  type="submit"
                  className="confirm-button"
                  style={{ marginTop: "10px" }}
                >
                  Send
                </button>
              </form>
            </div>
          </div>

          <div className="right-column">
            {messages && messages.length > 0 ? (
              messages.map((msg) => renderMessageCard(msg))
            ) : (
              <p>No messages found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Messaging;
