import React, { memo, forwardRef } from 'react';
import { theme } from '../styles/theme';

const InputForm = memo(forwardRef(({ 
  type = 'text',
  label,
  placeholder,
  value,
  onChange,
  error,
  disabled = false,
  required = false,
  multiline = false,
  rows = 3,
  ...props
}, ref) => {
  const inputStyle = {
    width: '100%',
    padding: theme.spacing.md,
    border: `2px solid ${error ? theme.colors.error : theme.colors.secondary[300]}`,
    borderRadius: theme.borderRadius.md,
    fontSize: theme.typography.fontSize.base,
    fontFamily: theme.typography.fontFamily.primary,
    backgroundColor: disabled ? theme.colors.secondary[100] : theme.colors.background.default,
    color: theme.colors.text.primary,
    transition: `border-color ${theme.transitions.fast}`,
    outline: 'none',
    direction: 'rtl',
    textAlign: 'right',
    ':focus': {
      borderColor: theme.colors.primary.main,
      boxShadow: `0 0 0 3px ${theme.colors.primary.main}20`
    }
  };
  
  const labelStyle = {
    display: 'block',
    marginBottom: theme.spacing.xs,
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text.primary,
    textAlign: 'right'
  };
  
  const errorStyle = {
    marginTop: theme.spacing.xs,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.error,
    textAlign: 'right'
  };
  
  const containerStyle = {
    marginBottom: theme.spacing.md
  };
  
  const InputComponent = multiline ? 'textarea' : 'input';
  
  return (
    <div style={containerStyle}>
      {label && (
        <label style={labelStyle}>
          {label}
          {required && <span style={{ color: theme.colors.error }}> *</span>}
        </label>
      )}
      <InputComponent
        ref={ref}
        type={multiline ? undefined : type}
        rows={multiline ? rows : undefined}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        style={inputStyle}
        {...props}
      />
      {error && <div style={errorStyle}>{error}</div>}
    </div>
  );
}));

InputForm.displayName = 'InputForm';

export default InputForm;