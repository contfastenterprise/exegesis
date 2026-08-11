export type NavTab = 'home' | 'sermons' | 'activities' | 'leaders' | 'location' | 'help' | 'interactions' | 'devotionals' | 'admin';

export interface Devotional {
  id: string;
  title: string;
  type: 'text' | 'image' | 'video' | 'youtube';
  content?: string;
  mediaUrl?: string;
  youtubeUrl?: string;
  author?: string;
  date: string;
  createdAt: string;
}

export interface ChurchLeader {
  id: string;
  name: string;
  role: string;
  phone?: string;
  email?: string;
  imageUrl?: string;
  bio?: string;
}

export interface Sermon {
  id: string;
  title: string;
  series: string;
  date: string;
  year: string;
  pastor: string;
  pastorInitials: string;
  description: string;
  imageUrl: string;
  audioUrl?: string;
  passage?: string;
  isFeatured?: boolean;
  youtubeUrl?: string;
  youtubeStartMinute?: number;
}

export interface ActivityEvent {
  id: string;
  title: string;
  category: string;
  date: string;
  time: string;
  location: string;
  description: string;
  imageUrl?: string;
  isFeatured?: boolean;
  registrationOpen?: boolean;
  leaderName?: string;
  contactPhone?: string;
}

export interface PrayerRequest {
  id: string;
  createdAt: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  status: 'Pending' | 'Prayed';
}

export interface EventRegistration {
  id: string;
  eventName: string;
  userName: string;
  userEmail: string;
  tickets: number;
  registeredAt: string;
  type: 'volunteer' | 'attendance';
}

export interface CommunityPost {
  id: string;
  authorName: string;
  authorAvatar?: string;
  authorInitials?: string;
  timeAgo: string;
  content: string;
  imageUrl?: string;
  likes: number;
  userLiked?: boolean;
  repliesCount: number;
}

export interface SystemSettings {
  maintenanceMode: boolean;
  primaryColor: string;
  churchName: string;
  churchAddress: string;
  churchPhone: string;
  churchEmail: string;
  logoUrl?: string;
  // Hero & Banner customizable text & Bible background
  heroTitle?: string;
  heroSubtitle?: string;
  heroVerse?: string;
  heroVerses?: string[];
  heroDescription?: string;
  heroBackgroundImageUrl?: string;
  heroBgOpacity?: number;
  carouselImages?: string[];
  // YouTube & Live Stream settings
  youtubeUrl?: string;
  youtubeChannelCoverUrl?: string;
  isLiveStreaming?: boolean;
  liveStreamVideoId?: string;
  liveStreamTitle?: string;
  // Social Media
  facebookUrl?: string;
  instagramUrl?: string;
  whatsappUrl?: string;
  twitterUrl?: string;
  tiktokUrl?: string;
  // Map Location & Schedules
  googleMapsEmbedUrl?: string;
  googleMapsDirectionsUrl?: string;
  locationSchedule?: string;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface UserSession {
  user: {
    id: string;
    email: string;
    role: 'admin' | 'user';
    name?: string;
  } | null;
  isAdmin: boolean;
}
