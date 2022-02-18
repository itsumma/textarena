import { ArenaMediatorInterface } from '../../interfaces';
import Textarena from '../../Textarena';
import { ArenaPluginOptions } from './types';

export function initArena(
  textarena: Textarena,
  opts: ArenaPluginOptions,
): ArenaMediatorInterface {
  const {
    name, tag, attributes, allowedAttributes,
    allowedArenas, arenaForText, defaultParentArena, output,
    noPseudoCursor,
    component, componentConstructor,
    marks,
    parentArenas,
  } = opts;
  // const allowedArenas = textarena.getSimpleArenas();
  if (component && componentConstructor && !customElements.get(component)) {
    customElements.define(component, componentConstructor);
  }
  const arena = textarena.registerArena(
    {
      name,
      tag,
      attributes,
      allowedAttributes,
      allowedArenas,
      arenaForText,
      noPseudoCursor,
      defaultParentArena,
      output,
    },
    marks,
    parentArenas,
  ) as ArenaMediatorInterface;
  return arena;
}
