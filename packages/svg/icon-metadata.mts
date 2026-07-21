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
  'ai-assistant-multi-icon': {
    aliases: ['ai', 'assistant', 'automation'],
    category: 'collaboration',
    description: 'AI assistant source indicator.',
    keywords: ['ai', 'assistant', 'history', 'origin', 'collaboration', 'automation'],
    products: ['common'],
    role: 'status',
  },
  'bases-multi-icon': productMetadata('bases', 'Bases product icon.'),
  'boards-multi-icon': productMetadata('boards', 'Boards product icon.'),
  'callout-icon': {
    aliases: ['text-callout', 'annotation'],
    category: 'insert',
    description: 'Open callout insertion tools.',
    keywords: ['callout', 'annotation', 'insert', 'text', 'toolbar'],
    products: ['common'],
    role: 'action',
  },
  'chart-icon': {
    category: 'insert',
    role: 'action',
    keywords: ['chart', 'insert', 'visualization', 'graph'],
    aliases: ['graph', 'visualization'],
    description: 'Open chart insertion tools.',
    products: ['common'],
  },
  'checkbox-icon': {
    aliases: ['check-box', 'data-validation-checkbox'],
    category: 'insert',
    description: 'Insert checkboxes into selected spreadsheet cells.',
    keywords: ['checkbox', 'check', 'insert', 'cell', 'sheets', 'data-validation'],
    products: ['sheets'],
    role: 'action',
  },
  'color-wheel-multi-icon': {
    aliases: ['palette', 'color-picker'],
    category: 'formatting',
    description: 'Open a color wheel picker.',
    keywords: ['color', 'wheel', 'palette', 'picker', 'format', 'appearance'],
    products: ['common'],
    role: 'formatting',
  },
  'convert-to-number-icon': {
    aliases: ['number-conversion', 'numeric-conversion', 'to-number'],
    category: 'data',
    description: 'Convert selected values to numbers.',
    keywords: ['sheets', 'convert', 'number', 'numeric', 'type', 'conversion', 'data'],
    products: ['sheets'],
    role: 'action',
  },
  'delete-table-double-icon': {
    aliases: ['remove-table', 'drop-table'],
    category: 'editing',
    description: 'Delete a table from a document.',
    keywords: ['docs', 'delete', 'remove', 'table', 'grid'],
    products: ['docs'],
    role: 'action',
  },
  'class-diagram-class-icon': boardDiagramMetadata('UML class diagram table shape.'),
  'class-diagram-dashed-filled-arrow-connector-icon': boardConnectorMetadata(
    'UML dashed connector with filled arrow marker.',
  ),
  'class-diagram-dashed-open-arrow-connector-icon': boardConnectorMetadata(
    'UML dashed connector with open arrow marker.',
  ),
  'class-diagram-filled-arrow-connector-icon': boardConnectorMetadata(
    'UML connector with filled arrow marker.',
  ),
  'class-diagram-filled-diamond-connector-icon': boardConnectorMetadata(
    'UML connector with filled diamond marker.',
  ),
  'class-diagram-hollow-diamond-connector-icon': boardConnectorMetadata(
    'UML connector with hollow diamond marker.',
  ),
  'class-diagram-interface-icon': boardDiagramMetadata('UML interface diagram table shape.'),
  'component-diagram-assembly-connector-icon': boardDiagramMetadata(
    'UML component assembly connector shape.',
  ),
  'component-diagram-component-box-icon': boardDiagramMetadata('UML component box shape.'),
  'component-diagram-component-icon': boardDiagramMetadata('UML component shape.'),
  'component-diagram-provided-interface-icon': boardDiagramMetadata(
    'UML provided interface shape.',
  ),
  'component-diagram-required-interface-icon': boardDiagramMetadata(
    'UML required interface shape.',
  ),
  'connector-bar-crows-foot-marker-icon': boardConnectorMetadata('Connector bar crow foot marker.'),
  'connector-bar-marker-icon': boardConnectorMetadata('Connector bar marker.'),
  'connector-circle-bar-marker-icon': boardConnectorMetadata('Connector circle bar marker.'),
  'connector-circle-crows-foot-marker-icon': boardConnectorMetadata(
    'Connector circle crow foot marker.',
  ),
  'connector-circle-marker-icon': boardConnectorMetadata('Connector circle marker.'),
  'connector-cross-marker-icon': boardConnectorMetadata('Connector cross marker.'),
  'connector-crows-foot-marker-icon': boardConnectorMetadata('Connector crow foot marker.'),
  'connector-filled-arrow-marker-icon': boardConnectorMetadata('Connector filled arrow marker.'),
  'connector-filled-circle-marker-icon': boardConnectorMetadata('Connector filled circle marker.'),
  'connector-filled-diamond-marker-icon': boardConnectorMetadata(
    'Connector filled diamond marker.',
  ),
  'connector-hollow-diamond-marker-icon': boardConnectorMetadata(
    'Connector hollow diamond marker.',
  ),
  'connector-hollow-triangle-marker-icon': boardConnectorMetadata(
    'Connector hollow triangle marker.',
  ),
  'connector-none-marker-icon': boardConnectorMetadata('Connector without marker.'),
  'connector-open-arrow-marker-icon': boardConnectorMetadata('Connector open arrow marker.'),
  'connector-rounded-elbow-icon': boardConnectorMetadata('Rounded elbow connector.'),
  'connector-swap-markers-icon': boardConnectorMetadata('Swap connector start and end markers.'),
  'connector-x-marker-icon': boardConnectorMetadata('Connector X marker.'),
  'copy-icon': {
    category: 'editing',
    role: 'action',
    keywords: ['copy', 'duplicate', 'clipboard', 'selection', 'content'],
    aliases: ['duplicate', 'clone'],
    description: 'Copy selected content to the clipboard.',
    products: ['common'],
  },
  'data-flow-circle-icon': boardDiagramMetadata('Data flow circle shape.'),
  'data-flow-data-storage1-icon': boardDiagramMetadata('Data flow storage shape.'),
  'data-flow-data-storage2-icon': boardDiagramMetadata('Data flow storage shape with divider.'),
  'data-flow-data-storage3-icon': boardDiagramMetadata('Data flow storage record shape.'),
  'data-flow-rounded-rectangle-icon': boardDiagramMetadata('Data flow rounded rectangle shape.'),
  'data-flow-rounded-square-icon': boardDiagramMetadata('Data flow rounded square shape.'),
  'data-bar-icon': {
    aliases: ['progress-bar', 'conditional-formatting-data-bar'],
    category: 'insert',
    description: 'Insert data bars into selected spreadsheet cells.',
    keywords: ['data', 'bar', 'progress', 'insert', 'cell', 'sheets', 'conditional-formatting'],
    products: ['sheets'],
    role: 'action',
  },
  'date-picker-icon': {
    aliases: ['calendar-cell', 'date-validation'],
    category: 'insert',
    description: 'Insert date pickers into selected spreadsheet cells.',
    keywords: ['date', 'calendar', 'picker', 'insert', 'cell', 'sheets', 'data-validation'],
    products: ['sheets'],
    role: 'action',
  },
  'docs-multi-icon': productMetadata('docs', 'Docs product icon.'),
  'dropdown-list-icon': {
    aliases: ['drop-down-list', 'data-validation-list'],
    category: 'insert',
    description: 'Open dropdown list insertion tools for spreadsheet cells.',
    keywords: ['dropdown', 'list', 'options', 'insert', 'cell', 'sheets', 'data-validation'],
    products: ['sheets'],
    role: 'action',
  },
  'entity-relationship-entity-icon': boardDiagramMetadata('Entity relationship entity table.'),
  'entity-relationship-field-type-icon': boardDiagramMetadata(
    'Entity relationship field type table.',
  ),
  'entity-relationship-full-icon': boardDiagramMetadata('Entity relationship full table.'),
  'entity-relationship-key-field-icon': boardDiagramMetadata(
    'Entity relationship key field table.',
  ),
  'database-function-icon': functionCategoryMetadata('Open database functions.', [
    'data',
    'storage',
  ]),
  'date-function-icon': functionCategoryMetadata('Open date and time functions.', [
    'calendar',
    'clock',
    'time',
  ]),
  'engineering-function-icon': functionCategoryMetadata('Open engineering functions.', [
    'ruler',
    'set-square',
  ]),
  'financial-function-icon': functionCategoryMetadata('Open financial functions.', [
    'currency',
    'money',
  ]),
  'information-function-icon': functionCategoryMetadata('Open information functions.', ['info']),
  'logical-function-icon': functionCategoryMetadata('Open logical functions.', [
    'boolean',
    'condition',
  ]),
  'lookup-function-icon': functionCategoryMetadata('Open lookup and reference functions.', [
    'reference',
    'search',
  ]),
  'math-function-icon': functionCategoryMetadata('Open math and trigonometry functions.', [
    'radical',
    'trigonometry',
  ]),
  'statistical-function-icon': functionCategoryMetadata('Open statistical functions.', [
    'distribution',
    'statistics',
  ]),
  'text-function-icon': functionCategoryMetadata('Open text functions.', ['string']),
  'formula-accent-icon': formulaMenuMetadata('Open formula accent templates.', [
    'accent',
    'hat',
    'overline',
  ]),
  'formula-bracket-icon': formulaMenuMetadata('Open formula bracket templates.', [
    'bracket',
    'delimiter',
    'parentheses',
  ]),
  'formula-fraction-icon': formulaMenuMetadata('Open formula fraction templates.', [
    'division',
    'fraction',
  ]),
  'formula-function-icon': formulaMenuMetadata('Open formula function templates.', [
    'function',
    'fx',
  ]),
  'formula-integral-icon': formulaMenuMetadata('Open formula integral templates.', [
    'calculus',
    'integral',
  ]),
  'formula-large-operator-icon': formulaMenuMetadata('Open large formula operator templates.', [
    'large-operator',
    'product',
    'summation',
  ]),
  'formula-limit-logarithm-icon': formulaMenuMetadata(
    'Open formula limit and logarithm templates.',
    ['infinity', 'limit', 'logarithm'],
  ),
  'formula-matrix-icon': formulaMenuMetadata('Open formula matrix templates.', ['array', 'matrix']),
  'formula-operator-icon': formulaMenuMetadata('Open formula operator templates.', [
    'operator',
    'plus-minus',
  ]),
  'formula-radical-icon': formulaMenuMetadata('Open formula radical templates.', [
    'radical',
    'root',
    'square-root',
  ]),
  'formula-script-icon': formulaMenuMetadata('Open formula script templates.', [
    'script',
    'subscript',
    'superscript',
  ]),
  'loading-multi-icon': {
    category: 'status',
    role: 'status',
    keywords: ['loading', 'progress', 'spinner', 'status'],
    aliases: ['spinner', 'pending'],
    description: 'Loading status indicator icon.',
    products: ['common'],
  },
  'locate-fixed-icon': {
    aliases: ['focus-object', 'center-selection'],
    category: 'navigation',
    description: 'Locate and focus a fixed object on the canvas.',
    keywords: ['locate', 'focus', 'object', 'canvas', 'target', 'navigation'],
    products: ['common'],
    role: 'navigation',
  },
  'line-dashed-none-icon': lineMarkerMetadata('Dashed line without arrowheads.'),
  'line-double-open-arrow-icon': lineMarkerMetadata('Line with open arrowheads at both ends.'),
  'line-indent-decrease-icon': lineIndentMetadata('Decrease paragraph line indentation.'),
  'line-indent-increase-icon': lineIndentMetadata('Increase paragraph line indentation.'),
  'line-none-icon': lineMarkerMetadata('Line without arrowheads.'),
  'line-open-arrow-icon': lineMarkerMetadata('Line with an open arrowhead.'),
  'object-layers-icon': {
    aliases: ['layers-panel', 'object-list'],
    category: 'layout',
    description: 'Open the panel for managing layered floating objects.',
    keywords: ['layers', 'objects', 'panel', 'manage', 'images', 'shapes', 'floating'],
    products: ['common'],
    role: 'action',
  },
  'configure-tab-icon': tabMetadata('Configure the active view tab.', ['bases']),
  'first-tab-icon': tabMetadata('Set a view as the first tab.', ['bases']),
  'quick-add-icon': {
    aliases: ['smart-add', 'insert-shape'],
    category: 'insert',
    description: 'Toggle quick add tools.',
    keywords: ['quick', 'add', 'insert', 'shape', 'sparkle', 'boards'],
    products: ['boards'],
    role: 'action',
  },
  'rating-icon': {
    aliases: ['rating-cell', 'conditional-formatting-icon-set'],
    category: 'insert',
    description: 'Insert rating or status icons into selected spreadsheet cells.',
    keywords: ['rating', 'status', 'star', 'insert', 'cell', 'sheets', 'conditional-formatting'],
    products: ['sheets'],
    role: 'action',
  },
  'row-height-extra-tall-icon': rowHeightMetadata('Extra tall row height preset.'),
  'row-height-medium-icon': rowHeightMetadata('Medium row height preset.'),
  'row-height-short-icon': rowHeightMetadata('Short row height preset.'),
  'row-height-tall-icon': rowHeightMetadata('Tall row height preset.'),
  'sequence-activation-bar-icon': sequenceLifelineMetadata('Sequence activation bar.'),
  'sequence-actor-lifeline-icon': sequenceLifelineMetadata('Sequence actor lifeline.'),
  'sequence-boundary-lifeline-icon': sequenceLifelineMetadata('Sequence boundary lifeline.'),
  'sequence-collection-lifeline-icon': sequenceLifelineMetadata('Sequence collection lifeline.'),
  'sequence-control-lifeline-icon': sequenceLifelineMetadata('Sequence control lifeline.'),
  'sequence-direct-access-storage-lifeline-icon': sequenceLifelineMetadata(
    'Sequence direct access storage lifeline.',
  ),
  'sequence-entity-lifeline-icon': sequenceLifelineMetadata('Sequence entity lifeline.'),
  'sequence-fragment-icon': boardDiagramMetadata('Sequence fragment table shape.'),
  'sequence-alternative-fragment-icon': boardDiagramMetadata(
    'Sequence alternative fragment table shape.',
  ),
  'sequence-magnetic-disk-lifeline-icon': sequenceLifelineMetadata(
    'Sequence magnetic disk lifeline.',
  ),
  'sequence-object-lifeline-icon': sequenceLifelineMetadata('Sequence object lifeline.'),
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
  'shrink-to-fit-icon': {
    aliases: ['fit-text', 'shrink-text'],
    category: 'formatting',
    description: 'Shrink cell text to fit within the available width.',
    keywords: ['sheets', 'cell', 'text', 'shrink', 'fit', 'format'],
    products: ['sheets'],
    role: 'formatting',
  },
  'sheets-multi-icon': productMetadata('sheets', 'Sheets product icon.'),
  'slides-multi-icon': productMetadata('slides', 'Slides product icon.'),
  'status-diagram-final-state-icon': boardDiagramMetadata('Status final state shape.'),
  'status-diagram-initial-state-icon': boardDiagramMetadata('Status initial state shape.'),
  'status-diagram-state-bar-icon': boardDiagramMetadata('Status state bar shape.'),
  'stroke-size1-icon': strokeSizeMetadata('Stroke size preset 1.'),
  'stroke-size2-icon': strokeSizeMetadata('Stroke size preset 2.'),
  'stroke-size3-icon': strokeSizeMetadata('Stroke size preset 3.'),
  'stroke-size4-icon': strokeSizeMetadata('Stroke size preset 4.'),
  'stroke-size5-icon': strokeSizeMetadata('Stroke size preset 5.'),
  'table-border-style-dashed-icon': tableBorderMetadata('Table dashed border style.'),
  'table-border-style-dotted-icon': tableBorderMetadata('Table dotted border style.'),
  'table-border-style-icon': tableBorderMetadata('Open table border style menu.'),
  'table-border-style-solid-icon': tableBorderMetadata('Table solid border style.'),
  'table-border-width-icon': tableBorderMetadata('Open table border width menu.'),
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
  'candlestick-chart-icon',
  'chord-chart-icon',
  'cloud-outline-icon',
  'column-chart-icon',
  'combo-chart-icon',
  'exponential-icon',
  'funnel-icon',
  'gauge-chart-icon',
  'heatmap-icon',
  'histogram-chart-icon',
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
  'sunburst-chart-icon',
  'treemap-chart-icon',
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

function tabMetadata(description: string, products: IconProduct[]): IconMetadata {
  return {
    aliases: ['view-tab'],
    category: 'navigation',
    description,
    keywords: unique(['view', 'tab', 'navigation', 'settings', ...products]),
    products,
    role: 'action',
  }
}

function rowHeightMetadata(description: string): IconMetadata {
  return {
    aliases: ['record-height', 'row-size'],
    category: 'layout',
    description,
    keywords: ['bases', 'row', 'height', 'record', 'layout', 'size'],
    products: ['bases'],
    role: 'layout',
  }
}

function tableBorderMetadata(description: string): IconMetadata {
  return {
    aliases: ['border-format'],
    category: 'formatting',
    description,
    keywords: ['docs', 'table', 'border', 'style', 'width', 'format'],
    products: ['docs'],
    role: 'formatting',
  }
}

function lineIndentMetadata(description: string): IconMetadata {
  return {
    aliases: ['paragraph-indent', 'text-indent'],
    category: 'formatting',
    description,
    keywords: ['docs', 'line', 'indent', 'paragraph', 'text', 'format'],
    products: ['docs'],
    role: 'formatting',
  }
}

function functionCategoryMetadata(description: string, aliases: string[]): IconMetadata {
  return {
    aliases,
    category: 'formula',
    description,
    keywords: unique([
      'sheets',
      'formula',
      'function',
      'function-category',
      'function-menu',
      ...aliases,
    ]),
    products: ['sheets'],
    role: 'action',
  }
}

function formulaMenuMetadata(description: string, aliases: string[]): IconMetadata {
  return {
    aliases,
    category: 'formula',
    description,
    keywords: unique([
      'docs',
      'latex',
      'formula',
      'formula-menu',
      'equation',
      'template',
      ...aliases,
    ]),
    products: ['docs'],
    role: 'action',
  }
}

function strokeSizeMetadata(description: string): IconMetadata {
  return {
    aliases: ['line-width', 'brush-size', 'pen-size'],
    category: 'formatting',
    description,
    keywords: ['stroke-size', 'stroke', 'width', 'line', 'brush', 'pen', 'format', 'size'],
    products: ['common'],
    role: 'formatting',
  }
}

function lineMarkerMetadata(description: string): IconMetadata {
  return {
    aliases: ['connector', 'diagram-line'],
    category: 'shape',
    description,
    keywords: ['diagram', 'line', 'connector', 'arrow', 'shape', 'boards', 'slides'],
    products: ['boards', 'slides'],
    role: 'object',
  }
}

function boardConnectorMetadata(description: string): IconMetadata {
  return {
    aliases: ['line', 'connector-marker', 'diagram-connector'],
    category: 'shape',
    description,
    keywords: ['diagram', 'line', 'connector', 'marker', 'arrow', 'boards', 'slides', 'shape'],
    products: ['boards', 'slides'],
    role: 'object',
  }
}

function boardDiagramMetadata(description: string): IconMetadata {
  return {
    aliases: ['diagram', 'board-shape'],
    category: 'shape',
    description,
    keywords: ['diagram', 'shape', 'boards', 'slides', 'uml', 'table', 'object'],
    products: ['boards', 'slides'],
    role: 'object',
  }
}

function sequenceLifelineMetadata(description: string): IconMetadata {
  return {
    aliases: ['uml', 'lifeline', 'sequence-diagram'],
    category: 'shape',
    description,
    keywords: ['diagram', 'sequence', 'lifeline', 'line', 'connector', 'uml', 'boards', 'slides'],
    products: ['boards', 'slides'],
    role: 'object',
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
