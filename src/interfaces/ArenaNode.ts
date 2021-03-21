import ArenaNodeAncestorPart from './ArenaNodeAncestorPart';
import ArenaNodeCorePart from './ArenaNodeCorePart';
import ArenaNodeRootPart from './ArenaNodeRootPart';
import ArenaNodeScionPart from './ArenaNodeScionPart';
import ArenaNodeSinglePart from './ArenaNodeSinglePart';
import ArenaNodeTextPart from './ArenaNodeTextPart';

export type ArenaNodeRoot = ArenaNodeCorePart<ArenaNodeRoot>
  & ArenaNodeAncestorPart
  & ArenaNodeRootPart;

export type ArenaNodeMediator = ArenaNodeCorePart<ArenaNodeMediator>
  & ArenaNodeScionPart
  & ArenaNodeAncestorPart;

export type ArenaNodeText = ArenaNodeCorePart<ArenaNodeText>
  & ArenaNodeScionPart
  & ArenaNodeTextPart;

export type ArenaNodeSingle = ArenaNodeCorePart<ArenaNodeSingle>
  & ArenaNodeScionPart
  & ArenaNodeSinglePart;

export type ArenaNodeParent = ArenaNodeMediator | ArenaNodeRoot;

export type ArenaNodeChild = ArenaNodeMediator | ArenaNodeText | ArenaNodeSingle;

type ArenaNode = ArenaNodeRoot | ArenaNodeChild;

export default ArenaNode;
