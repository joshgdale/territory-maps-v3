/*
|--------------------------------------------------------------------------
| Environment variables service
|--------------------------------------------------------------------------
*/

import { Env } from '@adonisjs/core/env'

export default await Env.create(new URL('../', import.meta.url), {
  NODE_ENV: Env.schema.enum(['development', 'production', 'test'] as const),
  PORT: Env.schema.number(),
  HOST: Env.schema.string({ format: 'host' }),
  LOG_LEVEL: Env.schema.string(),

  APP_KEY: Env.schema.secret(),
  APP_URL: Env.schema.string({ format: 'url', tld: false }),

  SESSION_DRIVER: Env.schema.enum(['cookie', 'memory', 'database'] as const),

  LIMITER_STORE: Env.schema.enum(['database', 'memory'] as const),

  DB_HOST: Env.schema.string({ format: 'host' }),
  DB_PORT: Env.schema.number(),
  DB_USER: Env.schema.string(),
  DB_PASSWORD: Env.schema.string.optional(),
  DB_DATABASE: Env.schema.string(),

  DRIVE_DISK: Env.schema.enum(['spaces'] as const),
  SPACES_KEY: Env.schema.string(),
  SPACES_SECRET: Env.schema.string(),
  SPACES_REGION: Env.schema.string(),
  SPACES_BUCKET: Env.schema.string(),
  SPACES_ENDPOINT: Env.schema.string(),

  GOTENBERG_URL: Env.schema.string.optional({ format: 'url', tld: false }),
  /** @deprecated Prefer GOTENBERG_URL; kept as a local-dev fallback */
  GOTENBERG_ENDPOINT: Env.schema.string.optional({ format: 'url', tld: false }),
  GOTENBERG_API_BASIC_AUTH_USERNAME: Env.schema.string.optional(),
  GOTENBERG_API_BASIC_AUTH_PASSWORD: Env.schema.string.optional(),
  GOTENBERG_SECRET: Env.schema.string(),
})
