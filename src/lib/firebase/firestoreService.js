import { db } from './firebaseConfig';
import { collection, getDocs, doc, getDoc, setDoc, deleteDoc, addDoc, query, where, orderBy, serverTimestamp, writeBatch, deleteField } from 'firebase/firestore';
import { getUserRole, user } from './authService';


/**
 * Fetches all apps from the Firestore database.
 * @returns {Promise<Array<Object>>} - A promise that resolves to an array of app objects.
 */
export const fetchApps = async () => {
    try {
        const appsQuery = collection(db, 'apps');
        const querySnapshot = await getDocs(appsQuery);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error('Error fetching apps:', error.message);
        return [];
    }
};

/**
 * Fetches an app by its ID from the Firestore database.
 * @param {string} id - The ID of the app to fetch.
 * @returns {Promise<Object|null>} - A promise that resolves to the app object if found, otherwise null.
 * @throws {Error} - If the app ID is invalid.
 */
export const fetchAppById = async (id) => {
    if (!id) {
        throw new Error('Invalid app ID');
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

/**
 * Requests a new app to be added to the Firestore database.
 * @param {string} name - The name of the app.
 * @param {string} description - The description of the app.
 * @param {string} organization - The organization that created the app.
 * @param {string} price - The price of the app.
 * @param {Array<string>} tags - An array of tags associated with the app.
 * @param {Object} platforms - An object where keys are platform names and values are platform links.
 * @returns {Promise<Object|null>} - A promise that resolves to the requested app object, otherwise null.
 * @throws {Error} - If the app data is invalid.
 */
export const requestApp = async (name, description, organization, price, tags, platforms) => {
    if (!name) {
        throw new Error('Invalid app data: name is required');
    }
    if (!description) {
        throw new Error('Invalid app data: description is required');
    }
    if (!organization) {
        throw new Error('Invalid app data: organization is required');
    }
    if (!price) {
        throw new Error('Invalid app data: price is required');
    }
    if (!Array.isArray(tags)) {
        throw new Error('Invalid app data: tags must be an array');
    }
    if (typeof platforms !== 'object' || platforms === null) {
        throw new Error('Invalid app data: platforms must be an object');
    }

    try {
        const docRef = await addDoc(collection(db, 'requested_apps'), {
            name,
            description,
            organization,
            price,
            tags,
            platforms,
            createdAt: serverTimestamp()
        });
        return { id: docRef.id, name, description, organization, price, tags, platforms };
    } catch (error) {
        console.error('Error requesting app:', error.message);
        return null;
    }
};
/**
 * Fetches reviews for a specific app by its ID from the Firestore database.
 * @param {string} appId - The ID of the app to fetch reviews for.
 * @returns {Promise<Array<Object>>} - A promise that resolves to an array of review objects.
 * @throws {Error} - If the app ID is invalid.
 */
export const fetchReviewsByAppId = async (appId) => {
    if (!appId) {
        throw new Error('Invalid app ID');
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

/**
 * Checks if a username is unique in the Firestore database.
 * @param {string} username - The username to check.
 * @returns {Promise<boolean>} - A promise that resolves to true if the username is unique, otherwise false.
 * @throws {Error} - If the username is invalid.
 */
export const isUsernameUnique = async (username) => {
    if (!username) {
        throw new Error('Invalid username');
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

/**
 * Saves a new username to the Firestore database.
 * @param {string} uid - The user ID.
 * @param {string} username - The username to save.
 * @returns {Promise<Object|null>} - A promise that resolves to the saved username object, otherwise null.
 * @throws {Error} - If the user data is invalid.
 */
export const saveUsername = async (uid, username) => {
    if (!uid || !username) {
        throw new Error('Invalid user data');
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

/**
 * Fetches all tags from the Firestore database.
 * @returns {Promise<Array<string>>} - A promise that resolves to an array of tag names.
 */
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
 * Adds a review to an app in the Firestore database.
 * @param {string} appId - The ID of the app.
 * @param {string} userId - The ID of the user.
 * @param {number} rating - The rating given by the user.
 * @param {string} reviewText - The text review given by the user.
 * @returns {Promise<boolean>} - A promise that resolves to true if the review was added successfully, otherwise false.
 * @throws {Error} - If the review data is invalid.
 */
export const addReviewToApp = async (appId, userId, rating, reviewText) => {
    if (!appId || !userId || !reviewText || isNaN(parseInt(rating, 10))) {
        throw new Error('Invalid review data');
    }
    try {
        const appDocRef = doc(db, 'apps', appId);
        const batch = writeBatch(db);

        // Update the ratings and reviews map
        batch.update(appDocRef, {
            [`ratings.${userId}`]: parseInt(rating, 10),
            [`reviews.${userId}`]: reviewText
        });

        await batch.commit();
        return true;
    } catch (error) {
        console.error('Error adding review to app:', error.message);
        return false;
    }
};

/**
 * Fetches all usernames from the Firestore database.
 * @returns {Promise<Object>} - A promise that resolves to an object mapping user IDs to usernames.
 */
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

/**
 * Updates a review for an app in the Firestore database.
 * @param {string} appId - The ID of the app.
 * @param {string} userId - The ID of the user.
 * @param {number} rating - The new rating given by the user.
 * @param {string} reviewText - The new text review given by the user.
 * @returns {Promise<boolean>} - A promise that resolves to true if the review was updated successfully, otherwise false.
 * @throws {Error} - If the review data is invalid.
 */
export const updateReviewForApp = async (appId, userId, rating, reviewText) => {
    if (!appId || !userId || !reviewText || isNaN(parseInt(rating, 10))) {
        throw new Error('Invalid review data');
    }

    // Input sanitization
    const sanitizedReviewText = reviewText.replace(/<[^>]*>?/gm, '');

    try {
        const appDocRef = doc(db, 'apps', appId);
        const batch = writeBatch(db);

        // Update the ratings and reviews map
        batch.update(appDocRef, {
            [`ratings.${userId}`]: parseInt(rating, 10),
            [`reviews.${userId}`]: sanitizedReviewText
        });

        await batch.commit();
        return true;
    } catch (error) {
        console.error('Error updating review for app:', error.message);
        return false;
    }
};

/**
 * Removes a review from an app in the Firestore database.
 * @param {string} appId - The ID of the app.
 * @param {string} userId - The ID of the user requesting the deletion.
 * @param {string} reviewUserId - The ID of the user who wrote the review.
 * @returns {Promise<boolean>} - A promise that resolves to true if the review was removed successfully, otherwise false.
 * @throws {Error} - If the review data is invalid or the user is not authorized to delete the review.
 */
export const removeReviewFromApp = async (appId, userId, reviewUserId) => {
    if (!appId || !userId || !reviewUserId) {
        throw new Error('Invalid review data');
    }

    try {
        // Fetch the user's role
        const userRole = await getUserRole(userId);

        // Check if the user is authorized to delete the review
        if (userRole < 1 && userId !== reviewUserId) {
            throw new Error('User is not authorized to delete this review');
        }

        // Ensure reviewUserId is valid
        if (!reviewUserId || typeof reviewUserId !== 'string' || reviewUserId.trim() === '') {
            throw new Error('Invalid reviewUserId');
        }

        const appDocRef = doc(db, 'apps', appId);
        const batch = writeBatch(db);

        // Remove the ratings and reviews map
        batch.update(appDocRef, {
            [`ratings.${reviewUserId}`]: deleteField(),
            [`reviews.${reviewUserId}`]: deleteField()
        });

        await batch.commit();
        return true;
    } catch (error) {
        console.error('Error removing review from app:', error.message);
        return false;
    }
};
/**
 * Fetches all app requests from the Firestore database.
 * @returns {Promise<Array<Object>>} - A promise that resolves to an array of app request objects.
 */
export const fetchAppRequests = async () => {
    try {
        const appRequestsQuery = collection(db, 'requested_apps');
        const querySnapshot = await getDocs(appRequestsQuery);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error('Error fetching app requests:', error.message);
        return [];
    }
};

/**
 * Handles app requests by either accepting or rejecting them.
 * @param {string} requestId - The ID of the app request.
 * @param {boolean} accept - Whether to accept the app request.
 * @returns {Promise<boolean>} - A promise that resolves to true if the operation was successful, otherwise false.
 */
export const handleAppRequest = async (requestId, accept) => {
    try {
        console.log('Handling app request:', { requestId, accept, user });

        const requestDocRef = doc(db, 'requested_apps', requestId);
        const requestDoc = await getDoc(requestDocRef);

        if (!requestDoc.exists()) {
            console.error('App request does not exist.');
            return false;
        }

        const appData = requestDoc.data();
        console.log('App request data:', appData);

        if (accept) {
            const appDocRef = doc(db, 'apps', requestId);
            await setDoc(appDocRef, appData);
        }

        await deleteDoc(requestDocRef);
        return true;
    } catch (error) {
        console.error('Error handling app request:', error.message);
        return false;
    }
};

/**
 * Fetches all Platforms from Platform db
 */
export const fetchPlatforms = async () => {
    try {
        const platformQuery = collection(db, 'platforms');
        const querySnapshot = await getDocs(platformQuery);
        return querySnapshot.docs.map(doc => doc.data().name);
    } catch (error) {
        console.error('Error fetching platforms:', error.message);
        return [];
    }
};