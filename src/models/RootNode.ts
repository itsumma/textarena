import { TemplateResult, html } from 'lit-html';
import { repeat } from 'lit-html/directives/repeat';
import RichTextManager from 'RichTextManager';
import Arena, { ArenaWithChildText, ArenaWithNodes } from 'interfaces/Arena';
import ArenaNodeAncestorInterface from 'interfaces/ArenaNodeAncestorInterface';
import ArenaNodeInterface from 'interfaces/ArenaNodeInterface';
import ArenaNodeScionInterface from 'interfaces/ArenaNodeScionInterface';
import NodeFactory from './NodeFactory';

// У корневого может быть разрешены либо параграфы (заголовки), либо секции (и большие картинки)

export default class RootNode implements ArenaNodeAncestorInterface {
  children: ArenaNodeScionInterface[] = [];

  constructor(
    public arena: ArenaWithNodes | ArenaWithChildText,
  ) {
  }

  insertText(
    text: string,
    offset: number,
    formatings: RichTextManager | undefined,
  ): [ArenaNodeInterface, number] {
    if ('arenaForText' in this.arena) {
      const [newNode] = this.createAndInsertNode(this.arena.arenaForText, offset);
      if (newNode) {
        newNode.insertText(text, 0, formatings);
        return [newNode, text.length];
      }
    }
    // вставить не удалось, но мы вернём что дали, чтобы не усложнять дальнейшую логику
    return [this, offset];
  }

  createAndInsertNode(arena: Arena, offset: number): [
    ArenaNodeInterface | undefined, ArenaNodeInterface, number,
  ] {
    if (this.arena.allowedArenas.includes(arena)) {
      const node = NodeFactory.createNode(arena, this);
      this.children.splice(offset, 0, node);
      return [node, this, offset + 1];
    }
    // вставить не удалось, но мы вернём что дали, чтобы не усложнять дальнейшую логику
    return [undefined, this, offset];
  }

  getHtml(): TemplateResult {
    console.log('root node');
    return this.arena.template(html`
      ${repeat(this.children, (c, index) => index, (child) => child.getHtml())}
    `);
  }
}
