const { defineConfig } = require('cypress')

const setupNodeEvents = (on, config) => {
    require('dotenv').config({ path: '.env.local' })
    config.env = { ...config.env, ...process.env }
    return config
}

module.exports = defineConfig({
    component: {
        specPattern: 'cypress/spec/**/*.{ts,tsx}',
        supportFile: false,
        setupNodeEvents,
    },
    e2e: {
        specPattern: 'cypress/e2e/**/*.{ts,tsx}',
        supportFile: false,
        setupNodeEvents,
        baseUrl: 'http://localhost:3000/',
    },
    env: {
        CYPRESS_VERIFY_TIMEOUT: 100000,
    },
    fixturesFolder: false,
})
