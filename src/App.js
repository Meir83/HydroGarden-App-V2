import React, { memo, useState, useCallback } from 'react';
import { theme } from './styles/theme';
import { Card, Button, Modal, InputForm, LoadingSpinner, Toast } from './components';
import Dashboard from './screens/Dashboard';
import Plants from './screens/Plants';
import Calendar from './screens/Calendar';
import Guide from './screens/Guide';
import Community from './screens/Community';
import Settings from './screens/Settings';

const App = memo(() => {
  const [currentScreen, setCurrentScreen] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState(null);
  
  const showToast = useCallback((message, type = 'info') => {
    setToast({ message, type, id: Date.now() });
  }, []);
  
  const hideToast = useCallback(() => {
    setToast(null);
  }, []);
  
  const navigateTo = useCallback((screen) => {
    setCurrentScreen(screen);
  }, []);
  
  const navigationItems = [
    { id: 'dashboard', label: 'דף בית', icon: '🏠' },
    { id: 'plants', label: 'צמחים', icon: '🌱' },
    { id: 'calendar', label: 'לוח זמנים', icon: '📅' },
    { id: 'guide', label: 'מדריך', icon: '📚' },
    { id: 'community', label: 'קהילה', icon: '👥' },
    { id: 'settings', label: 'הגדרות', icon: '⚙️' }
  ];
  
  const renderScreen = () => {
    const screenProps = { showToast, setIsLoading };
    
    switch (currentScreen) {
      case 'dashboard':
        return <Dashboard {...screenProps} />;
      case 'plants':
        return <Plants {...screenProps} />;
      case 'calendar':
        return <Calendar {...screenProps} />;
      case 'guide':
        return <Guide {...screenProps} />;
      case 'community':
        return <Community {...screenProps} />;
      case 'settings':
        return <Settings {...screenProps} />;
      default:
        return <Dashboard {...screenProps} />;
    }
  };
  
  const appStyle = {
    direction: 'rtl',
    fontFamily: theme.typography.fontFamily.hebrew,
    minHeight: '100vh',
    backgroundColor: theme.colors.background.default
  };
  
  const containerStyle = {
    maxWidth: '800px',
    margin: '0 auto',
    padding: theme.spacing.md,
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing.lg
  };
  
  const headerStyle = {
    textAlign: 'center',
    marginBottom: theme.spacing.lg
  };
  
  const titleStyle = {
    fontSize: theme.typography.fontSize['4xl'],
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primary.main,
    margin: 0,
    marginBottom: theme.spacing.sm
  };
  
  const subtitleStyle = {
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.text.secondary,
    margin: 0
  };
  
  const navigationStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.xl
  };
  
  const navButtonStyle = (isActive) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: theme.spacing.xs,
    padding: theme.spacing.md,
    backgroundColor: isActive ? theme.colors.primary[50] : 'transparent',
    border: `2px solid ${isActive ? theme.colors.primary.main : theme.colors.secondary[300]}`,
    borderRadius: theme.borderRadius.lg,
    cursor: 'pointer',
    transition: `all ${theme.transitions.fast}`,
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    color: isActive ? theme.colors.primary.main : theme.colors.text.primary,
    ':hover': {
      backgroundColor: isActive ? theme.colors.primary[100] : theme.colors.secondary[50],
      borderColor: theme.colors.primary.main
    }
  });
  
  const iconStyle = {
    fontSize: theme.typography.fontSize['2xl']
  };
  
  return (
    <div style={appStyle}>
      <div style={containerStyle}>
        <header style={headerStyle}>
          <h1 style={titleStyle}>🌱 HydroGarden</h1>
          <p style={subtitleStyle}>מערכת ניהול גידול הידרופוני מתקדמת</p>
        </header>
        
        <nav style={navigationStyle}>
          {navigationItems.map((item) => (
            <button
              key={item.id}
              style={navButtonStyle(currentScreen === item.id)}
              onClick={() => navigateTo(item.id)}
            >
              <span style={iconStyle}>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
        
        <main>
          {renderScreen()}
        </main>
        
        {isLoading && (
          <LoadingSpinner 
            size="large" 
            overlay={true} 
            text="טוען..." 
          />
        )}
        
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={hideToast}
            position="bottom-center"
          />
        )}
      </div>
    </div>
  );
});

App.displayName = 'App';

export default App;