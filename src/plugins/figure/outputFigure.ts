import { AnyArenaNode, ArenaFormatings, ArenaNodeMediator } from '../../interfaces';
import { ScrProcessor, Srcset } from '../image';
import { FigureClass } from './types';

type Unpacked<T> = T extends (infer U)[]
  ? U
  : T;

const replaceExt = (src: string, ext: string) => {
  const arr = src.split('.');
  if (arr.length < 2) {
    return src;
  }
  arr[arr.length - 1] = ext;
  return arr.join('.');
};

const prepareSource = (
  src: string,
  item: Unpacked<Srcset>,
  prepareSrc: ScrProcessor,
): string => {
  const arr = src.split('.');
  if (arr.length < 2) {
    return '';
  }
  const ext = arr[arr.length - 1];
  return `
  <source type="image/webp" media="${item.media}" srcset="${item.rations.map((r) => `${replaceExt(prepareSrc(src, r.width, r.height), 'webp')} ${r.ratio}x`).join(', ')}"/>
  <source type="image/${ext.toLowerCase()}" media="${item.media}" srcset="${item.rations.map((r) => `${prepareSrc(src, r.width, r.height)} ${r.ratio}x`).join(', ')}"/>
  `;
};

const outputImage = (
  type: string,
  node: AnyArenaNode,
  srcset?: Srcset,
): string => {
  const src = node.getAttribute('src') as string;
  const alt = node.getAttribute('alt') as string;
  const width = node.getAttribute('width') as number;
  const height = node.getAttribute('height') as number;
  const className = node.getAttribute('class') as string;
  if (!src) {
    return '';
  }
  const prepareSrc = node.arena.getAttribute('prepareSrc') as ScrProcessor | undefined;
  const resultSrc = prepareSrc ? prepareSrc(src, width, height) : src;
  const img = `<img src="${resultSrc}" alt="${alt}" class="${className}">`;
  if (srcset && prepareSrc) {
    const sources = srcset.map((item) => prepareSource(src, item, prepareSrc)).join('\n');
    return `
      ${sources}
      ${img}
    `;
  }
  return img;
};

export const outputFigure = (
  type: string,
  node: AnyArenaNode,
  frms: ArenaFormatings,
): string => {
  const imageNode = (node as ArenaNodeMediator).getChild(0);
  const captionNode = (node as ArenaNodeMediator).getChild(1);
  const className = node.getAttribute('class') as string;
  const classes = node.arena.getAttribute('classes') as FigureClass[];
  const figureClass = classes
    ? classes.find((someFigureClass) => someFigureClass.className === className)
    : undefined;
  const srcset = (figureClass?.srcset || imageNode?.arena.getAttribute('srcset') || node.getAttribute('srcset')) as Srcset | undefined;
  return `
    <figure class="${className}">
      <picture>
        ${imageNode ? outputImage(type, imageNode, srcset) : null}
      </picture>
      ${captionNode?.getOutput(type, frms)}
    </figure>
  `;
};
