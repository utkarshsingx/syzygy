// Crockford base32 — excludes I/L/O/U to avoid visual ambiguity in sharing.
const ALPHABET = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';

// 8-char invite code (~40 bits of entropy — plenty for the lifetime of a 14-day code).
export function generateInviteCode(length = 8): string {
  let out = '';
  for (let i = 0; i < length; i++) {
    out += ALPHABET.charAt(Math.floor(Math.random() * ALPHABET.length));
  }
  return out;
}

export function isValidInviteCode(code: string): boolean {
  if (code.length !== 8) return false;
  for (let i = 0; i < code.length; i++) {
    if (!ALPHABET.includes(code[i]!)) return false;
  }
  return true;
}
