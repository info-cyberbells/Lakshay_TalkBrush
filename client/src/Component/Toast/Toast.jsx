import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { hideToast } from "../../features/toastSlice";
import "../../App.css";

const Toast = () => {
  const dispatch = useDispatch();
  const { visible, message, type } = useSelector((state) => state.toast);

  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => dispatch(hideToast()), 2500);
      return () => clearTimeout(timer);
    }
  }, [visible, dispatch]);

  if (!visible) return null;

  return (
    <div className={`custom-toast ${type}`}>
      {message}
    </div>
  );
};

export default Toast;
