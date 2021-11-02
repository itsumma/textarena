import { DefaultPluginOptions } from '../../interfaces/ArenaPlugin';

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

export interface EmbedProviderEndpoint {
  schemes: string[];
  url: string;
  discovery?: boolean;
  formats?: string[];
}

export interface EmbedProvider {
  provider_name: string;
  provider_url: string;
  endpoints: EmbedProviderEndpoint[];
}

export interface ProviderOptions {
  name: string;
  maxwidth?: number;
  maxheight?: number;
}

export interface GetEmbedProviderResult {
  endpoint: EmbedProviderEndpoint;
  provider_name: string;
  opts?: ProviderOptions;
}

export type GetEmbedProvider = (url: string) => GetEmbedProviderResult | undefined;

export type EmbedPluginOptions = DefaultPluginOptions & {
  components: EmbedComponent[],
  providers?: EmbedProvider[],
  providerOptions?: ProviderOptions[],
};

export type OEmbedType = 'photo' | 'video' | 'link' | 'rich';

export interface OEmbedBase {
  // The resource type. Valid values, along with value-specific parameters, are described below.
  type: OEmbedType;

  // The oEmbed version number. This must be 1.0.
  version: string;

  // A text title, describing the resource.
  title?: string;

  // The name of the author/owner of the resource.
  author_name?: string;

  // A URL for the author/owner of the resource.
  author_url?: string;

  // The name of the resource provider.
  provider_name?: string;

  // The url of the resource provider.
  provider_url?: string;

  // The suggested cache lifetime for this resource, in seconds. Consumers may
  // choose to use this value or not.
  cache_age?: number;

  // A URL to a thumbnail image representing the resource. The thumbnail must
  // respect any maxwidth and maxheight parameters. If this parameter is
  // present, thumbnail_width and thumbnail_height must also be present.
  thumbnail_url?: string;

  // The width of the optional thumbnail. If this parameter is present,
  // thumbnail_url and thumbnail_height must also be present.
  thumbnail_width?: number;

  // The height of the optional thumbnail. If this parameter is present,
  // thumbnail_url and thumbnail_width must also be present.
  thumbnail_height?: number;
}

// This type is used for representing static photos.
export interface OEmbedPhoto extends OEmbedBase {
  type: 'photo';

  // The source URL of the image. Consumers should be able to insert this URL
  // into an <img> element. Only HTTP and HTTPS URLs are valid.
  url: string;

  // The width in pixels of the image specified in the url parameter.
  width: number;

  // The height in pixels of the image specified in the url parameter.
  height: number;
}

// This type is used for representing playable videos.
export interface OEmbedVideo extends OEmbedBase {
  type: 'video';

  // The HTML required to embed a video player. The HTML should have no padding
  // or margins. Consumers may wish to load the HTML in an off-domain iframe to
  // avoid XSS vulnerabilities.
  html: string;

  // The width in pixels required to display the HTML.
  width: number;

  // The height in pixels required to display the HTML.
  height: number;
}

// Responses of this type allow a provider to return any generic embed data
// (such as title and author_name), without providing either the url or html
// parameters. The consumer may then link to the resource, using the URL
// specified in the original request.
export type OEmbedLink = OEmbedBase & {
  type: 'link';
};

// This type is used for rich HTML content that does not fall under one of the
// other categories.
export interface OEmbedRich extends OEmbedBase {
  type: 'rich';
  // The HTML required to display the resource. The HTML should have no padding
  // or margins. Consumers may wish to load the HTML in an off-domain iframe to
  // avoid XSS vulnerabilities. The markup should be valid XHTML 1.0 Basic.
  html: string;

  // The width in pixels required to display the HTML.
  width: number;

  // The height in pixels required to display the HTML.
  height: number;
}

export type OEmbed = OEmbedPhoto | OEmbedVideo | OEmbedLink | OEmbedRich;
