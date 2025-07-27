import React, { memo, useState, useCallback, useMemo } from 'react';
import { theme } from '../styles/theme';
import { Card, Button, Modal, InputForm } from '../components';

const Plants = memo(({ showToast, setIsLoading }) => {
  const [plants, setPlants] = useState([
    {
      id: 1,
      name: 'חסה רומית',
      type: 'ירקות עלים',
      plantedDate: '2024-01-15',
      expectedHarvest: '2024-02-15',
      status: 'בגידול',
      health: 'בריא',
      location: 'A1'
    },
    {
      id: 2,
      name: 'עגבניה שרי',
      type: 'פירות',
      plantedDate: '2024-01-10',
      expectedHarvest: '2024-03-10',
      status: 'מוכן לקציר',
      health: 'מצוין',
      location: 'B2'
    },
    {
      id: 3,
      name: 'בזיליקום',
      type: 'עשבי תיבול',
      plantedDate: '2024-01-20',
      expectedHarvest: '2024-02-20',
      status: 'נביטה',
      health: 'בריא',
      location: 'C1'
    }
  ]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlant, setEditingPlant] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    plantedDate: '',
    expectedHarvest: '',
    location: ''
  });
  
  const [filterType, setFilterType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredPlants = useMemo(() => {
    return plants.filter(plant => {
      const matchesFilter = filterType === 'all' || plant.type === filterType;
      const matchesSearch = plant.name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [plants, filterType, searchTerm]);
  
  const plantTypes = useMemo(() => {
    const types = [...new Set(plants.map(plant => plant.type))];
    return types;
  }, [plants]);
  
  const handleAddPlant = useCallback(() => {
    setEditingPlant(null);
    setFormData({
      name: '',
      type: '',
      plantedDate: '',
      expectedHarvest: '',
      location: ''
    });
    setIsModalOpen(true);
  }, []);
  
  const handleEditPlant = useCallback((plant) => {
    setEditingPlant(plant);
    setFormData({
      name: plant.name,
      type: plant.type,
      plantedDate: plant.plantedDate,
      expectedHarvest: plant.expectedHarvest,
      location: plant.location
    });
    setIsModalOpen(true);
  }, []);
  
  const handleSavePlant = useCallback(() => {
    if (!formData.name || !formData.type) {
      showToast('אנא מלא את כל השדות הדרושים', 'error');
      return;
    }
    
    setIsLoading(true);
    
    setTimeout(() => {
      if (editingPlant) {
        setPlants(prev => prev.map(plant => 
          plant.id === editingPlant.id 
            ? { ...plant, ...formData }
            : plant
        ));
        showToast('צמח עודכן בהצלחה', 'success');
      } else {
        const newPlant = {
          id: Date.now(),
          ...formData,
          status: 'נביטה',
          health: 'בריא'
        };
        setPlants(prev => [...prev, newPlant]);
        showToast('צמח חדש נוסף בהצלחה', 'success');
      }
      
      setIsModalOpen(false);
      setIsLoading(false);
    }, 1000);
  }, [formData, editingPlant, showToast, setIsLoading]);
  
  const handleDeletePlant = useCallback((plantId) => {
    if (window.confirm('האם אתה בטוח שברצונך למחוק את הצמח?')) {
      setPlants(prev => prev.filter(plant => plant.id !== plantId));
      showToast('צמח נמחק בהצלחה', 'success');
    }
  }, [showToast]);
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'מוכן לקציר': return theme.colors.success;
      case 'בגידול': return theme.colors.primary.main;
      case 'נביטה': return theme.colors.warning;
      default: return theme.colors.secondary.main;
    }
  };
  
  const getHealthColor = (health) => {
    switch (health) {
      case 'מצוין': return theme.colors.success;
      case 'בריא': return theme.colors.primary.main;
      case 'דורש טיפול': return theme.colors.warning;
      case 'חולה': return theme.colors.error;
      default: return theme.colors.secondary.main;
    }
  };
  
  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
    flexWrap: 'wrap',
    gap: theme.spacing.md
  };
  
  const filtersStyle = {
    display: 'flex',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.lg,
    flexWrap: 'wrap'
  };
  
  const selectStyle = {
    padding: theme.spacing.sm,
    border: `2px solid ${theme.colors.secondary[300]}`,
    borderRadius: theme.borderRadius.md,
    fontSize: theme.typography.fontSize.sm,
    backgroundColor: theme.colors.background.default
  };
  
  const plantsGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: theme.spacing.lg
  };
  
  const plantCardStyle = {
    position: 'relative',
    transition: `transform ${theme.transitions.fast}`,
    ':hover': {
      transform: 'translateY(-2px)'
    }
  };
  
  const statusBadgeStyle = (status) => ({
    position: 'absolute',
    top: theme.spacing.sm,
    left: theme.spacing.sm,
    backgroundColor: getStatusColor(status),
    color: '#ffffff',
    padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
    borderRadius: theme.borderRadius.md,
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.medium
  });
  
  const plantInfoStyle = {
    display: 'grid',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md
  };
  
  const infoRowStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: theme.typography.fontSize.sm
  };
  
  const actionsStyle = {
    display: 'flex',
    gap: theme.spacing.sm,
    marginTop: theme.spacing.md
  };
  
  return (
    <div>
      <div style={headerStyle}>
        <h2 style={{ margin: 0, fontSize: theme.typography.fontSize['2xl'] }}>
          🌱 ניהול צמחים
        </h2>
        <Button variant="primary" onClick={handleAddPlant}>
          + הוסף צמח חדש
        </Button>
      </div>
      
      <div style={filtersStyle}>
        <InputForm
          type="text"
          placeholder="חפש צמח..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        
        <select 
          style={selectStyle}
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="all">כל הסוגים</option>
          {plantTypes.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>
      
      <div style={plantsGridStyle}>
        {filteredPlants.map(plant => (
          <Card key={plant.id} style={plantCardStyle}>
            <div style={statusBadgeStyle(plant.status)}>
              {plant.status}
            </div>
            
            <h3 style={{ 
              margin: 0, 
              marginBottom: theme.spacing.md,
              fontSize: theme.typography.fontSize.lg,
              paddingTop: theme.spacing.xl
            }}>
              {plant.name}
            </h3>
            
            <div style={plantInfoStyle}>
              <div style={infoRowStyle}>
                <span>סוג:</span>
                <span>{plant.type}</span>
              </div>
              <div style={infoRowStyle}>
                <span>תאריך שתילה:</span>
                <span>{plant.plantedDate}</span>
              </div>
              <div style={infoRowStyle}>
                <span>קציר צפוי:</span>
                <span>{plant.expectedHarvest}</span>
              </div>
              <div style={infoRowStyle}>
                <span>מיקום:</span>
                <span>{plant.location}</span>
              </div>
              <div style={infoRowStyle}>
                <span>בריאות:</span>
                <span style={{ color: getHealthColor(plant.health) }}>
                  {plant.health}
                </span>
              </div>
            </div>
            
            <div style={actionsStyle}>
              <Button 
                variant="secondary" 
                size="small"
                onClick={() => handleEditPlant(plant)}
              >
                ✏️ ערוך
              </Button>
              <Button 
                variant="danger" 
                size="small"
                onClick={() => handleDeletePlant(plant.id)}
              >
                🗑️ מחק
              </Button>
            </div>
          </Card>
        ))}
      </div>
      
      {filteredPlants.length === 0 && (
        <Card>
          <div style={{ textAlign: 'center', padding: theme.spacing.xl }}>
            <div style={{ fontSize: '3rem', marginBottom: theme.spacing.md }}>🌱</div>
            <p>לא נמצאו צמחים מתאימים לחיפוש</p>
          </div>
        </Card>
      )}
      
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingPlant ? 'ערוך צמח' : 'הוסף צמח חדש'}
        size="medium"
      >
        <InputForm
          label="שם הצמח"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          required
        />
        
        <InputForm
          label="סוג הצמח"
          value={formData.type}
          onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
          required
        />
        
        <InputForm
          label="תאריך שתילה"
          type="date"
          value={formData.plantedDate}
          onChange={(e) => setFormData(prev => ({ ...prev, plantedDate: e.target.value }))}
          required
        />
        
        <InputForm
          label="תאריך קציר צפוי"
          type="date"
          value={formData.expectedHarvest}
          onChange={(e) => setFormData(prev => ({ ...prev, expectedHarvest: e.target.value }))}
          required
        />
        
        <InputForm
          label="מיקום"
          value={formData.location}
          onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
          placeholder="לדוגמה: A1, B2"
          required
        />
        
        <div style={{ display: 'flex', gap: theme.spacing.md, marginTop: theme.spacing.lg }}>
          <Button variant="primary" fullWidth onClick={handleSavePlant}>
            {editingPlant ? 'עדכן צמח' : 'הוסף צמח'}
          </Button>
          <Button variant="secondary" fullWidth onClick={() => setIsModalOpen(false)}>
            ביטול
          </Button>
        </div>
      </Modal>
    </div>
  );
});

Plants.displayName = 'Plants';

export default Plants;