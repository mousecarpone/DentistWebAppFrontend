import React from "react";

const FormInput = ({ label, value, onChange, type = "text", required = true }) => {
  return (
    <div className="form-control">
      {label && <label>{label}</label>}
      <input
        type={type}
        className="form-input"
        value={value}
        onChange={onChange}
        required={required}
      />
    </div>
  );
};

export default FormInput;
