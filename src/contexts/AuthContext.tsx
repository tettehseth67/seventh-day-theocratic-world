import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '../lib/firebase';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  User as FirebaseUser,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { AppUser, UserRole } from '../types';

export interface UserPreferences {
  liturgyAlerts: boolean;
  donationReceipts: boolean;
  communityNews: boolean;
}

interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  login: () => Promise<UserRole | undefined>;
  loginWithEmail: (email: string, pass: string) => Promise<UserRole | undefined>;
  signupWithEmail: (email: string, pass: string, name: string) => Promise<UserRole | undefined>;
  logout: () => Promise<void>;
  updateProfileName: (name: string) => Promise<void>;
  updatePreferences: (prefs: UserPreferences) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        // Check for user document in Firestore
        const userRef = doc(db, 'users', firebaseUser.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const userData = userSnap.data();
          const isAdminEmail = firebaseUser.email === 'tettehseth67@gmail.com';
          const currentRole = userData.role as UserRole;
          
          // Force upgrade if it's the admin email but role is different
          if (isAdminEmail && currentRole !== 'admin') {
            await setDoc(userRef, { role: 'admin' }, { merge: true });
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: userData.displayName || firebaseUser.displayName,
              role: 'admin',
              preferences: userData.preferences
            });
          } else {
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: userData.displayName || firebaseUser.displayName,
              role: currentRole,
              preferences: userData.preferences
            });
          }
        } else {
          // New user, assign role based on email or default to member
          const isAdminEmail = firebaseUser.email === 'tettehseth67@gmail.com';
          const newUser: AppUser = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            role: isAdminEmail ? 'admin' : 'member',
          };
          await setDoc(userRef, {
            uid: newUser.uid,
            email: newUser.email,
            displayName: newUser.displayName,
            role: newUser.role,
            createdAt: serverTimestamp(),
          });
          setUser(newUser);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const firebaseUser = result.user;

    const userRef = doc(db, 'users', firebaseUser.uid);
    let userSnap = await getDoc(userRef);

    const isAdminEmail = firebaseUser.email === 'tettehseth67@gmail.com';
    console.log('Login attempt for:', firebaseUser.email, 'isAdmin:', isAdminEmail);

    if (!userSnap.exists()) {
      const initialRole: UserRole = isAdminEmail ? 'admin' : 'member';
      await setDoc(userRef, {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
        role: initialRole,
        createdAt: serverTimestamp(),
      });
      console.log('Created new user with role:', initialRole);
      return initialRole;
    } else {
      const userData = userSnap.data();
      const currentRole = userData.role as UserRole;
      console.log('Existing user found with role:', currentRole);
      
      if (isAdminEmail && currentRole !== 'admin') {
        console.log('Upgrading existing user to admin');
        await setDoc(userRef, { role: 'admin' }, { merge: true });
        return 'admin' as UserRole;
      }
      return currentRole;
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  const loginWithEmail = async (email: string, pass: string) => {
    const result = await signInWithEmailAndPassword(auth, email, pass);
    const firebaseUser = result.user;
    
    const userRef = doc(db, 'users', firebaseUser.uid);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      return userSnap.data().role as UserRole;
    }
    return 'member' as UserRole;
  };

  const signupWithEmail = async (email: string, pass: string, name: string) => {
    const result = await createUserWithEmailAndPassword(auth, email, pass);
    const firebaseUser = result.user;
    
    await updateProfile(firebaseUser, { displayName: name });
    
    const isAdminEmail = email === 'tettehseth67@gmail.com';
    const role: UserRole = isAdminEmail ? 'admin' : 'member';
    
    const userRef = doc(db, 'users', firebaseUser.uid);
    await setDoc(userRef, {
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      displayName: name,
      role: role,
      createdAt: serverTimestamp(),
    });
    
    setUser({
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      displayName: name,
      role: role,
    });
    
    return role;
  };

  const updateProfileName = async (name: string) => {
    if (!user) return;
    const userRef = doc(db, 'users', user.uid);
    await setDoc(userRef, { displayName: name }, { merge: true });
    setUser({ ...user, displayName: name });
  };

  const updatePreferences = async (prefs: UserPreferences) => {
    if (!user) return;
    const userRef = doc(db, 'users', user.uid);
    await setDoc(userRef, { preferences: prefs }, { merge: true });
    setUser({ ...user, preferences: prefs });
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, loginWithEmail, signupWithEmail, logout, updateProfileName, updatePreferences }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
