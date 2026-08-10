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

const dbUrl = Bun.env.DATABASE_URL ?? Bun.env.POSTGRES_URL ?? Bun.env.SUPABASE_DB_URL ?? "";

export const env = {
  port: Number(optional("PORT", "4000")),
  workerId: Number(optional("WORKER_ID", "1")),
  baseUrl: optional("BASE_URL", "https://localhost:4000"),

  redisUrl: required("REDIS_URL"),

  databaseUrl: dbUrl,
  supabaseUrl: optional("SUPABASE_URL", "https://cgzfvvwtmltwstvpmzzy.supabase.co"),
  supabaseServiceKey: optional("SUPABASE_SERVICE_ROLE_KEY", Bun.env.SUPABASE_ANON_KEY ?? Bun.env.SUPABASE_KEY ?? ""),

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

  kafkaBrokers: optional("KAFKA_BROKERS", "localhost:9092"),
  kafkaClientId: optional("KAFKA_CLIENT_ID", "url-shortener-backend"),
  kafkaTopic: optional("KAFKA_TOPIC", "clicks"),

  clickhouseHost: optional("CLICKHOUSE_HOST", "http://localhost:8123"),
  clickhouseUsername: optional("CLICKHOUSE_USERNAME", "default"),
  clickhousePassword: optional("CLICKHOUSE_PASSWORD", ""),
  clickhouseDatabase: optional("CLICKHOUSE_DATABASE", "default"),

  adminSecret: optional("ADMIN_SECRET", "admin-secret-key"),
} as const;

if (env.workerId < 0 || env.workerId > 1023) {
  throw new Error("WORKER_ID must be between 0 and 1023 (10-bit field)");
}