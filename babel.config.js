module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  // Ensure all class features plugins use the same `loose` mode to avoid Metro errors
  plugins: [
    ['@babel/plugin-transform-class-properties', { loose: true }],
    ['@babel/plugin-transform-private-methods', { loose: true }],
    ['@babel/plugin-transform-private-property-in-object', { loose: true }],
  ],
};
