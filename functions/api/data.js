// One JSON list of your prompts in D1, with a version number so two devices cannot silently overwrite each other.
const json = (o, status = 200) => new Response(JSON.stringify(o), { status, headers: { 'content-type': 'application/json', 'cache-control': 'no-store' } });
const MAX_BYTES = 1_000_000;

export async function onRequestGet({ env }) {
  const row = await env.DB.prepare('SELECT data, updated FROM state WHERE id = 1').first();
  if (!row) return json({ data: null, updated: 0 });
  return json({ data: JSON.parse(row.data), updated: row.updated });
}

export async function onRequestPut({ request, env }) {
  const text = await request.text();
  if (text.length > MAX_BYTES) return json({ error: 'too large' }, 413);
  let body;
  try { body = JSON.parse(text); } catch { return json({ error: 'bad json' }, 400); }
  if (!Array.isArray(body.data)) return json({ error: 'bad shape' }, 400);
  const row = await env.DB.prepare('SELECT updated FROM state WHERE id = 1').first();
  const current = row ? row.updated : 0;
  if (current !== (body.base || 0)) return json({ error: 'conflict', updated: current }, 409);
  const updated = Math.max(Date.now(), current + 1);
  const res = row
    ? await env.DB.prepare('UPDATE state SET data = ?, updated = ? WHERE id = 1 AND updated = ?').bind(JSON.stringify(body.data), updated, current).run()
    : await env.DB.prepare('INSERT OR IGNORE INTO state (id, data, updated) VALUES (1, ?, ?)').bind(JSON.stringify(body.data), updated).run();
  if (!res.meta.changes) return json({ error: 'conflict' }, 409);
  return json({ updated });
}
