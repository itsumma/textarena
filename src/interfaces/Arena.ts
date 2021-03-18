import ArenaCursor from './ArenaCursor';
import ArenaSingle from './ArenaSingle';
import ArenaAncestor from './ArenaAncestor';
import ArenaWithText from './ArenaWithText';
import ArenaInline from './ArenaInline';

export type Middleware = (cursor: ArenaCursor) => ArenaCursor;

type Arena = ArenaInline | ArenaSingle | ArenaAncestor | ArenaWithText;

export default Arena;
