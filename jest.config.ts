import type { Config } from 'jest';
import { compilerOptions } from './tsconfig.json';

const moduleNameMapper = Object.entries(compilerOptions.paths).reduce(
  (acc, [alias, [path]]) => {
    const key = alias.replace('/*', '/(.*)');
    const value = `<rootDir>/${path.replace('/*', '/$1')}`;
    return { ...acc, [key]: value };
  },
  {}
);

const config: Config = {
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  moduleNameMapper,
  moduleDirectories: ['node_modules', 'src'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  testPathIgnorePatterns: [
    "/node_modules/",
    "/__tests__/mocks/"
  ],
};

export default config;
