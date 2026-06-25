import assert from 'node:assert/strict'
import { createSvgIconGroups } from './svg-catalogue.ts'

const groups = createSvgIconGroups({
  '../../svg/double/copy-double-icon.svg': '<svg><path /></svg>',
  '../../svg/other/doc-multi-icon.svg': '<svg><path /></svg>',
  '../../svg/single/shape-star-icon.svg': '<svg><path /></svg>',
  '../../svg/single/zoom-icon.svg': '<svg><path /></svg>',
})

assert.deepEqual(
  groups.map((group) => ({
    id: group.id,
    subgroups: group.subgroups.map((subgroup) => ({
      id: subgroup.id,
      names: subgroup.items.map((icon) => icon.name),
    })),
  })),
  [
    {
      id: 'single',
      subgroups: [
        { id: 'general', names: ['ZoomIcon'] },
        { id: 'shape', names: ['ShapeStarIcon'] },
      ],
    },
    {
      id: 'double',
      subgroups: [{ id: 'double', names: ['CopyDoubleIcon'] }],
    },
    {
      id: 'multi',
      subgroups: [{ id: 'multi', names: ['DocMultiIcon'] }],
    },
  ],
)
