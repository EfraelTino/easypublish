# 1. Crear entorno virtual
python -m venv venv

# 2. Activarlo
# En Windows:
venv\Scripts\activate
# En Mac/Linux:
source venv/bin/activate

# 3. Instalar librerías
pip install fastapi uvicorn supabase python-dotenv pydantic

DB_PASSWORD: oBPP7Y0mtnfT2lw0


CREACION DE TABLAS:
-- 1. TABLA PUBLIC.PROFILES
-- Extiende la tabla auth.users de Supabase. Aquí guardamos si es admin o colab.
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text,
  role text default 'colab', -- 'admin' o 'colab'
  full_name text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 2. TABLA ORGANIZATIONS
-- El "espacio de trabajo". Un admin crea esto.
create table public.organizations (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  owner_id uuid references public.profiles(id) not null, -- El creador (Admin)
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 3. TABLA ORGANIZATION_MEMBERS
-- Tabla intermedia: Dice qué usuarios pertenecen a qué organización.
create table public.organization_members (
  id uuid default gen_random_uuid() primary key,
  organization_id uuid references public.organizations(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  role text default 'member', -- Permisos dentro de la org
  joined_at timestamp with time zone default timezone('utc'::text, now()),
  unique(organization_id, user_id) -- Evita duplicados
);

-- 4. TABLA PROJECTS (Donde viven las API KEYS)
-- Aquí es donde se guardan las credenciales de las redes sociales.
create table public.projects (
  id uuid default gen_random_uuid() primary key,
  organization_id uuid references public.organizations(id) on delete cascade not null,
  name text not null, -- Ej: "Campaña Pizzería"
  
  -- Guardamos las keys en un JSON para flexibilidad
  -- Ej: { "youtube_token": "xyz", "tiktok_key": "abc" }
  api_keys jsonb default '{}'::jsonb, 
  
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 5. CONFIGURACIÓN DE SEGURIDAD (Row Level Security - RLS)
-- Habilitamos seguridad para que no cualquiera pueda leer los datos
alter table public.profiles enable row level security;
alter table public.organizations enable row level security;
alter table public.projects enable row level security;

-- POLÍTICA BÁSICA (Ejemplo):
-- "Los usuarios pueden ver los proyectos si pertenecen a la organización de ese proyecto"
create policy "Usuarios pueden ver proyectos de su org"
on public.projects for select
using (
  exists (
    select 1 from public.organization_members
    where organization_members.organization_id = projects.organization_id
    and organization_members.user_id = auth.uid()
  )
);


-- 1. Asegurarnos de que RLS esté activo
alter table public.organizations enable row level security;

-- 2. Limpiar políticas viejas para evitar conflictos (opcional pero recomendado)
drop policy if exists "Users can create organizations" on public.organizations;
drop policy if exists "Users can view their own organizations" on public.organizations;

-- 3. PERMISO DE INSERTAR (La solución a tu error 42501)
-- Permite insertar SOLO si el 'owner_id' coincide con tu ID de usuario logueado.
create policy "Users can create organizations"
on public.organizations
for insert
to authenticated
with check (auth.uid() = owner_id);

-- 4. PERMISO DE LEER (Necesario para el .select() del final)
-- Permite ver la organización SOLO si eres el dueño.
create policy "Users can view their own organizations"
on public.organizations
for select
to authenticated
using (auth.uid() = owner_id);