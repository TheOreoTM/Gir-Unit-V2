import { Time } from '@sapphire/duration';

/**
 * Seconds to milliseconds
 * @param seconds
 * @returns milliseconds
 */
export function sec(seconds: number): number {
  if (isNaN(seconds)) throw new Error('Input must be a valid number');
  return Time.Second * seconds;
}

/**
 * Minutes to milliseconds
 * @param minutes
 * @returns milliseconds
 */
export function mins(minutes: number): number {
  if (isNaN(minutes)) throw new Error('Input must be a valid number');
  return Time.Minute * minutes;
}
/**
 * Hours to milliseconds
 * @param hours
 * @returns milliseconds
 */
export function hours(hours: number): number {
  if (isNaN(hours)) throw new Error('Input must be a valid number');
  return Time.Hour * hours;
}

/**
 * Days to milliseconds
 * @param days
 * @returns milliseconds
 */
export function days(days: number): number {
  if (isNaN(days)) throw new Error('Input must be a valid number');
  return Time.Day * days;
}

/**
 * Months to milliseconds
 * @param months
 * @returns milliseconds
 */
export function months(months: number): number {
  if (isNaN(months)) throw new Error('Input must be a valid number');
  return Time.Month * months;
}

/**
 * Years to milliseconds
 * @param years
 * @returns milliseconds
 */
export function years(years: number): number {
  if (isNaN(years)) throw new Error('Input must be a valid number');
  return Time.Year * years;
}

export function time({
  unit,
  time,
}: {
  unit: 'sec' | 'mins' | 'hours' | 'days' | 'months' | 'years';
  time: number;
}) {
  return { sec, mins, hours, days, months, years }[unit](time);
}
