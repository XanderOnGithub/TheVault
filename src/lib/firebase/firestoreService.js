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

export const requestApp = async (name, description, organization, price, tags) => {
    if (!name || !description || !organization || !price || !Array.isArray(tags)) {
        console.error('Invalid app data');
        return null;
    }
    try {
        console.log('Requesting app:', { name, description, organization, price, tags });
        const docRef = await addDoc(collection(db, 'requested_apps'), {
            name,
            description,
            organization,
            price,
            tags,
            createdAt: serverTimestamp()
        });
        return { id: docRef.id, name, description, organization, price, tags };
    } catch (error) {
        console.error('Error requesting app:', error.message);
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

/**
 * Adds a review to an app.
 * @param {string} appId - The ID of the app.
 * @param {string} userId - The ID of the user.
 * @param {number} rating - The rating given by the user.
 * @param {string} reviewText - The text review given by the user.
 * @returns {Promise<boolean>} - Returns true if the review was added successfully, otherwise false.
 */
export const addReviewToApp = async (appId, userId, rating, reviewText) => {
    if (!appId) {
        console.error('Invalid review data: appId is missing', { appId, userId, rating, reviewText });
        return false;
    }
    if (!userId) {
        console.error('Invalid review data: userId is missing', { appId, userId, rating, reviewText });
        return false;
    }

    // Convert rating to an integer
    const intRating = parseInt(rating, 10);
    if (isNaN(intRating)) {
        console.error('Invalid review data: rating is not a number', { appId, userId, rating, reviewText });
        return false;
    }

    if (!reviewText) {
        console.error('Invalid review data: reviewText is missing', { appId, userId, rating, reviewText });
        return false;
    }

    try {
        console.log('Starting to add review', { appId, userId, rating: intRating, reviewText });

        const appDocRef = doc(db, 'apps', appId);
        console.log('App document reference:', appDocRef);

        const batch = writeBatch(db);
        console.log('Batch initialized');

        // Update the ratings map
        batch.update(appDocRef, {
            [`ratings.${userId}`]: intRating
        });
        console.log('Ratings update prepared');

        // Update the reviews map
        batch.update(appDocRef, {
            [`reviews.${userId}`]: reviewText
        });
        console.log('Reviews update prepared');

        await batch.commit();
        console.log('Batch committed successfully', { appId, userId, rating: intRating, reviewText });

        return true;
    } catch (error) {
        console.error('Error adding review to app:', error.message, { appId, userId, rating: intRating, reviewText });
        return false;
    }
};

export const fetchUsernames = async () => {
    try {
        const usernamesQuery = collection(db, 'usernames');
        const querySnapshot = await getDocs(usernamesQuery);
        const usernamesMap = {};
        querySnapshot.forEach(doc => {
            const data = doc.data();
            usernamesMap[data.uid] = data.username;
        });
        return usernamesMap;
    } catch (error) {
        console.error('Error fetching usernames:', error.message);
        return {};
    }
};