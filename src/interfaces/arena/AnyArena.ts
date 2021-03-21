import ArenaInline from './ArenaInline';
import ArenaRoot from './ArenaRoot';
import ChildArena from './ChildArena';

type AnyArena = ArenaRoot | ChildArena | ArenaInline;

export default AnyArena;
