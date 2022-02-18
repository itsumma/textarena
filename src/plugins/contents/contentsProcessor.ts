import { AnyArenaNode } from '../../interfaces';
import Textarena from '../../Textarena';
import utils from '../../utils';
import { ContentItem, Contents } from './types';

export function contentsProcessor(textarena: Textarena, node: AnyArenaNode): void {
  const data: ContentItem[] = [];
  const bySlug: { [key: string]: ContentItem } = {};
  const byId: { [key: string]: ContentItem } = {};
  let currentData = node.getAttribute('data') as Contents;
  const list = node.getAttribute('list');
  if (list && typeof list === 'string') {
    try {
      currentData = JSON.parse(list);
      currentData.forEach((item) => {
        bySlug[item.slug] = item;
      });
    } catch (e) {
      currentData = [];
    }
  } else if (Array.isArray(currentData)) {
    currentData.forEach((item) => {
      byId[item.id] = item;
    });
  }
  utils.modelTree.runOfChildren(textarena.getRootModel(), (n: AnyArenaNode) => {
    if (n.hasText && n.arena.name.substr(0, n.arena.name.length - 1) === 'header') {
      const originalTitle = n.getRawText();
      let slug = n.getAttribute('id');
      if (!slug && n.arena.allowedAttributes.includes('id')) {
        const text = n.getRawText();
        slug = utils.str.prepareForAttribute(text.toLowerCase().trim());
        n.setAttribute('id', slug);
      }
      const id = n.getId();
      if (typeof slug === 'string' && slug) {
        const item: ContentItem = {
          id,
          slug,
          title: undefined,
          originalTitle,
          active: true,
        };
        const oldItem = byId[id] || bySlug[slug];
        if (oldItem) {
          item.active = oldItem.active;
          item.title = oldItem.title;
        }
        if (item.title === item.originalTitle) {
          item.title = undefined;
        }
        data.push(item);
      }
    }
  });
  node.setAttribute('data', data);
}
