module.exports = {
  moduleFileExtensions: ['js', 'json'],
  rootDir: 'src',
  testRegex: '.test.js$',
  transform: {
    '^.+\\.js?$': 'babel-jest',
  },
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
};
