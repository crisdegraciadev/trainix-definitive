/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  rootDir: "./",
  modulePaths: ["<rootDir>"],
  moduleNameMapper: {
    "^@injections/(.*)$": "<rootDir>/src/injections/$1",
    "^@controllers/(.*)$": "<rootDir>/src/controllers/$1",
    "^@app$": "<rootDir>/src/app.ts",
  },
};
