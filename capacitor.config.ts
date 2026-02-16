import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.skybound.kidsacademy',
  appName: 'Skybound Kids Academy',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    url: 'https://skyboundkidsacademy.pages.dev'
  },
  cordova: {
    preferences: {
      ScrollEnabled: 'false',
      Orientation: 'portrait',
      'android-minSdkVersion': '22',
      'android-targetSdkVersion': '33'
    }
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 3000,
      launchAutoHide: true,
      backgroundColor: '#ff4757'
    }
  }
};

export default config;
