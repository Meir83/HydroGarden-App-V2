import React, { memo, useEffect, useCallback } from 'react';
import { theme } from '../styles/theme';

const Modal = memo(({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'medium',
  closeOnBackdrop = true 
}) => {
  const sizes = {
    small: '400px',
    medium: '500px',
    large: '700px'
  };
  
  const handleBackdropClick = useCallback((e) => {
    if (closeOnBackdrop && e.target === e.currentTarget) {
      onClose();
    }
  }, [closeOnBackdrop, onClose]);
  
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') {
      onClose();
    }
  }, [onClose]);
  
  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        document.body.style.overflow = 'unset';
      };
    }
  }, [isOpen, handleKeyDown]);
  
  if (!isOpen) return null;
  
  const backdropStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: theme.spacing.md
  };
  
  const modalStyle = {
    backgroundColor: theme.colors.background.default,
    borderRadius: theme.borderRadius.lg,
    boxShadow: theme.shadows.xl,
    width: '100%',
    maxWidth: sizes[size],
    maxHeight: '90vh',
    overflow: 'auto',
    animation: 'slideUp 0.3s ease-out'
  };
  
  const headerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing.lg,
    borderBottom: `1px solid ${theme.colors.secondary[200]}`
  };
  
  const titleStyle = {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
    margin: 0
  };
  
  const closeButtonStyle = {
    background: 'none',
    border: 'none',
    fontSize: theme.typography.fontSize.xl,
    cursor: 'pointer',
    color: theme.colors.text.secondary,
    padding: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
    transition: `color ${theme.transitions.fast}`,
    ':hover': {
      color: theme.colors.text.primary
    }
  };
  
  const contentStyle = {
    padding: theme.spacing.lg
  };
  
  return (
    <div style={backdropStyle} onClick={handleBackdropClick}>
      <div style={modalStyle} role="dialog" aria-modal="true" aria-labelledby="modal-title">
        {title && (
          <div style={headerStyle}>
            <h2 id="modal-title" style={titleStyle}>{title}</h2>
            <button 
              style={closeButtonStyle} 
              onClick={onClose}
              aria-label="סגור חלון"
            >
              ×
            </button>
          </div>
        )}
        <div style={contentStyle}>
          {children}
        </div>
      </div>
    </div>
  );
});

Modal.displayName = 'Modal';

export default Modal;