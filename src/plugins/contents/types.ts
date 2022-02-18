import { AnyArenaNode, DefaultPluginOptions } from '../../interfaces';
import Textarena from '../../Textarena';

export type ContentItem = {
  id: string,
  slug: string,
  originalTitle: string,
  title?: string,
  active: boolean,
};

export type Contents = Array<ContentItem>;

export type ContentsProcessor = (textarena: Textarena, node: AnyArenaNode) => void;

export type ContentsComponentProcessor = (node: AnyArenaNode) => void;

export type ContentsOptions = DefaultPluginOptions & {
  processor: ContentsProcessor,
};
