import { Event, Member, Sermon } from './types';

export const CHURCH_NAME = "Seventh Day Theocratic World Congregation";

export const MOCK_EVENTS: Event[] = [
  {
    id: '1',
    title: 'Sabbath Morning Service',
    date: '2026-05-09',
    time: '09:00 AM',
    description: 'Join us for our main worship service every Saturday morning.',
    category: 'Worship',
    priority: 'High',
    thumbnail: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: '2',
    title: 'Youth Ministry Meetup',
    date: '2026-05-10',
    time: '04:00 PM',
    description: 'A special gathering for our young members to connect and grow.',
    category: 'Youth',
    priority: 'Medium',
    thumbnail: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: '3',
    title: 'Community Bible Study',
    date: '2026-05-13',
    time: '06:30 PM',
    description: 'Deep dive into the scriptures with our community.',
    category: 'Community',
    priority: 'Low',
    thumbnail: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=800',
  },
];

export const MOCK_MEMBERS: Member[] = [
  { id: '1', name: 'Pastor Samuel Akotey', role: 'Head Pastor', email: 'samuel@sdtwc.org', phone: '+233 24 123 4567' },
  { id: '2', name: 'Elder Sarah Mensah', role: 'Congregation Elder', email: 'sarah@sdtwc.org', phone: '+233 20 987 6543' },
  { id: '3', name: 'John Doe', role: 'Deacon', email: 'john@sdtwc.org', phone: '+233 55 444 3322' },
  { id: '4', name: 'Mary Appiah', role: 'Youth Leader', email: 'mary@sdtwc.org', phone: '+233 27 111 2233' },
  { id: '5', name: 'Daniel Tetteh', role: 'Choir Director', email: 'daniel@sdtwc.org' },
  { id: '6', name: 'Grace Ofori', role: 'Secretary', email: 'grace@sdtwc.org' },
];

export const SERMON_TAGS = ['faith', 'prayer', 'eschatology', 'theocracy', 'grace', 'wisdom', 'salvation', 'holiness'];

export const MOCK_SERMONS: Sermon[] = [
  {
    id: '1',
    title: 'Walking in the Light',
    speaker: 'Pastor Samuel Akotey',
    date: '2026-04-26',
    category: 'Spirituality',
    videoUrl: 'https://youtube.com/watch?v=example1',
    thumbnail: 'https://images.unsplash.com/photo-1544427920-c49ccfb85579?auto=format&fit=crop&q=80&w=800',
    tags: ['faith', 'holiness', 'grace'],
  },
  {
    id: '2',
    title: 'The Theocratic Way of Life',
    speaker: 'Elder Sarah Mensah',
    date: '2026-04-19',
    category: 'Doctrine',
    videoUrl: 'https://youtube.com/watch?v=example2',
    thumbnail: 'https://images.unsplash.com/photo-1504052434569-7c96024f7993?auto=format&fit=crop&q=80&w=800',
    tags: ['theocracy', 'faith', 'wisdom'],
  },
  {
    id: '3',
    title: 'Community and Faith',
    speaker: 'Pastor Samuel Akotey',
    date: '2026-04-12',
    category: 'Fellowship',
    videoUrl: 'https://youtube.com/watch?v=example3',
    thumbnail: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&q=80&w=800',
    tags: ['faith', 'prayer', 'grace'],
  },
];

export const LIVESTREAM_URL = "https://www.youtube.com/embed/live_stream?channel=UC_EXAMPLE"; // Placeholder
