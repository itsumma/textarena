import { ArenaFormatings } from '../../interfaces/ArenaFormating';
import { AnyArenaNode, ArenaNodeMediator } from '../../interfaces/ArenaNode';

const outputFigure = (
  type: string,
  node: AnyArenaNode,
  frms: ArenaFormatings,
): string => {
  const imageNode = (node as ArenaNodeMediator).getChild(0);
  const captionNode = (node as ArenaNodeMediator).getChild(1);
  return `
    <figure>
      ${imageNode?.getOutput(type, frms)}
      ${captionNode?.getOutput(type, frms)}
    </figure>
  `;
};

export default outputFigure;
