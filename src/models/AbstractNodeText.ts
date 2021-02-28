import { ArenaWithText, ArenaWithRichText } from 'interfaces/Arena';
import ArenaNodeAncestor from 'interfaces/ArenaNodeAncestor';
import AbstractNodeScion from './AbstractNodeScion';

export default abstract class AbstractNodeText
  extends AbstractNodeScion {
  hasText: true = true;

  constructor(
    public arena: ArenaWithText | ArenaWithRichText,
    public parent: ArenaNodeAncestor,
  ) {
    super(arena, parent);
  }
}
