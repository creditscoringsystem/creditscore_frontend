import { clsx, ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility for merging Tailwind CSS class names with deduplication and conditional logic.
 *
 * @param inputs - List of class values (strings, objects, arrays) as accepted by clsx.
 * @returns A single merged class string, with Tailwind classes intelligently merged.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(...inputs));
}