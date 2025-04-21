import React from "react";
import "../styles/ProfileModal.css"; // create this if needed

const ProfileModal = ({ user, onClose }) => {
  if (!user) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Update Profile</h2>
        <form>
          <label>
            First Name
            <input type="text" defaultValue={user.first_name} />
          </label>
          <label>
            Last Name
            <input type="text" defaultValue={user.last_name} />
          </label>
          <label>
            Email
            <input type="email" defaultValue={user.email} />
          </label>
          <button type="submit">Save</button>
        </form>
        <button className="close-button" onClick={onClose}>X</button>
      </div>
    </div>
  );
};

export default ProfileModal;
