export default {
  testEnvironment: "jsdom",

  transform: {
    "^.+\\.[jt]sx?$": "babel-jest",
  },

  extensionsToTreatAsEsm: [".jsx"],

  setupFiles: [
    "<rootDir>/jest.setup.js",
  ],

  setupFilesAfterEnv: [
    "@testing-library/jest-dom",
  ],

  testMatch: [
    "**/tests/**/*.test.jsx",
  ],
};