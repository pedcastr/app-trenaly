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
    ],
    [
      "expo-image-picker",
      {
        "photosPermission": "O aplicativo precisa acessar suas fotos para permitir o upload de imagens.",
        "cameraPermission": "O aplicativo precisa acessar sua câmera para tirar fotos e gravar vídeos."
      }
    ],
    [
      "expo-splash-screen",
      {
        "backgroundColor": "#276999",
        "imageResizeMode": "contain",
        "image": "./src/assets/logo-trenaly.png"
      }
    ],
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
      "CAMERA",
      "READ_EXTERNAL_STORAGE",
      "WRITE_EXTERNAL_STORAGE",
      "INTERNET",
      "VIBRATE",
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
    eas: {
      projectId: "c550ec3d-f1ba-43a5-b8f1-76131de341cb"
    }
  }
};
