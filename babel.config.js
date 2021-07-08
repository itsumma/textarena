module.exports = {
  "presets": [
    "@babel/env",
    "@babel/preset-typescript"
  ],
  "plugins": [
    ["@babel/plugin-proposal-decorators", { "decoratorsBeforeExport": true, }],
    ["@babel/proposal-class-properties", { "loose": false }],
    "@babel/proposal-object-rest-spread"
  ],
  "env": {
    "test": {
      "plugins": ["@babel/plugin-transform-runtime"]
    }
  }
}