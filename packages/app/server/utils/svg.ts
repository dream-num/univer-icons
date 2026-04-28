export function validateSvg(content: string): boolean {
  const trimmed = content.trim().toLowerCase()
  return trimmed.startsWith('<svg') && trimmed.endsWith('</svg>')
}
