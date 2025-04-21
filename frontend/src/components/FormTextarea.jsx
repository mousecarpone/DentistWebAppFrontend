import React from "react";

const FormTextarea = ({ label, value, onChange, rows = 3, required = true }) => {
  return (
    <div className="form-control">
      {label && <label>{label}</label>}
      <textarea
        className="form-input"
        rows={rows}
        value={value}
        onChange={onChange}
        required={required}
      />
    </div>
  );
};

export default FormTextarea;
