import ArenaModel, {
  Arena,
} from 'interfaces/ArenaModel';

export default class ArenaNode implements ArenaModel {
  children: ArenaNode[] = [];

  parent: ArenaNode | undefined = undefined;

  constructor(
    public arena: Arena,
  ) {
  }

  insertText(text: string, offset = 0): [ArenaNode, number] {
    // TODO сделать вариант когда у нас фиксированное количество дочерних нод,
    // например callout (title, paragraph)
    // или quote (title, section).
    // У корневого может быть разрешены либо параграфы (заголовки), либо секции (и большие картинки)
    if ('arenaForText' in this.arena) {
      const newNode = this.appendNode(this.arena.arenaForText);
      newNode.insertText(text);
      return [newNode, text.length];
    }
    if (this.parent) {
      return this.parent.insertText(text); // TODO keep in mind index of current node
    }
    // вставить не удалось, но мы вернём что дали, чтобы не усложнять дальнейшую логику
    return [this, offset];
  }

  appendNode(arena: Arena): ArenaNode {
    const node = new ArenaNode(arena);
    this.children.push(node);
    return node;
  }
}
