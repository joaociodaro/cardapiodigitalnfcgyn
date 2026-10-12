#!/usr/bin/env bash
# Aplica a migration + seed em um Postgres local e roda os testes de RLS.
# Uso: DATABASE_URL=postgres://postgres@localhost:5432/postgres npm run test:db
set -euo pipefail
: "${DATABASE_URL:?Defina DATABASE_URL apontando para um Postgres de TESTE (nunca produção)}"

DB="cardapio_rls_test"
psql "$DATABASE_URL" -q -c "drop database if exists $DB" -c "create database $DB"
TEST_URL="${DATABASE_URL%/*}/$DB"

for f in supabase/tests/00_supabase_stub.sql supabase/migrations/*.sql supabase/seed.sql supabase/tests/10_*.sql; do
  echo "→ $f"
  psql "$TEST_URL" -v ON_ERROR_STOP=1 -q -f "$f" > /dev/null
done
echo "✓ Testes de banco aprovados"
