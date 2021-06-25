import { DefaulPluginOptions } from '../../interfaces/ArenaPlugin';

export enum EmbedTypes {
  twitter = 'twitter',
  youtube = 'youtube',
  facebook = 'facebook',
  instagram = 'instagram',
}

export enum RenderTypes {
  RSS = 'content_rss',
  AMP = 'content_amp',
  DEFAULT = 'html',
}

export type EmbedComponent = {
  component: string,
  componentConstructor: CustomElementConstructor,
};

export type EmbedPluginOptions = DefaulPluginOptions & {
  components: EmbedComponent[],
};
