import { createTransformStream } from './transform'

export type IconFileContentGenerator = (props: {
  name: string
  element: string
}) => string

export function useTemplate(iconGenerator: IconFileContentGenerator) {
  return createTransformStream((svgElementString, { stem: name }) => {
    return iconGenerator({ name, element: svgElementString })
  })
}
