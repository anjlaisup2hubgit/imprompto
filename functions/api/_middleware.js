// Cloudflare Access sits in front of the site; every /api request also re-verifies the Access JWT.
// Fails CLOSED if ACCESS_TEAM_DOMAIN, ACCESS_AUD or ALLOWED_EMAIL is missing.

const b64uToBytes = s => {
  s = s.replace(/-/g, '+').replace(/_/g, '/');
  s += '='.repeat((4 - (s.length % 4)) % 4);
  return Uint8Array.from(atob(s), c => c.charCodeAt(0));
};
const b64uToJson = s => JSON.parse(new TextDecoder().decode(b64uToBytes(s)));

async function verify(request, env) {
  const team = env.ACCESS_TEAM_DOMAIN, aud = env.ACCESS_AUD;
  if (!team || !aud || !env.ALLOWED_EMAIL) return false;
  const jwt = request.headers.get('Cf-Access-Jwt-Assertion');
  if (!jwt) return false;
  const parts = jwt.split('.');
  if (parts.length !== 3) return false;
  try {
    const header = b64uToJson(parts[0]);
    const payload = b64uToJson(parts[1]);
    if (header.alg !== 'RS256') return false;
    if (!payload.exp || payload.exp * 1000 < Date.now()) return false;
    if (payload.iss !== `https://${team}`) return false;
    if (!([].concat(payload.aud)).includes(aud)) return false;
    if (payload.email !== env.ALLOWED_EMAIL) return false;
    const res = await fetch(`https://${team}/cdn-cgi/access/certs`);
    if (!res.ok) return false;
    const jwk = (await res.json()).keys.find(k => k.kid === header.kid);
    if (!jwk) return false;
    const key = await crypto.subtle.importKey('jwk', jwk, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['verify']);
    return await crypto.subtle.verify('RSASSA-PKCS1-v1_5', key, b64uToBytes(parts[2]), new TextEncoder().encode(parts[0] + '.' + parts[1]));
  } catch (e) {
    return false;
  }
}

export async function onRequest(context) {
  if (!(await verify(context.request, context.env))) {
    return new Response(JSON.stringify({ error: 'unauthorized' }), { status: 401, headers: { 'content-type': 'application/json' } });
  }
  return context.next();
}
