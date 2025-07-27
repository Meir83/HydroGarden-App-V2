import React, { memo, useState, useCallback } from 'react';
import { theme } from '../styles/theme';
import { Card, Button, InputForm, Modal } from '../components';

const Settings = memo(({ showToast, setIsLoading }) => {
  const [settings, setSettings] = useState({
    notifications: {
      waterLevel: true,
      phLevels: true,
      harvest: true,
      maintenance: false,
      community: true
    },
    system: {
      autoWatering: true,
      nightMode: false,
      tempUnit: 'celsius',
      language: 'hebrew',
      backupFrequency: 'weekly'
    },
    user: {
      name: 'מגדל הידרופוני',
      email: 'grower@example.com',
      experience: 'beginner',
      timezone: 'Asia/Jerusalem'
    },
    thresholds: {
      minWaterLevel: 20,
      maxWaterLevel: 95,
      minPH: 5.5,
      maxPH: 6.8,
      minTemp: 18,
      maxTemp: 28
    }
  });
  
  const [isBackupModalOpen, setIsBackupModalOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [exportData, setExportData] = useState('');
  
  const handleSettingChange = useCallback((category, key, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
    
    showToast('הגדרה נשמרה', 'success');
  }, [showToast]);
  
  const handleSaveSettings = useCallback(() => {
    setIsLoading(true);
    
    setTimeout(() => {
      localStorage.setItem('hydrogardenSettings', JSON.stringify(settings));
      setIsLoading(false);
      showToast('כל ההגדרות נשמרו בהצלחה!', 'success');
    }, 1000);
  }, [settings, setIsLoading, showToast]);
  
  const handleExportData = useCallback(() => {
    const dataToExport = {
      settings,
      exportDate: new Date().toISOString(),
      version: '1.0'
    };
    
    setExportData(JSON.stringify(dataToExport, null, 2));
    setIsBackupModalOpen(true);
  }, [settings]);
  
  const handleImportData = useCallback((event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedData = JSON.parse(e.target.result);
          if (importedData.settings) {
            setSettings(importedData.settings);
            showToast('נתונים יובאו בהצלחה!', 'success');
          } else {
            showToast('קובץ לא תקין', 'error');
          }
        } catch (error) {
          showToast('שגיאה בקריאת הקובץ', 'error');
        }
      };
      reader.readAsText(file);
    }
  }, [showToast]);
  
  const handleResetSettings = useCallback(() => {
    setIsLoading(true);
    
    setTimeout(() => {
      const defaultSettings = {
        notifications: {
          waterLevel: true,
          phLevels: true,
          harvest: true,
          maintenance: false,
          community: true
        },
        system: {
          autoWatering: true,
          nightMode: false,
          tempUnit: 'celsius',
          language: 'hebrew',
          backupFrequency: 'weekly'
        },
        user: {
          name: 'מגדל הידרופוני',
          email: 'grower@example.com',
          experience: 'beginner',
          timezone: 'Asia/Jerusalem'
        },
        thresholds: {
          minWaterLevel: 20,
          maxWaterLevel: 95,
          minPH: 5.5,
          maxPH: 6.8,
          minTemp: 18,
          maxTemp: 28
        }
      };
      
      setSettings(defaultSettings);
      setIsResetModalOpen(false);
      setIsLoading(false);
      showToast('ההגדרות אופסו לברירת מחדל', 'success');
    }, 1000);
  }, [setIsLoading, showToast]);
  
  const sectionStyle = {
    marginBottom: theme.spacing.xl
  };
  
  const sectionTitleStyle = {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.primary.main,
    marginBottom: theme.spacing.lg,
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.sm
  };
  
  const settingRowStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.md,
    borderBottom: `1px solid ${theme.colors.secondary[200]}`,
    ':last-child': {
      borderBottom: 'none'
    }
  };
  
  const settingLabelStyle = {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.primary,
    fontWeight: theme.typography.fontWeight.medium
  };
  
  const settingDescStyle = {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.xs
  };
  
  const toggleStyle = (checked) => ({
    position: 'relative',
    width: '48px',
    height: '24px',
    backgroundColor: checked ? theme.colors.primary.main : theme.colors.secondary[300],
    borderRadius: theme.borderRadius.full,
    cursor: 'pointer',
    transition: `all ${theme.transitions.fast}`
  });
  
  const toggleThumbStyle = (checked) => ({
    position: 'absolute',
    top: '2px',
    left: checked ? '26px' : '2px',
    width: '20px',
    height: '20px',
    backgroundColor: '#ffffff',
    borderRadius: theme.borderRadius.full,
    transition: `all ${theme.transitions.fast}`,
    boxShadow: theme.shadows.sm
  });
  
  const selectStyle = {
    padding: theme.spacing.sm,
    border: `2px solid ${theme.colors.secondary[300]}`,
    borderRadius: theme.borderRadius.md,
    fontSize: theme.typography.fontSize.sm,
    backgroundColor: theme.colors.background.default,
    minWidth: '150px'
  };
  
  const inputStyle = {
    padding: theme.spacing.sm,
    border: `2px solid ${theme.colors.secondary[300]}`,
    borderRadius: theme.borderRadius.md,
    fontSize: theme.typography.fontSize.sm,
    width: '100px',
    textAlign: 'center'
  };
  
  const actionsStyle = {
    display: 'flex',
    gap: theme.spacing.md,
    flexWrap: 'wrap',
    marginTop: theme.spacing.xl
  };
  
  const dangerZoneStyle = {
    marginTop: theme.spacing.xl,
    padding: theme.spacing.lg,
    border: `2px solid ${theme.colors.error}`,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: `${theme.colors.error}05`
  };
  
  const Toggle = ({ checked, onChange }) => (
    <div style={toggleStyle(checked)} onClick={() => onChange(!checked)}>
      <div style={toggleThumbStyle(checked)} />
    </div>
  );
  
  return (
    <div>
      <div style={{ marginBottom: theme.spacing.xl }}>
        <h2 style={{ 
          margin: 0, 
          fontSize: theme.typography.fontSize['2xl'],
          marginBottom: theme.spacing.md 
        }}>
          ⚙️ הגדרות מערכת
        </h2>
        <p style={{ 
          color: theme.colors.text.secondary,
          margin: 0,
          fontSize: theme.typography.fontSize.lg 
        }}>
          התאם את המערכת לצרכים שלך
        </p>
      </div>
      
      <div style={sectionStyle}>
        <Card>
          <h3 style={sectionTitleStyle}>
            <span>🔔</span>
            התראות
          </h3>
          
          <div>
            <div style={settingRowStyle}>
              <div>
                <div style={settingLabelStyle}>התראות מפלס מים</div>
                <div style={settingDescStyle}>קבל התראה כאשר מפלס המים נמוך</div>
              </div>
              <Toggle 
                checked={settings.notifications.waterLevel}
                onChange={(value) => handleSettingChange('notifications', 'waterLevel', value)}
              />
            </div>
            
            <div style={settingRowStyle}>
              <div>
                <div style={settingLabelStyle}>התראות רמת pH</div>
                <div style={settingDescStyle}>קבל התראה על שינויים ברמת ה-pH</div>
              </div>
              <Toggle 
                checked={settings.notifications.phLevels}
                onChange={(value) => handleSettingChange('notifications', 'phLevels', value)}
              />
            </div>
            
            <div style={settingRowStyle}>
              <div>
                <div style={settingLabelStyle}>התראות קציר</div>
                <div style={settingDescStyle}>תזכורות לקציר צמחים מוכנים</div>
              </div>
              <Toggle 
                checked={settings.notifications.harvest}
                onChange={(value) => handleSettingChange('notifications', 'harvest', value)}
              />
            </div>
            
            <div style={settingRowStyle}>
              <div>
                <div style={settingLabelStyle}>התראות תחזוקה</div>
                <div style={settingDescStyle}>תזכורות לביצוע תחזוקה שוטפת</div>
              </div>
              <Toggle 
                checked={settings.notifications.maintenance}
                onChange={(value) => handleSettingChange('notifications', 'maintenance', value)}
              />
            </div>
            
            <div style={settingRowStyle}>
              <div>
                <div style={settingLabelStyle}>התראות קהילה</div>
                <div style={settingDescStyle}>עדכונים על פעילות בקהילה</div>
              </div>
              <Toggle 
                checked={settings.notifications.community}
                onChange={(value) => handleSettingChange('notifications', 'community', value)}
              />
            </div>
          </div>
        </Card>
      </div>
      
      <div style={sectionStyle}>
        <Card>
          <h3 style={sectionTitleStyle}>
            <span>🖥️</span>
            הגדרות מערכת
          </h3>
          
          <div>
            <div style={settingRowStyle}>
              <div>
                <div style={settingLabelStyle}>השקיה אוטומטית</div>
                <div style={settingDescStyle}>הפעל השקיה אוטומטית לפי לוח זמנים</div>
              </div>
              <Toggle 
                checked={settings.system.autoWatering}
                onChange={(value) => handleSettingChange('system', 'autoWatering', value)}
              />
            </div>
            
            <div style={settingRowStyle}>
              <div>
                <div style={settingLabelStyle}>מצב לילה</div>
                <div style={settingDescStyle}>צמצם בהירות במהלך הלילה</div>
              </div>
              <Toggle 
                checked={settings.system.nightMode}
                onChange={(value) => handleSettingChange('system', 'nightMode', value)}
              />
            </div>
            
            <div style={settingRowStyle}>
              <div>
                <div style={settingLabelStyle}>יחידת טמפרטורה</div>
                <div style={settingDescStyle}>בחר יחידת מידה עבור טמפרטורה</div>
              </div>
              <select 
                style={selectStyle}
                value={settings.system.tempUnit}
                onChange={(e) => handleSettingChange('system', 'tempUnit', e.target.value)}
              >
                <option value="celsius">צלזיוס (°C)</option>
                <option value="fahrenheit">פרנהייט (°F)</option>
              </select>
            </div>
            
            <div style={settingRowStyle}>
              <div>
                <div style={settingLabelStyle}>שפת ממשק</div>
                <div style={settingDescStyle}>בחר שפת הממשק המועדפת</div>
              </div>
              <select 
                style={selectStyle}
                value={settings.system.language}
                onChange={(e) => handleSettingChange('system', 'language', e.target.value)}
              >
                <option value="hebrew">עברית</option>
                <option value="english">English</option>
                <option value="arabic">العربية</option>
              </select>
            </div>
            
            <div style={settingRowStyle}>
              <div>
                <div style={settingLabelStyle}>תדירות גיבוי</div>
                <div style={settingDescStyle}>כמה פעמים לגבות את הנתונים</div>
              </div>
              <select 
                style={selectStyle}
                value={settings.system.backupFrequency}
                onChange={(e) => handleSettingChange('system', 'backupFrequency', e.target.value)}
              >
                <option value="daily">יומי</option>
                <option value="weekly">שבועי</option>
                <option value="monthly">חודשי</option>
                <option value="manual">ידני בלבד</option>
              </select>
            </div>
          </div>
        </Card>
      </div>
      
      <div style={sectionStyle}>
        <Card>
          <h3 style={sectionTitleStyle}>
            <span>👤</span>
            פרופיל משתמש
          </h3>
          
          <div>
            <div style={settingRowStyle}>
              <div style={settingLabelStyle}>שם משתמש</div>
              <input 
                style={selectStyle}
                value={settings.user.name}
                onChange={(e) => handleSettingChange('user', 'name', e.target.value)}
              />
            </div>
            
            <div style={settingRowStyle}>
              <div style={settingLabelStyle}>כתובת אימייל</div>
              <input 
                type="email"
                style={selectStyle}
                value={settings.user.email}
                onChange={(e) => handleSettingChange('user', 'email', e.target.value)}
              />
            </div>
            
            <div style={settingRowStyle}>
              <div>
                <div style={settingLabelStyle}>רמת ניסיון</div>
                <div style={settingDescStyle}>עוזר להתאים עצות והמלצות</div>
              </div>
              <select 
                style={selectStyle}
                value={settings.user.experience}
                onChange={(e) => handleSettingChange('user', 'experience', e.target.value)}
              >
                <option value="beginner">מתחיל</option>
                <option value="intermediate">בינוני</option>
                <option value="advanced">מתקדם</option>
                <option value="expert">מומחה</option>
              </select>
            </div>
            
            <div style={settingRowStyle}>
              <div style={settingLabelStyle}>אזור זמן</div>
              <select 
                style={selectStyle}
                value={settings.user.timezone}
                onChange={(e) => handleSettingChange('user', 'timezone', e.target.value)}
              >
                <option value="Asia/Jerusalem">ישראל (GMT+2)</option>
                <option value="Europe/London">לונדון (GMT+0)</option>
                <option value="America/New_York">ניו יורק (GMT-5)</option>
                <option value="Asia/Tokyo">טוקיו (GMT+9)</option>
              </select>
            </div>
          </div>
        </Card>
      </div>
      
      <div style={sectionStyle}>
        <Card>
          <h3 style={sectionTitleStyle}>
            <span>📊</span>
            ספי התראה
          </h3>
          
          <div>
            <div style={settingRowStyle}>
              <div>
                <div style={settingLabelStyle}>מפלס מים מינימלי (%)</div>
                <div style={settingDescStyle}>התראה כאשר המים מתחת לרמה זו</div>
              </div>
              <input 
                type="number"
                min="0"
                max="100"
                style={inputStyle}
                value={settings.thresholds.minWaterLevel}
                onChange={(e) => handleSettingChange('thresholds', 'minWaterLevel', Number(e.target.value))}
              />
            </div>
            
            <div style={settingRowStyle}>
              <div>
                <div style={settingLabelStyle}>מפלס מים מקסימלי (%)</div>
                <div style={settingDescStyle}>התראה כאשר המים מעל לרמה זו</div>
              </div>
              <input 
                type="number"
                min="0"
                max="100"
                style={inputStyle}
                value={settings.thresholds.maxWaterLevel}
                onChange={(e) => handleSettingChange('thresholds', 'maxWaterLevel', Number(e.target.value))}
              />
            </div>
            
            <div style={settingRowStyle}>
              <div>
                <div style={settingLabelStyle}>pH מינימלי</div>
                <div style={settingDescStyle}>התראה כאשר ה-pH מתחת לרמה זו</div>
              </div>
              <input 
                type="number"
                min="0"
                max="14"
                step="0.1"
                style={inputStyle}
                value={settings.thresholds.minPH}
                onChange={(e) => handleSettingChange('thresholds', 'minPH', Number(e.target.value))}
              />
            </div>
            
            <div style={settingRowStyle}>
              <div>
                <div style={settingLabelStyle}>pH מקסימלי</div>
                <div style={settingDescStyle}>התראה כאשר ה-pH מעל לרמה זו</div>
              </div>
              <input 
                type="number"
                min="0"
                max="14"
                step="0.1"
                style={inputStyle}
                value={settings.thresholds.maxPH}
                onChange={(e) => handleSettingChange('thresholds', 'maxPH', Number(e.target.value))}
              />
            </div>
            
            <div style={settingRowStyle}>
              <div>
                <div style={settingLabelStyle}>טמפרטורה מינימלית (°C)</div>
                <div style={settingDescStyle}>התראה כאשר הטמפרטורה מתחת לרמה זו</div>
              </div>
              <input 
                type="number"
                min="0"
                max="50"
                style={inputStyle}
                value={settings.thresholds.minTemp}
                onChange={(e) => handleSettingChange('thresholds', 'minTemp', Number(e.target.value))}
              />
            </div>
            
            <div style={settingRowStyle}>
              <div>
                <div style={settingLabelStyle}>טמפרטורה מקסימלית (°C)</div>
                <div style={settingDescStyle}>התראה כאשר הטמפרטורה מעל לרמה זו</div>
              </div>
              <input 
                type="number"
                min="0"
                max="50"
                style={inputStyle}
                value={settings.thresholds.maxTemp}
                onChange={(e) => handleSettingChange('thresholds', 'maxTemp', Number(e.target.value))}
              />
            </div>
          </div>
        </Card>
      </div>
      
      <div style={actionsStyle}>
        <Button variant="primary" onClick={handleSaveSettings}>
          💾 שמור את כל ההגדרות
        </Button>
        
        <Button variant="secondary" onClick={handleExportData}>
          📤 יצוא נתונים
        </Button>
        
        <label style={{ cursor: 'pointer' }}>
          <Button variant="secondary" as="span">
            📥 יבוא נתונים
          </Button>
          <input 
            type="file" 
            accept=".json"
            style={{ display: 'none' }}
            onChange={handleImportData}
          />
        </label>
      </div>
      
      <div style={dangerZoneStyle}>
        <h3 style={{ 
          color: theme.colors.error, 
          marginBottom: theme.spacing.md,
          fontSize: theme.typography.fontSize.lg
        }}>
          ⚠️ אזור מסוכן
        </h3>
        <p style={{ 
          marginBottom: theme.spacing.md,
          color: theme.colors.text.secondary 
        }}>
          פעולות אלו אינן הפיכות. אנא שקול בזהירות לפני ביצוע.
        </p>
        <Button 
          variant="danger" 
          onClick={() => setIsResetModalOpen(true)}
        >
          🔄 אפס לברירת מחדל
        </Button>
      </div>
      
      <Modal
        isOpen={isBackupModalOpen}
        onClose={() => setIsBackupModalOpen(false)}
        title="יצוא נתונים"
        size="large"
      >
        <p style={{ marginBottom: theme.spacing.md }}>
          העתק את הנתונים הבאים ושמור אותם בקובץ טקסט:
        </p>
        <textarea
          value={exportData}
          readOnly
          style={{
            width: '100%',
            height: '300px',
            padding: theme.spacing.md,
            border: `2px solid ${theme.colors.secondary[300]}`,
            borderRadius: theme.borderRadius.md,
            fontSize: theme.typography.fontSize.sm,
            fontFamily: 'monospace',
            resize: 'vertical'
          }}
        />
        <div style={{ display: 'flex', gap: theme.spacing.md, marginTop: theme.spacing.lg }}>
          <Button 
            variant="primary" 
            fullWidth 
            onClick={() => {
              navigator.clipboard.writeText(exportData);
              showToast('נתונים הועתקו ללוח', 'success');
            }}
          >
            📋 העתק ללוח
          </Button>
          <Button 
            variant="secondary" 
            fullWidth 
            onClick={() => setIsBackupModalOpen(false)}
          >
            סגור
          </Button>
        </div>
      </Modal>
      
      <Modal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        title="איפוס הגדרות"
        size="medium"
      >
        <div style={{ textAlign: 'center', padding: theme.spacing.lg }}>
          <div style={{ fontSize: '3rem', marginBottom: theme.spacing.md }}>⚠️</div>
          <h3 style={{ marginBottom: theme.spacing.md, color: theme.colors.error }}>
            האם אתה בטוח?
          </h3>
          <p style={{ marginBottom: theme.spacing.lg, color: theme.colors.text.secondary }}>
            פעולה זו תמחק את כל ההגדרות האישיות ותחזיר את המערכת לברירת המחדל.
            פעולה זו אינה הפיכה.
          </p>
          <div style={{ display: 'flex', gap: theme.spacing.md }}>
            <Button variant="danger" fullWidth onClick={handleResetSettings}>
              כן, אפס הכל
            </Button>
            <Button variant="secondary" fullWidth onClick={() => setIsResetModalOpen(false)}>
              ביטול
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
});

Settings.displayName = 'Settings';

export default Settings;