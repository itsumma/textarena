import {
  EmbedProvider,
  EmbedProviderEndpoint,
  GetEmbedProvider,
  GetEmbedProviderResult,
  OEmbedVideo,
  ProviderOptions,
} from './types';

export const providerGetter = (
  providers: EmbedProvider[],
  opts?: ProviderOptions[],
): GetEmbedProvider => (url: string): GetEmbedProviderResult | undefined => {
  for (let i = 0; i < providers.length; i += 1) {
    const provider = providers[i];
    for (let ie = 0; ie < provider.endpoints.length; ie += 1) {
      const endpoint = provider.endpoints[ie];
      for (let j = 0; j < endpoint.schemes.length; j += 1) {
        const scheme = endpoint.schemes[j];
        const regex = new RegExp(
          scheme
            .replace(/\./g, '\\.')
            .replace(/\?/g, '\\?')
            .replace(/\//g, '\\/')
            .replace(/\*/g, '.*'),
        );
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

export const getEmbedUrl = (
  endpoint: EmbedProviderEndpoint,
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
