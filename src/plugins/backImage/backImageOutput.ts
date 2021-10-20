import ArenaAttributes from '../../interfaces/ArenaAttributes';
import { ArenaFormatings } from '../../interfaces/ArenaFormating';
import { AnyArenaNode } from '../../interfaces/ArenaNode';
import outputImage from '../image/outputImage';

const backImageOutput = (
  type: string,
  node: AnyArenaNode,
  frms: ArenaFormatings,
  arenaAttrs: ArenaAttributes,
): string => {
  if (['html', 'amp', 'rss'].includes(type)) {
    const image = outputImage(type, node, frms, arenaAttrs);
    return `
      <div class="arena-back-image">
      ${image}
        <div class="arena-back-image-body">
          ${node.hasChildren ? node.children.map((child) => child.getOutput(type, frms)).join('\n') : null}
        </div>
      </div>
    `;
  }
  return '';
};

export default backImageOutput;
