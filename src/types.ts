export interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  description: string;
  category: 'Worship' | 'Youth' | 'Community' | 'Special' | 'Mission';
  priority?: 'High' | 'Medium' | 'Low';
  thumbnail?: string;
}

export interface Member {
  id: string;
  name: string;
  role: string;
  email: string;
  phone?: string;
  avatar?: string;
}

export interface DonationOption {
  amount: number;
  label: string;
}

export type UserRole = 'admin' | 'member' | 'guest';

export interface UserPreferences {
  liturgyAlerts: boolean;
  donationReceipts: boolean;
  communityNews: boolean;
}

export interface AppUser {
  uid: string;
  email: string | null;
  role: UserRole;
  displayName: string | null;
  preferences?: UserPreferences;
}

export interface Registration {
  id?: string;
  eventId: string;
  userId?: string;
  userName: string;
  userEmail: string;
  timestamp: any;
}

export interface Donation {
  id?: string;
  userId: string;
  userName: string;
  userEmail: string;
  amount: number;
  category: string;
  timestamp: any;
  status: 'completed' | 'pending';
}

export interface DonationCategory {
  id?: string;
  name: string;
  description?: string;
  isActive: boolean;
  order?: number;
}

export interface PrayerRequest {
  id?: string;
  name: string;
  request: string;
  timestamp: any;
  userId?: string;
}

export interface Sermon {
  id: string;
  title: string;
  speaker: string;
  date: string;
  thumbnail?: string;
  videoUrl?: string;
  audioUrl?: string;
  description?: string;
  category: string;
  series?: string;
  tags?: string[];
}

export interface AuditLog {
  id?: string;
  adminId: string;
  adminEmail: string;
  action: 'create' | 'update' | 'delete' | 'role_change';
  targetType: 'event' | 'sermon' | 'member' | 'user' | 'donation';
  targetId: string;
  targetName: string;
  timestamp: any;
  details?: string;
}
