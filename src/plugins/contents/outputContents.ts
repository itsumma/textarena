import { AnyArenaNode } from '../../interfaces/ArenaNode';
import { Contents } from './types';

const outputContents = (
  type: string,
  node: AnyArenaNode,
): string => {
  if (['html', 'amp', 'rss'].includes(type)) {
    const data = node.getAttribute('data');
    if (!Array.isArray(data)) {
      return '';
    }
    const list = (data as Contents).filter((c) => c.active);
    if (list.length === 0) {
      return '';
    }
    return `
      <div class="contents">
        <h3 class="contents__title">
          Содержание
        </h3>
        <ul>
          ${list.map((c) => `
            <li>
              <a href="#${c.slug}">${c.title || c.originalTitle}</a>
            </li>
          `).join('')}
        </ul>
      </div>
    `;
  }
  return '';
};

export default outputContents;
