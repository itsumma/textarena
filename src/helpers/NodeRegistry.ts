import { AnyArenaNode } from '../interfaces/ArenaNode';

const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-';
const charactersLength = characters.length;

const makeId = (length: number): string => {
  let result = '';
  for (let i = 0; i < length; i += 1) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

export default class NodeRegistry {
  generateId(): string {
    let id = makeId(this.idLength);
    let count = 0;
    while (this.registry[id]) {
      count += 1;
      if (count > 10) {
        this.idLength += 1;
      }
      id = makeId(this.idLength);
    }
    return id;
  }

  set(id: string, node: AnyArenaNode): void {
    this.registry[id] = node;
  }

  get(id: string): AnyArenaNode | undefined {
    return this.registry[id];
  }

  protected idLength = 4;

  protected registry: { [key: string]: AnyArenaNode } = {};
}
