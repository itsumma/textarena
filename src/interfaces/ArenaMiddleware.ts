import Textarena from '../Textarena';
import ArenaCursorText from './ArenaCursorText';

type ArenaMiddleware = (ta: Textarena, cursor: ArenaCursorText) => ArenaCursorText;

export default ArenaMiddleware;
