import React, { memo } from 'react';
import { theme } from '../styles/theme';

const Button = memo(({ 
  children,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  fullWidth = false,
  onClick,
  type = 'button',
  ...props
}) => {
  const variants = {
    primary: {
      backgroundColor: theme.colors.primary.main,
      color: '#ffffff',
      border: `2px solid ${theme.colors.primary.main}`,
      ':hover': {
        backgroundColor: theme.colors.primary[600]
      }
    },
    secondary: {
      backgroundColor: 'transparent',
      color: theme.colors.primary.main,
      border: `2px solid ${theme.colors.primary.main}`,
      ':hover': {
        backgroundColor: theme.colors.primary[50]
      }
    },
    danger: {
      backgroundColor: theme.colors.error,
      color: '#ffffff',
      border: `2px solid ${theme.colors.error}`,
      ':hover': {
        backgroundColor: '#dc2626'
      }
    },
    ghost: {
      backgroundColor: 'transparent',
      color: theme.colors.text.primary,
      border: '2px solid transparent',
      ':hover': {
        backgroundColor: theme.colors.secondary[100]
      }
    }
  };
  
  const sizes = {
    small: {
      padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
      fontSize: theme.typography.fontSize.sm
    },
    medium: {
      padding: `${theme.spacing.sm} ${theme.spacing.lg}`,
      fontSize: theme.typography.fontSize.base
    },
    large: {
      padding: `${theme.spacing.md} ${theme.spacing.xl}`,
      fontSize: theme.typography.fontSize.lg
    }
  };
  
  const baseStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.borderRadius.md,
    fontWeight: theme.typography.fontWeight.medium,
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: `all ${theme.transitions.fast}`,
    outline: 'none',
    fontFamily: theme.typography.fontFamily.primary,
    textDecoration: 'none',
    userSelect: 'none',
    ...variants[variant],
    ...sizes[size],
    ...(fullWidth && { width: '100%' }),
    ...(disabled && {
      opacity: 0.6,
      cursor: 'not-allowed'
    })
  };
  
  return (
    <button
      type={type}
      style={baseStyle}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;