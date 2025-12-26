
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { getAuthClient, getFirestoreClient } from '@/lib/firebaseClient';
import { onAuthStateChanged, User as FirebaseUser, signOut as firebaseSignOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { FRAUser } from '@/lib/types/fra-workflow';

interface AuthContextType {
    user: FRAUser | null;
    firebaseUser: FirebaseUser | null;
    loading: boolean;
    logout: () => Promise<void>;
    refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    firebaseUser: null,
    loading: true,
    logout: async () => { },
    refreshProfile: async () => { },
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
    const [user, setUser] = useState<FRAUser | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchUserProfile = async (uid: string) => {
        try {
            const db = getFirestoreClient();
            const userRef = doc(db, 'users', uid);
            const userSnap = await getDoc(userRef);

            if (userSnap.exists()) {
                const data = userSnap.data();
                // Map Firestore data to FRAUser type
                setUser({
                    uid: uid,
                    email: data.email,
                    displayName: data.name || data.displayName,
                    role: data.role,
                    phone: data.phone,
                    state: data.state,
                    district: data.district,
                    block: data.block,
                    village: data.village,
                    subdivision: data.subdivision,
                } as FRAUser);
            } else {
                console.warn('User profile not found in Firestore');
                setUser(null);
            }
        } catch (error) {
            console.error('Error fetching user profile:', error);
            setUser(null);
        }
    };

    useEffect(() => {
        const auth = getAuthClient();
        if (!auth) {
            setLoading(false);
            return;
        }

        const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
            setFirebaseUser(authUser);
            if (authUser) {
                await fetchUserProfile(authUser.uid);
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const logout = async () => {
        const auth = getAuthClient();
        if (auth) {
            await firebaseSignOut(auth);
        }
    };

    const refreshProfile = async () => {
        if (firebaseUser) {
            await fetchUserProfile(firebaseUser.uid);
        }
    };

    return (
        <AuthContext.Provider value={{ user, firebaseUser, loading, logout, refreshProfile }}>
            {children}
        </AuthContext.Provider>
    );
}
