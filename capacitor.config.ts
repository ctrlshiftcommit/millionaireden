import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.millionaireden.app',
  appName: 'Millionaire Den',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    url: 'https://514950ca-ff5d-4568-821a-c78ec64ce7b4.lovableproject.com?forceHideBadge=true',
    cleartext: true
  }
};

export default config;