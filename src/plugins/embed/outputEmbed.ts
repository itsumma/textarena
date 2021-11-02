import { AnyArenaNode } from '../../interfaces/ArenaNode';

const outputEmbed = (type: string, node: AnyArenaNode): string => {
  const html = node.getAttribute('html') as string | undefined;
  return html ? JSON.parse(html) : '';
};

export default outputEmbed;
