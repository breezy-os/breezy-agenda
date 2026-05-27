
/** Both start and end are INCLUSIVE. */
export function createRange(start: number, end: number) {
  return new Array(end-start+1).fill(1).map((_, i) => start+i);
}