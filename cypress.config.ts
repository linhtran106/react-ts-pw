import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    // e2e options here
    defaultCommandTimeout: 10000,
    baseUrl: 'http://localhost:3000/',
    chromeWebSecurity: false,
    viewportWidth: 1366, // the most suitable screen for the desktop website
    viewportHeight: 768, // the most suitable screen for the desktop website
    requestTimeout: 10000,
    numTestsKeptInMemory: 10,
    responseTimeout: 10000,
    pageLoadTimeout: 20000,
    trashAssetsBeforeRuns: false,
    setupNodeEvents(on, config) {
      // implement node event listeners here
      // and load any plugins that require the Node environment
    },
  },
})
