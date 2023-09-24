import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.devstudio.binanceportfolio',
  appName: 'CoinDeck',
  webDir: 'dist',
  android:{
    buildOptions:{
      keystorePath:"./newvartha.keystore",
      keystoreAlias:"newvartha",
      keystoreAliasPassword:"asd1234",
      keystorePassword:"asd1234",
      // signingType:"apksigner"
    }
  },
  server: {
    androidScheme: 'https'
  }
};

export default config;
