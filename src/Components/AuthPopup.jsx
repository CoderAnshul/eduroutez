import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const AuthPopup = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isOpen) return;

    navigate('/login', {
      state: {
        backgroundLocation: location.state?.backgroundLocation || location,
      },
    });

    if (onClose) {
      onClose();
    }
  }, [isOpen, onClose, navigate, location]);

  if (!isOpen) return null;

  return null;
};

export default AuthPopup;
