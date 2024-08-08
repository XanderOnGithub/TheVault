import { auth } from './firebaseConfig';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { writable, get } from 'svelte/store';
import { isUsernameUnique, saveUsername } from './firestoreService';
import { getFirestore, doc, setDoc, getDoc, query, where, collection, getDocs } from 'firebase/firestore';

const db = getFirestore();

export const user = writable(null);

const fetchUserRole = async (uid) => {
    try {
        console.log(`Fetching role for user with UID: ${uid}`);
        const q = query(collection(db, 'user_roles'), where('uid', '==', uid));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
            const roleDoc = querySnapshot.docs[0];
            console.log(`Role document data: ${JSON.stringify(roleDoc.data())}`);
            return roleDoc.data().role;
        } else {
            console.error('Role document does not exist');
            throw new Error('Role not found for the user');
        }
    } catch (error) {
        console.error('Error fetching user role:', error.message);
        throw new Error('Error fetching user role. Please try again.');
    }
};

export const initAuth = () => {
    console.log('Initializing authentication service...');
    onAuthStateChanged(auth, async (currentUser) => {
        if (currentUser) {
            try {
                const role = await fetchUserRole(currentUser.uid);
                console.log('User is logged in:', {
                    email: currentUser.email,
                    uid: currentUser.uid,
                    displayName: currentUser.displayName,
                    role
                });

                user.set({
                    email: currentUser.email,
                    uid: currentUser.uid,
                    displayName: currentUser.displayName,
                    role
                });
            } catch (error) {
                console.error('Error setting user role:', error.message);
            }
        } else {
            console.log('No user is logged in.');
            user.set(null);
        }
    });
};

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
        console.error('Error signing in:', error.message);
        throw new Error('Invalid login credentials');
    }
};

export const logout = async () => {
    try {
        await signOut(auth);
        user.set(null);
    } catch (error) {
        console.error('Error signing out:', error.message);
        throw new Error('Error signing out. Please try again.');
    }
};

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
        console.error('Error registering:', error.message);
        handleRegisterError(error);
    }
};

const handleRegisterError = (error) => {
    if (error.code === 'auth/weak-password') {
        throw new Error('Password should be at least 6 characters long.');
    } else if (error.code === 'auth/email-already-in-use') {
        throw new Error('Email is already in use.');
    } else {
        throw new Error('Error registering. Please try again.');
    }
};

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
        console.error('Error setting username:', error.message);
        throw new Error('Error setting username. Please try again.');
    }
};

export const getUsername = () => {
    const currentUser = auth.currentUser;
    if (currentUser) {
        return currentUser.displayName;
    } else {
        throw new Error('No authenticated user');
    }
};

export const isLoggedIn = () => {
    const currentUser = get(user);
    return !!currentUser;
};

/**
 * Gets the role of the current authenticated user from Firestore.
 * 
 * @returns {Promise<number>} The role of the current authenticated user.
 * @throws {Error} If there is no authenticated user or if fetching the role fails.
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
        console.error('Error fetching user role:', error.message);
        throw new Error('Error fetching user role. Please try again.');
    }
};