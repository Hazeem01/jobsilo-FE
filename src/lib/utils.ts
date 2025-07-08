import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Utility functions for safe data access and error handling

/**
 * Safely access nested object properties
 */
export function safeGet<T>(obj: any, path: string, defaultValue: T): T {
  try {
    return path.split('.').reduce((current, key) => {
      return current && current[key] !== undefined ? current[key] : defaultValue;
    }, obj);
  } catch {
    return defaultValue;
  }
}

/**
 * Safely convert a value to string with fallback
 */
export function safeToString(value: any, fallback: string = '0'): string {
  if (value === null || value === undefined) {
    return fallback;
  }
  try {
    return String(value);
  } catch {
    return fallback;
  }
}

/**
 * Safely format a number with locale
 */
export function safeNumberFormat(value: any, fallback: string = '0'): string {
  if (value === null || value === undefined) {
    return fallback;
  }
  try {
    const num = Number(value);
    return isNaN(num) ? fallback : num.toLocaleString();
  } catch {
    return fallback;
  }
}

/**
 * Safely format a date
 */
export function safeDateFormat(dateString: any, fallback: string = 'Date unknown'): string {
  if (!dateString) {
    return fallback;
  }
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return fallback;
    }
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch {
    return fallback;
  }
}

/**
 * Safely access array with fallback
 */
export function safeArray<T>(arr: any, fallback: T[] = []): T[] {
  if (!Array.isArray(arr)) {
    return fallback;
  }
  return arr;
}

/**
 * Check if a value is a valid object
 */
export function isValidObject(value: any): boolean {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

/**
 * Get initials from a name string
 */
export function getInitials(name: string | null | undefined, fallback: string = 'U'): string {
  if (!name || typeof name !== 'string') {
    return fallback;
  }
  try {
    return name.split(' ').map(n => n[0]).join('').toUpperCase() || fallback;
  } catch {
    return fallback;
  }
}

/**
 * Handle API error responses
 */
export function handleApiError(error: any): string {
  if (error?.response?.data?.error?.message) {
    return error.response.data.error.message;
  }
  if (error?.message) {
    return error.message;
  }
  return 'An unexpected error occurred';
}
