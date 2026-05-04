import { collection, getDocs, doc, getDoc, query, orderBy, addDoc, updateDoc, deleteDoc, serverTimestamp, where, limit } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { Event, Sermon, Member, Registration, AppUser, UserRole, Donation, AuditLog, PrayerRequest, DonationCategory } from '../types';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// --- Donations ---
export const getDonations = async (userId?: string): Promise<Donation[]> => {
  const path = 'donations';
  try {
    let q = query(collection(db, path), orderBy('timestamp', 'desc'));
    if (userId) {
      q = query(collection(db, path), where('userId', '==', userId), orderBy('timestamp', 'desc'));
    }
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Donation));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return [];
  }
};

export const createDonation = async (donation: Omit<Donation, 'id' | 'timestamp'>): Promise<string> => {
  const path = 'donations';
  try {
    const docRef = await addDoc(collection(db, path), {
      ...donation,
      timestamp: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
    return '';
  }
};

export const updateDonation = async (id: string, donation: Partial<Donation>): Promise<void> => {
  const path = `donations/${id}`;
  try {
    const docRef = doc(db, 'donations', id);
    await updateDoc(docRef, donation);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
};

export const deleteDonation = async (id: string): Promise<void> => {
  const path = `donations/${id}`;
  try {
    const docRef = doc(db, 'donations', id);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
};

// --- Prayer Requests ---
export const createPrayerRequest = async (prayer: Omit<PrayerRequest, 'id' | 'timestamp'>): Promise<string> => {
  const path = 'prayer_requests';
  try {
    const docRef = await addDoc(collection(db, path), {
      ...prayer,
      timestamp: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
    return '';
  }
};

export const getPrayerRequests = async (userId?: string): Promise<PrayerRequest[]> => {
  const path = 'prayer_requests';
  try {
    let q = query(collection(db, path), orderBy('timestamp', 'desc'), limit(50));
    if (userId) {
      q = query(collection(db, path), where('userId', '==', userId), orderBy('timestamp', 'desc'));
    }
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PrayerRequest));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return [];
  }
};

// --- Donation Categories ---
export const getDonationCategories = async (): Promise<DonationCategory[]> => {
  const path = 'donation_categories';
  try {
    const q = query(collection(db, path), orderBy('order', 'asc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as DonationCategory));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return [];
  }
};

export const createDonationCategory = async (category: Omit<DonationCategory, 'id'>): Promise<string> => {
  const path = 'donation_categories';
  try {
    const docRef = await addDoc(collection(db, path), category);
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
    return '';
  }
};

export const updateDonationCategory = async (id: string, category: Partial<DonationCategory>): Promise<void> => {
  const path = `donation_categories/${id}`;
  try {
    const docRef = doc(db, 'donation_categories', id);
    await updateDoc(docRef, category);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
};

export const deleteDonationCategory = async (id: string): Promise<void> => {
  const path = `donation_categories/${id}`;
  try {
    const docRef = doc(db, 'donation_categories', id);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
};

// --- Events ---
export const getEvents = async (): Promise<Event[]> => {
  const path = 'events';
  try {
    const q = query(collection(db, path), orderBy('date', 'asc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Event));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return [];
  }
};

export const getEvent = async (id: string): Promise<Event | null> => {
  const path = `events/${id}`;
  try {
    const docRef = doc(db, 'events', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Event;
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
    return null;
  }
};

export const createEvent = async (event: Omit<Event, 'id'>): Promise<string> => {
  const path = 'events';
  try {
    const docRef = await addDoc(collection(db, path), event);
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
    return '';
  }
};

export const updateEvent = async (id: string, event: Partial<Event>): Promise<void> => {
  const path = `events/${id}`;
  try {
    const docRef = doc(db, 'events', id);
    await updateDoc(docRef, event);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
};

export const deleteEvent = async (id: string): Promise<void> => {
  const path = `events/${id}`;
  try {
    const docRef = doc(db, 'events', id);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
};

// --- Registrations ---
export const registerForEvent = async (registration: Omit<Registration, 'id' | 'timestamp'>): Promise<void> => {
  const path = 'registrations';
  try {
    await addDoc(collection(db, path), {
      ...registration,
      timestamp: serverTimestamp()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
};

export const getRegistrations = async (userId?: string): Promise<Registration[]> => {
  const path = 'registrations';
  try {
    let q = query(collection(db, path), orderBy('timestamp', 'desc'));
    if (userId) {
      q = query(collection(db, path), where('userId', '==', userId), orderBy('timestamp', 'desc'));
    }
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Registration));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return [];
  }
};

// --- Sermons ---
export const getSermons = async (limitCount?: number): Promise<Sermon[]> => {
  const path = 'sermons';
  try {
    let q = query(collection(db, path), orderBy('date', 'desc'));
    if (limitCount) {
      q = query(q, limit(limitCount));
    }
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Sermon));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return [];
  }
};

export const getSermon = async (id: string): Promise<Sermon | null> => {
  const path = `sermons/${id}`;
  try {
    const docRef = doc(db, 'sermons', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Sermon;
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
    return null;
  }
};

export const createSermon = async (sermon: Omit<Sermon, 'id'>): Promise<string> => {
  const path = 'sermons';
  try {
    const docRef = await addDoc(collection(db, path), sermon);
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
    return '';
  }
};

export const updateSermon = async (id: string, sermon: Partial<Sermon>): Promise<void> => {
  const path = `sermons/${id}`;
  try {
    const docRef = doc(db, 'sermons', id);
    await updateDoc(docRef, sermon);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
};

export const deleteSermon = async (id: string): Promise<void> => {
  const path = `sermons/${id}`;
  try {
    const docRef = doc(db, 'sermons', id);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
};

// --- Users ---
export const getUsers = async (): Promise<AppUser[]> => {
  const path = 'users';
  try {
    const snapshot = await getDocs(collection(db, path));
    return snapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() } as AppUser));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return [];
  }
};

export const updateUserRole = async (uid: string, role: UserRole): Promise<void> => {
  const path = `users/${uid}`;
  try {
    const docRef = doc(db, 'users', uid);
    await updateDoc(docRef, { role });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
};

// --- Members ---
export const getMembers = async (): Promise<Member[]> => {
  const path = 'members';
  try {
    const snapshot = await getDocs(collection(db, path));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Member));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return [];
  }
};

export const createMember = async (member: Omit<Member, 'id'>): Promise<string> => {
  const path = 'members';
  try {
    const docRef = await addDoc(collection(db, path), member);
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
    return '';
  }
};

export const updateMember = async (id: string, member: Partial<Member>): Promise<void> => {
  const path = `members/${id}`;
  try {
    const docRef = doc(db, 'members', id);
    await updateDoc(docRef, member);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
};

export const deleteMember = async (id: string): Promise<void> => {
  const path = `members/${id}`;
  try {
    const docRef = doc(db, 'members', id);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
};

// --- Audit Logs ---
export const getAuditLogs = async (): Promise<AuditLog[]> => {
  const path = 'audit_logs';
  try {
    const q = query(collection(db, path), orderBy('timestamp', 'desc'), limit(100));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as AuditLog));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return [];
  }
};

export const createAuditLog = async (log: Omit<AuditLog, 'id' | 'timestamp'>): Promise<void> => {
  const path = 'audit_logs';
  try {
    await addDoc(collection(db, path), {
      ...log,
      timestamp: serverTimestamp()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
};

// --- Seeding ---
export const seedChurchData = async (): Promise<void> => {
  const { MOCK_EVENTS, MOCK_SERMONS, MOCK_MEMBERS } = await import('../constants');
  
  try {
    const existingEvents = await getEvents();
    if (existingEvents.length === 0) {
      for (const event of MOCK_EVENTS) {
        const { id, ...data } = event;
        // Ensure time field is present for rules
        await createEvent({ ...data, time: '9:00 AM' });
      }
    }

    const existingSermons = await getSermons();
    if (existingSermons.length === 0) {
      for (const sermon of MOCK_SERMONS) {
        const { id, ...data } = sermon;
        await createSermon(data);
      }
    }

    const existingMembers = await getMembers();
    if (existingMembers.length === 0) {
      for (const member of MOCK_MEMBERS) {
        const { id, ...data } = member;
        await createMember(data);
      }
    }

    const existingCategories = await getDonationCategories();
    if (existingCategories.length === 0) {
      const defaultCategories = [
        { name: 'Tithe', description: 'Mandatory sacred proportional giving', isActive: true, order: 1 },
        { name: 'Welfare', description: 'Supporting members in need', isActive: true, order: 2 },
        { name: 'Building Fund', description: 'Sanctuary construction and maintenance', isActive: true, order: 3 },
        { name: 'Missions', description: 'Evangelism and outreach efforts', isActive: true, order: 4 },
        { name: 'Thanksgiving', description: 'Expressing gratitude for blessings', isActive: true, order: 5 }
      ];
      for (const cat of defaultCategories) {
        await createDonationCategory(cat);
      }
    }
    
  } catch (error) {
    console.error("Seeding failed", error);
    throw error;
  }
};
