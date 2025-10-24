// Color palette for the app
export const colors = {
  primary: '#007AFF',
  primaryDark: '#0051D5',
  primaryLight: '#4DA3FF',
  secondary: '#5856D6',
  
  success: '#34C759',
  warning: '#FF9500',
  error: '#FF3B30',
  
  background: '#F2F2F7',
  surface: '#FFFFFF',
  
  text: '#000000',
  textSecondary: '#8E8E93',
  textTertiary: '#C7C7CC',
  
  border: '#E5E5EA',
  separator: '#C6C6C8',
  
  // Message colors
  myMessageBg: '#007AFF',
  otherMessageBg: '#E9E9EB',
  myMessageText: '#FFFFFF',
  otherMessageText: '#000000',
  
  // Status colors
  online: '#34C759',
  offline: '#8E8E93',
  typing: '#007AFF',
  
  // Read receipt colors
  sent: '#8E8E93',
  delivered: '#8E8E93',
  read: '#007AFF',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 9999,
};

export const shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
};

export const typography = {
  h1: {
    fontSize: 32,
    fontWeight: 'bold',
    lineHeight: 40,
  },
  h2: {
    fontSize: 24,
    fontWeight: '600',
    lineHeight: 32,
  },
  h3: {
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 28,
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
  },
  caption: {
    fontSize: 12,
    lineHeight: 16,
  },
};
