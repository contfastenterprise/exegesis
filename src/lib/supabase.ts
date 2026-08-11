import { createClient } from '@supabase/supabase-js';
import { 
  INITIAL_SERMONS, 
  INITIAL_EVENTS, 
  INITIAL_PRAYER_REQUESTS, 
  INITIAL_REGISTRATIONS, 
  INITIAL_POSTS, 
  INITIAL_SYSTEM_SETTINGS,
  INITIAL_LEADERS 
} from '../data/initialData';
import { Sermon, ActivityEvent, PrayerRequest, EventRegistration, CommunityPost, SystemSettings, UserSession, ChurchLeader, AdminUser, Devotional } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== 'https://your-supabase-project.supabase.co'
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Local storage key constants for persistence fallback
const STORAGE_KEYS = {
  SERMONS: 'gt_sermons_v1',
  EVENTS: 'gt_events_v1',
  PRAYERS: 'gt_prayers_v1',
  REGISTRATIONS: 'gt_registrations_v1',
  POSTS: 'gt_posts_v1',
  SETTINGS: 'gt_settings_v1',
  LEADERS: 'gt_leaders_v1',
  AUTH: 'gt_auth_v1',
  DEVOTIONALS: 'gt_devotionals_v1'
};

// Helper to get or initialize local storage
function getStoredItem<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (e) {
    console.warn(`Error reading localStorage key ${key}`, e);
    return defaultValue;
  }
}

function setStoredItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn(`Error setting localStorage key ${key}`, e);
  }
}

// Data Services
export const DataService = {
  // Devotionals
  async getDevotionals(): Promise<Devotional[]> {
    if (supabase) {
      try {
        const { data, error } = await supabase.from('devotionals').select('*').order('date', { ascending: false });
        if (!error && data) return data as Devotional[];
      } catch (err) {
        console.warn('Supabase devotionals fetch error:', err);
      }
    }
    return getStoredItem<Devotional[]>(STORAGE_KEYS.DEVOTIONALS, []);
  },

  async addDevotional(devotional: Omit<Devotional, 'id' | 'createdAt'>): Promise<Devotional> {
    const newDevotional: Devotional = {
      ...devotional,
      id: 'devo-' + Date.now(),
      createdAt: new Date().toISOString()
    };

    if (supabase) {
      try {
        const { data, error } = await supabase.from('devotionals').insert([newDevotional]).select().single();
        if (!error && data) return data as Devotional;
      } catch (err) {
        console.warn('Supabase add devotional error:', err);
      }
    }
    
    const devotionals = getStoredItem<Devotional[]>(STORAGE_KEYS.DEVOTIONALS, []);
    const updated = [newDevotional, ...devotionals];
    setStoredItem(STORAGE_KEYS.DEVOTIONALS, updated);
    return newDevotional;
  },

  async updateDevotional(devotional: Devotional): Promise<Devotional> {
    if (supabase) {
      try {
        await supabase.from('devotionals').update(devotional).eq('id', devotional.id);
      } catch (err) {
        console.warn('Supabase update devotional error:', err);
      }
    }
    const devotionals = getStoredItem<Devotional[]>(STORAGE_KEYS.DEVOTIONALS, []);
    const updated = devotionals.map(d => d.id === devotional.id ? devotional : d);
    setStoredItem(STORAGE_KEYS.DEVOTIONALS, updated);
    return devotional;
  },

  async deleteDevotional(id: string): Promise<void> {
    if (supabase) {
      try {
        await supabase.from('devotionals').delete().eq('id', id);
      } catch (err) {
        console.warn('Supabase delete devotional error:', err);
      }
    }
    const devotionals = getStoredItem<Devotional[]>(STORAGE_KEYS.DEVOTIONALS, []);
    const updated = devotionals.filter(d => d.id !== id);
    setStoredItem(STORAGE_KEYS.DEVOTIONALS, updated);
  },

  async uploadDevotionalMedia(file: File): Promise<string | null> {
    if (!supabase) return null;
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;
      const { error: uploadError } = await supabase.storage.from('devotionals').upload(filePath, file);
      
      if (uploadError) {
        console.error('Error uploading to devotionals bucket:', uploadError);
        return null;
      }
      
      const { data } = supabase.storage.from('devotionals').getPublicUrl(filePath);
      return data.publicUrl;
    } catch (error) {
      console.error('Exception uploading devotional media:', error);
      return null;
    }
  },

  // Sermons
  async getSermons(): Promise<Sermon[]> {
    if (supabase) {
      try {
        const { data, error } = await supabase.from('sermons').select('*').order('date', { ascending: false });
        if (!error && data ) {
          return data as Sermon[];
        }
      } catch (err) {
        console.warn('Supabase sermons fetch error, using local fallback:', err);
      }
    }
    return getStoredItem<Sermon[]>(STORAGE_KEYS.SERMONS, INITIAL_SERMONS);
  },

  async addSermon(sermon: Omit<Sermon, 'id'>): Promise<Sermon> {
    const newSermon: Sermon = {
      ...sermon,
      id: 'sermon-' + Date.now()
    };

    if (supabase) {
      try {
        const { data, error } = await supabase.from('sermons').insert([newSermon]).select().single();
        if (!error && data) return data as Sermon;
      } catch (err) {
        console.warn('Supabase add sermon failed:', err);
      }
    }

    const sermons = getStoredItem<Sermon[]>(STORAGE_KEYS.SERMONS, INITIAL_SERMONS);
    const updated = [newSermon, ...sermons];
    setStoredItem(STORAGE_KEYS.SERMONS, updated);
    return newSermon;
  },

  async deleteSermon(id: string): Promise<void> {
    if (supabase) {
      try {
        await supabase.from('sermons').delete().eq('id', id);
      } catch (err) {
        console.warn('Supabase delete sermon error:', err);
      }
    }
    const sermons = getStoredItem<Sermon[]>(STORAGE_KEYS.SERMONS, INITIAL_SERMONS);
    const updated = sermons.filter(s => s.id !== id);
    setStoredItem(STORAGE_KEYS.SERMONS, updated);
  },

  // Events
  async getEvents(): Promise<ActivityEvent[]> {
    if (supabase) {
      try {
        const { data, error } = await supabase.from('events').select('*');
        if (!error && data ) {
          return data as ActivityEvent[];
        }
      } catch (err) {
        console.warn('Supabase events fetch error:', err);
      }
    }
    return getStoredItem<ActivityEvent[]>(STORAGE_KEYS.EVENTS, INITIAL_EVENTS);
  },

  async addEvent(event: Omit<ActivityEvent, 'id'>): Promise<ActivityEvent> {
    const newEvent: ActivityEvent = {
      ...event,
      id: 'event-' + Date.now()
    };

    if (supabase) {
      try {
        const { data, error } = await supabase.from('events').insert([newEvent]).select().single();
        if (!error && data) return data as ActivityEvent;
      } catch (err) {
        console.warn('Supabase add event failed:', err);
      }
    }

    const events = getStoredItem<ActivityEvent[]>(STORAGE_KEYS.EVENTS, INITIAL_EVENTS);
    const updated = [...events, newEvent];
    setStoredItem(STORAGE_KEYS.EVENTS, updated);
    return newEvent;
  },

  async deleteEvent(id: string): Promise<void> {
    if (supabase) {
      try {
        await supabase.from('events').delete().eq('id', id);
      } catch (err) {
        console.warn('Supabase delete event error:', err);
      }
    }
    const events = getStoredItem<ActivityEvent[]>(STORAGE_KEYS.EVENTS, INITIAL_EVENTS);
    const updated = events.filter(e => e.id !== id);
    setStoredItem(STORAGE_KEYS.EVENTS, updated);
  },

  // Prayer Requests
  async getPrayerRequests(): Promise<PrayerRequest[]> {
    if (supabase) {
      try {
        const { data, error } = await supabase.from('prayer_requests').select('*').order('createdAt', { ascending: false });
        if (!error && data ) {
          return data as PrayerRequest[];
        }
      } catch (err) {
        console.warn('Supabase prayers fetch error:', err);
      }
    }
    return getStoredItem<PrayerRequest[]>(STORAGE_KEYS.PRAYERS, INITIAL_PRAYER_REQUESTS);
  },

  async addPrayerRequest(request: { name: string; email: string; phone?: string; message: string }): Promise<PrayerRequest> {
    const newRequest: PrayerRequest = {
      id: 'prayer-' + Date.now(),
      createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      name: request.name,
      email: request.email,
      phone: request.phone || '',
      message: request.message,
      status: 'Pending'
    };

    if (supabase) {
      try {
        const { data, error } = await supabase.from('prayer_requests').insert([newRequest]).select().single();
        if (!error && data) return data as PrayerRequest;
      } catch (err) {
        console.warn('Supabase prayer add failed:', err);
      }
    }

    const requests = getStoredItem<PrayerRequest[]>(STORAGE_KEYS.PRAYERS, INITIAL_PRAYER_REQUESTS);
    const updated = [newRequest, ...requests];
    setStoredItem(STORAGE_KEYS.PRAYERS, updated);
    return newRequest;
  },

  async updatePrayerStatus(id: string, status: 'Pending' | 'Prayed'): Promise<void> {
    if (supabase) {
      try {
        await supabase.from('prayer_requests').update({ status }).eq('id', id);
      } catch (err) {
        console.warn('Supabase prayer update error:', err);
      }
    }

    const requests = getStoredItem<PrayerRequest[]>(STORAGE_KEYS.PRAYERS, INITIAL_PRAYER_REQUESTS);
    const updated = requests.map(r => r.id === id ? { ...r, status } : r);
    setStoredItem(STORAGE_KEYS.PRAYERS, updated);
  },

  async deletePrayerRequest(id: string): Promise<void> {
    if (supabase) {
      try {
        await supabase.from('prayer_requests').delete().eq('id', id);
      } catch (err) {
        console.warn('Supabase delete error:', err);
      }
    }

    const requests = getStoredItem<PrayerRequest[]>(STORAGE_KEYS.PRAYERS, INITIAL_PRAYER_REQUESTS);
    const updated = requests.filter(r => r.id !== id);
    setStoredItem(STORAGE_KEYS.PRAYERS, updated);
  },

  // Registrations
  async getRegistrations(): Promise<EventRegistration[]> {
    if (supabase) {
      try {
        const { data, error } = await supabase.from('event_registrations').select('*');
        if (!error && data ) return data as EventRegistration[];
      } catch (err) {
        console.warn('Supabase reg fetch error:', err);
      }
    }
    return getStoredItem<EventRegistration[]>(STORAGE_KEYS.REGISTRATIONS, INITIAL_REGISTRATIONS);
  },

  async addRegistration(reg: Omit<EventRegistration, 'id' | 'registeredAt'>): Promise<EventRegistration> {
    const newReg: EventRegistration = {
      ...reg,
      id: 'reg-' + Date.now(),
      registeredAt: 'Ahora mismo'
    };

    if (supabase) {
      try {
        const { data, error } = await supabase.from('event_registrations').insert([newReg]).select().single();
        if (!error && data) return data as EventRegistration;
      } catch (err) {
        console.warn('Supabase reg add error:', err);
      }
    }

    const regs = getStoredItem<EventRegistration[]>(STORAGE_KEYS.REGISTRATIONS, INITIAL_REGISTRATIONS);
    const updated = [newReg, ...regs];
    setStoredItem(STORAGE_KEYS.REGISTRATIONS, updated);
    return newReg;
  },

  // Community Posts
  async getPosts(): Promise<CommunityPost[]> {
    if (supabase) {
      try {
        const { data, error } = await supabase.from('community_posts').select('*');
        if (!error && data ) return data as CommunityPost[];
      } catch (err) {
        console.warn('Supabase posts fetch error:', err);
      }
    }
    return getStoredItem<CommunityPost[]>(STORAGE_KEYS.POSTS, INITIAL_POSTS);
  },

  async toggleLikePost(postId: string): Promise<CommunityPost[]> {
    const posts = await this.getPosts();
    const updated = posts.map(post => {
      if (post.id === postId) {
        const userLiked = !post.userLiked;
        const likes = userLiked ? post.likes + 1 : Math.max(0, post.likes - 1);
        return { ...post, userLiked, likes };
      }
      return post;
    });

    setStoredItem(STORAGE_KEYS.POSTS, updated);
    return updated;
  },

  async addPost(content: string, authorName: string, imageUrl?: string): Promise<CommunityPost> {
    const newPost: CommunityPost = {
      id: 'post-' + Date.now(),
      authorName: authorName || 'Miembro de la Iglesia',
      authorInitials: authorName ? authorName.substring(0, 2).toUpperCase() : 'M',
      timeAgo: 'Justo ahora',
      content,
      imageUrl,
      likes: 1,
      userLiked: true,
      repliesCount: 0
    };

    const posts = await this.getPosts();
    const updated = [newPost, ...posts];
    setStoredItem(STORAGE_KEYS.POSTS, updated);
    return newPost;
  },

  // System Settings
  async getSettings(): Promise<SystemSettings> {
    if (supabase) {
      try {
        const { data, error } = await supabase.from('system_settings').select('*').single();
        if (!error && data) return data as SystemSettings;
      } catch (err) {
        console.warn('Supabase settings fetch error:', err);
      }
    }
    return getStoredItem<SystemSettings>(STORAGE_KEYS.SETTINGS, INITIAL_SYSTEM_SETTINGS);
  },

  async saveSettings(settings: SystemSettings): Promise<SystemSettings> {
    if (supabase) {
      try {
        const { error } = await supabase.from('system_settings').upsert([settings]);
        if (error) {
          console.error('Supabase settings update error from server:', error);
          alert('Error al guardar en la base de datos: ' + error.message);
        }
      } catch (err) {
        console.warn('Supabase settings update exception:', err);
      }
    }
    setStoredItem(STORAGE_KEYS.SETTINGS, settings);
    return settings;
  },

  // Church Leaders
  async getLeaders(): Promise<ChurchLeader[]> {
    if (supabase) {
      try {
        const { data, error } = await supabase.from('church_leaders').select('*');
        if (!error && data ) return data as ChurchLeader[];
      } catch (err) {
        console.warn('Supabase leaders fetch error:', err);
      }
    }
    return getStoredItem<ChurchLeader[]>(STORAGE_KEYS.LEADERS, INITIAL_LEADERS);
  },

  async addLeader(leader: Omit<ChurchLeader, 'id'>): Promise<ChurchLeader> {
    const newLeader: ChurchLeader = {
      ...leader,
      id: 'leader-' + Date.now()
    };

    if (supabase) {
      try {
        const { data, error } = await supabase.from('church_leaders').insert([newLeader]).select().single();
        if (!error && data) return data as ChurchLeader;
      } catch (err) {
        console.warn('Supabase add leader error:', err);
      }
    }

    const leaders = getStoredItem<ChurchLeader[]>(STORAGE_KEYS.LEADERS, INITIAL_LEADERS);
    const updated = [...leaders, newLeader];
    setStoredItem(STORAGE_KEYS.LEADERS, updated);
    return newLeader;
  },

  async updateLeader(leader: ChurchLeader): Promise<ChurchLeader> {
    if (supabase) {
      try {
        await supabase.from('church_leaders').update(leader).eq('id', leader.id);
      } catch (err) {
        console.warn('Supabase update leader error:', err);
      }
    }

    const leaders = getStoredItem<ChurchLeader[]>(STORAGE_KEYS.LEADERS, INITIAL_LEADERS);
    const updated = leaders.map(l => l.id === leader.id ? leader : l);
    setStoredItem(STORAGE_KEYS.LEADERS, updated);
    return leader;
  },

  async deleteLeader(id: string): Promise<void> {
    if (supabase) {
      try {
        await supabase.from('church_leaders').delete().eq('id', id);
      } catch (err) {
        console.warn('Supabase delete leader error:', err);
      }
    }

    const leaders = getStoredItem<ChurchLeader[]>(STORAGE_KEYS.LEADERS, INITIAL_LEADERS);
    const updated = leaders.filter(l => l.id !== id);
    setStoredItem(STORAGE_KEYS.LEADERS, updated);
  },

  // Admin Users
  async getAdminUsers(): Promise<AdminUser[]> {
    if (supabase) {
      try {
        const { data, error } = await supabase.from('admin_users').select('*').order('createdAt', { ascending: false });
        if (!error && data) return data as AdminUser[];
      } catch (err) {
        console.warn('Supabase admin users fetch error:', err);
      }
    }
    return [];
  },

  async addAdminUser(email: string, name: string, password?: string): Promise<AdminUser | null> {
    if (supabase) {
      // Create user in Supabase Auth if password is provided
      if (password) {
        try {
          // Use a secondary client to prevent overwriting the current admin's session
          const tempClient = createClient(supabaseUrl, supabaseAnonKey, { 
            auth: { persistSession: false } 
          });
          const { error: signUpError } = await tempClient.auth.signUp({
            email,
            password,
            options: { data: { name } }
          });
          if (signUpError) {
            console.warn('Supabase auth sign up error:', signUpError);
            return null;
          }
        } catch (e) {
          console.warn('Supabase auth sign up exception:', e);
          return null;
        }
      }

      const newUser = {
        id: 'admin-' + Date.now(),
        email,
        name,
        createdAt: new Date().toLocaleDateString('en-US')
      };
      try {
        const { data, error } = await supabase.from('admin_users').insert([newUser]).select().single();
        if (!error && data) return data as AdminUser;
      } catch (err) {
        console.warn('Supabase add admin error:', err);
      }
    }
    return null;
  },

  async deleteAdminUser(id: string): Promise<void> {
    if (supabase) {
      try {
        await supabase.from('admin_users').delete().eq('id', id);
      } catch (err) {
        console.warn('Supabase delete admin error:', err);
      }
    }
  }
};

// Authentication Service using Supabase or Fallback Admin Auth
export const AuthService = {
  getStoredUserSession(): UserSession {
    const session = getStoredItem<UserSession>(STORAGE_KEYS.AUTH, {
      user: null,
      isAdmin: false
    });
    return session;
  },

  async getCurrentUserSession(): Promise<UserSession> {
    if (supabase) {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session && session.user) {
          let isAdmin = false;
          let adminName = session.user.user_metadata?.name || 'Administrador';
          if (session.user.email) {
            try {
              const { data } = await supabase.from('admin_users').select('id, name').eq('email', session.user.email).single();
              if (data) {
                isAdmin = true;
                if (data.name) adminName = data.name;
              }
            } catch (e) {
              // Ignore or log
            }
          }
          // Fallback for immediate testing if table is empty
          if (!isAdmin && (session.user.email?.toLowerCase().includes('admin'))) {
             isAdmin = true;
          }

          return {
            user: {
              id: session.user.id,
              email: session.user.email || 'admin@gracetruth.org',
              role: isAdmin ? 'admin' : 'user',
              name: adminName
            },
            isAdmin
          };
        }
      } catch (err) {
        console.warn('Supabase auth session check failed:', err);
      }
    }
    return this.getStoredUserSession();
  },

  async login(email: string, pass: string): Promise<{ success: boolean; session?: UserSession; error?: string }> {
    // 1. Try real Supabase auth if client is active
    if (supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password: pass
        });

        if (!error && data.session && data.user) {
          let isAdmin = false;
          let adminName = data.user.user_metadata?.name || 'Administrador Church';
          if (data.user.email) {
            try {
              const { data: adminData } = await supabase.from('admin_users').select('id, name').eq('email', data.user.email).single();
              if (adminData) {
                isAdmin = true;
                if (adminData.name) adminName = adminData.name;
              }
            } catch(e) {}
          }
          
          if (!isAdmin && (data.user.email?.toLowerCase().includes('admin'))) {
             isAdmin = true;
          }

          if (!isAdmin) {
             await supabase.auth.signOut();
             return { success: false, error: 'Acceso denegado: este correo no está registrado como administrador.' };
          }

          const sessionVal: UserSession = {
            user: {
              id: data.user.id,
              email: data.user.email || email,
              role: 'admin',
              name: adminName
            },
            isAdmin: true
          };
          setStoredItem(STORAGE_KEYS.AUTH, sessionVal);
          return { success: true, session: sessionVal };
        } else if (error) {
          return { success: false, error: error.message };
        }
      } catch (err: any) {
        return { success: false, error: err?.message || 'Error de autenticación.' };
      }
    }

    return { 
      success: false, 
      error: 'No se pudo conectar a la base de datos de autenticación.' 
    };
  },

  async logout(): Promise<void> {
    if (supabase) {
      try {
        await supabase.auth.signOut();
      } catch (e) {
        console.warn('Supabase signOut error:', e);
      }
    }
    setStoredItem(STORAGE_KEYS.AUTH, { user: null, isAdmin: false });
  }
};
