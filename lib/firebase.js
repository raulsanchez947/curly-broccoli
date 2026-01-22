import { initializeApp, getApps, getApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
import { getAnalytics, isSupported as analyticsIsSupported } from 'firebase/analytics'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
}

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp()

const isBrowser = typeof window !== 'undefined'
export const auth = isBrowser ? getAuth(app) : null
export const db = isBrowser ? getFirestore(app) : null
export const storage = isBrowser ? getStorage(app) : null

// Initialize analytics only in supported browsers and when measurementId is present
export let analytics = null
if (isBrowser && process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID) {
  (async () => {
    try {
      const supported = await analyticsIsSupported()
      if (supported) analytics = getAnalytics(app)
    } catch (e) {
      // ignore analytics init failures in environment without window or permission
      console.debug('firebase analytics not supported or failed to init', e?.message || e)
    }
  })()
}
