import { isNullishOrEmpty } from '@sapphire/utilities';
import type {
  GirEnv,
  GirEnvAny,
  GirEnvBoolean,
  GirEnvInteger,
  GirEnvString,
} from './types.js';

export function envParseInteger(
  key: GirEnvInteger,
  defaultValue?: number
): number {
  const value = process.env[key];
  if (isNullishOrEmpty(value)) {
    if (defaultValue === undefined)
      throw new Error(
        `[ENV] ${key} - The key must be an integer, but is empty or undefined.`
      );
    return defaultValue;
  }

  const integer = Number(value);
  if (Number.isInteger(integer)) return integer;
  throw new Error(
    `[ENV] ${key} - The key must be an integer, but received '${value}'.`
  );
}

export function envParseBoolean(
  key: GirEnvBoolean,
  defaultValue?: boolean
): boolean {
  const value = process.env[key];
  if (isNullishOrEmpty(value)) {
    if (defaultValue === undefined)
      throw new Error(
        `[ENV] ${key} - The key must be a boolean, but is empty or undefined.`
      );
    return defaultValue;
  }

  if (value === 'true') return true;
  if (value === 'false') return false;
  throw new Error(
    `[ENV] ${key} - The key must be a boolean, but received '${value}'.`
  );
}

export function envParseString<K extends GirEnvString>(
  key: K,
  defaultValue?: GirEnv[K]
): GirEnv[K] {
  const value = process.env[key];
  if (isNullishOrEmpty(value)) {
    if (defaultValue === undefined)
      throw new Error(
        `[ENV] ${key} - The key must be a string, but is empty or undefined.`
      );
    return defaultValue;
  }

  return value;
}

export function envParseArray(
  key: GirEnvString,
  defaultValue?: string[]
): string[] {
  const value = process.env[key];
  if (isNullishOrEmpty(value)) {
    if (defaultValue === undefined)
      throw new Error(
        `[ENV] ${key} - The key must be an array, but is empty or undefined.`
      );
    return defaultValue;
  }

  return value.split(' ');
}

export function envIsDefined(...keys: readonly GirEnvAny[]): boolean {
  return keys.every((key) => {
    const value = process.env[key];
    return value !== undefined && value.length !== 0;
  });
}
