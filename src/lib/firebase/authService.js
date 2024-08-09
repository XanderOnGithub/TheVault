import { auth } from './firebaseConfig';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { writable, get } from 'svelte/store';
import { isUsernameUnique, saveUsername } from './firestoreService';
import { getFirestore, doc, setDoc, getDoc, query, where, collection, getDocs } from 'firebase/firestore';

const db = getFirestore();

export const user = writable(null);

/**
 * Fetches the role of a user from Firestore.
 * @param {string} uid - The UID of the user.
 * @returns {Promise<number>} - A promise that resolves to the user's role.
 * @throws {Error} - If the role cannot be fetched.
 */
const fetchUserRole = async (uid) => {
    try {
        const q = query(collection(db, 'user_roles'), where('uid', '==', uid));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
            const roleDoc = querySnapshot.docs[0];
            return roleDoc.data().role;
        } else {
            throw new Error('Role not found for the user');
        }
    } catch (error) {
        throw new Error('Error fetching user role. Please try again.');
    }
};

/**
 * Initializes the authentication service and sets up an auth state listener.
 */
export const initAuth = () => {
    onAuthStateChanged(auth, async (currentUser) => {
        if (currentUser) {
            try {
                const role = await fetchUserRole(currentUser.uid);
                user.set({
                    email: currentUser.email,
                    uid: currentUser.uid,
                    displayName: currentUser.displayName,
                    role
                });
            } catch (error) {
                // Handle error silently
            }
        } else {
            user.set(null);
        }
    });
};

/**
 * Logs in a user with email and password.
 * @param {string} email - The email of the user.
 * @param {string} password - The password of the user.
 * @returns {Promise<void>} - A promise that resolves when the user is logged in.
 * @throws {Error} - If the login fails.
 */
export const login = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const currentUser = userCredential.user;
        const role = await fetchUserRole(currentUser.uid);

        user.set({
            email: currentUser.email,
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            role
        });
    } catch (error) {
        throw new Error('Invalid login credentials');
    }
};

/**
 * Logs out the current user.
 * @returns {Promise<void>} - A promise that resolves when the user is logged out.
 * @throws {Error} - If the logout fails.
 */
export const logout = async () => {
    try {
        await signOut(auth);
        user.set(null);
    } catch (error) {
        throw new Error('Error signing out. Please try again.');
    }
};

/**
 * Registers a new user with email and password.
 * @param {string} email - The email of the new user.
 * @param {string} password - The password of the new user.
 * @returns {Promise<Object>} - A promise that resolves to the new user object.
 * @throws {Error} - If the registration fails.
 */
export const register = async (email, password) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const currentUser = userCredential.user;

        // Set default role to 0 (user)
        await setDoc(doc(db, 'user_roles', currentUser.uid), { uid: currentUser.uid, role: 0 });

        user.set({
            email: currentUser.email,
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            role: 0
        });

        return currentUser;
    } catch (error) {
        handleRegisterError(error);
    }
};

/**
 * Handles errors that occur during user registration.
 * @param {Error} error - The error object.
 * @throws {Error} - A user-friendly error message.
 */
const handleRegisterError = (error) => {
    if (error.code === 'auth/weak-password') {
        throw new Error('Password should be at least 6 characters long.');
    } else if (error.code === 'auth/email-already-in-use') {
        throw new Error('Email is already in use.');
    } else {
        throw new Error('Error registering. Please try again.');
    }
};

/**
 * Sets the username for the current authenticated user.
 * @param {string} username - The new username.
 * @returns {Promise<void>} - A promise that resolves when the username is set.
 * @throws {Error} - If setting the username fails.
 */
export const setUsername = async (username) => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
        throw new Error('No authenticated user');
    }

    try {
        const isUnique = await isUsernameUnique(username.toLowerCase());
        if (!isUnique) {
            throw new Error('Username is already taken');
        }

        await updateProfile(currentUser, { displayName: username });
        await saveUsername(currentUser.uid, username);

        user.set({ ...currentUser, displayName: username });
    } catch (error) {
        throw new Error('Error setting username. Please try again.');
    }
};

/**
 * Gets the username of the current authenticated user.
 * @returns {string} - The username of the current authenticated user.
 * @throws {Error} - If there is no authenticated user.
 */
export const getUsername = () => {
    const currentUser = auth.currentUser;
    if (currentUser) {
        return currentUser.displayName;
    } else {
        throw new Error('No authenticated user');
    }
};

/**
 * Checks if a user is currently logged in.
 * @returns {boolean} - True if a user is logged in, false otherwise.
 */
export const isLoggedIn = () => {
    const currentUser = get(user);
    return !!currentUser;
};

/**
 * Gets the role of the current authenticated user from Firestore.
 * @returns {Promise<number>} - A promise that resolves to the role of the current authenticated user.
 * @throws {Error} - If there is no authenticated user or if fetching the role fails.
 */
export const getUserRole = async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
        throw new Error('No authenticated user');
    }

    try {
        const role = await fetchUserRole(currentUser.uid);
        return role;
    } catch (error) {
        throw new Error('Error fetching user role. Please try again.');
    }
};