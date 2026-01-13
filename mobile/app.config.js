module.exports = {
  expo: {
    name: "BusTracker",
    slug: "bustracker",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#6200ee"
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.bustracker.app",
      infoPlist: {
        NSLocationWhenInUseUsageDescription: "BusTracker needs your location to find bus routes from your current location.",
        NSLocationAlwaysAndWhenInUseUsageDescription: "BusTracker needs your location to provide accurate bus routes."
      }
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#6200ee"
      },
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
      package: "com.bustracker.app",
      permissions: [
        "ACCESS_COARSE_LOCATION",
        "ACCESS_FINE_LOCATION",
        "android.permission.ACCESS_COARSE_LOCATION",
        "android.permission.ACCESS_FINE_LOCATION"
      ],
      config: {
        googleMaps: {
          apiKey: process.env.GOOGLE_MAPS_ANDROID_KEY || "YOUR_ANDROID_GOOGLE_MAPS_API_KEY"
        }
      }
    },
    web: {
      favicon: "./assets/favicon.png"
    },
    plugins: [
      [
        "expo-location",
        {
          locationAlwaysAndWhenInUsePermission: "Allow BusTracker to use your location to find bus routes from your current location."
        }
      ]
    ],
    extra: {
      eas: {
        projectId: "a1583af1-60c1-4af5-9948-36498488a08a"
      }
    }
  }
};

