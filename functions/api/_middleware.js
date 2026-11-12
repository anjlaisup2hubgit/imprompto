// Cloudflare Access sits in front of the site; every /api request also re-verifies the Access JWT.
// Any email that Cloudflare Access lets in is a user; the verified email says whose prompts to use.
// Fails CLOSED if ACCESS_TEAM_DOMAIN or ACCESS_AUD is missing.

const b64uToBytes = s => {
  s = s.replace(/-/g, '+').replace(/_/g, '/');
  s += '='.repeat((4 - (s.length % 4)) % 4);
  return Uint8Array.from(atob(s), c => c.charCodeAt(0));
};
const b64uToJson = s => JSON.parse(new TextDecoder().decode(b64uToBytes(s)));

let certs = null, certsAt = 0;

async function verifiedEmail(request, env) {
  const team = env.ACCESS_TEAM_DOMAIN, aud = env.ACCESS_AUD;
  if (!team || !aud) return null;
  const jwt = request.headers.get('Cf-Access-Jwt-Assertion');
  if (!jwt) return null;
  const parts = jwt.split('.');
  if (parts.length !== 3) return null;
  try {
    const header = b64uToJson(parts[0]);
    const payload = b64uToJson(parts[1]);
    if (header.alg !== 'RS256') return null;
    if (!payload.exp || payload.exp * 1000 < Date.now()) return null;
    if (payload.iss !== `https://${team}`) return null;
    if (!([].concat(payload.aud)).includes(aud)) return null;
    if (typeof payload.email !== 'string' || !payload.email) return null;
    if (!certs || Date.now() - certsAt > 600000) { // keep Cloudflare's keys for 10 minutes instead of asking every request
      const res = await fetch(`https://${team}/cdn-cgi/access/certs`);
      if (!res.ok) return null;
      certs = (await res.json()).keys; certsAt = Date.now();
    }
    const jwk = certs.find(k => k.kid === header.kid);
    if (!jwk) return null;
    const key = await crypto.subtle.importKey('jwk', jwk, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['verify']);
    const ok = await crypto.subtle.verify('RSASSA-PKCS1-v1_5', key, b64uToBytes(parts[2]), new TextEncoder().encode(parts[0] + '.' + parts[1]));
    return ok ? payload.email.toLowerCase() : null;
  } catch (e) {
    return null;
  }
}

export async function onRequest(context) {
  const email = await verifiedEmail(context.request, context.env);
  if (!email) {
    return new Response(JSON.stringify({ error: 'unauthorized' }), { status: 401, headers: { 'content-type': 'application/json' } });
  }
  context.data.email = email;
  return context.next();
}
