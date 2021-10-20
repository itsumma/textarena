import { ArenaFormatings } from '../../interfaces/ArenaFormating';
import { AnyArenaNode } from '../../interfaces/ArenaNode';
import { ScrProcessor, Srcset } from './types';
import ArenaAttributes from '../../interfaces/ArenaAttributes';

// TODO webp
const outputImage = (
  type: string,
  node: AnyArenaNode,
  frms: ArenaFormatings,
  arenaAttrs: ArenaAttributes,
): string => {
  const src = node.getAttribute('src') as string;
  const alt = node.getAttribute('alt') as string;
  const width = node.getAttribute('width') as number;
  const height = node.getAttribute('height') as number;
  const className = node.getAttribute('class') as string;
  if (!src) {
    return '';
  }
  const srcset = (arenaAttrs.srcset || node.getAttribute('srcset')) as Srcset | undefined;
  const prepareSrc = arenaAttrs.prepareSrc as ScrProcessor | undefined;
  const resultSrc = prepareSrc ? prepareSrc(src, width, height) : src;
  const img = `<img src="${resultSrc}" alt="${alt}" class="${className}">`;
  let sources = '';
  if (srcset && prepareSrc) {
    sources = srcset.map((item) => `<source media="${item.media}"
    srcset="${item.rations.map((r) => `${prepareSrc(src, r.width, r.height)} ${r.ratio}x`).join(', ')}"/>`).join('\n');
  }
  return `
    <picture>
      ${sources}
      ${img}
    </picture>
  `;
};

export default outputImage;
