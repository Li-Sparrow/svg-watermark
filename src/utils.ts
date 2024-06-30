/**
 * 创建svg元素
 * @param patternElement 
 * @param patternId 
 * @returns 
 */
export function createElementSVG(patternElement: Element, patternId: string) {
  const svg = createElementNS({
    type: 'svg',
    attributes: {
      width: '100%',
      height: '100%'
    }
  });

  const defsElement = createElementNS({
    type: 'defs',
    parent: svg
  });

  defsElement.appendChild(patternElement);

  createElementNS({
    type: 'rect',
    parent: svg,
    attributes: {
      x: 0,
      y: 0,
      width: '100%',
      height: '100%',
      fill: `url(#${patternId})`
    },
    style: {
      pointerEvents: 'none'
    }
  });

  return svg;
}

/**
 * 创建svg pattern
 * @param id 
 * @param width 
 * @param height 
 * @returns 
 */
export function createElementSVGPattern(id: string, width: number, height: number) {
  return createElementNS({
    type: 'pattern',
    id: id,
    attributes: {
      width: width,
      height: height,
      patternUnits: "userSpaceOnUse"
    }
  });
}

/**
 * 创建svg text
 * @param parent 
 * @param style 
 * @param attributes 
 * @returns 
 */
export function createElementSVGText(parent: Element, style: any, attributes: any) {
  return createElementNS({
    type: 'text',
    parent: parent,
    style,
    attributes
  });
}

interface IParams {
  type: string;
  style?: any;
  id?: string;
  classname?: string;
  parent?: Element
  text?: string;
  isInsertBefore?: boolean;
  attributes?: any;
}

/**
 * 创建svg元素 
 * @param params 
 * @returns 
 */
function createElementNS(params: IParams) {
  const element = document.createElementNS('http://www.w3.org/2000/svg', params.type);
  const {
    style,
    id,
    classname,
    parent,
    text,
    isInsertBefore = false,
    attributes,
  } = params;

  // @ts-ignore
  element.attachTo = function (parentDom: HTMLElement) {
    if (isInsertBefore) {
      const [firstChild] = parentDom.children || [];
      if (firstChild) {
        parentDom.insertBefore(element, firstChild);
        return;
      }
    }

    parentDom.appendChild(element);
  };

  if (classname) {
    element.className = classname;
  }

  if (style) {
    switch (typeof style) {
      case 'string':
        element.setAttribute('style', style);
        break;
      case 'object':
        for (const key in style) {
          if (style.hasOwnProperty(key)) {
            element.style[key] = style[key];
          }
        }
        break;
      default:
        break;
    }
  }
  if (id) { element.id = id; }
  if (parent) { element.attachTo(parent); }
  if (text) { element.innerText = text; }
  if (attributes) {
    for (const key in attributes) {
      if (attributes.hasOwnProperty(key)) {
        element.setAttribute(key, attributes[key]);
      }
    }
  }

  return element;
};

/**
 * 测量文本
 * @param text 
 * @param font 
 * @returns 
 */
export const measureText = (text: string, font: string) => {
  const span = document.createElement('span');
  let div = document.createElement('div');
  const block = div.cloneNode(false);

  block.setAttribute('style', 'display: inline-block; width: 1px; height: 0');
  div.setAttribute('style', 'visibility: hidden; position: absolute; top: 0; left: 0; z-index: -999;');

  div.appendChild(span);
  div.appendChild(block);
  document.body.appendChild(div);

  const result = {
    width: 0,
    height: 0,
    ascent: 0,
    descent: 0
  };

  try {
    const style = `font: ${font}; word-break: keep-all; white-space: nowrap;`;
    span.setAttribute('style', style);

    let blockRect, spanRect;

    span.innerHTML = '';
    span.appendChild(document.createTextNode(text.replace(/\s/g, String.fromCharCode(960))));
    spanRect = span.getBoundingClientRect();

    block.style.verticalAlign = 'baseline';
    blockRect = block.getBoundingClientRect();
    result.ascent = blockRect.top - spanRect.top;

    block.style.verticalAlign = 'bottom';
    blockRect = block.getBoundingClientRect();
    result.height = blockRect.top - spanRect.top;
    result.descent = result.height - result.ascent;
    result.width = spanRect.width;
  } finally {
    div.parentNode.removeChild(div);
    div = null;
  }

  return result;
};