import React, { memo, useState, useCallback } from 'react';
import { theme } from '../styles/theme';
import { Card, Button, InputForm } from '../components';

const Guide = memo(({ showToast }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedGuide, setExpandedGuide] = useState(null);
  
  const guides = [
    {
      id: 1,
      title: 'התחלת גידול הידרופוני',
      category: 'basics',
      difficulty: 'מתחיל',
      duration: '30 דקות',
      icon: '🌱',
      description: 'מדריך מקיף להתחלת גידול הידרופוני בבית',
      steps: [
        'בחירת מערכת הידרופונית מתאימה',
        'הכנת תמיסת הזנה',
        'שתילת הזרעים או השתילים',
        'הגדרת מחזור תאורה',
        'ניטור פרמטרים בסיסיים'
      ],
      tips: [
        'התחל עם צמחים קלים כמו חסה או בזיליקום',
        'שמור על pH בין 5.5-6.5',
        'החלף מים כל שבועיים'
      ]
    },
    {
      id: 2,
      title: 'איזון רמת pH',
      category: 'maintenance',
      difficulty: 'בינוני',
      duration: '15 דקות',
      icon: '🧪',
      description: 'כיצד לשמור על רמת pH אופטימלית',
      steps: [
        'מדידת pH באמצעות מד דיגיטלי',
        'זיהוי סטיות מהטווח האופטימלי',
        'הוספת תמיסה מעלה/מורידה pH',
        'בדיקה חוזרת לאחר 30 דקות',
        'תיעוד הנתונים'
      ],
      tips: [
        'בדוק pH יומית בשעות הבוקר',
        'השתמש בתמיסות איכותיות בלבד',
        'הוסף תמיסות בהדרגה'
      ]
    },
    {
      id: 3,
      title: 'מניעה וטיפול במזיקים',
      category: 'problems',
      difficulty: 'מתקדם',
      duration: '45 דקות',
      icon: '🐛',
      description: 'זיהוי ומניעת מזיקים במערכת הידרופונית',
      steps: [
        'בדיקה יומית של עלים ובדים',
        'זיהוי סימני מזיקים מוקדמים',
        'יישום שיטות הדברה טבעיות',
        'בידוד צמחים נגועים',
        'מעקב אחר התפתחות'
      ],
      tips: [
        'שמור על ניקיון המערכת',
        'הימנע מלחות גבוהה',
        'השתמש בטורפים טבעיים'
      ]
    },
    {
      id: 4,
      title: 'זמני קציר אופטימליים',
      category: 'harvest',
      difficulty: 'בינוני',
      duration: '20 דקות',
      icon: '🥕',
      description: 'מתי ואיך לקצור את הצמחים',
      steps: [
        'זיהוי סימני בשלות',
        'בחירת כלי קציר מתאימים',
        'קצירה בשעות הבוקר המוקדמות',
        'שטיפה ואחסון נכון',
        'תכנון זרעים חדשים'
      ],
      tips: [
        'קצור בבוקר לטעם מיטבי',
        'השאר שורשים לקומפוסט',
        'קצור בהדרגה לאספקה רציפה'
      ]
    },
    {
      id: 5,
      title: 'הכנת תמיסת הזנה',
      category: 'nutrients',
      difficulty: 'בינוני',
      duration: '25 דקות',
      icon: '💧',
      description: 'איך להכין תמיסת זנים מושלמת',
      steps: [
        'מדידת כמות המים הנדרשת',
        'הוספת דשן בסיס בריכוז נכון',
        'ערבוב יסודי למשך 5 דקות',
        'בדיקת EC ו-pH',
        'התאמת הפרמטרים לפי הצורך'
      ],
      tips: [
        'השתמש במים מזוקקים',
        'הוסף דשנים בסדר הנכון',
        'שמור רישום של הרכבים'
      ]
    },
    {
      id: 6,
      title: 'אופטימיזציה של תאורה',
      category: 'lighting',
      difficulty: 'מתקדם',
      duration: '40 דקות',
      icon: '💡',
      description: 'מיטוב מערכת התאורה לצמיחה מיטבית',
      steps: [
        'בחירת סוג נורות LED מתאים',
        'חישוב עוצמת התאורה הנדרשת',
        'הגדרת מחזור יום/לילה',
        'מדידת טמפרטורת העלים',
        'התאמת גובה הנורות'
      ],
      tips: [
        'השתמש בספקטרום מלא',
        'שמור על מרחק 30-50 ס"מ',
        'הדרג עוצמה לצמחים צעירים'
      ]
    }
  ];
  
  const categories = [
    { value: 'all', label: 'כל הקטגוריות', icon: '📚' },
    { value: 'basics', label: 'יסודות', icon: '🌱' },
    { value: 'maintenance', label: 'תחזוקה', icon: '🔧' },
    { value: 'nutrients', label: 'זנים ודישון', icon: '💧' },
    { value: 'lighting', label: 'תאורה', icon: '💡' },
    { value: 'problems', label: 'פתרון בעיות', icon: '🐛' },
    { value: 'harvest', label: 'קציר', icon: '🥕' }
  ];
  
  const filteredGuides = guides.filter(guide => {
    const matchesSearch = guide.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         guide.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || guide.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });
  
  const handleExpandGuide = useCallback((guideId) => {
    setExpandedGuide(expandedGuide === guideId ? null : guideId);
  }, [expandedGuide]);
  
  const handleSaveGuide = useCallback((guideId) => {
    showToast('מדריך נשמר למועדפים', 'success');
  }, [showToast]);
  
  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'מתחיל': return theme.colors.success;
      case 'בינוני': return theme.colors.warning;
      case 'מתקדם': return theme.colors.error;
      default: return theme.colors.secondary.main;
    }
  };
  
  const headerStyle = {
    marginBottom: theme.spacing.lg
  };
  
  const filtersStyle = {
    display: 'flex',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.lg,
    flexWrap: 'wrap'
  };
  
  const categoryButtonStyle = (isActive) => ({
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.xs,
    padding: `${theme.spacing.sm} ${theme.spacing.md}`,
    backgroundColor: isActive ? theme.colors.primary.main : 'transparent',
    color: isActive ? '#ffffff' : theme.colors.text.primary,
    border: `2px solid ${isActive ? theme.colors.primary.main : theme.colors.secondary[300]}`,
    borderRadius: theme.borderRadius.md,
    cursor: 'pointer',
    fontSize: theme.typography.fontSize.sm,
    transition: `all ${theme.transitions.fast}`,
    ':hover': {
      backgroundColor: isActive ? theme.colors.primary[600] : theme.colors.primary[50],
      borderColor: theme.colors.primary.main
    }
  });
  
  const guidesGridStyle = {
    display: 'grid',
    gap: theme.spacing.lg
  };
  
  const guideCardStyle = {
    cursor: 'pointer',
    transition: `all ${theme.transitions.fast}`,
    ':hover': {
      transform: 'translateY(-2px)',
      boxShadow: theme.shadows.md
    }
  };
  
  const guideHeaderStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.md
  };
  
  const guideTitleStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.sm,
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.semibold,
    margin: 0
  };
  
  const guideMetaStyle = {
    display: 'flex',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.md,
    flexWrap: 'wrap'
  };
  
  const metaBadgeStyle = (color) => ({
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.xs,
    padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
    backgroundColor: color,
    color: '#ffffff',
    borderRadius: theme.borderRadius.md,
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.medium
  });
  
  const expandedContentStyle = {
    marginTop: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
    borderTop: `1px solid ${theme.colors.secondary[200]}`
  };
  
  const sectionStyle = {
    marginBottom: theme.spacing.lg
  };
  
  const sectionTitleStyle = {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.primary.main,
    marginBottom: theme.spacing.md
  };
  
  const stepListStyle = {
    listStyle: 'none',
    padding: 0,
    margin: 0
  };
  
  const stepItemStyle = {
    display: 'flex',
    alignItems: 'flex-start',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
    padding: theme.spacing.sm,
    backgroundColor: theme.colors.background.paper,
    borderRadius: theme.borderRadius.md,
    border: `1px solid ${theme.colors.secondary[200]}`
  };
  
  const stepNumberStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '24px',
    height: '24px',
    backgroundColor: theme.colors.primary.main,
    color: '#ffffff',
    borderRadius: theme.borderRadius.full,
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.bold,
    flexShrink: 0
  };
  
  const tipListStyle = {
    listStyle: 'none',
    padding: 0,
    margin: 0
  };
  
  const tipItemStyle = {
    display: 'flex',
    alignItems: 'flex-start',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
    padding: theme.spacing.sm,
    backgroundColor: theme.colors.success + '10',
    borderRadius: theme.borderRadius.md,
    border: `1px solid ${theme.colors.success}30`
  };
  
  const actionsStyle = {
    display: 'flex',
    gap: theme.spacing.md,
    marginTop: theme.spacing.lg
  };
  
  return (
    <div>
      <div style={headerStyle}>
        <h2 style={{ 
          margin: 0, 
          fontSize: theme.typography.fontSize['2xl'],
          marginBottom: theme.spacing.md 
        }}>
          📚 מדריך גידול הידרופוני
        </h2>
        <p style={{ 
          color: theme.colors.text.secondary,
          margin: 0,
          fontSize: theme.typography.fontSize.lg 
        }}>
          מדריכים מפורטים ועצות מומחים לגידול הידרופוני מוצלח
        </p>
      </div>
      
      <div style={filtersStyle}>
        <InputForm
          type="text"
          placeholder="חפש מדריכים..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        
        <div style={{ display: 'flex', gap: theme.spacing.sm, flexWrap: 'wrap' }}>
          {categories.map(category => (
            <button
              key={category.value}
              style={categoryButtonStyle(selectedCategory === category.value)}
              onClick={() => setSelectedCategory(category.value)}
            >
              <span>{category.icon}</span>
              <span>{category.label}</span>
            </button>
          ))}
        </div>
      </div>
      
      <div style={guidesGridStyle}>
        {filteredGuides.map(guide => (
          <Card key={guide.id} style={guideCardStyle}>
            <div style={guideHeaderStyle}>
              <h3 style={guideTitleStyle}>
                <span style={{ fontSize: theme.typography.fontSize['2xl'] }}>
                  {guide.icon}
                </span>
                {guide.title}
              </h3>
              <Button
                variant="ghost"
                size="small"
                onClick={() => handleSaveGuide(guide.id)}
              >
                ⭐
              </Button>
            </div>
            
            <div style={guideMetaStyle}>
              <div style={metaBadgeStyle(getDifficultyColor(guide.difficulty))}>
                📊 {guide.difficulty}
              </div>
              <div style={metaBadgeStyle(theme.colors.secondary.main)}>
                ⏱️ {guide.duration}
              </div>
            </div>
            
            <p style={{ 
              color: theme.colors.text.secondary,
              marginBottom: theme.spacing.md,
              lineHeight: theme.typography.lineHeight.relaxed
            }}>
              {guide.description}
            </p>
            
            {expandedGuide === guide.id && (
              <div style={expandedContentStyle}>
                <div style={sectionStyle}>
                  <h4 style={sectionTitleStyle}>🔄 שלבי ביצוע</h4>
                  <ol style={stepListStyle}>
                    {guide.steps.map((step, index) => (
                      <li key={index} style={stepItemStyle}>
                        <div style={stepNumberStyle}>{index + 1}</div>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
                
                <div style={sectionStyle}>
                  <h4 style={sectionTitleStyle}>💡 טיפים חשובים</h4>
                  <ul style={tipListStyle}>
                    {guide.tips.map((tip, index) => (
                      <li key={index} style={tipItemStyle}>
                        <span style={{ color: theme.colors.success, fontSize: theme.typography.fontSize.lg }}>
                          ✓
                        </span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
            
            <div style={actionsStyle}>
              <Button
                variant="primary"
                onClick={() => handleExpandGuide(guide.id)}
              >
                {expandedGuide === guide.id ? 'סגור מדריך' : 'הצג מדריך מלא'}
              </Button>
              <Button
                variant="secondary"
                onClick={() => showToast('מדריך הודפס בהצלחה', 'success')}
              >
                🖨️ הדפס
              </Button>
            </div>
          </Card>
        ))}
      </div>
      
      {filteredGuides.length === 0 && (
        <Card>
          <div style={{ textAlign: 'center', padding: theme.spacing.xl }}>
            <div style={{ fontSize: '3rem', marginBottom: theme.spacing.md }}>📚</div>
            <p>לא נמצאו מדריכים מתאימים לחיפוש</p>
            <Button 
              variant="primary" 
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
              }}
            >
              נקה סינונים
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
});

Guide.displayName = 'Guide';

export default Guide;