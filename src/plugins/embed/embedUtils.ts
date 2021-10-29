import { EmbedElem, EmbedService } from './types';
import embedServices from './embedServices';

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
    width: ew,
    height: eh,
    id = (ids: string[]) => ids.shift() as string,
  } = service;
  const result = regex.exec(url)?.slice(1) as string[];
  const embed = embedUrl.replace(/<%= remote_id %>/g, id(result));
  return {
    type,
    embed,
    ew,
    eh,
  };
};
