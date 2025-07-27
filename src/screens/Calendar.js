import React, { memo, useState, useCallback, useMemo } from 'react';
import { theme } from '../styles/theme';
import { Card, Button, Modal, InputForm } from '../components';

const Calendar = memo(({ showToast, setIsLoading }) => {
  const [events, setEvents] = useState([
    {
      id: 1,
      title: 'השקיה בוקר',
      type: 'watering',
      date: '2024-01-25',
      time: '08:00',
      recurring: 'daily',
      plant: 'כל הצמחים'
    },
    {
      id: 2,
      title: 'בדיקת pH',
      type: 'maintenance',
      date: '2024-01-26',
      time: '10:00',
      recurring: 'weekly',
      plant: 'מערכת כללית'
    },
    {
      id: 3,
      title: 'קציר חסה',
      type: 'harvest',
      date: '2024-01-28',
      time: '09:00',
      recurring: 'none',
      plant: 'חסה רומית'
    }
  ]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    type: 'watering',
    date: '',
    time: '',
    recurring: 'none',
    plant: ''
  });
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('month');
  
  const eventTypes = [
    { value: 'watering', label: 'השקיה', icon: '🚿', color: theme.colors.primary.main },
    { value: 'fertilizing', label: 'דישון', icon: '🌿', color: theme.colors.success },
    { value: 'pruning', label: 'גיזום', icon: '✂️', color: theme.colors.warning },
    { value: 'harvest', label: 'קציר', icon: '🥕', color: theme.colors.accent.orange },
    { value: 'maintenance', label: 'תחזוקה', icon: '🔧', color: theme.colors.secondary.main }
  ];
  
  const recurringOptions = [
    { value: 'none', label: 'ללא חזרה' },
    { value: 'daily', label: 'יומי' },
    { value: 'weekly', label: 'שבועי' },
    { value: 'monthly', label: 'חודשי' }
  ];
  
  const getEventsForDate = useCallback((date) => {
    const dateStr = date.toISOString().split('T')[0];
    return events.filter(event => event.date === dateStr);
  }, [events]);
  
  const getEventTypeInfo = useCallback((type) => {
    return eventTypes.find(et => et.value === type) || eventTypes[0];
  }, []);
  
  const handleAddEvent = useCallback(() => {
    setEditingEvent(null);
    setFormData({
      title: '',
      type: 'watering',
      date: '',
      time: '',
      recurring: 'none',
      plant: ''
    });
    setIsModalOpen(true);
  }, []);
  
  const handleEditEvent = useCallback((event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      type: event.type,
      date: event.date,
      time: event.time,
      recurring: event.recurring,
      plant: event.plant
    });
    setIsModalOpen(true);
  }, []);
  
  const handleSaveEvent = useCallback(() => {
    if (!formData.title || !formData.date || !formData.time) {
      showToast('אנא מלא את כל השדות הדרושים', 'error');
      return;
    }
    
    setIsLoading(true);
    
    setTimeout(() => {
      if (editingEvent) {
        setEvents(prev => prev.map(event => 
          event.id === editingEvent.id 
            ? { ...event, ...formData }
            : event
        ));
        showToast('אירוע עודכן בהצלחה', 'success');
      } else {
        const newEvent = {
          id: Date.now(),
          ...formData
        };
        setEvents(prev => [...prev, newEvent]);
        showToast('אירוע חדש נוסף בהצלחה', 'success');
      }
      
      setIsModalOpen(false);
      setIsLoading(false);
    }, 1000);
  }, [formData, editingEvent, showToast, setIsLoading]);
  
  const handleDeleteEvent = useCallback((eventId) => {
    if (window.confirm('האם אתה בטוח שברצונך למחוק את האירוע?')) {
      setEvents(prev => prev.filter(event => event.id !== eventId));
      showToast('אירוע נמחק בהצלחה', 'success');
    }
  }, [showToast]);
  
  const getDaysInMonth = useCallback((date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  }, []);
  
  const monthDays = useMemo(() => getDaysInMonth(currentDate), [currentDate, getDaysInMonth]);
  
  const navigateMonth = useCallback((direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  }, []);
  
  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
    flexWrap: 'wrap',
    gap: theme.spacing.md
  };
  
  const calendarHeaderStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.primary[50],
    borderRadius: theme.borderRadius.lg
  };
  
  const monthYearStyle = {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.primary.main,
    margin: 0
  };
  
  const calendarGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gap: '1px',
    backgroundColor: theme.colors.secondary[200],
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden'
  };
  
  const dayHeaderStyle = {
    backgroundColor: theme.colors.primary.main,
    color: '#ffffff',
    padding: theme.spacing.sm,
    textAlign: 'center',
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold
  };
  
  const dayStyle = (day, hasEvents) => ({
    backgroundColor: theme.colors.background.default,
    minHeight: '80px',
    padding: theme.spacing.xs,
    position: 'relative',
    border: hasEvents ? `2px solid ${theme.colors.primary.main}` : 'none',
    cursor: 'pointer',
    transition: `all ${theme.transitions.fast}`,
    ':hover': {
      backgroundColor: theme.colors.primary[50]
    }
  });
  
  const eventItemStyle = (eventType) => {
    const typeInfo = getEventTypeInfo(eventType);
    return {
      backgroundColor: typeInfo.color,
      color: '#ffffff',
      padding: `${theme.spacing.xs} ${theme.spacing.xs}`,
      borderRadius: theme.borderRadius.sm,
      fontSize: theme.typography.fontSize.xs,
      marginBottom: theme.spacing.xs,
      cursor: 'pointer',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    };
  };
  
  const upcomingEventsStyle = {
    marginTop: theme.spacing.lg
  };
  
  const eventListStyle = {
    display: 'grid',
    gap: theme.spacing.md
  };
  
  const eventCardStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.md,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background.paper,
    borderRadius: theme.borderRadius.md,
    border: `1px solid ${theme.colors.secondary[200]}`
  };
  
  const dayNames = ['א׳', 'ב׳', 'ג׳', 'ד׳', 'ה׳', 'ו׳', 'ש׳'];
  const monthNames = [
    'ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני',
    'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'
  ];
  
  const upcomingEvents = useMemo(() => {
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    return events
      .filter(event => {
        const eventDate = new Date(event.date);
        return eventDate >= today && eventDate <= nextWeek;
      })
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [events]);
  
  return (
    <div>
      <div style={headerStyle}>
        <h2 style={{ margin: 0, fontSize: theme.typography.fontSize['2xl'] }}>
          📅 לוח זמנים וניהול משימות
        </h2>
        <Button variant="primary" onClick={handleAddEvent}>
          + הוסף אירוע
        </Button>
      </div>
      
      <Card>
        <div style={calendarHeaderStyle}>
          <Button variant="ghost" onClick={() => navigateMonth(-1)}>
            ← חודש קודם
          </Button>
          <h3 style={monthYearStyle}>
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h3>
          <Button variant="ghost" onClick={() => navigateMonth(1)}>
            חודש הבא →
          </Button>
        </div>
        
        <div style={calendarGridStyle}>
          {dayNames.map(day => (
            <div key={day} style={dayHeaderStyle}>
              {day}
            </div>
          ))}
          
          {monthDays.map((day, index) => {
            if (!day) {
              return <div key={`empty-${index}`} style={{ backgroundColor: theme.colors.secondary[100] }} />;
            }
            
            const dayEvents = getEventsForDate(day);
            const hasEvents = dayEvents.length > 0;
            
            return (
              <div key={day.toISOString()} style={dayStyle(day, hasEvents)}>
                <div style={{ fontSize: theme.typography.fontSize.sm, marginBottom: theme.spacing.xs }}>
                  {day.getDate()}
                </div>
                {dayEvents.slice(0, 2).map(event => (
                  <div
                    key={event.id}
                    style={eventItemStyle(event.type)}
                    onClick={() => handleEditEvent(event)}
                    title={event.title}
                  >
                    {getEventTypeInfo(event.type).icon} {event.title}
                  </div>
                ))}
                {dayEvents.length > 2 && (
                  <div style={{ fontSize: theme.typography.fontSize.xs, color: theme.colors.text.secondary }}>
                    +{dayEvents.length - 2} נוספים
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Card>
      
      <div style={upcomingEventsStyle}>
        <Card title="אירועים קרובים (השבוע הקרוב)">
          {upcomingEvents.length > 0 ? (
            <div style={eventListStyle}>
              {upcomingEvents.map(event => {
                const typeInfo = getEventTypeInfo(event.type);
                return (
                  <div key={event.id} style={eventCardStyle}>
                    <div style={{ fontSize: theme.typography.fontSize.xl }}>
                      {typeInfo.icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: theme.typography.fontWeight.semibold }}>
                        {event.title}
                      </div>
                      <div style={{ fontSize: theme.typography.fontSize.sm, color: theme.colors.text.secondary }}>
                        {event.date} בשעה {event.time} • {event.plant}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: theme.spacing.sm }}>
                      <Button 
                        variant="ghost" 
                        size="small"
                        onClick={() => handleEditEvent(event)}
                      >
                        ✏️
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="small"
                        onClick={() => handleDeleteEvent(event.id)}
                      >
                        🗑️
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: theme.spacing.xl }}>
              <div style={{ fontSize: '3rem', marginBottom: theme.spacing.md }}>📅</div>
              <p>אין אירועים קרובים השבוע</p>
            </div>
          )}
        </Card>
      </div>
      
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingEvent ? 'ערוך אירוע' : 'הוסף אירוע חדש'}
        size="medium"
      >
        <InputForm
          label="כותרת האירוע"
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          required
        />
        
        <div style={{ marginBottom: theme.spacing.md }}>
          <label style={{ 
            display: 'block', 
            marginBottom: theme.spacing.xs,
            fontSize: theme.typography.fontSize.sm,
            fontWeight: theme.typography.fontWeight.medium
          }}>
            סוג האירוע *
          </label>
          <select 
            value={formData.type}
            onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
            style={{
              width: '100%',
              padding: theme.spacing.md,
              border: `2px solid ${theme.colors.secondary[300]}`,
              borderRadius: theme.borderRadius.md,
              fontSize: theme.typography.fontSize.base
            }}
          >
            {eventTypes.map(type => (
              <option key={type.value} value={type.value}>
                {type.icon} {type.label}
              </option>
            ))}
          </select>
        </div>
        
        <InputForm
          label="תאריך"
          type="date"
          value={formData.date}
          onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
          required
        />
        
        <InputForm
          label="שעה"
          type="time"
          value={formData.time}
          onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
          required
        />
        
        <div style={{ marginBottom: theme.spacing.md }}>
          <label style={{ 
            display: 'block', 
            marginBottom: theme.spacing.xs,
            fontSize: theme.typography.fontSize.sm,
            fontWeight: theme.typography.fontWeight.medium
          }}>
            חזרה
          </label>
          <select 
            value={formData.recurring}
            onChange={(e) => setFormData(prev => ({ ...prev, recurring: e.target.value }))}
            style={{
              width: '100%',
              padding: theme.spacing.md,
              border: `2px solid ${theme.colors.secondary[300]}`,
              borderRadius: theme.borderRadius.md,
              fontSize: theme.typography.fontSize.base
            }}
          >
            {recurringOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        
        <InputForm
          label="צמח/מערכת"
          value={formData.plant}
          onChange={(e) => setFormData(prev => ({ ...prev, plant: e.target.value }))}
          placeholder="לדוגמה: חסה רומית, כל הצמחים"
          required
        />
        
        <div style={{ display: 'flex', gap: theme.spacing.md, marginTop: theme.spacing.lg }}>
          <Button variant="primary" fullWidth onClick={handleSaveEvent}>
            {editingEvent ? 'עדכן אירוע' : 'הוסף אירוע'}
          </Button>
          <Button variant="secondary" fullWidth onClick={() => setIsModalOpen(false)}>
            ביטול
          </Button>
        </div>
      </Modal>
    </div>
  );
});

Calendar.displayName = 'Calendar';

export default Calendar;