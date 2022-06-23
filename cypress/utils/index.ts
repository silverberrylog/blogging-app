const host = Cypress.env('VITE_FIRESTORE_EMULATOR_HOST')
const port = Cypress.env('VITE_FIRESTORE_EMULATOR_PORT')
const projectId = Cypress.env('VITE_PROJECT_ID')

const emulatorURL = `http://${host}:${port}/emulator/v1/projects/${projectId}/databases/(default)/documents`

export const emptyFirestoreEmulator = () => {
    cy.request('DELETE', emulatorURL)
}
