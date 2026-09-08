import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.calendo.app',
  appName: 'Calendo',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
