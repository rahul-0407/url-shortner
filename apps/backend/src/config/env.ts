function required(name: string): string {
  const value = Bun.env[name];
  if (!value) {
    throw new Error(`Missing required env var: ${name}`)
  }
  return value;
}

function optional(name: string, fallback: string): string {
  return Bun.env[name] ?? fallback;
}

export const env = {
  port: Number(optional("PORT", "4000")),
  workerId: Number(optional("WORKER_ID", "1")),
  baseUrl: optional("BASE_URL", "http://localhost:4000"),

  redisUrl: required("REDIS_URL"),

  mongoUrl: required("MONGO_URL"),
  mongoDbName: optional("MONGO_DB_NAME", "urlshortener"),

  supabaseUrl: required("SUPABASE_URL"),

  rateLimits: {
    anon: {
      create: Number(optional("RATE_LIMIT_ANON_CREATE", "10")),
      read: Number(optional("RATE_LIMIT_ANON_READ", "100")),
    },
    free: {
      create: Number(optional("RATE_LIMIT_FREE_CREATE", "30")),
      read: Number(optional("RATE_LIMIT_FREE_READ", "1000")),
    },
    pro: {
      create: Number(optional("RATE_LIMIT_PRO_CREATE", "300")),
      read: Number(optional("RATE_LIMIT_PRO_READ", "10000")),
    },
  },
} as const;

if (env.workerId < 0 || env.workerId > 1023) {
  throw new Error("WORKER_ID must be between 0 and 1023 (10-bit field)");
}