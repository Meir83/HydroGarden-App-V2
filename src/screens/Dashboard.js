import React, { memo, useState, useEffect, useMemo } from 'react';
import { theme } from '../styles/theme';
import { Card, Button } from '../components';

const Dashboard = memo(({ showToast, setIsLoading }) => {
  const [systemData, setSystemData] = useState({
    waterLevel: 85,
    ph: 6.2,
    temperature: 22,
    humidity: 65,
    lightHours: 14,
    plantsCount: 12,
    harvestReady: 3,
    maintenanceDue: 2
  });
  
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  const systemStatus = useMemo(() => {
    const { waterLevel, ph, temperature } = systemData;
    
    if (waterLevel < 20 || ph < 5.5 || ph > 7.0 || temperature < 18 || temperature > 28) {
      return { status: 'warning', message: 'דרושה התערבות' };
    }
    if (waterLevel < 50 || ph < 6.0 || ph > 6.8) {
      return { status: 'caution', message: 'מצב בסדר עם התראות' };
    }
    return { status: 'good', message: 'המערכת פועלת בצורה מושלמת' };
  }, [systemData]);
  
  const handleQuickAction = (action) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      showToast(`${action} בוצע בהצלחה`, 'success');
    }, 1500);
  };
  
  const statusColors = {
    good: theme.colors.success,
    caution: theme.colors.warning,
    warning: theme.colors.error
  };
  
  const containerStyle = {
    display: 'grid',
    gap: theme.spacing.lg,
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))'
  };
  
  const statusCardStyle = {
    textAlign: 'center',
    borderLeft: `4px solid ${statusColors[systemStatus.status]}`
  };
  
  const statusIconStyle = {
    fontSize: '3rem',
    marginBottom: theme.spacing.md
  };
  
  const statusTextStyle = {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    color: statusColors[systemStatus.status],
    margin: 0
  };
  
  const metricsGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: theme.spacing.md,
    marginTop: theme.spacing.lg
  };
  
  const metricStyle = {
    textAlign: 'center',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background.paper,
    borderRadius: theme.borderRadius.md,
    border: `1px solid ${theme.colors.secondary[200]}`
  };
  
  const metricValueStyle = {
    fontSize: theme.typography.fontSize['2xl'],
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primary.main,
    margin: 0
  };
  
  const metricLabelStyle = {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    margin: 0,
    marginTop: theme.spacing.xs
  };
  
  const quickActionsStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: theme.spacing.md,
    marginTop: theme.spacing.lg
  };
  
  const offlineIndicatorStyle = {
    position: 'fixed',
    top: theme.spacing.md,
    left: theme.spacing.md,
    backgroundColor: theme.colors.warning,
    color: '#ffffff',
    padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
    borderRadius: theme.borderRadius.md,
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    zIndex: 1000
  };
  
  return (
    <div>
      {!isOnline && (
        <div style={offlineIndicatorStyle}>
          📱 מצב לא מקוון
        </div>
      )}
      
      <div style={containerStyle}>
        <Card title="סטטוס המערכת" style={statusCardStyle}>
          <div style={statusIconStyle}>
            {systemStatus.status === 'good' ? '✅' : 
             systemStatus.status === 'caution' ? '⚠️' : '🚨'}
          </div>
          <p style={statusTextStyle}>{systemStatus.message}</p>
          
          <div style={metricsGridStyle}>
            <div style={metricStyle}>
              <div style={metricValueStyle}>{systemData.waterLevel}%</div>
              <div style={metricLabelStyle}>מפלס מים</div>
            </div>
            <div style={metricStyle}>
              <div style={metricValueStyle}>{systemData.ph}</div>
              <div style={metricLabelStyle}>רמת pH</div>
            </div>
            <div style={metricStyle}>
              <div style={metricValueStyle}>{systemData.temperature}°C</div>
              <div style={metricLabelStyle}>טמפרטורה</div>
            </div>
            <div style={metricStyle}>
              <div style={metricValueStyle}>{systemData.humidity}%</div>
              <div style={metricLabelStyle}>לחות</div>
            </div>
          </div>
        </Card>
        
        <Card title="סטטיסטיקות גידול">
          <div style={metricsGridStyle}>
            <div style={metricStyle}>
              <div style={metricValueStyle}>{systemData.plantsCount}</div>
              <div style={metricLabelStyle}>צמחים פעילים</div>
            </div>
            <div style={metricStyle}>
              <div style={metricValueStyle}>{systemData.harvestReady}</div>
              <div style={metricLabelStyle}>מוכנים לקציר</div>
            </div>
            <div style={metricStyle}>
              <div style={metricValueStyle}>{systemData.lightHours}h</div>
              <div style={metricLabelStyle}>שעות תאורה</div>
            </div>
            <div style={metricStyle}>
              <div style={metricValueStyle}>{systemData.maintenanceDue}</div>
              <div style={metricLabelStyle}>תחזוקות ממתינות</div>
            </div>
          </div>
        </Card>
        
        <Card title="פעולות מהירות">
          <div style={quickActionsStyle}>
            <Button 
              variant="primary" 
              fullWidth 
              onClick={() => handleQuickAction('השקיה')}
            >
              🚿 השקיה מיידית
            </Button>
            <Button 
              variant="secondary" 
              fullWidth 
              onClick={() => handleQuickAction('בדיקת pH')}
            >
              🧪 בדיקת pH
            </Button>
            <Button 
              variant="secondary" 
              fullWidth 
              onClick={() => handleQuickAction('הדלקת אור')}
            >
              💡 הדלקת תאורה
            </Button>
            <Button 
              variant="secondary" 
              fullWidth 
              onClick={() => handleQuickAction('ניקוי מסננים')}
            >
              🧽 ניקוי מסננים
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
});

Dashboard.displayName = 'Dashboard';

export default Dashboard;