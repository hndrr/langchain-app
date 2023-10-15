const appJson = require("./app.json");
const { appId, projectId, owner } = require("./config.json");

module.exports = {
  expo: {
    ...appJson.expo,
    ios: {
      supportsTablet: true,
      bundleIdentifier: appId,
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      package: appId,
    },
    extra: {
      eas: {
        projectId,
      },
    },
    owner,
  },
};
