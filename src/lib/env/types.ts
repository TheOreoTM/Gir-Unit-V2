export type BooleanString = 'true' | 'false';
export type IntegerString = `${bigint}`;

export type GirEnvAny = keyof GirEnv;
export type GirEnvString = {
  [K in GirEnvAny]: GirEnv[K] extends BooleanString | IntegerString ? never : K;
}[GirEnvAny];
export type GirEnvBoolean = {
  [K in GirEnvAny]: GirEnv[K] extends BooleanString ? K : string;
}[GirEnvAny];
export type GirEnvInteger = {
  [K in GirEnvAny]: GirEnv[K] extends IntegerString ? K : string;
}[GirEnvAny];

export interface GirEnv {
  NODE_ENV?: 'test' | 'development' | 'production';
  DOTENV_DEBUG_ENABLED?: BooleanString;

  CLIENT_NAME?: string;
  CLIENT_VERSION?: string;
  CLIENT_PREFIX?: string;
  CLIENT_REGEX_PREFIX?: string;
  CLIENT_OWNERS?: string;
  CLIENT_ID?: string;
  CLIENT_SHARDS?: string;

  CLIENT_PRESENCE_NAME?: string;
  CLIENT_PRESENCE_TYPE?: string;

  HASTEBIN_POST_URL?: string;
  HASTEBIN_GET_URL?: string;

  WEBHOOK_ERROR_ENABLED?: BooleanString;
  WEBHOOK_ERROR_ID?: string;
  WEBHOOK_ERROR_TOKEN?: string;

  DISCORD_TOKEN?: string;
  MONGO?: string;

  VOID_BOT_TOKEN?: string;
  TOP_BOT_TOKEN?: string;

  REDIS_PORT?: string;
  REDIS_PASSWORD?: string;
  REDIS_HOST?: string;
}
