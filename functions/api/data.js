// Each signed-in person gets their own JSON list of prompts in D1, with a version number so two devices cannot silently overwrite each other.
const json = (o, status = 200) => new Response(JSON.stringify(o), { status, headers: { 'content-type': 'application/json', 'cache-control': 'no-store' } });
const MAX_BYTES = 1_000_000;

async function ready(env, email) {
  await env.DB.prepare('CREATE TABLE IF NOT EXISTS user_state (email TEXT PRIMARY KEY, data TEXT NOT NULL, updated INTEGER NOT NULL)').run();
  // the first owner's prompts used to live in one shared row: copy them over once
  if (env.ALLOWED_EMAIL && email === env.ALLOWED_EMAIL.toLowerCase()) {
    try { await env.DB.prepare('INSERT OR IGNORE INTO user_state (email, data, updated) SELECT ?, data, updated FROM state WHERE id = 1').bind(email).run(); } catch (e) { /* no old row */ }
  }
}

export async function onRequestGet({ env, data: { email } }) {
  await ready(env, email);
  const row = await env.DB.prepare('SELECT data, updated FROM user_state WHERE email = ?').bind(email).first();
  if (!row) return json({ data: null, updated: 0, email });
  return json({ data: JSON.parse(row.data), updated: row.updated, email });
}

export async function onRequestPut({ request, env, data: { email } }) {
  const text = await request.text();
  if (text.length > MAX_BYTES) return json({ error: 'too large' }, 413);
  let body;
  try { body = JSON.parse(text); } catch { return json({ error: 'bad json' }, 400); }
  if (!Array.isArray(body.data)) return json({ error: 'bad shape' }, 400);
  await ready(env, email);
  const row = await env.DB.prepare('SELECT updated FROM user_state WHERE email = ?').bind(email).first();
  const current = row ? row.updated : 0;
  if (current !== (body.base || 0)) return json({ error: 'conflict', updated: current }, 409);
  const updated = Math.max(Date.now(), current + 1);
  const res = row
    ? await env.DB.prepare('UPDATE user_state SET data = ?, updated = ? WHERE email = ? AND updated = ?').bind(JSON.stringify(body.data), updated, email, current).run()
    : await env.DB.prepare('INSERT OR IGNORE INTO user_state (email, data, updated) VALUES (?, ?, ?)').bind(email, JSON.stringify(body.data), updated).run();
  if (!res.meta.changes) return json({ error: 'conflict' }, 409);
  return json({ updated });
}
