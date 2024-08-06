// Import the functions you need from the SDKs you need
import { getApps, initializeApp, deleteApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

/**
 * Firebase configuration object.
 * These values are sourced from environment variables.
 * 
 * @type {Object}
 * @property {string} apiKey - Firebase API key
 * @property {string} authDomain - Firebase Auth domain
 * @property {string} projectId - Firebase project ID
 * @property {string} storageBucket - Firebase storage bucket
 * @property {string} messagingSenderId - Firebase messaging sender ID
 * @property {string} appId - Firebase app ID
 * @property {string} measurementId - Firebase measurement ID
 */
const firebaseConfig = {
    apiKey: import.meta.env.VITE_APIKEY,
    authDomain: import.meta.env.VITE_AUTHDOMAIN,
    projectId: import.meta.env.VITE_PROJECTID,
    storageBucket: import.meta.env.VITE_STORAGEBUCKET,
    messagingSenderId: import.meta.env.VITE_MESSAGINGSENDERID,
    appId: import.meta.env.VITE_APPID,
    measurementId: import.meta.env.VITE_MEASUREMENTID
};

/**
 * Initializes Firebase app if not already initialized.
 * If an app is already initialized, it deletes and reinitializes it with the provided configuration.
 * 
 * @returns {Object} The initialized Firebase app instance
 */
let firebaseApp;
if (!getApps().length) {
    firebaseApp = initializeApp(firebaseConfig);
} else {
    firebaseApp = getApps()[0];
    deleteApp(firebaseApp).then(() => {
        firebaseApp = initializeApp(firebaseConfig);
    });
}

/**
 * Firestore database instance.
 * 
 * @type {Object}
 */
export const db = getFirestore(firebaseApp);

/**
 * Firebase Auth instance.
 * 
 * @type {Object}
 */
export const auth = getAuth(firebaseApp);