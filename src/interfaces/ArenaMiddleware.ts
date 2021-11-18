import Textarena from '../Textarena';
import ArenaSelection from '../helpers/ArenaSelection';

type ArenaMiddleware = (
  ta: Textarena,
  selection: ArenaSelection,
  data: string | DataTransfer,
) => [boolean, ArenaSelection];

export default ArenaMiddleware;
