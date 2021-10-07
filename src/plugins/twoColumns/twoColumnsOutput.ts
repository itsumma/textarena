import { ArenaFormatings } from '../../interfaces/ArenaFormating';
import { AnyArenaNode } from '../../interfaces/ArenaNode';

const twoColumnsOutput = (
  type: string,
  node: AnyArenaNode,
  frms: ArenaFormatings,
): string => {
  if (['html', 'amp', 'rss'].includes(type)) {
    const col0 = node.hasChildren && node.children[0]
      ? `<div class="arena-col">${node.children[0].getOutput(type, frms)}</div>` : '';
    const col1 = node.hasChildren && node.children[1]
      ? `<div class="arena-col">${node.children[1].getOutput(type, frms)}</div>` : '';
    return `
      <div class="arena-two-col">
        ${col0}
        ${col1}
      </div>
    `;
  }
  return '';
};

export default twoColumnsOutput;
