/**
 * force a numeric value to fall within lower/upper boundary
 * @param lowerBoundary
 * @param upperBoundary
 * @param value
 */
export function guard(lowerBoundary: number, upperBoundary: number, value: number): number {
  return Math.max(lowerBoundary, Math.min(upperBoundary, value));
}
