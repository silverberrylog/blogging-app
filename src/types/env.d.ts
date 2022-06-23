/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_API_KEY: string
    readonly VITE_AUTH_DOMAIN: string
    readonly VITE_PROJECT_ID: string
    readonly VITE_STORAGE_BUCKET: string
    readonly VITE_MESSAGING_SENDER_ID: string
    readonly VITE_APP_ID: string
    readonly VITE_FIRESTORE_EMULATOR_HOST: string
    readonly VITE_FIRESTORE_EMULATOR_PORT: number

    MODE: string
    BASE_URL: string
    PROD: boolean
    DEV: boolean
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}

export {}

declare global {
    namespace NodeJS {
        interface ProcessEnv extends ImportMetaEnv {}
    }
}
