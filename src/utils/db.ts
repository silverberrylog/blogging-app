import { initializeApp } from 'firebase/app'
import {
    connectFirestoreEmulator,
    getFirestore,
    CollectionReference,
    collection,
    DocumentData,
} from 'firebase/firestore/lite'
import { Post } from '@/types/models'

if (typeof Cypress !== 'undefined') {
    process.env = { ...Cypress.env() }
    process.env.MODE = 'development'
    process.env.BASE_URL = '/'
    process.env.PROD = false
    process.env.DEV = true
}

const firebaseApp = initializeApp({
    apiKey: process.env.VITE_API_KEY,
    authDomain: process.env.VITE_AUTH_DOMAIN,
    projectId: process.env.VITE_PROJECT_ID,
    storageBucket: process.env.VITE_STORAGE_BUCKET,
    messagingSenderId: process.env.VITE_MESSAGING_SENDER_ID,
    appId: process.env.VITE_APP_ID,
})
const db = getFirestore(firebaseApp)

if (process.env.DEV) {
    console.log('Connecting to emulator')
    connectFirestoreEmulator(
        db,
        process.env.VITE_FIRESTORE_EMULATOR_HOST,
        process.env.VITE_FIRESTORE_EMULATOR_PORT
    )
}

const getCollection = <T = DocumentData>(collectionName: string) => {
    return collection(db, collectionName) as CollectionReference<T>
}

export const postsCol = getCollection<Post>('posts')
export const commentsCol = getCollection<Comment>('comments')
