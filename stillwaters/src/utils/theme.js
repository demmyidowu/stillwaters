import { createTheme } from '@rneui/themed';

export const colors = {
  primary: {
    blue: '#5B9BD5',
    dark: '#4A7BA7',
    light: '#E3F2FD',
  },
  secondary: {
    dark: '#424242',
    medium: '#757575',
    light: '#F5F5F5',
  },
  accent: '#4DB6AC',
  semantic: {
    success: '#81C784',
    warning: '#FFB74D',
    error: '#E57373',
  },
  white: '#FFFFFF',
  black: '#000000',
};

export const typography = {
  heading: 'System',
  body: 'System',
  scripture: 'System',
  sizes: {
    h1: 32,
    h2: 24,
    h3: 20,
    body: 16,
    caption: 14,
    small: 12,
  },
  weights: {
    regular: '400',
    medium: '500',
    bold: '700',
  },
};

export const spacing = {
  xs: 4,
  s: 8,
  m: 16,
  l: 24,
  xl: 32,
  xxl: 48,
};

export const commonStyles = {
  card: {
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: spacing.m,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  container: {
    flex: 1,
    backgroundColor: colors.secondary.light,
  },
};

export const theme = createTheme({
  lightColors: {
    primary: colors.primary.blue,
    secondary: colors.secondary.medium,
    background: colors.secondary.light,
    white: colors.white,
    black: colors.black,
    grey0: colors.secondary.light,
    grey1: colors.secondary.medium,
    grey2: colors.secondary.dark,
    error: colors.semantic.error,
    success: colors.semantic.success,
    warning: colors.semantic.warning,
  },
  mode: 'light', // Force light mode
  // Ensure dark mode uses same colors as light mode to effectively disable it
  darkColors: {
    primary: colors.primary.blue,
    secondary: colors.secondary.medium,
    background: colors.secondary.light,
    white: colors.white,
    black: colors.black,
    grey0: colors.secondary.light,
    grey1: colors.secondary.medium,
    grey2: colors.secondary.dark,
    error: colors.semantic.error,
    success: colors.semantic.success,
    warning: colors.semantic.warning,
  },
  components: {
    Button: {
      buttonStyle: {
        borderRadius: 8,
      },
    },
    Text: {
      style: {
        fontFamily: 'System',
      },
    },
  },
});
