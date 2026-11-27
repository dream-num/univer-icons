import type { IconEntry } from './catalogue.ts'
import { defaultDemoState } from './state.ts'

export type SnippetPreviewSettings = {
  color: string
  colorChannel1: string
  preserveStrokeWidth: boolean
  size: number
}

export function buildReactSnippet(icon: IconEntry, settings: SnippetPreviewSettings): string {
  const props: string[] = []

  if (settings.preserveStrokeWidth && icon.preserveStrokeWidthSupport === 'full') {
    props.push('preserveStrokeWidth')
  }

  if (
    icon.group === 'double' &&
    settings.colorChannel1.toLowerCase() !== defaultDemoState.colorChannel1
  ) {
    props.push(`extend={{ colorChannel1: '${settings.colorChannel1}' }}`)
  }

  const styleEntries: string[] = []
  if (icon.group !== 'multi' && settings.color.toLowerCase() !== defaultDemoState.color) {
    styleEntries.push(`color: '${settings.color}'`)
  }
  if (settings.size !== defaultDemoState.size) {
    styleEntries.push(`fontSize: '${settings.size}px'`)
  }

  if (styleEntries.length > 0) {
    props.push(`style={{ ${styleEntries.join(', ')} }}`)
  }

  const jsx = props.length > 0 ? `<${icon.name} ${props.join(' ')} />` : `<${icon.name} />`

  return `import { ${icon.name} } from '@univerjs/icons'\n\nexport function Example() {\n  return ${jsx}\n}`
}

export function buildVueSnippet(icon: IconEntry, settings: SnippetPreviewSettings): string {
  const props: string[] = []

  if (settings.preserveStrokeWidth && icon.preserveStrokeWidthSupport === 'full') {
    props.push('preserve-stroke-width')
  }

  if (
    icon.group === 'double' &&
    settings.colorChannel1.toLowerCase() !== defaultDemoState.colorChannel1
  ) {
    props.push(`:extend="{ colorChannel1: '${settings.colorChannel1}' }"`)
  }

  const styleEntries: string[] = []
  if (icon.group !== 'multi' && settings.color.toLowerCase() !== defaultDemoState.color) {
    styleEntries.push(`color: ${settings.color}`)
  }
  if (settings.size !== defaultDemoState.size) {
    styleEntries.push(`font-size: ${settings.size}px`)
  }

  if (styleEntries.length > 0) {
    props.push(`style="${styleEntries.join('; ')}"`)
  }

  const templateTag = props.length > 0 ? `<${icon.name} ${props.join(' ')} />` : `<${icon.name} />`

  return `<script setup lang="ts">\nimport { ${icon.name} } from '@univerjs/icons-vue'\n</script>\n\n<template>\n  ${templateTag}\n</template>`
}

export function buildExportSvg(icon: IconEntry, settings: SnippetPreviewSettings): string {
  return icon.svg
    .replaceAll('var(--icon-color-channel-1)', settings.colorChannel1)
    .replaceAll('width="1em" height="1em"', `width="${settings.size}" height="${settings.size}"`)
}
