const esModules = [
  '@lit',
  'lit',
  'lit-element',
  'lit-html',
].join('|');

module.exports = {
  transform: {
    '^.+.(ts|html)$': 'ts-jest',
    '^.+.js$': 'babel-jest',
  },
  transformIgnorePatterns: [`/node_modules/(?!${esModules})`],
};
