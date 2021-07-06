import ArenaFactory from '../src/arenas/ArenaFactory';
import ArenaText from '../src/arenas/ArenaText';
import ArenaSelection from '../src/helpers/ArenaSelection';
import NodeRegistry from '../src/helpers/NodeRegistry';
import { ArenaNodeMediator, ArenaNodeText } from '../src/interfaces/ArenaNode';
import { ParentArena } from '../src/interfaces/Arena';
import NodeFactory from '../src/models/NodeFactory';
import RootNode from '../src/models/RootNode';
import utils from '../src/utils';

const registry = new NodeRegistry();

const textArena = ArenaFactory.createChild({
  name: 'text',
  hasText: true,
  tag: '',
  attributes: {},
}) as ArenaText;
const blockArena = ArenaFactory.createChild({
  name: 'block',
  tag: '',
  attributes: {},
  allowedArenas: [textArena],
  arenaForText: textArena,
}) as ParentArena;
blockArena.addAllowedChild(blockArena);
const rootArena = ArenaFactory.createRoot({
  name: 'root',
  root: true,
  tag: '',
  attributes: {},
  allowedArenas: [textArena, blockArena],
  arenaForText: textArena,
});

const node00 = NodeFactory.createChildNode(
  textArena,
  registry,
) as ArenaNodeText;
node00.insertText('First text node0.0', 0);

const node01 = NodeFactory.createChildNode(
  blockArena,
  registry,
) as ArenaNodeMediator;
const node010 = NodeFactory.createChildNode(
  textArena,
  registry,
) as ArenaNodeText;
node010.insertText('Second text node0.1.0', 0);
node01.insertChildren([node010], 0);

const node02 = NodeFactory.createChildNode(
  textArena,
  registry,
) as ArenaNodeText;
node02.insertText('Third text node0.2', 0);

const node03 = NodeFactory.createChildNode(
  blockArena,
  registry,
) as ArenaNodeMediator;
const node030 = NodeFactory.createChildNode(
  textArena,
  registry,
) as ArenaNodeText;
node030.insertText('Fourth text node0.3.0', 0);
const node031 = NodeFactory.createChildNode(
  textArena,
  registry,
) as ArenaNodeText;
node031.insertText('Fifth text node0.3.1', 0);
const node032 = NodeFactory.createChildNode(
  blockArena,
  registry,
) as ArenaNodeMediator;
const node0320 = NodeFactory.createChildNode(
  textArena,
  registry,
) as ArenaNodeText;
node0320.insertText('Sixth text node0.3.2.0', 0);
const node0321 = NodeFactory.createChildNode(
  blockArena,
  registry,
) as ArenaNodeMediator;
node032.insertChildren([node0320, node0321], 0);
node03.insertChildren([node030, node031, node032], 0);

const root = new RootNode(
  rootArena,
  [
    node00,
    node01,
    node02,
    node03,
  ],
);

type RunResult = [string, number | undefined, number | undefined][];

// function printRange(start: number | undefined, end: number | undefined): string {
//   if (start === undefined && end === undefined) {
//     return 'whole';
//   }
//   return `from ${start?.toString() || 'start'} till ${end?.toString() || 'end'}`;
// }

// function printResult(result: RunResult): void {
// console.log(result.map(
//   ([index, start, end]) => `node${index} ${printRange(start, end)}`,
// ).join('\n'));
// }

test(`
  node0
    |__node0.0 'F→irst text node0'
    |__node0.1 block
    |   |__node0.1.0 'Second text node1.0'
  2 |  ←
    |__node0.2 'Third text node2'
    |__node0.3 block
        |__node0.3.0 'Fourth text node0.3.0'
        |__node0.3.1 'Fifth text node0.3.1'
  `, () => {

  const result: RunResult = [];
  utils.modelTree.runThroughSelection(
    new ArenaSelection(
      node00,
      1,
      root,
      2,
      'forward',
    ),
    (n, a, b) => result.push([n.getGlobalIndex(), a, b]),
  );
});

test(`
  node0
    |__node0.0 'First text node0.0'
  1 |  →
    |__node0.1 block
    |    |__node0.1.0 'Second text node0.1.0'
    |__node0.2 'T←hird text node0.2'
    |__node0.3 empty block
         |__node0.3.0 'Fourth text node0.3.0'
         |__node0.3.1 'Fifth text node0.3.1'
  `, () => {

  const result: RunResult = [];
  utils.modelTree.runThroughSelection(
    new ArenaSelection(
      root,
      1,
      node02,
      1,
      'forward',
    ),
    (n, a, b) => result.push([n.getGlobalIndex(), a, b]),
  );
});

test(`
  node0
    |__node0.0 'First text node0.0'
  1 |  →
    |__node0.1 block
    |    |__node0.1.0 'Second text node0.1.0'
    |__node0.2 'Third text node0.2'
  3 |  ←
    |__node0.3 empty block
         |__node0.3.0 'Fourth text node0.3.0'
         |__node0.3.1 'Fifth text node0.3.1'
  `, () => {

  const result: RunResult = [];
  utils.modelTree.runThroughSelection(
    new ArenaSelection(
      root,
      1,
      root,
      3,
      'forward',
    ),
    (n, a, b) => result.push([n.getGlobalIndex(), a, b]),
  );
});

test(`
  node0
    |__node0.0 'First text node0.0'
    |__node0.1 block
    |    |__node0.1.0 'Second text node0.1.0'
    |__node0.2 'Third text node0.2'
    |__node0.3 empty block
         |__node0.3.0 'F→ourth text node0.3.0'
         |__node0.3.1 'Fi←fth text node0.3.1'
  `, () => {

  const result: RunResult = [];
  utils.modelTree.runThroughSelection(
    new ArenaSelection(
      node030,
      1,
      node031,
      2,
      'forward',
    ),
    (n, a, b) => result.push([n.getGlobalIndex(), a, b]),
  );
});

test(`
  node0
    |__node0.0 'First text node0.0'
    |__node0.1 block
    |  0 |  →
    |    |__node0.1.0 'Second text node0.1.0'
    |__node0.2 'Third text node0.2'
    |__node0.3 empty block
         |__node0.3.0 'Fourth text node0.3.0'
       1 |  ←
         |__node0.3.1 'Fifth text node0.3.1'
  `, () => {

  const result: RunResult = [];
  utils.modelTree.runThroughSelection(
    new ArenaSelection(
      node01,
      0,
      node03,
      1,
      'forward',
    ),
    (n, a, b) => result.push([n.getGlobalIndex(), a, b]),
  );
});

test(`
  node0
    |__node0.0 'First text node0.0'
    |__node0.1 block
    |  0 |  →
    |    |__node0.1.0 'Second text node0.1.0'
    |__node0.2 'Third text node0.2'
    |__node0.3 block
         |__node0.3.0 'Fourth text node0.3.0'
         |__node0.3.1 'Fifth text node0.3.1'
         |__node0.3.2 block
              |__node0.3.2.0 'Sixth text node0.3.2.0'
              |__node0.3.2.1 empty block
                 0 | ←
  `, () => {

  const result: RunResult = [];
  utils.modelTree.runThroughSelection(
    new ArenaSelection(
      node01,
      0,
      node0321,
      0,
      'forward',
    ),
    (n, a, b) => result.push([n.getGlobalIndex(), a, b]),
  );
});

test(`
  node0
    |__node0.0 'First text node0.0'
    |__node0.1 block
    |    |__node0.1.0 'Second text node0.1.0'
    |__node0.2 'Third text node0.2'
    |__node0.3 block
    |    |__node0.3.0 'Fourth text node0.3.0'
    |    |__node0.3.1 'Fifth text node0.3.1'
    |    |__node0.3.2 block
    |         |__node0.3.2.0 'Sixth text node0.3.2.0'
    |         |__node0.3.2.1 empty block
    |            0 | →
  4 |  ←
  `, () => {

  const result: RunResult = [];
  utils.modelTree.runThroughSelection(
    new ArenaSelection(
      node0321,
      0,
      root,
      4,
      'forward',
    ),
    (n, a, b) => result.push([n.getGlobalIndex(), a, b]),
  );
});

test(`
  node0
    |__node0.0 'First text node0.0'
    |__node0.1 block
    |    |__node0.1.0 'Second text node0.1.0'
    |__node0.2 'Third text node0.2'
    |__node0.3 block
    |    |__node0.3.0 'Fourth text node0.3.0'
    |    |__node0.3.1 'Fifth text node0.3.1'
    |    |__node0.3.2 block
    |         |__node0.3.2.0 'Sixth text node0.3.2.0→'
    |         |__node0.3.2.1 empty block
  4 |  ←
  `, () => {

  const result: RunResult = [];
  utils.modelTree.runThroughSelection(
    new ArenaSelection(
      node0320,
      22,
      root,
      4,
      'forward',
    ),
    (n, a, b) => result.push([n.getGlobalIndex(), a, b]),
  );
});

test(`
  node0
  0 |  →
    |__node0.0 'First text node0.0'
    |__node0.1 block
    |    |__node0.1.0 'Second text node0.1.0'
    |__node0.2 'Third text node0.2'
    |__node0.3 block
    |    |__node0.3.0 'Fourth text node0.3.0'
    |    |__node0.3.1 'Fifth text node0.3.1'
    |    |__node0.3.2 block
    |         |__node0.3.2.0 'Sixth text node0.3.2.0←'
    |         |__node0.3.2.1 empty block
  `, () => {

  const result: RunResult = [];
  utils.modelTree.runThroughSelection(
    new ArenaSelection(
      root,
      0,
      node0320,
      22,
      'forward',
    ),
    (n, a, b) => result.push([n.getGlobalIndex(), a, b]),
  );
});

test(`
  node0
  0 |  →
    |__node0.0 'First text node0.0'
    |__node0.1 block
    |    |__node0.1.0 'Second text node0.1.0'
    |__node0.2 'Third text node0.2'
    |__node0.3 block
    |    |__node0.3.0 'Fourth text node0.3.0'
    |    |__node0.3.1 'Fifth text node0.3.1'
    |  2 |  ←
    |    |__node0.3.2 block
    |         |__node0.3.2.0 'Sixth text node0.3.2.0←'
    |         |__node0.3.2.1 empty block
  `, () => {
  const result: RunResult = [];
  utils.modelTree.runThroughSelection(
    new ArenaSelection(
      root,
      0,
      node03,
      2,
      'forward',
    ),
    (n, a, b) => result.push([n.getGlobalIndex(), a, b]),
  );
});
