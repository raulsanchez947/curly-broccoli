import admin from 'firebase-admin'

function initAdmin(){
  if(admin.apps && admin.apps.length) return admin.app()

  // Prefer GOOGLE_APPLICATION_CREDENTIALS if set (path to JSON file)
  if(process.env.GOOGLE_APPLICATION_CREDENTIALS){
    admin.initializeApp({ credential: admin.credential.applicationDefault(), storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET })
    return admin.app()
  }

  // Otherwise accept a base64-encoded service account JSON via env
  const base64 = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64
  if(base64){
    try{
      const json = JSON.parse(Buffer.from(base64, 'base64').toString('utf8'))
      admin.initializeApp({ credential: admin.credential.cert(json), storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET })
      return admin.app()
    }catch(e){
      console.error('Failed to parse FIREBASE_SERVICE_ACCOUNT_BASE64', e)
    }
  }

  // Fallback: attempt application default credentials (may fail in dev)
  admin.initializeApp({ credential: admin.credential.applicationDefault(), storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET })
  return admin.app()
}

const adminApp = initAdmin()
const authAdmin = adminApp.auth()
const firestoreAdmin = adminApp.firestore()
const storageAdmin = adminApp.storage()

export { adminApp as admin, authAdmin, firestoreAdmin, storageAdmin }
