import { ArenaFormatings } from '../../interfaces/ArenaFormating';
import { AnyArenaNode } from '../../interfaces/ArenaNode';

const defaultOutputCallout = (
  type: string,
  node: AnyArenaNode,
  frms: ArenaFormatings,
): string => {
  if (['html', 'amp', 'rss'].includes(type)) {
    const title = node.hasChildren && node.children[0]
      ? `<div class="callout__title">${node.children[0].getOutput(type, frms)}</div>` : '';
    const body = node.hasChildren && node.children[1]
      ? `<div class="callout__body">${node.children[1].getOutput(type, frms)}</div>` : '';
    return `
      <aside class="callout>
        <div class="callout__nb">Внимание!</div>
        ${title}
        ${body}
      </aside>
    `;
  }
  return '';
};

export default defaultOutputCallout;
