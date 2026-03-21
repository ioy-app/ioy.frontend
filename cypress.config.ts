import { defineConfig } from "cypress";

export default defineConfig({
  allowCypressEnv: false,

  e2e: {
    specPattern: '__tests__/units/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: '__tests__/units/support/e2e.{js,jsx,ts,tsx}',
    downloadsFolder: '__tests__/units/downloads',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
