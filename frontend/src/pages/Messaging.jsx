import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import "../styles/Portal.css";
import {
  getMessages,
  sendMessage,
  updateMessage,
  deleteMessage,
  replyToMessage,
  getDentists,
  getInboxMessages,
  getMessageById,
  refreshToken,
} from "../api";
import axios from "axios";

const Messaging = () => {
  const [messages, setMessages] = useState([]);
  const [inboxMessages, setInboxMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [dentists, setDentists] = useState([]);
  const [newMessage, setNewMessage] = useState({
    recipient_id: "",
    subject: "",
    body: "",
  });
  const [replyMessage, setReplyMessage] = useState({
    recipient_id: "",
    subject: "",
    body: "",
  });
  const [error, setError] = useState("");
  const [view, setView] = useState("inbox"); // "inbox" or "all"

  // Fetch dentists and messages on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch dentists
        try {
          const dentistsData = await getDentists();
          setDentists(dentistsData);
        } catch (dentistErr) {
          console.error("Failed to fetch dentists:", dentistErr);
          setError("Could not load recipient list. Please try again.");
        }

        // Fetch messages
        try {
          const messagesData = await getMessages();
          setMessages(messagesData);
        } catch (messagesErr) {
          console.error("Failed to fetch messages:", messagesErr);
          setError("Could not load messages. Please try again.");
        }

        // Fetch inbox messages
        try {
          const inboxData = await getInboxMessages();
          setInboxMessages(inboxData);
        } catch (inboxErr) {
          console.error("Failed to fetch inbox messages:", inboxErr);
          setError("Could not load inbox messages. Please try again.");
        }
      } catch (err) {
        handleError(err);
      }
    };
    fetchData();
  }, []);

  // Handle API errors (e.g., token expiration)
  const handleError = async (err) => {
    if (err.response && err.response.status === 401) {
      try {
        await refreshToken();
        // Retry the failed requests
        const dentistsData = await getDentists();
        setDentists(dentistsData);
        const messagesData = await getMessages();
        setMessages(messagesData);
        const inboxData = await getInboxMessages();
        setInboxMessages(inboxData);
        setError("");
      } catch (refreshErr) {
        setError("Session expired. Please log in again.");
      }
    } else if (err.code === "ERR_NETWORK") {
      setError("Cannot connect to the server. Please ensure the backend is running.");
    } else {
      setError(err.response?.data?.detail || "An error occurred.");
    }
  };

  // Handle selecting a message to view
  const handleSelectMessage = async (message) => {
    try {
      const messageData = await getMessageById(message.id);
      setSelectedMessage(messageData);
      // Pre-fill the reply form subject with "Re: [original subject]"
      setReplyMessage({
        recipient_id: messageData.sender.id,
        subject: `Re: ${messageData.subject}`,
        body: "",
      });
      if (!messageData.is_read) {
        await updateMessage(message.id, { is_read: true });
        // Refresh messages
        const messagesData = await getMessages();
        setMessages(messagesData);
        const inboxData = await getInboxMessages();
        setInboxMessages(inboxData);
      }
    } catch (err) {
      handleError(err);
    }
  };

  // Handle sending a new message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    try {
      await sendMessage(newMessage);
      setNewMessage({ recipient_id: "", subject: "", body: "" });
      const messagesData = await getMessages();
      setMessages(messagesData);
      const inboxData = await getInboxMessages();
      setInboxMessages(inboxData);
      setError("");
    } catch (err) {
      handleError(err);
    }
  };

  // Handle replying to a message
  const handleReplyMessage = async (e) => {
    e.preventDefault();
    try {
      await replyToMessage(selectedMessage.id, {
        ...replyMessage,
        recipient_id: selectedMessage.sender.id, // Use the sender's User ID
      });
      setReplyMessage({ recipient_id: "", subject: "", body: "" });
      setSelectedMessage(null); // Optionally close the reply section after sending
      const messagesData = await getMessages();
      setMessages(messagesData);
      const inboxData = await getInboxMessages();
      setInboxMessages(inboxData);
      setError("");
    } catch (err) {
      handleError(err);
    }
  };

  // Handle deleting a message
  const handleDeleteMessage = async (messageId) => {
    try {
      await deleteMessage(messageId);
      setSelectedMessage(null);
      setReplyMessage({ recipient_id: "", subject: "", body: "" });
      const messagesData = await getMessages();
      setMessages(messagesData);
      const inboxData = await getInboxMessages();
      setInboxMessages(inboxData);
      setError("");
    } catch (err) {
      handleError(err);
    }
  };

  // Format date for display
  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleString();
  };

  return (
    <div className="portal-container">
      <Sidebar />
      <div className="main-content">
        <h2>Messaging</h2>
        {error && <div className="error-message">{error}</div>}

        {/* View Toggle */}
        <div className="view-toggle">
          <button
            className={view === "inbox" ? "active" : ""}
            onClick={() => setView("inbox")}
          >
            Inbox ({inboxMessages.length})
          </button>
          <button
            className={view === "all" ? "active" : ""}
            onClick={() => setView("all")}
          >
            All Messages
          </button>
        </div>

        {/* Message List */}
        <div className="message-list">
          <h3>{view === "inbox" ? "Unread Messages" : "All Messages"}</h3>
          {messages.length === 0 && view === "all" && <p>No messages available.</p>}
          {inboxMessages.length === 0 && view === "inbox" && <p>No unread messages.</p>}
          {(view === "inbox" ? inboxMessages : messages).length > 0 && (
            <table>
              <thead>
                <tr>
                  <th>From</th>
                  <th>To</th>
                  <th>Subject</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {(view === "inbox" ? inboxMessages : messages).map((message) => (
                  <tr
                    key={message.id}
                    onClick={() => handleSelectMessage(message)}
                    className={selectedMessage?.id === message.id ? "selected" : ""}
                  >
                    <td>{message.sender?.username || "Unknown"}</td>
                    <td>{message.recipient?.username}</td>
                    <td>{message.subject}</td>
                    <td>{formatDate(message.created_at)}</td>
                    <td>{message.is_read ? "Read" : "Unread"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Message Details */}
        {selectedMessage && (
          <div className="message-details">
            <h3>Message Details</h3>
            <p><strong>From:</strong> {selectedMessage.sender?.username}</p>
            <p><strong>To:</strong> {selectedMessage.recipient?.username}</p>
            <p><strong>Subject:</strong> {selectedMessage.subject}</p>
            <p><strong>Date:</strong> {formatDate(selectedMessage.created_at)}</p>
            <p><strong>Body:</strong> {selectedMessage.body}</p>
            <button onClick={() => handleDeleteMessage(selectedMessage.id)}>
              Delete Message
            </button>

            {/* Reply Form */}
            <div className="reply-form">
              <h4>Reply</h4>
              <form onSubmit={handleReplyMessage}>
                <input
                  type="text"
                  value={replyMessage.subject}
                  onChange={(e) =>
                    setReplyMessage({
                      ...replyMessage,
                      subject: e.target.value,
                    })
                  }
                  placeholder="Subject"
                  required
                />
                <textarea
                  value={replyMessage.body}
                  onChange={(e) =>
                    setReplyMessage({ ...replyMessage, body: e.target.value })
                  }
                  placeholder="Type your reply..."
                  required
                ></textarea>
                <button type="submit">Send Reply</button>
              </form>
            </div>
          </div>
        )}

        {/* New Message Form */}
        <div className="new-message-form">
          <h3>Compose New Message</h3>
          <form onSubmit={handleSendMessage}>
            <select
              value={newMessage.recipient_id}
              onChange={(e) =>
                setNewMessage({ ...newMessage, recipient_id: e.target.value })
              }
              required
            >
              <option value="">Select Recipient</option>
              {dentists.map((dentist) => (
                <option key={dentist.id} value={dentist.user.id}>
                  {dentist.user.username} ({dentist.specialization})
                </option>
              ))}
            </select>
            <input
              type="text"
              value={newMessage.subject}
              onChange={(e) =>
                setNewMessage({ ...newMessage, subject: e.target.value })
              }
              placeholder="Subject"
              required
            />
            <textarea
              value={newMessage.body}
              onChange={(e) =>
                setNewMessage({ ...newMessage, body: e.target.value })
              }
              placeholder="Type your message..."
              required
            ></textarea>
            <button type="submit">Send Message</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Messaging;