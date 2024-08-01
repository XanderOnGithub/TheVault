import { db } from './firebaseConfig';
import { collection, getDocs, doc, getDoc, addDoc, query, where, orderBy } from 'firebase/firestore';

export const fetchApps = async (tag = '') => {
    try {
        const appsQuery = tag ? query(collection(db, 'apps'), where('tags', 'array-contains', tag)) : collection(db, 'apps');
        const querySnapshot = await getDocs(appsQuery);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error('Error fetching apps:', error.message);
        return [];
    }
};

export const fetchAppById = async (id) => {
    try {
        const docRef = doc(db, 'apps', id);
        const docSnap = await getDoc(docRef);
        return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
    } catch (error) {
        console.error('Error fetching app:', error.message);
        return null;
    }
};

export const addApp = async (name, description, organization, price, tags) => {
    try {
        const docRef = await addDoc(collection(db, 'apps'), {
            name,
            description,
            organization,
            price,
            tags,
            createdAt: new Date()
        });
        return { id: docRef.id, name, description, organization, price, tags };
    } catch (error) {
        console.error('Error adding app:', error.message);
        return null;
    }
};

export const fetchReviewsByAppId = async (appId) => {
    try {
        const reviewsQuery = query(collection(db, 'reviews'), where('appId', '==', appId), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(reviewsQuery);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error('Error fetching reviews:', error.message);
        return [];
    }
};

export const addReview = async (appId, reviewText, rating) => {
    try {
        await addDoc(collection(db, 'reviews'), {
            appId,
            text: reviewText,
            rating,
            createdAt: new Date()
        });
    } catch (error) {
        console.error('Error adding review:', error.message);
    }
};

export const isUsernameUnique = async (username) => {
    const usernamesRef = collection(db, 'usernames');
    const q = query(usernamesRef, where('username', '==', username));
    const querySnapshot = await getDocs(q);
    return querySnapshot.empty;
};

export const saveUsername = async (uid, username) => {
    const usernamesRef = collection(db, 'usernames');
    await addDoc(usernamesRef, { uid, username });
};
