// src/lib/stores/rolesStore.js
import { writable } from 'svelte/store';
import { auth, db } from '$lib/firebase/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

export const roles = writable({});

const fetchUserRoles = async (userId) => {
    const docRef = doc(db, 'roles', userId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        roles.set(docSnap.data());
    } else {
        roles.set({});
    }
};

auth.onAuthStateChanged((currentUser) => {
    if (currentUser) {
        fetchUserRoles(currentUser.uid);
    } else {
        roles.set({});
    }
});