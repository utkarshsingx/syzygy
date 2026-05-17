type ClassValue = string | undefined | null | false | 0 | Record<string, boolean | undefined | null>;

// Lightweight conditional class joiner for NativeWind className strings.
// Accepts strings, falsy values, or { 'class-name': boolean } maps.
export function cn(...args: ClassValue[]): string {
  const out: string[] = [];
  for (const a of args) {
    if (!a) continue;
    if (typeof a === 'string') {
      out.push(a);
    } else if (typeof a === 'object') {
      for (const [k, v] of Object.entries(a)) {
        if (v) out.push(k);
      }
    }
  }
  return out.join(' ');
}
