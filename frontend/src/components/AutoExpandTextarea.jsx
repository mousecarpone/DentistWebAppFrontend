import React, { useEffect, useRef } from "react";

const AutoExpandTextarea = ({ value, onChange, placeholder }) => {
  const ref = useRef();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";
  }, [value]);

  return (
    <textarea
      ref={ref}
      className="auto-expand-textarea"
      value={value}
      onChange={(e) => {
        onChange(e); // trigger parent update
      }}
      placeholder={placeholder}
      rows={1}
      style={{ overflow: "hidden" }}
    />
  );
};

export default AutoExpandTextarea;
