import { v4 as uuid } from 'uuid';
/**
 * It uses the uuidv4() function
 * @returns A string of random characters.
 */
export function uid() {
  return uuid();
}
