/**
 * Gera src/lib/supabase/database.types.ts no formato do supabase-js a partir
 * de um Postgres com as migrations aplicadas (o de teste local serve).
 *
 *   DATABASE_URL=postgres://... npm run db:types
 *
 * Alternativa equivalente com a CLI do Supabase:
 *   npx supabase gen types typescript --project-id <ref> > src/lib/supabase/database.types.ts
 */
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { Client } from "pg";

const url = process.env.DATABASE_URL;
if (!url) throw new Error("Defina DATABASE_URL");

const PG_TO_TS: Record<string, string> = {
  uuid: "string", text: "string", citext: "string", varchar: "string", bpchar: "string", inet: "unknown",
  int2: "number", int4: "number", int8: "number", float4: "number", float8: "number", numeric: "number",
  bool: "boolean", json: "Json", jsonb: "Json", timestamptz: "string", timestamp: "string", date: "string",
};

async function main() {
  const db = new Client({ connectionString: url });
  await db.connect();

  const enums = await db.query<{ name: string; values: string[] }>(`
    select t.typname as name, array_agg(e.enumlabel::text order by e.enumsortorder) as values
    from pg_type t join pg_enum e on e.enumtypid = t.oid join pg_namespace n on n.oid = t.typnamespace
    where n.nspname = 'public' group by t.typname order by t.typname`);
  const enumNames = new Set(enums.rows.map((e) => e.name));

  const cols = await db.query<{ table: string; column: string; udt: string; nullable: boolean; has_default: boolean; identity: boolean }>(`
    select c.table_name as table, c.column_name as column, c.udt_name as udt,
           c.is_nullable = 'YES' as nullable, c.column_default is not null as has_default, c.is_identity = 'YES' as identity
    from information_schema.columns c join information_schema.tables t
      on t.table_name = c.table_name and t.table_schema = c.table_schema
    where c.table_schema = 'public' and t.table_type = 'BASE TABLE'
    order by c.table_name, c.column_name`);

  const fks = await db.query<{ name: string; table: string; columns: string[]; ref_table: string; ref_columns: string[]; one_to_one: boolean }>(`
    select con.conname as name, rel.relname as table,
      array(select att.attname from unnest(con.conkey) k join pg_attribute att on att.attrelid = con.conrelid and att.attnum = k)::text[] as columns,
      frel.relname as ref_table,
      array(select att.attname from unnest(con.confkey) k join pg_attribute att on att.attrelid = con.confrelid and att.attnum = k)::text[] as ref_columns,
      exists (select 1 from pg_index i where i.indrelid = con.conrelid and i.indisunique and i.indkey::int2[] = con.conkey) as one_to_one
    from pg_constraint con join pg_class rel on rel.oid = con.conrelid join pg_class frel on frel.oid = con.confrelid
    join pg_namespace n on n.oid = rel.relnamespace join pg_namespace fn on fn.oid = frel.relnamespace
    where con.contype = 'f' and n.nspname = 'public' and fn.nspname = 'public'
    order by rel.relname, con.conname`);

  const fns = await db.query<{ name: string; args: string; result: string; returns_set: boolean }>(`
    select p.proname as name, pg_get_function_arguments(p.oid) as args, pg_get_function_result(p.oid) as result, p.proretset as returns_set
    from pg_proc p join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public' and p.prorettype <> 'trigger'::regtype
      and p.proname not in ('set_updated_at') order by p.proname`);

  const tsType = (udt: string): string => {
    if (udt.startsWith("_")) return `${tsType(udt.slice(1))}[]`;
    if (enumNames.has(udt)) return `Database["public"]["Enums"]["${udt}"]`;
    return PG_TO_TS[udt] ?? "unknown";
  };
  const argType = (pgType: string): string => {
    const t = pgType.trim().replace(/^public\./, "");
    if (t.endsWith("[]")) return `${argType(t.slice(0, -2))}[]`;
    const map: Record<string, string> = { "text": "string", "uuid": "string", "integer": "number", "boolean": "boolean", "jsonb": "Json" };
    if (enumNames.has(t)) return `Database["public"]["Enums"]["${t}"]`;
    return map[t] ?? "unknown";
  };

  const tables = new Map<string, typeof cols.rows>();
  for (const c of cols.rows) tables.set(c.table, [...(tables.get(c.table) ?? []), c]);

  const o: string[] = [];
  o.push("// Gerado por scripts/generate-db-types.ts — não editar manualmente.");
  o.push("export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];");
  o.push("");
  o.push("export type Database = {");
  o.push('  __InternalSupabase: { PostgrestVersion: "12" };');
  o.push("  public: {");
  o.push("    Tables: {");
  for (const [table, list] of tables) {
    o.push(`      ${table}: {`);
    o.push("        Row: {");
    for (const c of list) o.push(`          ${c.column}: ${tsType(c.udt)}${c.nullable ? " | null" : ""};`);
    o.push("        };");
    for (const kind of ["Insert", "Update"] as const) {
      o.push(`        ${kind}: {`);
      for (const c of list) {
        const optional = kind === "Update" || c.nullable || c.has_default || c.identity;
        o.push(`          ${c.column}${optional ? "?" : ""}: ${tsType(c.udt)}${c.nullable ? " | null" : ""};`);
      }
      o.push("        };");
    }
    o.push("        Relationships: [");
    for (const f of fks.rows.filter((f) => f.table === table)) {
      o.push(
        `          { foreignKeyName: "${f.name}"; columns: [${f.columns.map((c) => `"${c}"`).join(", ")}]; isOneToOne: ${f.one_to_one}; referencedRelation: "${f.ref_table}"; referencedColumns: [${f.ref_columns.map((c) => `"${c}"`).join(", ")}] },`,
      );
    }
    o.push("        ];");
    o.push("      };");
  }
  o.push("    };");
  o.push("    Views: { [_ in never]: never };");
  o.push("    Functions: {");
  for (const f of fns.rows) {
    const args = f.args
      .split(",")
      .map((a) => a.trim())
      .filter(Boolean)
      .map((a) => {
        const optional = /\sDEFAULT\s/i.test(a);
        const clean = a.replace(/\sDEFAULT\s.*$/i, "");
        const [name, ...type] = clean.split(/\s+/);
        return `${name}${optional ? "?" : ""}: ${argType(type.join(" "))}`;
      });
    let ret: string;
    const tableMatch = f.result.match(/^TABLE\((.*)\)$/);
    if (tableMatch) {
      const fields = tableMatch[1].split(",").map((x) => {
        const [n, ...t] = x.trim().split(/\s+/);
        return `${n}: ${argType(t.join(" "))}`;
      });
      ret = `{ ${fields.join("; ")} }[]`;
    } else if (f.result === "void") ret = "undefined";
    else ret = argType(f.result);
    o.push(`      ${f.name}: { Args: ${args.length ? `{ ${args.join("; ")} }` : "never"}; Returns: ${ret} };`);
  }
  o.push("    };");
  o.push("    Enums: {");
  for (const e of enums.rows) o.push(`      ${e.name}: ${e.values.map((v) => `"${v}"`).join(" | ")};`);
  o.push("    };");
  o.push("    CompositeTypes: { [_ in never]: never };");
  o.push("  };");
  o.push("};");
  o.push("");
  o.push('type PublicSchema = Database["public"];');
  o.push('export type Tables<T extends keyof PublicSchema["Tables"]> = PublicSchema["Tables"][T]["Row"];');
  o.push('export type TablesInsert<T extends keyof PublicSchema["Tables"]> = PublicSchema["Tables"][T]["Insert"];');
  o.push('export type TablesUpdate<T extends keyof PublicSchema["Tables"]> = PublicSchema["Tables"][T]["Update"];');
  o.push('export type Enums<T extends keyof PublicSchema["Enums"]> = PublicSchema["Enums"][T];');

  writeFileSync(join(__dirname, "..", "src", "lib", "supabase", "database.types.ts"), o.join("\n") + "\n");
  await db.end();
  console.log(`Tipos gerados: ${tables.size} tabelas, ${fns.rowCount} funções, ${enums.rowCount} enums`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
