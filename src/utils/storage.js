class StorageOptimizer {
  constructor() {
    this.writeQueue = new Map();
    this.batchTimer = null;
    this.cache = new Map();
    this.BATCH_DELAY = 500; // ms
    this.MAX_RETRIES = 3;
  }

  // Optimized read with in-memory caching
  get(key, defaultValue = null) {
    try {
      // Check cache first
      if (this.cache.has(key)) {
        return this.cache.get(key);
      }

      // Read from localStorage
      const item = localStorage.getItem(key);
      if (item === null) {
        return defaultValue;
      }

      const parsed = JSON.parse(item);
      
      // Cache the result
      this.cache.set(key, parsed);
      
      return parsed;
    } catch (error) {
      console.warn(`Storage read error for key "${key}":`, error);
      return defaultValue;
    }
  }

  // Batched write operations
  set(key, value, immediate = false) {
    // Update cache immediately
    this.cache.set(key, value);

    if (immediate) {
      this.writeImmediate(key, value);
    } else {
      // Queue for batched write
      this.writeQueue.set(key, value);
      this.scheduleBatchWrite();
    }
  }

  // Immediate write (for critical data)
  writeImmediate(key, value, retries = 0) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.warn(`Storage write error for key "${key}":`, error);
      
      if (retries < this.MAX_RETRIES) {
        // Try to free up space
        this.cleanup();
        return this.writeImmediate(key, value, retries + 1);
      }
      
      return false;
    }
  }

  // Schedule batched writes
  scheduleBatchWrite() {
    if (this.batchTimer) {
      clearTimeout(this.batchTimer);
    }

    this.batchTimer = setTimeout(() => {
      this.executeBatchWrite();
    }, this.BATCH_DELAY);
  }

  // Execute all queued writes
  executeBatchWrite() {
    const entries = Array.from(this.writeQueue.entries());
    this.writeQueue.clear();

    for (const [key, value] of entries) {
      this.writeImmediate(key, value);
    }

    this.batchTimer = null;
  }

  // Remove item
  remove(key) {
    this.cache.delete(key);
    this.writeQueue.delete(key);
    
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.warn(`Storage remove error for key "${key}":`, error);
    }
  }

  // Clear all data
  clear() {
    this.cache.clear();
    this.writeQueue.clear();
    
    if (this.batchTimer) {
      clearTimeout(this.batchTimer);
      this.batchTimer = null;
    }
    
    try {
      localStorage.clear();
    } catch (error) {
      console.warn('Storage clear error:', error);
    }
  }

  // Cleanup old or large items
  cleanup() {
    try {
      const keys = Object.keys(localStorage);
      const items = keys.map(key => ({
        key,
        size: localStorage.getItem(key).length,
        timestamp: this.getTimestamp(key)
      }));

      // Sort by size (largest first) and age (oldest first)
      items.sort((a, b) => {
        if (b.size !== a.size) return b.size - a.size;
        return a.timestamp - b.timestamp;
      });

      // Remove largest/oldest items if storage is getting full
      const totalSize = items.reduce((sum, item) => sum + item.size, 0);
      const MAX_SIZE = 5 * 1024 * 1024; // 5MB threshold

      if (totalSize > MAX_SIZE) {
        const itemsToRemove = items.slice(0, Math.ceil(items.length * 0.1)); // Remove 10%
        itemsToRemove.forEach(item => {
          if (!item.key.startsWith('hydrogarden-critical-')) {
            localStorage.removeItem(item.key);
            this.cache.delete(item.key);
          }
        });
      }
    } catch (error) {
      console.warn('Storage cleanup error:', error);
    }
  }

  // Get timestamp for cache management
  getTimestamp(key) {
    try {
      const timestampKey = `${key}_timestamp`;
      return parseInt(localStorage.getItem(timestampKey) || Date.now());
    } catch {
      return Date.now();
    }
  }

  // Set timestamp for cache management
  setTimestamp(key) {
    try {
      const timestampKey = `${key}_timestamp`;
      localStorage.setItem(timestampKey, Date.now().toString());
    } catch (error) {
      console.warn('Timestamp set error:', error);
    }
  }

  // Get storage usage statistics
  getStats() {
    try {
      const keys = Object.keys(localStorage);
      const totalSize = keys.reduce((sum, key) => {
        return sum + localStorage.getItem(key).length;
      }, 0);

      return {
        totalKeys: keys.length,
        totalSize,
        cacheSize: this.cache.size,
        queueSize: this.writeQueue.size,
        usage: `${(totalSize / 1024 / 1024).toFixed(2)} MB`
      };
    } catch (error) {
      console.warn('Storage stats error:', error);
      return {
        totalKeys: 0,
        totalSize: 0,
        cacheSize: this.cache.size,
        queueSize: this.writeQueue.size,
        usage: '0 MB'
      };
    }
  }

  // Export data for backup
  exportData() {
    try {
      const data = {};
      const keys = Object.keys(localStorage);
      
      keys.forEach(key => {
        if (key.startsWith('hydrogarden-')) {
          data[key] = localStorage.getItem(key);
        }
      });

      return {
        data,
        exportDate: new Date().toISOString(),
        version: '1.0'
      };
    } catch (error) {
      console.warn('Data export error:', error);
      return null;
    }
  }

  // Import data from backup
  importData(exportedData) {
    try {
      if (!exportedData || !exportedData.data) {
        throw new Error('Invalid import data');
      }

      Object.entries(exportedData.data).forEach(([key, value]) => {
        localStorage.setItem(key, value);
        // Parse and cache the value
        try {
          const parsed = JSON.parse(value);
          this.cache.set(key, parsed);
        } catch {
          this.cache.set(key, value);
        }
      });

      return true;
    } catch (error) {
      console.warn('Data import error:', error);
      return false;
    }
  }

  // Force flush all pending writes
  flush() {
    if (this.batchTimer) {
      clearTimeout(this.batchTimer);
      this.executeBatchWrite();
    }
  }
}

// Create singleton instance
const storage = new StorageOptimizer();

// Application-specific storage utilities
export const hydroStorage = {
  // System settings
  getSettings: () => storage.get('hydrogarden-settings', {}),
  setSettings: (settings) => storage.set('hydrogarden-settings', settings),

  // Plant data
  getPlants: () => storage.get('hydrogarden-plants', []),
  setPlants: (plants) => storage.set('hydrogarden-plants', plants),

  // Calendar events
  getEvents: () => storage.get('hydrogarden-events', []),
  setEvents: (events) => storage.set('hydrogarden-events', events),

  // System metrics
  getMetrics: () => storage.get('hydrogarden-metrics', {}),
  setMetrics: (metrics) => storage.set('hydrogarden-metrics', metrics, true), // Immediate for metrics

  // User preferences
  getPreferences: () => storage.get('hydrogarden-preferences', {}),
  setPreferences: (preferences) => storage.set('hydrogarden-preferences', preferences),

  // Community posts cache
  getPosts: () => storage.get('hydrogarden-posts', []),
  setPosts: (posts) => storage.set('hydrogarden-posts', posts),

  // Guide favorites
  getFavoriteGuides: () => storage.get('hydrogarden-favorite-guides', []),
  setFavoriteGuides: (guides) => storage.set('hydrogarden-favorite-guides', guides),

  // Generic methods
  get: storage.get.bind(storage),
  set: storage.set.bind(storage),
  remove: storage.remove.bind(storage),
  clear: storage.clear.bind(storage),
  flush: storage.flush.bind(storage),
  cleanup: storage.cleanup.bind(storage),
  getStats: storage.getStats.bind(storage),
  exportData: storage.exportData.bind(storage),
  importData: storage.importData.bind(storage)
};

// Performance monitoring
export class PerformanceMonitor {
  constructor() {
    this.metrics = new Map();
    this.observers = [];
    this.startTime = performance.now();
  }

  // Start measuring a operation
  start(name) {
    this.metrics.set(name, {
      startTime: performance.now(),
      endTime: null,
      duration: null
    });
  }

  // End measuring and record duration
  end(name) {
    const metric = this.metrics.get(name);
    if (metric) {
      metric.endTime = performance.now();
      metric.duration = metric.endTime - metric.startTime;
      
      // Log slow operations
      if (metric.duration > 16) { // Slower than 60fps frame
        console.warn(`Slow operation detected: ${name} took ${metric.duration.toFixed(2)}ms`);
      }
      
      // Notify observers
      this.notifyObservers(name, metric);
    }
  }

  // Get metrics
  getMetrics() {
    const result = {};
    this.metrics.forEach((value, key) => {
      result[key] = { ...value };
    });
    return result;
  }

  // Clear metrics
  clear() {
    this.metrics.clear();
  }

  // Add performance observer
  addObserver(callback) {
    this.observers.push(callback);
  }

  // Remove performance observer
  removeObserver(callback) {
    const index = this.observers.indexOf(callback);
    if (index > -1) {
      this.observers.splice(index, 1);
    }
  }

  // Notify all observers
  notifyObservers(name, metric) {
    this.observers.forEach(callback => {
      try {
        callback(name, metric);
      } catch (error) {
        console.warn('Performance observer error:', error);
      }
    });
  }

  // Measure memory usage
  getMemoryUsage() {
    if (performance.memory) {
      return {
        used: performance.memory.usedJSHeapSize,
        total: performance.memory.totalJSHeapSize,
        limit: performance.memory.jsHeapSizeLimit,
        usagePercent: (performance.memory.usedJSHeapSize / performance.memory.jsHeapSizeLimit * 100).toFixed(2)
      };
    }
    return null;
  }

  // Get app uptime
  getUptime() {
    return performance.now() - this.startTime;
  }
}

// Create singleton instance
export const performanceMonitor = new PerformanceMonitor();

// Utility functions
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export const throttle = (func, limit) => {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
  storage.flush();
});

export default storage;