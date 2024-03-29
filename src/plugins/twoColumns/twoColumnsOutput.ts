import { AnyArenaNode, ArenaFormatings, ArenaNodeMediator } from '../../interfaces';

const colOutput = (
  type: string,
  node: ArenaNodeMediator,
  frms: ArenaFormatings,
): string =>
  node.children.map((child) => child.getOutput(type, frms)).join('');

export const twoColumnsOutput = (
  type: string,
  node: AnyArenaNode,
  frms: ArenaFormatings,
): string => {
  if (['html', 'amp', 'rss'].includes(type)) {
    const col0 = node.hasChildren && node.children[0]
      ? `<div class="arena-col">${colOutput(type, node.children[0] as ArenaNodeMediator, frms)}</div>` : '';
    const col1 = node.hasChildren && node.children[1]
      ? `<div class="arena-col">${colOutput(type, node.children[1] as ArenaNodeMediator, frms)}</div>` : '';
    return `<div class="arena-two-col">${col0}${col1}</div>`;
  }
  return '';
};
