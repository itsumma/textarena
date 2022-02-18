import { ArenaSelection } from '../helpers';
import Textarena from '../Textarena';

export type CommandAction = (textarena: Textarena, selection: ArenaSelection)
  => ArenaSelection | boolean | Promise<ArenaSelection>;
