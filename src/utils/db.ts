import { FirebaseOptions, initializeApp } from 'firebase/app'
// import { getFirestore, getDoc, updateDoc } from 'firebase/firestore/lite'
import {
    getFirestore,
    CollectionReference,
    collection,
    DocumentData,
} from 'firebase/firestore'
import { Post, Comment } from '@/types/models'

const firebaseConfig: FirebaseOptions = {
    apiKey: import.meta.env.VITE_API_KEY,
    authDomain: import.meta.env.VITE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_APP_ID,
}

export const firebaseApp = initializeApp(firebaseConfig)
export const db = getFirestore(firebaseApp)

const getCollection = <T = DocumentData>(collectionName: string) => {
    return collection(db, collectionName) as CollectionReference<T>
}

export const postsCol = getCollection<Post>('posts')
export const commentsCol = getCollection<Comment>('comments')
