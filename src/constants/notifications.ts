import { Bell, UserPlus, Heart, Calendar, AlertCircle, MessageSquare } from 'lucide-react';

export type NotificationType = 'registration' | 'donation' | 'member' | 'system' | 'message';

export interface ChurchNotification {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  timestamp: Date;
  isRead: boolean;
  link?: string;
}

export const MOCK_NOTIFICATIONS: ChurchNotification[] = [
  {
    id: '1',
    type: 'donation',
    title: 'Sacrificial Gift Received',
    description: 'A new donation of GH₵ 500.00 was logged for the Building Fund.',
    timestamp: new Date(Date.now() - 1000 * 60 * 45), // 45 mins ago
    isRead: false,
  },
  {
    id: '2',
    type: 'registration',
    title: 'New Event RSVP',
    description: 'Kofi Mensah registered for the "Youth Vigil" event.',
    timestamp: new Date(Date.now() - 1000 * 60 * 120), // 2 hours ago
    isRead: false,
  },
  {
    id: '3',
    type: 'member',
    title: 'Membership Enlistment',
    description: 'Ama Serwaa has submitted a membership request.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
    isRead: true,
  },
  {
    id: '4',
    type: 'system',
    title: 'Divine Archive Update',
    description: 'The digital scrolls for Q3 have been successfully backed up to the cloud.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    isRead: true,
  },
  {
    id: '5',
    type: 'message',
    title: 'New Prayer Request',
    description: 'Brother Emmanuel is requesting prayers for his family in Kumasi.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    isRead: false,
  },
  {
    id: '6',
    type: 'system',
    title: 'New Announcement Posted',
    description: 'The upcoming "Ghana Mission Drive" has been announced to the congregation.',
    timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 mins ago
    isRead: false,
  }
];

export const getNotificationIcon = (type: NotificationType) => {
  switch (type) {
    case 'registration': return { icon: Calendar, color: 'text-blue-500', bg: 'bg-blue-50' };
    case 'donation': return { icon: Heart, color: 'text-red-500', bg: 'bg-red-50' };
    case 'member': return { icon: UserPlus, color: 'text-brand-gold', bg: 'bg-brand-gold/10' };
    case 'message': return { icon: MessageSquare, color: 'text-emerald-500', bg: 'bg-emerald-50' };
    default: return { icon: AlertCircle, color: 'text-brand-olive', bg: 'bg-brand-olive/10' };
  }
};
