-- 1. Crear la tabla de administradores
create table public.admin_users (
    id text primary key,
    email text not null unique,
    name text not null,
    "createdAt" text not null
);

-- 2. Habilitar RLS
alter table public.admin_users enable row level security;

-- 3. Políticas para admin_users
-- Todos los usuarios autenticados (que logren entrar) pueden leer, insertar y borrar
create policy "Admins are viewable by authenticated" on public.admin_users for select to authenticated using (true);
create policy "Admins insertable by authenticated" on public.admin_users for insert to authenticated with check (true);
create policy "Admins deletable by authenticated" on public.admin_users for delete to authenticated using (true);

-- (Opcional) Insertar un administrador por defecto (el usuario actual)
-- Reemplaza 'tu-correo@ejemplo.com' con tu correo real antes de correr esto en Supabase si quieres pre-configurarlo.
-- insert into public.admin_users (id, email, name, "createdAt") values ('admin-1', 'tu-correo@ejemplo.com', 'Super Admin', '2024-08-09');
