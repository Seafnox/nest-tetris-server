export function generateId(prefix: string): string {
  const timestamp = Date.now().toString(36);
  const salt = Math.floor(Math.random()*0xFFFFFF).toString(36);

  return `${prefix}_${timestamp}-${salt}`;
}
