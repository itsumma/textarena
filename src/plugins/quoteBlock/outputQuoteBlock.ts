import { AnyArenaNode, ArenaFormatings } from '../../interfaces';

export const outputQuoteBlock = (
  type: string,
  node: AnyArenaNode,
  frms: ArenaFormatings,
): string => {
  if (['html', 'amp', 'rss'].includes(type)) {
    const image = node.hasChildren && node.children[0]
      ? `<div class="quote-block__image">${node.children[0].getOutput(type, frms)}</div>` : '';
    const author = node.hasChildren && node.children[1]
      ? node.children[1].getOutput(type, frms) : '';
    const role = node.hasChildren && node.children[2]
      ? node.children[2].getOutput(type, frms) : '';
    const body = node.hasChildren && node.children[3]
      ? node.children[3].getOutput(type, frms) : '';
    const authorBlock = author || role ? `
      <div class="quote-block__author-block">
        ${author}
        ${role}
      </div>
    ` : '';
    return `
      <blockquote class="quote-block">
        <div class="quote-block__line">
          ${authorBlock}
          ${image}
        </div>
        ${body}
      </blockquote>
    `;
  }
  return '';
};
