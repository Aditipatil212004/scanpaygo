import { Dimensions, Appearance } from 'react-native';

const { width, height } = Dimensions.get('window');
const isTablet = width >= 768;
const scheme = Appearance.getColorScheme();

export const COLORS = {
  primary: '#2563EB',
  accent: '#22C55E',
 background: '#FFFFFF',

  card: scheme === 'dark' ? '#020617' : '#FFFFFF',
  text: scheme === 'dark' ? '#F8FAFC' : '#020617',
  muted: scheme === 'dark' ? '#94A3B8' : '#64748B',
};

export const SIZES = {
  width,
  height,
  padding: isTablet ? width * 0.04 : width * 0.05,
  radius: 16,
  title: isTablet ? width * 0.045 : width * 0.06,
  text: isTablet ? width * 0.032 : width * 0.045,
  small: isTablet ? width * 0.028 : width * 0.038,
};

export const SHADOW = {
  shadowColor: '#000',
  shadowOpacity: 0.08,
  shadowRadius: 12,
  elevation: 6,
};
