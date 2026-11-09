// Read actual HTTP responses: frontend offline fallbacks must not hide failures.
const origin = process.env.HOMESTAY_SMOKE_URL ?? 'http://127.0.0.1:8000';
for (const path of ['/health', '/api/v1/properties', '/api/v1/amenities', '/api/v1/services']) {
  const response = await fetch(new URL(path, origin));
  if (!response.ok) throw new Error(`${path}: HTTP ${response.status}`);
  const body: unknown = await response.json();
  if (path === '/health' ? !(body && typeof body === 'object' && 'status' in body && body.status === 'ok') : !Array.isArray(body)) {
    throw new Error(`${path}: incompatible response`);
  }
  console.log(`OK ${path}`);
}
