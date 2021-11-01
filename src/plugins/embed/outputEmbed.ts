import { AnyArenaNode } from '../../interfaces/ArenaNode';
import { RenderTypes } from './types';
import embedServices from './embedServices';

interface RenderParams {
  embedType: string;
  embed: string;
  amp?: boolean;
}

const iframeId = (type: string, embed: string | undefined) => `iframe-${type}-${embed?.split('/').pop()?.split('?').pop()}`;

const embedRender = ({
  embedType,
  embed,
  amp,
}: RenderParams): string => {
  const service = embedServices[embedType];
  let res = `<div embed class="embed embed-${embedType}" type="${embedType}">`;
  if (service) {
    let { html } = service;
    if (amp) {
      html = html
        .replace(/<\s*iframe/, '<amp-iframe')
        .replace(/<\s*\/\s*iframe\s*>/, '</amp-iframe>');
    }
    res += html.replace(/^<([^>]+?)>/, `<$1 id="${iframeId(embedType, embed)}" src="${embed}">`);
  }
  res += '</div>';
  return res;
};

const outputEmbed = (type: string, node: AnyArenaNode): string => {
  const embedType = (node.getAttribute('type') || '') as string;
  const embed = (node.getAttribute('embed') || '') as string;
  return embedRender({
    embedType, embed, amp: type === RenderTypes.AMP,
  });
};

export default outputEmbed;
