import Textarena from '../Textarena';
import ArenaSelection from '../helpers/ArenaSelection';

type ArenaMiddleware = (
  ta: Textarena,
  selection: ArenaSelection,
  text: string,
) => [boolean, ArenaSelection];

export default ArenaMiddleware;
