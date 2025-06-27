import 'dotenv/config';

export default {
  name: "trenaly",
  slug: "trenaly",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "light",
  splash: {
    image: "./assets/splash-icon.png",
    resizeMode: "contain",
    backgroundColor: "#276999"
  },
  plugins: [
    [
      "expo-location",
      {
        locationAlwaysAndWhenInUsePermission: "Este app precisa da sua localização para encontrar academias e locais próximos para treinar."
      }
    ]
  ],
  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.trenaly.fitness",
    infoPlist: {
      NSLocationWhenInUseUsageDescription: "Este app precisa da sua localização para encontrar academias e locais próximos para treinar.",
      NSLocationAlwaysAndWhenInUseUsageDescription: "Este app precisa da sua localização para encontrar academias e locais próximos para treinar."
    }
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#276999"
    },
    package: "com.trenaly.fitness",
    permissions: [
      "ACCESS_FINE_LOCATION",
      "ACCESS_COARSE_LOCATION"
    ]
  },
  web: {
    favicon: "./assets/favicon.png"
  },
  extra: {
    firebaseApiKey: process.env.FIREBASE_API_KEY,
    firebaseAuthDomain: process.env.FIREBASE_AUTH_DOMAIN,
    firebaseProjectId: process.env.FIREBASE_PROJECT_ID,
    firebaseStorageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    firebaseMessagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    firebaseAppId: process.env.FIREBASE_APP_ID,
    firebaseMeasurementId: process.env.FIREBASE_MEASUREMENT_ID,
    youtubeApiKey: process.env.YOUTUBE_API_KEY,
    googlePlacesApiKey: process.env.GOOGLE_PLACES_API_KEY,
    usdaApiKey: process.env.USDA_API_KEY,
  }
};
