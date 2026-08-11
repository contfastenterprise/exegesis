-- Enable UUID extension just in case, though we are using text IDs
create extension if not exists "uuid-ossp";

-------------------------------------------------------------------------------
-- 1. Tablas
-------------------------------------------------------------------------------

-- Sermones
create table public.sermons (
    id text primary key,
    title text not null,
    series text not null,
    date text not null,
    year text not null,
    pastor text not null,
    "pastorInitials" text not null,
    description text not null,
    "imageUrl" text not null,
    "audioUrl" text,
    passage text,
    "isFeatured" boolean default false,
    "youtubeUrl" text,
    "youtubeStartMinute" integer
);

-- Eventos
create table public.events (
    id text primary key,
    title text not null,
    category text not null,
    date text not null,
    time text not null,
    location text not null,
    description text not null,
    "imageUrl" text,
    "isFeatured" boolean default false,
    "registrationOpen" boolean default true
);

-- Peticiones de Oración
create table public.prayer_requests (
    id text primary key,
    "createdAt" text not null,
    name text not null,
    email text not null,
    phone text,
    message text not null,
    status text default 'Pending'
);

-- Registros a Eventos
create table public.event_registrations (
    id text primary key,
    "eventName" text not null,
    "userName" text not null,
    "userEmail" text not null,
    tickets integer not null default 1,
    "registeredAt" text not null,
    type text not null
);

-- Comunidad / Posts
create table public.community_posts (
    id text primary key,
    "authorName" text not null,
    "authorAvatar" text,
    "authorInitials" text,
    "timeAgo" text not null,
    content text not null,
    "imageUrl" text,
    likes integer default 0,
    "userLiked" boolean default false,
    "repliesCount" integer default 0
);

-- Configuración del Sistema (Generalmente solo un registro con id 'settings')
create table public.system_settings (
    id text primary key default 'settings',
    "maintenanceMode" boolean default false,
    "primaryColor" text default '#5D4037',
    "churchName" text default 'Grace & Truth',
    "churchAddress" text,
    "churchPhone" text,
    "churchEmail" text,
    "logoUrl" text,
    "heroTitle" text,
    "heroSubtitle" text,
    "heroVerse" text,
    "heroVerses" text[],
    "heroDescription" text,
    "heroBackgroundImageUrl" text,
    "heroBgOpacity" integer default 45,
    "youtubeUrl" text,
    "youtubeChannelCoverUrl" text,
    "isLiveStreaming" boolean default false,
    "liveStreamVideoId" text,
    "liveStreamTitle" text,
    "facebookUrl" text,
    "instagramUrl" text,
    "whatsappUrl" text,
    "twitterUrl" text,
    "tiktokUrl" text,
    "googleMapsEmbedUrl" text,
    "googleMapsDirectionsUrl" text,
    "locationSchedule" text
);

-- Líderes de la Iglesia
create table public.church_leaders (
    id text primary key,
    name text not null,
    role text not null,
    phone text,
    email text,
    "imageUrl" text,
    bio text
);

-------------------------------------------------------------------------------
-- 2. Habilitar Row Level Security (RLS)
-------------------------------------------------------------------------------
alter table public.sermons enable row level security;
alter table public.events enable row level security;
alter table public.prayer_requests enable row level security;
alter table public.event_registrations enable row level security;
alter table public.community_posts enable row level security;
alter table public.system_settings enable row level security;
alter table public.church_leaders enable row level security;

-------------------------------------------------------------------------------
-- 3. Políticas de Seguridad (Policies)
-------------------------------------------------------------------------------

-- SERMONS
-- Cualquier usuario puede leer
create policy "Sermons are viewable by everyone" on public.sermons for select using (true);
-- Solo admins (autenticados) pueden modificar
create policy "Sermons insertable by authenticated" on public.sermons for insert to authenticated with check (true);
create policy "Sermons updatable by authenticated" on public.sermons for update to authenticated using (true);
create policy "Sermons deletable by authenticated" on public.sermons for delete to authenticated using (true);

-- EVENTS
create policy "Events are viewable by everyone" on public.events for select using (true);
create policy "Events insertable by authenticated" on public.events for insert to authenticated with check (true);
create policy "Events updatable by authenticated" on public.events for update to authenticated using (true);
create policy "Events deletable by authenticated" on public.events for delete to authenticated using (true);

-- CHURCH LEADERS
create policy "Leaders are viewable by everyone" on public.church_leaders for select using (true);
create policy "Leaders insertable by authenticated" on public.church_leaders for insert to authenticated with check (true);
create policy "Leaders updatable by authenticated" on public.church_leaders for update to authenticated using (true);
create policy "Leaders deletable by authenticated" on public.church_leaders for delete to authenticated using (true);

-- SYSTEM SETTINGS
create policy "Settings are viewable by everyone" on public.system_settings for select using (true);
create policy "Settings insertable by authenticated" on public.system_settings for insert to authenticated with check (true);
create policy "Settings updatable by authenticated" on public.system_settings for update to authenticated using (true);
create policy "Settings deletable by authenticated" on public.system_settings for delete to authenticated using (true);

-- COMMUNITY POSTS
-- Todos pueden ver y todos pueden crear, pero solo autenticados pueden borrar/editar.
create policy "Posts are viewable by everyone" on public.community_posts for select using (true);
create policy "Posts insertable by everyone" on public.community_posts for insert with check (true);
create policy "Posts updatable by authenticated" on public.community_posts for update to authenticated using (true);
create policy "Posts deletable by authenticated" on public.community_posts for delete to authenticated using (true);

-- PRAYER REQUESTS
-- Todos pueden insertar (enviar peticiones), pero solo administradores pueden ver, editar o borrar
create policy "Prayer requests insertable by everyone" on public.prayer_requests for insert with check (true);
create policy "Prayer requests viewable by authenticated" on public.prayer_requests for select to authenticated using (true);
create policy "Prayer requests updatable by authenticated" on public.prayer_requests for update to authenticated using (true);
create policy "Prayer requests deletable by authenticated" on public.prayer_requests for delete to authenticated using (true);

-- EVENT REGISTRATIONS
-- Todos pueden registrarse, pero solo admins pueden ver las listas
create policy "Registrations insertable by everyone" on public.event_registrations for insert with check (true);
create policy "Registrations viewable by authenticated" on public.event_registrations for select to authenticated using (true);
create policy "Registrations updatable by authenticated" on public.event_registrations for update to authenticated using (true);
create policy "Registrations deletable by authenticated" on public.event_registrations for delete to authenticated using (true);
