import { v4 } from 'uuid';

/**
 * It uses the uuidv4() function
 * @returns A string of random characters.
 */
export function uid() {
  return v4();
}
