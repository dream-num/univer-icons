import { parse } from 'svg-parser'
import { optimize } from 'svgo'

export function parseSvg(svgString: string) {
  const { data } = optimize(svgString, {
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
        name: 'convertColors',
        params: {
          currentColor: true,
        },
      },
      {
        name: 'removeAttrs',
        params: {
          attrs: ['class', 'style'],
        },
      },
    ],
  })

  const ast = parse(data)

  return ast
}
