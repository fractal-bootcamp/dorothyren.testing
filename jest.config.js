module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  setupFilesAfterEnv: ['<rootDir>/src/lib/singleton.ts'],

};