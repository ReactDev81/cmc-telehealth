const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname, {
  // Enable CSS support required by NativeWind on Expo SDK 54
  isCSSEnabled: true,
});

module.exports = withNativeWind(config, {
  input: './global.css',
});
