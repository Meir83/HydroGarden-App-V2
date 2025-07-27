import React, { memo } from 'react';
import { theme } from '../styles/theme';

const Card = memo(({ 
  children,
  title,
  subtitle,
  hoverable = false,
  clickable = false,
  onClick,
  className = '',
  ...props
}) => {
  const baseStyle = {
    backgroundColor: theme.colors.background.paper,
    border: `1px solid ${theme.colors.secondary[200]}`,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    boxShadow: theme.shadows.sm,
    transition: `all ${theme.transitions.normal}`,
    ...(clickable && {
      cursor: 'pointer'
    }),
    ...(hoverable && {
      ':hover': {
        boxShadow: theme.shadows.md,
        transform: 'translateY(-2px)'
      }
    })
  };
  
  const headerStyle = {
    marginBottom: theme.spacing.md
  };
  
  const titleStyle = {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
    margin: 0,
    marginBottom: subtitle ? theme.spacing.xs : 0
  };
  
  const subtitleStyle = {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    margin: 0
  };
  
  const contentStyle = {
    color: theme.colors.text.primary
  };
  
  return (
    <div 
      style={baseStyle}
      onClick={clickable ? onClick : undefined}
      className={`card ${className}`}
      {...props}
    >
      {(title || subtitle) && (
        <div style={headerStyle}>
          {title && <h3 style={titleStyle}>{title}</h3>}
          {subtitle && <p style={subtitleStyle}>{subtitle}</p>}
        </div>
      )}
      <div style={contentStyle}>
        {children}
      </div>
    </div>
  );
});

Card.displayName = 'Card';

export default Card;