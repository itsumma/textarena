import { AnyArenaNode } from '../interfaces/ArenaNode';

export default class NodeRegistry {
  generateId(): string {
    return 'asd';
  }

  registerNode(id: string, node: AnyArenaNode): void {
    this.registry[id] = node;
  }

  protected registry: { [key: string]: AnyArenaNode } = {};
}
