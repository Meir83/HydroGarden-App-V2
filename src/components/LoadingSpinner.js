import React, { memo } from 'react';
import { theme } from '../styles/theme';

const LoadingSpinner = memo(({ 
  size = 'medium', 
  color = 'primary',
  overlay = false,
  text = null
}) => {
  const sizes = {
    small: '20px',
    medium: '32px',
    large: '48px'
  };
  
  const colors = {
    primary: theme.colors.primary.main,
    secondary: theme.colors.secondary.main,
    white: '#ffffff'
  };
  
  const spinnerStyle = {
    width: sizes[size],
    height: sizes[size],
    border: `3px solid ${colors[color]}20`,
    borderTop: `3px solid ${colors[color]}`,
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  };
  
  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: theme.spacing.sm,
    ...(overlay && {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      zIndex: 1000,
      justifyContent: 'center'
    })
  };
  
  return (
    <div style={containerStyle}>
      <div style={spinnerStyle} />
      {text && (
        <span style={{ 
          color: colors[color], 
          fontSize: theme.typography.fontSize.sm,
          fontWeight: theme.typography.fontWeight.medium
        }}>
          {text}
        </span>
      )}
    </div>
  );
});

LoadingSpinner.displayName = 'LoadingSpinner';

export default LoadingSpinner;