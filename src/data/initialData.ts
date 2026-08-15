import { Sermon, ActivityEvent, PrayerRequest, EventRegistration, CommunityPost, SystemSettings, ChurchLeader } from '../types';

export const INITIAL_SERMONS: Sermon[] = [];
export const INITIAL_EVENTS: ActivityEvent[] = [];
export const INITIAL_PRAYER_REQUESTS: PrayerRequest[] = [];
export const INITIAL_REGISTRATIONS: EventRegistration[] = [];
export const INITIAL_POSTS: CommunityPost[] = [];
export const INITIAL_LEADERS: ChurchLeader[] = [];

export const INITIAL_SYSTEM_SETTINGS: SystemSettings = {
  churchName: 'Exégesis',
  churchAddress: 'Dirección de la Iglesia',
  churchPhone: '+1 234 567 8900',
  churchEmail: 'contacto@exegesis.org',
  youtubeUrl: '',
  facebookUrl: '',
  instagramUrl: '',
  whatsappUrl: '',
  logoUrl: '',
  carouselImages: [
    'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1493612276216-ee3925520721?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=800&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1493612276216-ee3925520721?w=800&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&auto=format&fit=crop&q=60'
  ]
};
