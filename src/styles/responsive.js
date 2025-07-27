import { theme } from './theme';

export const breakpoints = theme.breakpoints;

export const mediaQueries = {
  mobile: `@media (max-width: ${breakpoints.mobile})`,
  tablet: `@media (min-width: ${breakpoints.mobile}) and (max-width: ${breakpoints.desktop})`,
  desktop: `@media (min-width: ${breakpoints.desktop})`,
  wide: `@media (min-width: ${breakpoints.wide})`
};

export const responsive = {
  // Responsive spacing
  spacing: {
    section: {
      mobile: theme.spacing.lg,
      tablet: theme.spacing.xl,
      desktop: theme.spacing['2xl']
    },
    card: {
      mobile: theme.spacing.md,
      tablet: theme.spacing.lg,
      desktop: theme.spacing.xl
    }
  },
  
  // Responsive typography
  typography: {
    heading: {
      mobile: theme.typography.fontSize['2xl'],
      tablet: theme.typography.fontSize['3xl'],
      desktop: theme.typography.fontSize['4xl']
    },
    subheading: {
      mobile: theme.typography.fontSize.lg,
      tablet: theme.typography.fontSize.xl,
      desktop: theme.typography.fontSize['2xl']
    },
    body: {
      mobile: theme.typography.fontSize.sm,
      tablet: theme.typography.fontSize.base,
      desktop: theme.typography.fontSize.lg
    }
  },
  
  // Responsive grid
  grid: {
    columns: {
      mobile: 1,
      tablet: 2,
      desktop: 3
    },
    gap: {
      mobile: theme.spacing.md,
      tablet: theme.spacing.lg,
      desktop: theme.spacing.xl
    }
  }
};

// Helper functions for responsive styles
export const getResponsiveValue = (values, breakpoint = 'mobile') => {
  return values[breakpoint] || values.mobile || values;
};

export const createResponsiveStyles = (property, values) => {
  const styles = {};
  
  Object.keys(values).forEach(breakpoint => {
    if (breakpoint === 'mobile') {
      styles[property] = values[breakpoint];
    } else {
      const mediaQuery = mediaQueries[breakpoint];
      if (mediaQuery) {
        styles[mediaQuery] = {
          [property]: values[breakpoint]
        };
      }
    }
  });
  
  return styles;
};