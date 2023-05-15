// babel.config.js
module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        targets: {
          esmodules: false,
          browsers: ["ie >= 10"],
        },
        useBuiltIns: "usage",
        corejs: 3,
      },
    ],
  ],
  plugins: [
    "@babel/plugin-transform-runtime",
    "babel-plugin-transform-async-to-promises",
  ],
  sourceMaps: true,
  highlightCode: true,
};
