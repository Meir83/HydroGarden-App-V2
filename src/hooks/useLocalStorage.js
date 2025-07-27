import { useState, useEffect, useCallback, useRef } from 'react';
import { hydroStorage, debounce } from '../utils/storage';

export const useLocalStorage = (key, defaultValue) => {
  const [value, setValue] = useState(() => {
    try {
      const item = hydroStorage.get(key);
      return item !== null ? item : defaultValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return defaultValue;
    }
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Debounced storage function to reduce writes
  const debouncedSetStorage = useCallback(
    debounce((key, value) => {
      try {
        setLoading(true);
        hydroStorage.set(key, value);
        setError(null);
      } catch (error) {
        console.warn(`Error setting localStorage key "${key}":`, error);
        setError(error);
      } finally {
        setLoading(false);
      }
    }, 300),
    []
  );

  const setStoredValue = useCallback((newValue) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = newValue instanceof Function ? newValue(value) : newValue;
      
      // Save state
      setValue(valueToStore);
      
      // Save to localStorage with debouncing
      debouncedSetStorage(key, valueToStore);
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
      setError(error);
    }
  }, [key, value, debouncedSetStorage]);

  const removeValue = useCallback(() => {
    try {
      setValue(defaultValue);
      hydroStorage.remove(key);
      setError(null);
    } catch (error) {
      console.warn(`Error removing localStorage key "${key}":`, error);
      setError(error);
    }
  }, [key, defaultValue]);

  return [value, setStoredValue, removeValue, { loading, error }];
};

export const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < 768;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return isMobile;
};

export const useKeyboardNavigation = (onEnter, onEscape) => {
  useEffect(() => {
    const handleKeyDown = (event) => {
      switch (event.key) {
        case 'Enter':
          if (onEnter) onEnter(event);
          break;
        case 'Escape':
          if (onEscape) onEscape(event);
          break;
        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onEnter, onEscape]);
};

export const usePerformanceTracking = (componentName) => {
  const renderCount = useRef(0);
  const mountTime = useRef(Date.now());

  useEffect(() => {
    renderCount.current += 1;
  });

  useEffect(() => {
    // Component mounted
    const loadTime = Date.now() - mountTime.current;
    if (loadTime > 100) {
      console.warn(`Slow component mount: ${componentName} took ${loadTime}ms`);
    }

    return () => {
      // Component unmounted
      const lifespan = Date.now() - mountTime.current;
      console.log(`Component ${componentName} unmounted after ${lifespan}ms, rendered ${renderCount.current} times`);
    };
  }, [componentName]);

  return {
    renderCount: renderCount.current,
    lifespan: Date.now() - mountTime.current
  };
};

export const useOnlineStatus = () => {
  const [isOnline, setIsOnline] = useState(() => {
    if (typeof navigator === 'undefined') return true;
    return navigator.onLine;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
};

export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

export const usePrevious = (value) => {
  const ref = useRef();
  
  useEffect(() => {
    ref.current = value;
  });
  
  return ref.current;
};