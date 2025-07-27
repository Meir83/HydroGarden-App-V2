import React, { memo, useEffect, useState } from 'react';
import { theme } from '../styles/theme';

const Toast = memo(({ 
  message,
  type = 'info',
  duration = 4000,
  onClose,
  position = 'bottom-right'
}) => {
  const [isVisible, setIsVisible] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, duration);
    
    return () => clearTimeout(timer);
  }, [duration, onClose]);
  
  const types = {
    success: {
      backgroundColor: theme.colors.success,
      icon: '✓'
    },
    error: {
      backgroundColor: theme.colors.error,
      icon: '✕'
    },
    warning: {
      backgroundColor: theme.colors.warning,
      icon: '⚠'
    },
    info: {
      backgroundColor: theme.colors.info,
      icon: 'ℹ'
    }
  };
  
  const positions = {
    'top-right': { top: theme.spacing.lg, right: theme.spacing.lg },
    'top-left': { top: theme.spacing.lg, left: theme.spacing.lg },
    'bottom-right': { bottom: theme.spacing.lg, right: theme.spacing.lg },
    'bottom-left': { bottom: theme.spacing.lg, left: theme.spacing.lg },
    'top-center': { top: theme.spacing.lg, left: '50%', transform: 'translateX(-50%)' },
    'bottom-center': { bottom: theme.spacing.lg, left: '50%', transform: 'translateX(-50%)' }
  };
  
  const toastStyle = {
    position: 'fixed',
    ...positions[position],
    backgroundColor: types[type].backgroundColor,
    color: '#ffffff',
    padding: `${theme.spacing.md} ${theme.spacing.lg}`,
    borderRadius: theme.borderRadius.md,
    boxShadow: theme.shadows.lg,
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.sm,
    zIndex: 1000,
    minWidth: '300px',
    maxWidth: '500px',
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    animation: isVisible ? 'slideUp 0.3s ease-out' : 'fadeOut 0.3s ease-in',
    transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
    opacity: isVisible ? 1 : 0,
    transition: `all ${theme.transitions.normal}`
  };
  
  const iconStyle = {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold
  };
  
  const closeButtonStyle = {
    marginLeft: 'auto',
    background: 'none',
    border: 'none',
    color: '#ffffff',
    cursor: 'pointer',
    fontSize: theme.typography.fontSize.lg,
    opacity: 0.8,
    padding: 0,
    ':hover': {
      opacity: 1
    }
  };
  
  return (
    <div style={toastStyle} role="alert">
      <span style={iconStyle}>{types[type].icon}</span>
      <span>{message}</span>
      <button 
        style={closeButtonStyle}
        onClick={() => {
          setIsVisible(false);
          setTimeout(onClose, 300);
        }}
        aria-label="סגור הודעה"
      >
        ×
      </button>
    </div>
  );
});

Toast.displayName = 'Toast';

export default Toast;