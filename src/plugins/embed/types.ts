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

export interface EmbedService {
  regex: RegExp;
  embedUrl: string;
  html: string;
  height?: number;
  width?: number;
  id?: ([id, params]: string[]) => string;
}

export interface EmbedServiceMap {
  [service: string]: EmbedService;
}

export type EmbedPluginOptions = DefaulPluginOptions & {
  components: EmbedComponent[],
  services: EmbedServiceMap,
};

export interface EmbedElem {
  type: string;
  embed: string;
  ew?: number;
  eh?: number;
}
