import { ArenaWithText, ArenaWithRichText } from './Arena';
import ArenaNodeScion from './ArenaNodeScion';

export default interface ArenaNodeText extends ArenaNodeScion {
  hasText: true;

  arena: ArenaWithText | ArenaWithRichText;
}
