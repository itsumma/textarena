import embedServices from './embedServices';
import {
  EmbedElem,
  OEmbedProvider,
  OEmbedProviderEndpoint,
  EmbedService,
  GetEmbedProvider,
  GetEmbedProviderResult,
  OEmbedVideo,
  ProviderOptions,
} from './types';

/**
 * Factory function which returns a method to get OEmbedProviderEndpoint for
 * specified url, so we could pass it to Embed ArenaNode
 * @param providers OEmbedProvider[]
 * @param opts optional ProviderOptions[]
 * @returns (url: string): GetEmbedProviderResult | undefined
 */
export const providerGetter = (
  providers: OEmbedProvider[],
  opts?: ProviderOptions[],
): GetEmbedProvider => (url: string): GetEmbedProviderResult | undefined => {
  for (let i = 0; i < providers.length; i += 1) {
    const provider = providers[i];
    for (let ie = 0; ie < provider.endpoints.length; ie += 1) {
      const endpoint = provider.endpoints[ie];
      for (let j = 0; j < endpoint.schemes.length; j += 1) {
        const scheme = endpoint.schemes[j];
        const regex = new RegExp(`^${
          scheme
            .replace(/\./g, '\\.')
            .replace(/\?/g, '\\?')
            .replace(/\//g, '\\/')
            .replace(/\*/g, '.*')
        }$`);
        if (regex.test(url)) {
          return {
            endpoint,
            provider_name: provider.provider_name,
            opts: opts
              ? opts.find((p) => p.name === provider.provider_name)
              : undefined,
          };
        }
      }
    }
  }
  return undefined;
};

/**
 * Construct url according to https://oembed.com to fetch embed
 * @param endpoint OEmbedProviderEndpoint
 * @param url string - url of the shared resource (post, video, etc...) to embed
 * @param opts optional ProviderOptions
 * @returns string
 */
export const getEmbedUrl = (
  endpoint: OEmbedProviderEndpoint,
  url: string,
  opts?: ProviderOptions,
) => {
  const params: {
    url: string;
    format: string;
    maxwidth?: number;
    maxheight?: number;
  } = {
    url,
    format: 'json',
  };
  if (opts?.maxwidth) {
    params.maxwidth = opts.maxwidth;
  }
  if (opts?.maxheight) {
    params.maxheight = opts.maxheight;
  }
  const encoded = Object.entries(params).map(
    (kv) => kv.map(encodeURIComponent).join('='),
  ).join('&');
  return `${endpoint.url}?${encoded}`;
};

export const fetchEmbedData = (
  url: string,
): Promise<OEmbedVideo> => fetch(url).then((body) => body.json());

/**
 * This function processes html field of the response from provider endpoint
 * e.g. https://oembed.com/#section5
 * The html string can contain <script> elements which won't be processed by
 * the browser. So here we use a hack to create script element with the same
 * attributes as were in original html script element. Then we delete the old
 * script element from the html DOM tree.
 * @param html string - html field of video response https://oembed.com/#section5
 * @returns HTMLElement
 */
export const processEmbedHtml = (html: string): HTMLElement => {
  const body = document.createElement('div');
  body.innerHTML = html;
  const scripts: HTMLScriptElement[] = [];
  body.querySelectorAll('script').forEach((script: HTMLScriptElement) => {
    const newScript = document.createElement('script') as HTMLScriptElement;
    const attrs = script.attributes;
    for (let i = attrs.length - 1; i >= 0; i -= 1) {
      newScript.setAttribute(attrs[i].name, attrs[i].value);
    }
    scripts.push(newScript);
    body.removeChild(script);
  });
  for (let i = 0; i < scripts.length; i += 1) {
    body.appendChild(scripts[i]);
  }
  return body;
};

/**
 * This function checks if provided utl pattern matches one of embed services
 * defined at embedServices.ts
 * @param url string - url of shared post, video etc...
 * @returns EmbedElem
 */

export const createElemEmbed = (url: string): EmbedElem | undefined => {
  const keys = Object.keys(embedServices);
  let type: string | undefined;
  let service: EmbedService | undefined;
  let found = false;
  for (let i = 0; i < keys.length; i += 1) {
    type = keys[i];
    service = embedServices[type];
    if (service.regex.test(url)) {
      found = true;
      break;
    }
  }
  if (!found || !service || !type) return undefined;
  const {
    regex,
    embedUrl,
    id = (ids: string[]) => ids.shift() as string,
  } = service;
  const result = regex.exec(url)?.slice(1) as string[];
  const embed = embedUrl.replace(/<%= remote_id %>/g, id(result));
  return {
    type,
    embed,
  };
};
