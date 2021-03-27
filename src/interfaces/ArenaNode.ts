import { TemplateResult } from 'lit-html';
import ArenaNodeAncestorPart from './node/ArenaNodeAncestorPart';
import ArenaNodeCorePart from './node/ArenaNodeCorePart';
import ArenaNodeScionPart from './node/ArenaNodeScionPart';
import ArenaNodeTextPart from './node/ArenaNodeTextPart';
import {
  ArenaInlineInterface, ArenaMediatorInterface, ArenaRootInterface, ArenaSingleInterface,
} from './Arena';
import { ArenaFormatings } from './ArenaFormating';

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

  getHtml(model: ArenaFormatings): TemplateResult | string;

  getOutputHtml(model: ArenaFormatings, deep?: number): string;

  getTags(): [string, string];

  getAttribute(name: string): string | boolean | number;

  setAttribute(name: string, value: string | boolean | number): void;

  clone(): ArenaNodeInline;
}

export type ParentArenaNode = ArenaNodeMediator | ArenaNodeRoot;

export type ChildArenaNode = ArenaNodeMediator
                           | ArenaNodeSingle
                           | ArenaNodeText;

export type AnyArenaNode = ArenaNodeRoot
                         | ChildArenaNode;
