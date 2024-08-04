import { db } from './firebaseConfig';
import { collection, getDocs, doc, getDoc, addDoc, query, where, orderBy, serverTimestamp, writeBatch } from 'firebase/firestore';

// Fetch all apps
export const fetchApps = async () => {
    try {
        const appsQuery = collection(db, 'apps');
        const querySnapshot = await getDocs(appsQuery);
        const apps = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return apps;
    } catch (error) {
        console.error('Error fetching apps:', error.message);
        return [];
    }
};

// Fetch app by ID
export const fetchAppById = async (id) => {
    if (!id) {
        console.error('Invalid app ID');
        return null;
    }
    try {
        const docRef = doc(db, 'apps', id);
        const docSnap = await getDoc(docRef);
        return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
    } catch (error) {
        console.error('Error fetching app:', error.message);
        return null;
    }
};

// Add a new app
export const addApp = async (name, description, organization, price, tags) => {
    if (!name || !description || !organization || !price || !Array.isArray(tags)) {
        console.error('Invalid app data');
        return null;
    }
    try {
        const docRef = await addDoc(collection(db, 'apps'), {
            name,
            description,
            organization,
            price,
            tags,
            createdAt: serverTimestamp()
        });
        return { id: docRef.id, name, description, organization, price, tags };
    } catch (error) {
        console.error('Error adding app:', error.message);
        return null;
    }
};

// Fetch reviews by app ID
export const fetchReviewsByAppId = async (appId) => {
    if (!appId) {
        console.error('Invalid app ID');
        return [];
    }
    try {
        const reviewsQuery = query(collection(db, 'reviews'), where('appId', '==', appId), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(reviewsQuery);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error('Error fetching reviews:', error.message);
        return [];
    }
};

// Add a new review
export const addReview = async (appId, reviewText, rating) => {
    if (!appId || !reviewText || typeof rating !== 'number') {
        console.error('Invalid review data');
        return null;
    }
    try {
        const docRef = await addDoc(collection(db, 'reviews'), {
            appId,
            text: reviewText,
            rating,
            createdAt: serverTimestamp()
        });
        return { id: docRef.id, appId, reviewText, rating };
    } catch (error) {
        console.error('Error adding review:', error.message);
        return null;
    }
};

// Check if username is unique
export const isUsernameUnique = async (username) => {
    if (!username) {
        console.error('Invalid username');
        return false;
    }
    try {
        const usernamesRef = collection(db, 'usernames');
        const q = query(usernamesRef, where('username', '==', username));
        const querySnapshot = await getDocs(q);
        return querySnapshot.empty;
    } catch (error) {
        console.error('Error checking username uniqueness:', error.message);
        return false;
    }
};

// Save a new username
export const saveUsername = async (uid, username) => {
    if (!uid || !username) {
        console.error('Invalid user data');
        return null;
    }
    try {
        const usernamesRef = collection(db, 'usernames');
        await addDoc(usernamesRef, { uid, username });
        return { uid, username };
    } catch (error) {
        console.error('Error saving username:', error.message);
        return null;
    }
};

// Fetch all tags
export const fetchTags = async () => {
    try {
        const tagsQuery = collection(db, 'tags');
        const querySnapshot = await getDocs(tagsQuery);
        return querySnapshot.docs.map(doc => doc.data().name);
    } catch (error) {
        console.error('Error fetching tags:', error.message);
        return [];
    }
};