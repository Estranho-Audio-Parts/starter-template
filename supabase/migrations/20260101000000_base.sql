-- =============================================================================
-- BASE DO SISTEMA
-- Nao edite este arquivo depois que ele ja foi aplicado (db push).
-- Migration ja aplicada e historia: para mudar algo, crie uma nova com
--   npm run db:new nome_da_mudanca
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. Funcao reutilizavel: mantem updated_at sempre correto.
--    Toda tabela nova deve criar um trigger que chama esta funcao.
-- -----------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- -----------------------------------------------------------------------------
-- 2. profiles: dados do usuario que nao cabem em auth.users.
--    auth.users e gerenciada pelo Supabase e nao deve ser alterada.
--    Esta tabela e a referencia de como TODA tabela do sistema deve ser feita.
-- -----------------------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  nome text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- RLS E OBRIGATORIO. Sem esta linha, qualquer pessoa com a chave publica
-- (que fica visivel no navegador) le a tabela inteira.
alter table public.profiles enable row level security;

-- Politicas: cada um so enxerga e edita o proprio perfil.
-- Usamos (select auth.uid()) e nao auth.uid() porque o Postgres consegue
-- avaliar a subquery uma vez so, em vez de uma vez por linha.
create policy "perfil: dono le o proprio"
  on public.profiles for select
  to authenticated
  using ((select auth.uid()) = id);

create policy "perfil: dono atualiza o proprio"
  on public.profiles for update
  to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

-- Nao existe policy de INSERT de proposito: o perfil e criado pelo trigger
-- abaixo, que roda como security definer e por isso ignora RLS.
-- Nao existe policy de DELETE de proposito: o perfil some junto com o usuario
-- por causa do "on delete cascade".

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- -----------------------------------------------------------------------------
-- 3. Cria o perfil sozinho assim que alguem se cadastra.
-- -----------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, email, nome)
  values (
    new.id,
    new.email,
    coalesce(
      new.raw_user_meta_data ->> 'nome',
      new.raw_user_meta_data ->> 'full_name',
      split_part(new.email, '@', 1)
    )
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
