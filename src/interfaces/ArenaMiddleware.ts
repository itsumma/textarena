import Textarena from '../Textarena';
import ArenaCursorText from './ArenaCursorText';

type ArenaMiddleware = (
  ta: Textarena,
  cursor: ArenaCursorText,
  text: string,
) => [boolean, ArenaCursorText];

export default ArenaMiddleware;
