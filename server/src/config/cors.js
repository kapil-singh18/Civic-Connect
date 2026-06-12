const fallbackOrigins = ['http://localhost:5173', 'http://127.0.0.1:5173'];

export function allowedOrigins() {
  const configured = process.env.CLIENT_URL
    ? process.env.CLIENT_URL.split(',').map((origin) => origin.trim()).filter(Boolean)
    : [];

  return Array.from(new Set([...fallbackOrigins, ...configured]));
}

export const corsOptions = {
  origin(origin, callback) {
    if (!origin || allowedOrigins().includes(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error(`CORS blocked origin: ${origin}`));
  },
  credentials: true
};
