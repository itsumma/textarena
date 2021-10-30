import { AnyArenaNode } from '../../interfaces/ArenaNode';

const outputVideo = (
  type: string,
  node: AnyArenaNode,
): string => {
  const src = node.getAttribute('src') as string;
  const mime = node.getAttribute('mime') as string;
  const className = node.arena.getAttribute('classes') as string;
  if (!src) {
    return '';
  }
  const source = `<source src="${src}" type="${mime && mime !== '' ? mime : 'video/mp4'}">`;
  return `
    <video autoplay muted playsinline class="${className}">
      ${source}
    </video>
  `;
};

export default outputVideo;
