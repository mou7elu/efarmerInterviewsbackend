module.exports = {
  testEnvironment: 'node',
  collectCoverageFrom: [
    'src/**/*.js',
    'models/**/*.js',
    'routes/**/*.js',
    'controllers/**/*.js',
    'middleware/**/*.js',
    'utils/**/*.js',
    '!src/**/*.test.js',
    '!src/**/index.js',
    '!**/node_modules/**'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html', 'json-summary'],
  coverageThreshold: {
    global: {
      branches: 50,
      functions: 50,
      lines: 50,
      statements: 50
    }
  },
  testMatch: [
    '**/tests/**/*.test.js',
    '**/__tests__/**/*.js',
    '**/?(*.)+(spec|test).js'
  ],
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  verbose: true,
  clearMocks: true,
  restoreMocks: true,
  resetMocks: true,
  testTimeout: 10000,
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@models/(.*)$': '<rootDir>/models/$1',
    '^@controllers/(.*)$': '<rootDir>/controllers/$1',
    '^@middleware/(.*)$': '<rootDir>/middleware/$1',
    '^@routes/(.*)$': '<rootDir>/routes/$1',
    '^@utils/(.*)$': '<rootDir>/utils/$1',
    '^@config/(.*)$': '<rootDir>/config/$1'
  }
};
