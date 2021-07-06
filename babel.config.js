module.exports = {
  "presets": [
    "@babel/env",
    "@babel/preset-typescript"
  ],
  "plugins": [
    ["@babel/plugin-proposal-decorators", { "legacy": true }],
    "@babel/proposal-class-properties",
    "@babel/proposal-object-rest-spread"
  ],
  "env": {
    "test": {
      "plugins": ["@babel/plugin-transform-runtime"]
    }
  }
}