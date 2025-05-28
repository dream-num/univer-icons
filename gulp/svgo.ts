import { optimize } from 'svgo'
import { createTransformStreamAsync } from './transform'

export function svgo() {
  return createTransformStreamAsync(async (raw: string) => {
    return optimize(raw, {
      floatPrecision: 2,
      plugins: [
        'removeDoctype',
        'removeXMLProcInst',
        'removeComments',
        'removeMetadata',
        'removeTitle',
        'removeDesc',
        'removeUselessDefs',
        'removeEditorsNSData',
        'removeEmptyAttrs',
        'removeHiddenElems',
        'removeEmptyText',
        'removeEmptyContainers',
        'cleanupEnableBackground',
        'convertStyleToAttrs',
        'convertTransform',
        'removeUnknownsAndDefaults',
        'removeNonInheritableGroupAttrs',
        'removeUnusedNS',
        'cleanupNumericValues',
        'moveElemsAttrsToGroup',
        'moveGroupAttrsToElems',
        'collapseGroups',
        'convertShapeToPath',
        'sortAttrs',
        'removeDimensions',
        {
          name: 'removeAttrs',
          params: {
            attrs: ['class', 'style'],
          },
        },
      ],
    }).data
  })
}
