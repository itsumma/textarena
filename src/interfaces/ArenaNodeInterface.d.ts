import Arena from './Arena';

export default interface ArenaNodeInterface {
  arena: Arena;

  insertText(text: string, offset: number): [ArenaNodeInterface, number];

  createAndInsertNode(arena: Arena, offset: number): [
    ArenaNodeInterface | undefined, ArenaNodeInterface, number,
  ];
}
