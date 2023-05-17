import type { Config } from 'jest';

const config: Config = {
  verbose: true,
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@src/(.*)$': '<rootDir>/src/$1',
    '^@config/(.*)$': '<rootDir>/src/config/$1',
    '^@controllers/(.*)$': '<rootDir>/src/controllers/$1',
    '^@routers/(.*)$': '<rootDir>/src/routers/$1',
    '^@schemas/(.*)$': '<rootDir>/src/schemas/$1',
  },
};

export default config;