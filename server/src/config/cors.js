const fallbackOrigins = ['http://localhost:5173', 'http://127.0.0.1:5173'];

function normalizeOrigin(origin) {
  return origin?.trim().replace(/\/$/, '');
}

export function allowedOrigins() {
  const configured = process.env.CLIENT_URL
    ? process.env.CLIENT_URL.split(',').map(normalizeOrigin).filter(Boolean)
    : [];

  return Array.from(new Set([...fallbackOrigins, ...configured]));
}

export const corsOptions = {
  origin(origin, callback) {
    const normalized = normalizeOrigin(origin);

    if (!normalized || allowedOrigins().includes(normalized) || normalized.endsWith('.vercel.app')) {
      callback(null, true);
      return;
    }

    callback(new Error(`CORS blocked origin: ${origin}`));
  },
  credentials: true
};
