module.exports = {
    verbose: true,
    transform: {
      '^.+\\.js$': 'babel-jest'
    },
    testEnvironment: 'jest-environment-jsdom',
    moduleFileExtensions: ['js', 'json', 'vue'],
    transformIgnorePatterns: ['/node_modules/'],
    testMatch: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)'],
    moduleNameMapper: {
      '^@/(.*)$': '<rootDir>/src/$1'
    }
  };