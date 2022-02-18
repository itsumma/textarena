import {
  ArenaInlineInterface, ArenaMediatorInterface, ArenaRootInterface, ArenaSingleInterface,
} from './Arena';
import { ArenaAttribute } from './ArenaAttribute';
import {
  ArenaNodeAncestorPart, ArenaNodeCorePart, ArenaNodeScionPart, ArenaNodeTextPart,
} from './node';
import { NodeAttributes } from './NodeAttributes';

export type ArenaNodeRoot = ArenaNodeCorePart<ArenaNodeRoot>
  & ArenaNodeAncestorPart
  & {
  readonly arena: ArenaRootInterface;

  readonly root: true;
  readonly hasParent: false;
};

export type ArenaNodeMediator = ArenaNodeCorePart<ArenaNodeMediator>
  & ArenaNodeScionPart
  & ArenaNodeAncestorPart
  & {
  readonly arena: ArenaMediatorInterface;

  readonly root: false;
  readonly hasParent: true;
};

export type ArenaNodeText = ArenaNodeCorePart<ArenaNodeText>
  & ArenaNodeScionPart
  & ArenaNodeTextPart;

export type ArenaNodeSingle = ArenaNodeCorePart<ArenaNodeSingle>
  & ArenaNodeScionPart
  & {
  readonly arena: ArenaSingleInterface;

  readonly hasChildren: false;
  readonly hasText: false;
  readonly inline: false;
  readonly single: true;
};

export interface ArenaNodeInline {
  readonly arena: ArenaInlineInterface;

  readonly hasParent: false;
  readonly hasChildren: false;
  readonly hasText: false;
  readonly inline: true;
  readonly single: false;

  // getTemplate(model: ArenaFormatings): TemplateResult | string;

  // getDataHtml(model: ArenaFormatings): string;

  // getOutput(type: string, model: ArenaFormatings): string;

  getTags(): [string, string];

  getAttribute(name: string): ArenaAttribute;

  getAttributes(): NodeAttributes;

  setAttribute(name: string, value: ArenaAttribute): void;

  clone(): ArenaNodeInline;
}

export type ParentArenaNode = ArenaNodeMediator | ArenaNodeRoot;

export type ChildArenaNode = ArenaNodeMediator
                           | ArenaNodeSingle
                           | ArenaNodeText;

export type AnyArenaNode = ArenaNodeRoot
                         | ChildArenaNode;
