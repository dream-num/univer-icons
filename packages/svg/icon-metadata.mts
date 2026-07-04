export type IconMetadata = {
  aliases: string[]
  category: IconCategory
  description: string
  keywords: string[]
  products: IconProduct[]
  role: IconRole
}

export type IconCategory =
  | 'brand'
  | 'chart'
  | 'collaboration'
  | 'data'
  | 'document'
  | 'editing'
  | 'formatting'
  | 'formula'
  | 'insert'
  | 'layout'
  | 'navigation'
  | 'presentation'
  | 'product'
  | 'shape'
  | 'spreadsheet'
  | 'status'
  | 'system'
  | 'view'

export type IconProduct = 'bases' | 'boards' | 'common' | 'docs' | 'sheets' | 'slides' | 'univer'

export type IconRole =
  | 'action'
  | 'data'
  | 'formatting'
  | 'layout'
  | 'navigation'
  | 'object'
  | 'product'
  | 'status'

const explicitIconMetadata = {
  'bases-multi-icon': productMetadata('bases', 'Bases product icon.'),
  'boards-multi-icon': productMetadata('boards', 'Boards product icon.'),
  'chart-icon': {
    category: 'insert',
    role: 'action',
    keywords: ['chart', 'insert', 'visualization', 'graph'],
    aliases: ['graph', 'visualization'],
    description: 'Open chart insertion tools.',
    products: ['common'],
  },
  'copy-icon': {
    category: 'editing',
    role: 'action',
    keywords: ['copy', 'duplicate', 'clipboard', 'selection', 'content'],
    aliases: ['duplicate', 'clone'],
    description: 'Copy selected content to the clipboard.',
    products: ['common'],
  },
  'docs-multi-icon': productMetadata('docs', 'Docs product icon.'),
  'loading-multi-icon': {
    category: 'status',
    role: 'status',
    keywords: ['loading', 'progress', 'spinner', 'status'],
    aliases: ['spinner', 'pending'],
    description: 'Loading status indicator icon.',
    products: ['common'],
  },
  'shape-icon': {
    category: 'insert',
    role: 'action',
    keywords: ['shape', 'insert', 'drawing', 'object'],
    aliases: ['drawing'],
    description: 'Open shape insertion tools.',
    products: ['common'],
  },
  'shape-format-setting-icon': {
    category: 'formatting',
    role: 'formatting',
    keywords: ['shape', 'format', 'setting', 'style', 'appearance'],
    aliases: ['format-settings', 'shape-settings'],
    description: 'Open shape format settings.',
    products: ['common'],
  },
  'sheets-multi-icon': productMetadata('sheets', 'Sheets product icon.'),
  'slides-multi-icon': productMetadata('slides', 'Slides product icon.'),
  'univer-cli-icon': {
    category: 'brand',
    role: 'product',
    keywords: ['univer', 'cli', 'brand', 'application', 'command line'],
    aliases: ['command-line', 'terminal'],
    description: 'Univer CLI brand icon.',
    products: ['univer'],
  },
  'univer-sdk-multi-icon': productMetadata('univer', 'Univer SDK product icon.'),
} satisfies Record<string, IconMetadata>

const chartFeatureIconNames = new Set([
  'area-chart-icon',
  'bar-chart-icon',
  'boxplot-icon',
  'bubble-icon',
  'cloud-outline-icon',
  'column-chart-icon',
  'combo-chart-icon',
  'exponential-icon',
  'funnel-icon',
  'heatmap-icon',
  'linear-icon',
  'line-chart-icon',
  'logarithmic-icon',
  'moving-average-icon',
  'pie-chart-icon',
  'polynomial-icon',
  'power-line-icon',
  'radar-chart-icon',
  'relationship-icon',
  'sankey-icon',
  'scatter-chart-icon',
  'waterfall-chart-icon',
])

const categoryMatchers: Array<{ category: IconCategory; terms: string[] }> = [
  { category: 'brand', terms: ['app'] },
  { category: 'collaboration', terms: ['comment', 'live', 'note', 'reply', 'share'] },
  { category: 'data', terms: ['database', 'filter', 'funnel', 'pivot', 'sort', 'validation'] },
  { category: 'document', terms: ['doc', 'docs', 'document', 'header', 'footer', 'text'] },
  { category: 'editing', terms: ['copy', 'cut', 'delete', 'paste', 'redo', 'restore', 'undo'] },
  {
    category: 'formatting',
    terms: [
      'align',
      'bold',
      'border',
      'color',
      'font',
      'italic',
      'strikethrough',
      'subscript',
      'superscript',
      'underline',
    ],
  },
  {
    category: 'formula',
    terms: [
      'avg',
      'cnt',
      'dollar',
      'euro',
      'function',
      'fx',
      'max',
      'min',
      'percent',
      'rmb',
      'rouble',
      'sum',
    ],
  },
  { category: 'insert', terms: ['add', 'create', 'import', 'insert'] },
  {
    category: 'layout',
    terms: ['column', 'freeze', 'grid', 'height', 'merge', 'row', 'split', 'width'],
  },
  { category: 'navigation', terms: ['arrow', 'down', 'dropdown', 'left', 'right', 'up'] },
  { category: 'presentation', terms: ['slide', 'slideshow', 'transition'] },
  {
    category: 'product',
    terms: ['bases', 'boards', 'docs', 'multi', 'sdk', 'sheets', 'slides', 'univer'],
  },
  { category: 'shape', terms: ['callout', 'connector', 'flow', 'plaque', 'shape', 'star'] },
  { category: 'spreadsheet', terms: ['autofill', 'cell', 'sheet', 'spreadsheet', 'xlsx'] },
  {
    category: 'status',
    terms: [
      'correct',
      'error',
      'exclamation',
      'hide',
      'info',
      'mistake',
      'progress',
      'signal',
      'success',
      'warn',
      'warning',
    ],
  },
  {
    category: 'system',
    terms: [
      'calendar',
      'clock',
      'code',
      'download',
      'export',
      'folder',
      'help',
      'keyboard',
      'lock',
      'menu',
      'print',
      'resources',
      'search',
      'settings',
      'upload',
    ],
  },
  { category: 'view', terms: ['eye', 'fullscreen', 'hide', 'show', 'toolbar', 'zoom'] },
]

const categoryKeywords: Record<IconCategory, string[]> = {
  brand: ['brand', 'application', 'product', 'logo'],
  chart: ['chart', 'graph', 'visualization', 'analytics'],
  collaboration: ['collaboration', 'sharing', 'annotation', 'review'],
  data: ['data', 'table', 'filtering', 'organization'],
  document: ['document', 'text', 'page', 'writing'],
  editing: ['edit', 'editing', 'command', 'content'],
  formatting: ['format', 'style', 'appearance', 'typography'],
  formula: ['formula', 'calculation', 'number', 'function'],
  insert: ['insert', 'add', 'create', 'new'],
  layout: ['layout', 'structure', 'arrangement', 'sizing'],
  navigation: ['navigation', 'direction', 'movement', 'arrow'],
  presentation: ['presentation', 'slide', 'deck', 'slideshow'],
  product: ['product', 'brand', 'application', 'module'],
  shape: ['shape', 'drawing', 'diagram', 'object'],
  spreadsheet: ['spreadsheet', 'sheet', 'cell', 'workbook'],
  status: ['status', 'state', 'feedback', 'indicator'],
  system: ['system', 'utility', 'tool', 'operation'],
  view: ['view', 'visibility', 'display', 'preview'],
}

const aliasByToken: Record<string, string[]> = {
  add: ['plus', 'new'],
  arrow: ['direction'],
  chart: ['graph', 'visualization'],
  close: ['dismiss', 'remove'],
  column: ['field'],
  copy: ['duplicate', 'clone'],
  delete: ['remove', 'trash'],
  doc: ['document'],
  docs: ['documents'],
  down: ['bottom'],
  export: ['download'],
  filter: ['funnel'],
  left: ['previous'],
  link: ['url', 'hyperlink'],
  multi: ['color', 'brand'],
  redo: ['repeat'],
  right: ['next'],
  row: ['record'],
  search: ['find', 'lookup'],
  sheet: ['spreadsheet'],
  sheets: ['spreadsheets'],
  slide: ['presentation'],
  slides: ['presentations'],
  undo: ['revert'],
  up: ['top'],
  xlsx: ['excel', 'workbook'],
}

export function createIconMetadata(iconName: string, group: string): IconMetadata {
  const explicit = explicitIconMetadata[iconName as keyof typeof explicitIconMetadata]

  if (explicit) {
    return explicit
  }

  if (chartFeatureIconNames.has(iconName)) {
    return chartFeatureMetadata(iconName)
  }

  const tokens = getNameTokens(iconName)
  const category = inferCategory(tokens, group)
  const role = inferRole(tokens, category)
  const products = inferProducts(tokens, category)
  const aliases = unique(tokens.flatMap((token) => aliasByToken[token] ?? []))
  const keywords = unique([
    ...tokens,
    ...categoryKeywords[category],
    role,
    ...products.filter((product) => product !== 'common'),
  ])

  return {
    aliases,
    category,
    description: createDescription(tokens, category, role),
    keywords,
    products,
    role,
  }
}

function productMetadata(product: IconProduct, description: string): IconMetadata {
  return {
    aliases: product === 'sheets' ? ['spreadsheet', 'workbook'] : [],
    category: 'brand',
    description,
    keywords: ['product', product, 'brand', 'application'],
    products: [product],
    role: 'product',
  }
}

function chartFeatureMetadata(iconName: string): IconMetadata {
  const tokens = getNameTokens(iconName)

  return {
    aliases: tokens.includes('cloud')
      ? ['graph', 'visualization', 'wordcloud', 'word cloud']
      : ['graph', 'visualization'],
    category: 'chart',
    description: `${createLabel(tokens)} chart feature icon.`,
    keywords: unique([...tokens, ...categoryKeywords.chart, 'chart', 'type', 'trendline']),
    products: ['sheets', 'slides'],
    role: 'object',
  }
}

function getNameTokens(iconName: string) {
  return iconName
    .replace(/-icon$/, '')
    .split('-')
    .filter((token) => token.length > 0)
}

function inferCategory(tokens: string[], group: string): IconCategory {
  if (group === 'double') {
    return tokens.some((token) => ['border', 'color', 'format'].includes(token))
      ? 'formatting'
      : 'spreadsheet'
  }

  if (tokens[0] === 'shape' && tokens.length > 1) {
    return 'shape'
  }

  return (
    categoryMatchers.find((matcher) => tokens.some((token) => matcher.terms.includes(token)))
      ?.category ?? 'system'
  )
}

function inferRole(tokens: string[], category: IconCategory): IconRole {
  if (category === 'brand' || category === 'product') {
    return 'product'
  }

  if (category === 'status') {
    return 'status'
  }

  if (category === 'chart' || category === 'shape' || category === 'document') {
    return 'object'
  }

  if (category === 'formatting') {
    return 'formatting'
  }

  if (category === 'layout') {
    return 'layout'
  }

  if (category === 'data' || category === 'formula' || category === 'spreadsheet') {
    return 'data'
  }

  if (
    category === 'navigation' ||
    tokens.some((token) => ['arrow', 'left', 'right', 'up', 'down'].includes(token))
  ) {
    return 'navigation'
  }

  return 'action'
}

function inferProducts(tokens: string[], category: IconCategory): IconProduct[] {
  if (tokens.some((token) => ['bases', 'database'].includes(token))) {
    return ['bases']
  }

  if (tokens.includes('boards')) {
    return ['boards']
  }

  if (tokens.some((token) => ['doc', 'docs', 'document'].includes(token))) {
    return ['docs']
  }

  if (
    tokens.some((token) => ['sheet', 'sheets', 'xlsx'].includes(token)) ||
    category === 'spreadsheet'
  ) {
    return ['sheets']
  }

  if (
    tokens.some((token) => ['slide', 'slides', 'slideshow', 'transition'].includes(token)) ||
    category === 'presentation'
  ) {
    return ['slides']
  }

  if (tokens.some((token) => ['univer', 'sdk'].includes(token))) {
    return ['univer']
  }

  return ['common']
}

function createDescription(tokens: string[], category: IconCategory, role: IconRole) {
  const label = createLabel(tokens)

  if (role === 'action') {
    return `${label} action icon for ${category} workflows.`
  }

  if (role === 'object') {
    return `${label} object icon for ${category} content.`
  }

  if (role === 'status') {
    return `${label} status indicator icon.`
  }

  return `${label} icon for ${category} workflows.`
}

function createLabel(tokens: string[]) {
  return tokens.map((token) => token.charAt(0).toUpperCase() + token.slice(1)).join(' ')
}

function unique<T>(items: T[]) {
  return [...new Set(items)]
}
