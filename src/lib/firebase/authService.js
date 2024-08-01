// src/lib/firebase/authService.js
import { auth } from './firebaseConfig';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { writable } from 'svelte/store';
import { isUsernameUnique, saveUsername } from './firestoreService';

export const user = writable(null);

onAuthStateChanged(auth, (currentUser) => {
    user.set(currentUser ? { email: currentUser.email, uid: currentUser.uid, displayName: currentUser.displayName } : null);
});

export const login = async (email, password) => {
    try {
        await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
        console.error('Error signing in:', error.message);
        throw new Error('Invalid login credentials');
    }
};

export const logout = async () => {
    try {
        await signOut(auth);
    } catch (error) {
        console.error('Error signing out:', error.message);
        throw new Error('Error signing out. Please try again.');
    }
};

export const register = async (email, password) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    } catch (error) {
        console.error('Error registering:', error.message);
        if (error.code === 'auth/weak-password') {
            throw new Error('Password should be at least 6 characters long.');
        } else if (error.code === 'auth/email-already-in-use') {
            throw new Error('Email is already in use.');
        } else {
            throw new Error('Error registering. Please try again.');
        }
    }
};

export const setUsername = async (username) => {
    const currentUser = auth.currentUser; // Ensure we get the current user from auth
    try {
        if (!currentUser) {
            throw new Error('No authenticated user');
        }
        const isUnique = await isUsernameUnique(username);
        if (!isUnique) {
            throw new Error('Username is already taken');
        }

        await updateProfile(currentUser, { displayName: username });
        await saveUsername(currentUser.uid, username);
        user.set({ ...currentUser, displayName: username });
    } catch (error) {
        console.error('Error setting username:', error.message);
        throw error;
    }
};
