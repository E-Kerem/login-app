// jest.config.js
module.exports = {
    transform: {
      '^.+\\.(t|j)sx?$': '@swc/jest',
    },
    moduleNameMapper: {
      "\\.(css|less|scss|sass)$": "identity-obj-proxy"
    },
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
        
  };
  