import Textarena from 'Textarena';

export default interface ArenaPlugin {
  register: (textarena: Textarena, options: any) => void;
}
