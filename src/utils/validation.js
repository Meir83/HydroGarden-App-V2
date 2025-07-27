// Validation utilities for form inputs and data

export const validators = {
  // Basic validations
  required: (value) => {
    if (value === null || value === undefined || value === '') {
      return 'שדה זה הוא חובה';
    }
    return null;
  },

  email: (value) => {
    if (!value) return null;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return 'כתובת אימייל לא תקינה';
    }
    return null;
  },

  minLength: (min) => (value) => {
    if (!value) return null;
    if (value.length < min) {
      return `מינימום ${min} תווים`;
    }
    return null;
  },

  maxLength: (max) => (value) => {
    if (!value) return null;
    if (value.length > max) {
      return `מקסימום ${max} תווים`;
    }
    return null;
  },

  numeric: (value) => {
    if (!value) return null;
    if (isNaN(Number(value))) {
      return 'ערך חייב להיות מספר';
    }
    return null;
  },

  range: (min, max) => (value) => {
    if (!value) return null;
    const num = Number(value);
    if (isNaN(num)) {
      return 'ערך חייב להיות מספר';
    }
    if (num < min || num > max) {
      return `ערך חייב להיות בין ${min} ל-${max}`;
    }
    return null;
  },

  // Hydroponic-specific validations
  ph: (value) => {
    if (!value) return null;
    const num = Number(value);
    if (isNaN(num)) {
      return 'רמת pH חייבת להיות מספר';
    }
    if (num < 0 || num > 14) {
      return 'רמת pH חייבת להיות בין 0 ל-14';
    }
    if (num < 5.0 || num > 7.5) {
      return 'רמת pH מומלצת: 5.0-7.5';
    }
    return null;
  },

  temperature: (value) => {
    if (!value) return null;
    const num = Number(value);
    if (isNaN(num)) {
      return 'טמפרטורה חייבת להיות מספר';
    }
    if (num < -10 || num > 50) {
      return 'טמפרטורה חייבת להיות בין -10 ל-50';
    }
    if (num < 15 || num > 30) {
      return 'טמפרטורה מומלצת: 15-30 מעלות';
    }
    return null;
  },

  waterLevel: (value) => {
    if (!value) return null;
    const num = Number(value);
    if (isNaN(num)) {
      return 'מפלס מים חייב להיות מספר';
    }
    if (num < 0 || num > 100) {
      return 'מפלס מים חייב להיות בין 0 ל-100';
    }
    return null;
  },

  plantName: (value) => {
    if (!value) return 'שם הצמח הוא חובה';
    if (value.length < 2) {
      return 'שם הצמח חייב להכיל לפחות 2 תווים';
    }
    if (value.length > 50) {
      return 'שם הצמח לא יכול להכיל יותר מ-50 תווים';
    }
    if (!/^[\u0590-\u05FFa-zA-Z\s-]+$/.test(value)) {
      return 'שם הצמח יכול להכיל רק אותיות ומקפים';
    }
    return null;
  },

  location: (value) => {
    if (!value) return 'מיקום הוא חובה';
    if (!/^[A-Z]\d+$/i.test(value)) {
      return 'מיקום חייב להיות בפורמט: A1, B2, וכו\'';
    }
    return null;
  },

  date: (value) => {
    if (!value) return null;
    const date = new Date(value);
    if (isNaN(date.getTime())) {
      return 'תאריך לא תקין';
    }
    return null;
  },

  futureDate: (value) => {
    if (!value) return null;
    const date = new Date(value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (isNaN(date.getTime())) {
      return 'תאריך לא תקין';
    }
    if (date < today) {
      return 'תאריך חייב להיות בעתיד';
    }
    return null;
  },

  pastDate: (value) => {
    if (!value) return null;
    const date = new Date(value);
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    
    if (isNaN(date.getTime())) {
      return 'תאריך לא תקין';
    }
    if (date > today) {
      return 'תאריך חייב להיות בעבר או היום';
    }
    return null;
  }
};

// Validate single field
export const validateField = (value, validatorRules) => {
  if (!Array.isArray(validatorRules)) {
    validatorRules = [validatorRules];
  }

  for (const rule of validatorRules) {
    const error = rule(value);
    if (error) {
      return error;
    }
  }

  return null;
};

// Validate entire form
export const validateForm = (formData, validationRules) => {
  const errors = {};
  let isValid = true;

  Object.keys(validationRules).forEach(field => {
    const value = formData[field];
    const rules = validationRules[field];
    const error = validateField(value, rules);
    
    if (error) {
      errors[field] = error;
      isValid = false;
    }
  });

  return {
    isValid,
    errors
  };
};

// Plant form validation rules
export const plantValidationRules = {
  name: [validators.required, validators.plantName],
  type: [validators.required],
  plantedDate: [validators.required, validators.date, validators.pastDate],
  expectedHarvest: [validators.required, validators.date, validators.futureDate],
  location: [validators.required, validators.location]
};

// System settings validation rules
export const systemValidationRules = {
  minWaterLevel: [validators.required, validators.waterLevel],
  maxWaterLevel: [validators.required, validators.waterLevel],
  minPH: [validators.required, validators.ph],
  maxPH: [validators.required, validators.ph],
  minTemp: [validators.required, validators.temperature],
  maxTemp: [validators.required, validators.temperature]
};

// Event validation rules
export const eventValidationRules = {
  title: [validators.required, validators.minLength(3), validators.maxLength(100)],
  date: [validators.required, validators.date],
  time: [validators.required],
  plant: [validators.required, validators.minLength(2), validators.maxLength(50)]
};

// User profile validation rules
export const userValidationRules = {
  name: [validators.required, validators.minLength(2), validators.maxLength(50)],
  email: [validators.required, validators.email]
};

// Custom validation hook
export const useFormValidation = (initialData, validationRules) => {
  const [data, setData] = useState(initialData);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validateField = useCallback((field, value) => {
    const rules = validationRules[field];
    if (!rules) return null;

    const error = validateField(value, rules);
    setErrors(prev => ({
      ...prev,
      [field]: error
    }));

    return error;
  }, [validationRules]);

  const handleChange = useCallback((field, value) => {
    setData(prev => ({
      ...prev,
      [field]: value
    }));

    if (touched[field]) {
      validateField(field, value);
    }
  }, [touched, validateField]);

  const handleBlur = useCallback((field) => {
    setTouched(prev => ({
      ...prev,
      [field]: true
    }));

    validateField(field, data[field]);
  }, [data, validateField]);

  const validateForm = useCallback(() => {
    const { isValid, errors: formErrors } = validateForm(data, validationRules);
    setErrors(formErrors);
    setTouched(Object.keys(validationRules).reduce((acc, field) => {
      acc[field] = true;
      return acc;
    }, {}));

    return isValid;
  }, [data, validationRules]);

  const reset = useCallback(() => {
    setData(initialData);
    setErrors({});
    setTouched({});
  }, [initialData]);

  return {
    data,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateForm,
    reset,
    isValid: Object.keys(errors).length === 0
  };
};