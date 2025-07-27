export * from './storage';
export * from './validation';

// Date formatting utilities
export const formatDate = (date, locale = 'he-IL') => {
  if (!date) return '';
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return '';
  
  return dateObj.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const formatTime = (time, locale = 'he-IL') => {
  if (!time) return '';
  const [hours, minutes] = time.split(':');
  const date = new Date();
  date.setHours(parseInt(hours), parseInt(minutes));
  
  return date.toLocaleTimeString(locale, {
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const formatDateTime = (date, time, locale = 'he-IL') => {
  const formattedDate = formatDate(date, locale);
  const formattedTime = formatTime(time, locale);
  return `${formattedDate} בשעה ${formattedTime}`;
};

// Number formatting utilities
export const formatNumber = (number, decimals = 1) => {
  if (typeof number !== 'number') return '0';
  return number.toFixed(decimals);
};

export const formatPercentage = (value, total = 100) => {
  if (typeof value !== 'number') return '0%';
  const percentage = (value / total) * 100;
  return `${formatNumber(percentage, 0)}%`;
};

// Color utilities
export const hexToRgba = (hex, alpha = 1) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

// Array utilities
export const groupBy = (array, key) => {
  return array.reduce((result, item) => {
    const group = item[key];
    if (!result[group]) {
      result[group] = [];
    }
    result[group].push(item);
    return result;
  }, {});
};

export const sortBy = (array, key, direction = 'asc') => {
  return [...array].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];
    
    if (direction === 'desc') {
      return bVal > aVal ? 1 : -1;
    }
    return aVal > bVal ? 1 : -1;
  });
};

// String utilities
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const truncate = (str, length = 100, suffix = '...') => {
  if (!str || str.length <= length) return str;
  return str.substring(0, length) + suffix;
};

// Device detection
export const isMobile = () => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < 768;
};

export const isTablet = () => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth >= 768 && window.innerWidth < 1024;
};

export const isDesktop = () => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth >= 1024;
};

// Deep clone utility
export const deepClone = (obj) => {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime());
  if (obj instanceof Array) return obj.map(deepClone);
  if (typeof obj === 'object') {
    const cloned = {};
    Object.keys(obj).forEach(key => {
      cloned[key] = deepClone(obj[key]);
    });
    return cloned;
  }
};

// Generate unique ID
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Sleep utility for async operations
export const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// Retry utility for failed operations
export const retry = async (fn, retries = 3, delay = 1000) => {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === retries - 1) throw error;
      await sleep(delay * Math.pow(2, i)); // Exponential backoff
    }
  }
};