import { parse } from 'svg-parser';
import camelCase from 'camelcase';

import { createTransformStream } from './transform';

export interface Attrs {
  style: object | string;

  [key: string]: string | object;
}

export interface IconNode {
  tagName: string;
  properties: Attrs;
  children: IconNode[];

  [key: string]: any;
}

export interface IconElement {
  tag: string;
  attrs: Attrs;
  style?: React.CSSProperties;
  children?: IconElement[];
  defIds?: string[];
}

export interface NormalizationOptions {
  replaceColor?: boolean;
  customizedColor?: boolean;
}

interface NormalizationContext {
  idReplacementSet: Set<string>;
}

function createNormalizationContext(): NormalizationContext {
  return {
    idReplacementSet: new Set(),
  };
}

export function svgToElement(
  options: NormalizationOptions = {
    replaceColor: false,
  }
) {
  return createTransformStream((svgString, { stem: name }) => {
    const ast = parse(svgString) as any;
    return normalize(name, ast.children, options)[0];
  });
}

function normalize(
  name: string,
  roots: IconNode[],
  options: NormalizationOptions
): string[] {
  const context = createNormalizationContext();
  const normalizedRoots = doNormalize(roots, options, context);

  normalizedRoots.forEach((root) => {
    addDefIds(root, context);
  });

  normalizedRoots.forEach((root) => {
    normalizeWidthAndHeight(root);
  });

  return normalizedRoots.map((root) =>
    replaceIds(name, JSON.stringify(root), context.idReplacementSet)
  );
}

/**
 * map svg-parser ast to React element, so it would be convenient to render
 */
function doNormalize(
  roots: IconNode[],
  options: NormalizationOptions,
  context: NormalizationContext
): IconElement[] {
  return roots
    .map((node) => ({
      tag: node.tagName,
      attrs: node.properties,
      children: doNormalize(node.children, options, context),
    }))
    .map((node: IconElement) => {
      normalizeChildren(node);
      normalizeAttrs(node, options);
      normalizeDefinitions(node, context);
      return node;
    });
}

function normalizeWidthAndHeight(node: IconElement) {
  const { attrs } = node;
  attrs.width = '1em';
  attrs.height = '1em';
}

function normalizeChildren(node: IconElement) {
  if (node.children?.length === 0) {
    delete node.children;
  }
}

function normalizeDefinitions(
  node: IconElement,
  context: NormalizationContext
) {
  if (node.tag === 'defs') {
    node.children?.forEach((def) => {
      if (typeof def.attrs.id === 'string') {
        context.idReplacementSet.add(def.attrs.id);
      }
    });
  }
}

function addDefIds(root: IconElement, context: NormalizationContext) {
  const defIds = Array.from(context.idReplacementSet);
  if (defIds.length === 0) return;
  root.defIds = defIds;
}

function replaceIds(name: string, str: string, set: Set<string>): string {
  return Array.from(set.keys()).reduce((parsed, currentToReplace) => {
    return parsed.replace(
      new RegExp(currentToReplace, 'g'),
      `${name}_${currentToReplace}`
    );
  }, str);
}

function normalizeAttrs(node: IconElement, options: NormalizationOptions) {
  const { attrs } = node;

  Object.keys(attrs).forEach((key) => {
    if (key.indexOf('-') !== -1) {
      attrs[camelCase(key)] = attrs[key];
      delete attrs[key];
    }
  });

  normalizeStyle(node);
  normalizeClassName(node);
  normalizeColor(node, options);
}

function normalizeStyle(node: IconElement) {
  const { attrs } = node;
  const styleMap: { [k: string]: string } = {};

  if (typeof attrs.style === 'string') {
    const styles = attrs.style.split(';');
    styles.forEach((chunk) => {
      const [key, value] = chunk.split(':');
      styleMap[camelCase(key)] = value;
    });
    attrs.style = styleMap;
  }
}

function normalizeClassName(node: IconElement) {
  const { attrs } = node;

  if (attrs.class) {
    // React use className instead of class
    attrs.className = attrs.class;
    delete attrs.class;
  }
}

/**
 * for single colored icons, we assume that #000 is placeholder for 'currentColor'
 * for multi colored icons, we assume that #E5E5E5 is placeholder for 'colorChannel1'
 */
function normalizeColor(node: IconElement, options: NormalizationOptions) {

  const { attrs } = node;

  if (options.replaceColor) {
    if (attrs.fill === '#000' || attrs.fill === '#000000' || attrs.fill === 'black') {
      attrs.fill = 'currentColor';
    }
  
    if (attrs.stroke === '#000' || attrs.stroke === '#000000' || attrs.stroke === 'black') {
      attrs.stroke = 'currentColor';
    }
  }

  if (options.customizedColor) {
    if (attrs.fill === '#E5E5E5') {
      attrs.fill = 'colorChannel1';
    }
  
    if (attrs.stroke === '#E5E5E5') {
      attrs.stroke = 'colorChannel1';
    }
  }


}
