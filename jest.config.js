module.exports = {
  transform: {
    '^.+\\.ts$': 'ts-jest'
  },
  testEnvironment: "jsdom",
  testRegex: '/(src|test)/.*\\.test\\.ts$',
  moduleFileExtensions: ['ts', 'js', 'json', 'node']
};
