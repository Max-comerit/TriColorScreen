/**
 * Sanitize a string for safe use in a filename by replacing
 * Swedish/accented characters and removing any remaining non-ASCII characters.
 */
export function sanitizeFilenameSegment(value: string): string {
  return value
    .toLowerCase()
    .replace(/å/g, 'a')
    .replace(/ä/g, 'a')
    .replace(/ö/g, 'o')
    .replace(/[^a-z0-9-_]/g, '-')
}
