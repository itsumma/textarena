import { ArenaSelection } from '../helpers';
import Textarena from '../Textarena';

export type ArenaMiddleware = (
  ta: Textarena,
  selection: ArenaSelection,
  data: string | DataTransfer,
) => [boolean, ArenaSelection];
