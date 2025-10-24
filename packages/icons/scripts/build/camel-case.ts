export function camelCase(str: string): string {
  return str.replace(/-([a-z])/g, (_m, p1) => p1.toUpperCase())
}
