import ArenaCursor from './ArenaCursor';
import ArenaSingle from './ArenaSingle';
import ArenaAncestor from './ArenaAncestor';
import ArenaWithText from './ArenaWithText';

export type Middleware = (cursor: ArenaCursor) => ArenaCursor;

type Arena = ArenaSingle | ArenaAncestor | ArenaWithText;

export default Arena;
