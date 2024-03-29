import { AnyArenaNode, ArenaAttributes, ArenaFormatings } from '../../interfaces';
import { outputImage } from '../image';

export const backImageOutput = (
  type: string,
  node: AnyArenaNode,
  frms: ArenaFormatings,
  arenaAttrs: ArenaAttributes,
): string => {
  if (['html', 'amp', 'rss'].includes(type)) {
    const image = outputImage(type, node, frms, arenaAttrs);
    return `
      <div class="arena-back-image">
        <div class="arena-back-image-img">
          ${image}
        </div>
        <div class="arena-back-image-body">
          ${node.hasChildren ? node.children.map((child) => child.getOutput(type, frms)).join('\n') : null}
        </div>
      </div>
    `;
  }
  return '';
};
