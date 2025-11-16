import React, { useEffect } from "react";
import "../styles/Toast.css";

const Toast = ({ message, type = "success", onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`toast-container ${type}`}>
      <p>{message}</p>
    </div>
  );
};

export default Toast;
