import * as ReactIcons from '@univerjs/icons'
import * as VueIcons from '@univerjs/icons-vue'
import { createElement, type CSSProperties, type ReactNode } from 'react'
import { createRoot } from 'react-dom/client'
import { createApp, h, type VNode } from 'vue'
import styles from './styles.css?inline'

type Framework = 'react' | 'vue'

type IconEntry = {
  component: unknown
  name: string
}

type IconGroup = {
  description: string
  id: IconGroupId
  subgroups: IconSubgroup[]
  title: string
}

type IconGroupId = 'double' | 'multi' | 'single'

type IconSubgroup = {
  description: string
  id: IconSubgroupId
  items: IconEntry[]
  title: string
}

type IconSubgroupId = 'double' | 'general' | 'multi' | 'shape'

const defaultSettings = {
  color: '#18181b',
  colorChannel1: '#facc15',
  size: 32,
}

const groupMeta: Array<Omit<IconGroup, 'subgroups'>> = [
  {
    id: 'single',
    title: 'Single',
    description: 'Single-color icons driven by currentColor, including shape icons.',
  },
  {
    id: 'double',
    title: 'Double',
    description: 'Icons that expose colorChannel1 for secondary fills.',
  },
  {
    id: 'multi',
    title: 'Multi',
    description: 'Document and product-style multi-color icons.',
  },
]

const subgroupMeta = {
  double: {
    id: 'double',
    title: 'Double',
    description: 'Icons with a secondary color channel.',
  },
  general: {
    id: 'general',
    title: 'General',
    description: 'Single-color utility, toolbar, document, and progress icons.',
  },
  multi: {
    id: 'multi',
    title: 'Multi',
    description: 'Multi-color document and product icons.',
  },
  shape: {
    id: 'shape',
    title: 'Shape',
    description: 'Drawing, connector, callout, arrow, and chart shape icons.',
  },
} satisfies Record<IconSubgroupId, Omit<IconSubgroup, 'items'>>

const root = document.querySelector<HTMLElement>('#app')

if (!root) {
  throw new Error('Missing #app root')
}

document.head.append(createElementStyle(styles))

if (location.pathname === '/') {
  location.replace('/react')
} else if (location.pathname === '/vue') {
  renderVueDemo(root)
} else {
  renderReactDemo(root)
}

function createIconGroups(iconModule: Record<string, unknown>): IconGroup[] {
  const groupedEntries = new Map<IconSubgroupId, IconEntry[]>()

  Object.keys(subgroupMeta).forEach((id) => groupedEntries.set(id as IconSubgroupId, []))

  Object.entries(iconModule)
    .filter(([name, component]) => name.endsWith('Icon') && Boolean(component))
    .toSorted(([nameA], [nameB]) => nameA.localeCompare(nameB))
    .forEach(([name, component]) => {
      groupedEntries.get(getIconSubgroupId(name))?.push({ component, name })
    })

  return groupMeta.map((group) => ({
    ...group,
    subgroups: getSubgroupIds(group.id).map((id) => ({
      ...subgroupMeta[id],
      items: groupedEntries.get(id) ?? [],
    })),
  }))
}

function getIconSubgroupId(name: string): IconSubgroupId {
  if (name.endsWith('DoubleIcon')) {
    return 'double'
  }

  if (name.endsWith('MultiIcon')) {
    return 'multi'
  }

  if (name.startsWith('Shape')) {
    return 'shape'
  }

  return 'general'
}

function getSubgroupIds(groupId: IconGroupId): IconSubgroupId[] {
  if (groupId === 'single') {
    return ['general', 'shape']
  }

  return [groupId]
}

function getTotalIconCount(groups: IconGroup[]) {
  return groups.reduce((count, group) => count + getGroupIconCount(group), 0)
}

function getGroupIconCount(group: IconGroup) {
  return group.subgroups.reduce((count, subgroup) => count + subgroup.items.length, 0)
}

function getDemoStyle() {
  return {
    '--icon-color': defaultSettings.color,
    '--icon-color-channel-1': defaultSettings.colorChannel1,
    '--icon-size': `${defaultSettings.size}px`,
  } as CSSProperties
}

function getExtendProps() {
  return { extend: { colorChannel1: 'var(--icon-color-channel-1)' } }
}

function renderReactDemo(container: HTMLElement) {
  const groups = createIconGroups(ReactIcons)

  createRoot(container).render(
    createElement(ReactDemoShell, {
      active: 'react',
      groups,
      packageName: '@univerjs/icons',
      totalCount: getTotalIconCount(groups),
    }),
  )
}

function ReactDemoShell({
  active,
  groups,
  packageName,
  totalCount,
}: {
  active: Framework
  groups: IconGroup[]
  packageName: string
  totalCount: number
}) {
  return createElement(
    'main',
    { className: 'demo-shell', style: getDemoStyle() },
    createElement(Header, { active }),
    createElement(Hero, { active, packageName, totalCount }),
    createElement(ReactToolbar),
    createElement(
      'section',
      { className: 'catalogue', 'aria-label': 'Icon groups' },
      groups.map((group) =>
        createElement(ReactIconGroupSection, {
          group,
          key: group.id,
        }),
      ),
    ),
  )
}

function Header({ active }: { active: Framework }) {
  return createElement(
    'header',
    { className: 'topbar' },
    createElement('div', { className: 'brand-mark' }, 'UI'),
    createElement(
      'nav',
      { className: 'switcher', 'aria-label': 'Preview framework' },
      createElement(
        'a',
        { className: active === 'react' ? 'active' : '', href: '/react' },
        'React',
      ),
      createElement('a', { className: active === 'vue' ? 'active' : '', href: '/vue' }, 'Vue'),
    ),
  )
}

function Hero({
  active,
  packageName,
  totalCount,
}: {
  active: Framework
  packageName: string
  totalCount: number
}) {
  return createElement(
    'section',
    { className: 'hero-band' },
    createElement('p', { className: 'eyebrow' }, packageName),
    createElement('h1', null, active === 'react' ? 'React icon catalog' : 'Vue icon catalog'),
    createElement(
      'p',
      { className: 'lede' },
      `${totalCount} generated icons grouped as single, double, and multi, with shape icons nested under single.`,
    ),
  )
}

function ReactToolbar() {
  return createElement(
    'section',
    { className: 'toolbar', 'aria-label': 'Icon preview controls' },
    createElement('div', { className: 'toolbar-copy' }, [
      createElement('h2', { key: 'title' }, 'Preview controls'),
      createElement('p', { key: 'copy' }, 'Tune shared icon rendering without changing imports.'),
    ]),
    createElement('div', { className: 'control-grid' }, [
      createElement(ColorControl, {
        key: 'color',
        defaultValue: defaultSettings.color,
        label: 'Color',
        name: 'color',
      }),
      createElement(ColorControl, {
        key: 'colorChannel1',
        defaultValue: defaultSettings.colorChannel1,
        label: 'colorChannel1',
        name: 'colorChannel1',
      }),
      createElement(SizeControl, { key: 'size' }),
      createElement(
        'button',
        {
          className: 'reset-button',
          key: 'reset',
          onClick: resetSettings,
          type: 'button',
        },
        'Reset',
      ),
    ]),
  )
}

function ColorControl({
  defaultValue,
  label,
  name,
}: {
  defaultValue: string
  label: string
  name: 'color' | 'colorChannel1'
}) {
  return createElement(
    'label',
    { className: 'control-field' },
    createElement('span', { className: 'control-label' }, label),
    createElement('input', {
      'data-setting-input': name,
      defaultValue,
      onInput: (event: { currentTarget: HTMLInputElement }) =>
        updateSetting(name, event.currentTarget.value),
      type: 'color',
    }),
    createElement(
      'span',
      { className: 'control-value', 'data-setting-output': name },
      defaultValue,
    ),
  )
}

function SizeControl() {
  return createElement(
    'label',
    { className: 'control-field size-control' },
    createElement('span', { className: 'control-label' }, 'Size'),
    createElement('input', {
      'data-setting-input': 'size',
      defaultValue: defaultSettings.size,
      max: 96,
      min: 16,
      onInput: (event: { currentTarget: HTMLInputElement }) =>
        updateSetting('size', event.currentTarget.value),
      type: 'range',
    }),
    createElement(
      'span',
      { className: 'control-value', 'data-setting-output': 'size' },
      `${defaultSettings.size}px`,
    ),
  )
}

function ReactIconGroupSection({ group }: { group: IconGroup }) {
  return createElement(
    'section',
    { className: 'icon-group', id: `group-${group.id}` },
    createElement(
      'div',
      { className: 'group-heading' },
      createElement('div', null, [
        createElement('p', { className: 'eyebrow', key: 'type' }, `${group.id} icons`),
        createElement('h2', { key: 'title' }, group.title),
        createElement('p', { key: 'description' }, group.description),
      ]),
      createElement('span', { className: 'count-pill' }, `${getGroupIconCount(group)}`),
    ),
    group.subgroups.map((subgroup) =>
      createElement(ReactIconSubgroupSection, {
        key: subgroup.id,
        showHeading: group.subgroups.length > 1,
        subgroup,
      }),
    ),
  )
}

function ReactIconSubgroupSection({
  showHeading,
  subgroup,
}: {
  showHeading: boolean
  subgroup: IconSubgroup
}) {
  return createElement(
    'section',
    { className: 'icon-subgroup' },
    showHeading &&
      createElement(
        'div',
        { className: 'subgroup-heading' },
        createElement('div', null, [
          createElement('h3', { key: 'title' }, subgroup.title),
          createElement('p', { key: 'description' }, subgroup.description),
        ]),
        createElement('span', { className: 'count-pill' }, `${subgroup.items.length}`),
      ),
    createElement(
      'div',
      { className: 'icon-grid' },
      subgroup.items.map((icon) => createReactIconCard(icon, subgroup.id)),
    ),
  )
}

function createReactIconCard(icon: IconEntry, subgroupId: IconSubgroupId): ReactNode {
  const Icon = icon.component as string

  return createElement(
    'article',
    { className: 'icon-card', key: icon.name },
    createElement(
      'div',
      { className: 'icon-stage' },
      createElement(Icon, {
        ...getExtendProps(),
        'aria-label': icon.name,
        className: 'sample-icon',
        role: 'img',
      }),
    ),
    createElement(
      'div',
      { className: 'icon-copy' },
      createElement('h3', null, icon.name),
      createElement('p', null, subgroupId),
    ),
  )
}

function renderVueDemo(container: HTMLElement) {
  const groups = createIconGroups(VueIcons)

  createApp({
    render() {
      return h('main', { class: 'demo-shell', style: getDemoStyle() }, [
        h(VueHeader, { active: 'vue' }),
        h(VueHero, {
          active: 'vue',
          packageName: '@univerjs/icons-vue',
          totalCount: getTotalIconCount(groups),
        }),
        h(VueToolbar),
        h(
          'section',
          { class: 'catalogue', 'aria-label': 'Icon groups' },
          groups.map((group) => h(VueIconGroupSection, { group, key: group.id })),
        ),
      ])
    },
  }).mount(container)
}

function VueHeader(props: { active: Framework }): VNode {
  return h('header', { class: 'topbar' }, [
    h('div', { class: 'brand-mark' }, 'UI'),
    h('nav', { class: 'switcher', 'aria-label': 'Preview framework' }, [
      h('a', { class: props.active === 'react' ? 'active' : '', href: '/react' }, 'React'),
      h('a', { class: props.active === 'vue' ? 'active' : '', href: '/vue' }, 'Vue'),
    ]),
  ])
}

function VueHero(props: { active: Framework; packageName: string; totalCount: number }): VNode {
  return h('section', { class: 'hero-band' }, [
    h('p', { class: 'eyebrow' }, props.packageName),
    h('h1', null, props.active === 'react' ? 'React icon catalog' : 'Vue icon catalog'),
    h(
      'p',
      { class: 'lede' },
      `${props.totalCount} generated icons grouped as single, double, and multi, with shape icons nested under single.`,
    ),
  ])
}

function VueToolbar(): VNode {
  return h('section', { class: 'toolbar', 'aria-label': 'Icon preview controls' }, [
    h('div', { class: 'toolbar-copy' }, [
      h('h2', null, 'Preview controls'),
      h('p', null, 'Tune shared icon rendering without changing imports.'),
    ]),
    h('div', { class: 'control-grid' }, [
      createVueColorControl('color', 'Color', defaultSettings.color),
      createVueColorControl('colorChannel1', 'colorChannel1', defaultSettings.colorChannel1),
      createVueSizeControl(),
      h(
        'button',
        {
          class: 'reset-button',
          onClick: resetSettings,
          type: 'button',
        },
        'Reset',
      ),
    ]),
  ])
}

function createVueColorControl(
  name: 'color' | 'colorChannel1',
  label: string,
  defaultValue: string,
): VNode {
  return h('label', { class: 'control-field' }, [
    h('span', { class: 'control-label' }, label),
    h('input', {
      'data-setting-input': name,
      onInput: (event: Event) =>
        updateSetting(name, (event.currentTarget as HTMLInputElement).value),
      type: 'color',
      value: defaultValue,
    }),
    h('span', { class: 'control-value', 'data-setting-output': name }, defaultValue),
  ])
}

function createVueSizeControl(): VNode {
  return h('label', { class: 'control-field size-control' }, [
    h('span', { class: 'control-label' }, 'Size'),
    h('input', {
      'data-setting-input': 'size',
      max: 96,
      min: 16,
      onInput: (event: Event) =>
        updateSetting('size', (event.currentTarget as HTMLInputElement).value),
      type: 'range',
      value: defaultSettings.size,
    }),
    h(
      'span',
      { class: 'control-value', 'data-setting-output': 'size' },
      `${defaultSettings.size}px`,
    ),
  ])
}

function VueIconGroupSection(props: { group: IconGroup }): VNode {
  return h('section', { class: 'icon-group', id: `group-${props.group.id}` }, [
    h('div', { class: 'group-heading' }, [
      h('div', null, [
        h('p', { class: 'eyebrow' }, `${props.group.id} icons`),
        h('h2', null, props.group.title),
        h('p', null, props.group.description),
      ]),
      h('span', { class: 'count-pill' }, `${getGroupIconCount(props.group)}`),
    ]),
    props.group.subgroups.map((subgroup) =>
      h(VueIconSubgroupSection, {
        key: subgroup.id,
        showHeading: props.group.subgroups.length > 1,
        subgroup,
      }),
    ),
  ])
}

function VueIconSubgroupSection(props: { showHeading: boolean; subgroup: IconSubgroup }): VNode {
  return h('section', { class: 'icon-subgroup' }, [
    props.showHeading &&
      h('div', { class: 'subgroup-heading' }, [
        h('div', null, [
          h('h3', null, props.subgroup.title),
          h('p', null, props.subgroup.description),
        ]),
        h('span', { class: 'count-pill' }, `${props.subgroup.items.length}`),
      ]),
    h(
      'div',
      { class: 'icon-grid' },
      props.subgroup.items.map((icon) => createVueIconCard(icon, props.subgroup.id)),
    ),
  ])
}

function createVueIconCard(icon: IconEntry, subgroupId: IconSubgroupId): VNode {
  return h('article', { class: 'icon-card', key: icon.name }, [
    h('div', { class: 'icon-stage' }, [
      h(icon.component, {
        ...getExtendProps(),
        'aria-label': icon.name,
        class: 'sample-icon',
        role: 'img',
      }),
    ]),
    h('div', { class: 'icon-copy' }, [h('h3', null, icon.name), h('p', null, subgroupId)]),
  ])
}

function updateSetting(name: 'color' | 'colorChannel1' | 'size', value: string) {
  const shell = document.querySelector<HTMLElement>('.demo-shell')
  const cssValue = name === 'size' ? `${value}px` : value

  shell?.style.setProperty(getCssVariableName(name), cssValue)
  updateSettingOutput(name, cssValue)
}

function resetSettings() {
  const values = {
    color: defaultSettings.color,
    colorChannel1: defaultSettings.colorChannel1,
    size: `${defaultSettings.size}`,
  }

  Object.entries(values).forEach(([name, value]) => {
    const input = document.querySelector<HTMLInputElement>(`[data-setting-input="${name}"]`)

    if (input) {
      input.value = value
    }

    updateSetting(name as 'color' | 'colorChannel1' | 'size', value)
  })
}

function getCssVariableName(name: 'color' | 'colorChannel1' | 'size') {
  if (name === 'colorChannel1') {
    return '--icon-color-channel-1'
  }

  if (name === 'size') {
    return '--icon-size'
  }

  return '--icon-color'
}

function updateSettingOutput(name: 'color' | 'colorChannel1' | 'size', value: string) {
  document.querySelectorAll<HTMLElement>(`[data-setting-output="${name}"]`).forEach((element) => {
    element.textContent = value
  })
}

function createElementStyle(css: string) {
  const style = document.createElement('style')
  style.textContent = css
  return style
}
