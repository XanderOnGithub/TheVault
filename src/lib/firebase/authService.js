import { auth } from './firebaseConfig';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { writable, get } from 'svelte/store';
import { isUsernameUnique, saveUsername } from './firestoreService';

/**
 * Svelte writable store for managing the authenticated user state.
 * 
 * @type {Writable<Object|null>}
 */
export const user = writable(null);

/**
 * Initializes the authentication service.
 */
export const initAuth = () => {
    console.log('Initializing authentication service...');
    onAuthStateChanged(auth, (currentUser) => {
        if (currentUser) {
            console.log('User is logged in:', {
                email: currentUser.email,
                uid: currentUser.uid,
                displayName: currentUser.displayName
            });

            // Set user data in the store
            user.set({
                email: currentUser.email,
                uid: currentUser.uid,
                displayName: currentUser.displayName
            });

        } else {
            console.log('No user is logged in.');
            user.set(null);
        }
    });
};


// Update user store on authentication state change
onAuthStateChanged(auth, (currentUser) => {
    user.set(currentUser ? { email: currentUser.email, uid: currentUser.uid, displayName: currentUser.displayName } : null);
});

/**
 * Logs in a user with email and password.
 * 
 * @param {string} email - The user's email address.
 * @param {string} password - The user's password.
 * @returns {Promise<void>}
 * @throws {Error} If login fails.
 */
export const login = async (email, password) => {
    try {
        await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
        console.error('Error signing in:', error.message);
        throw new Error('Invalid login credentials');
    }
};

/**
 * Logs out the current user.
 * 
 * @returns {Promise<void>}
 * @throws {Error} If logout fails.
 */
export const logout = async () => {
    try {
        await signOut(auth);
    } catch (error) {
        console.error('Error signing out:', error.message);
        throw new Error('Error signing out. Please try again.');
    }
};

/**
 * Registers a new user with email and password.
 * 
 * @param {string} email - The user's email address.
 * @param {string} password - The user's password.
 * @returns {Promise<Object>} The registered user.
 * @throws {Error} If registration fails.
 */
export const register = async (email, password) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    } catch (error) {
        console.error('Error registering:', error.message);
        handleRegisterError(error);
    }
};

/**
 * Handles errors that occur during registration.
 * 
 * @param {Object} error - The error object.
 * @throws {Error} Specific error message based on error code.
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
 * 
 * @param {string} username - The username to set.
 * @returns {Promise<void>}
 * @throws {Error} If setting the username fails.
 */
export const setUsername = async (username) => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
        throw new Error('No authenticated user');
    }

    try {
        // Check uniqueness in lowercase
        const isUnique = await isUsernameUnique(username.toLowerCase());
        if (!isUnique) {
            throw new Error('Username is already taken');
        }

        // Use the original case for setting the username
        await updateProfile(currentUser, { displayName: username });
        await saveUsername(currentUser.uid, username);

        // Update the user store
        user.set({ ...currentUser, displayName: username });
    } catch (error) {
        console.error('Error setting username:', error.message);
        throw new Error('Error setting username. Please try again.');
    }
};

/**
 * Gets the username of the current authenticated user.
 * 
 * @returns {string} The username of the current authenticated user.
 * @throws {Error} If there is no authenticated user.
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
 * Checks if a user is logged in.
 * 
 * @returns {boolean} True if a user is logged in, otherwise false.
 */
export const isLoggedIn = () => {
    const currentUser = get(user);
    return !!currentUser;
};

