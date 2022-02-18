import Textarena from '../Textarena';

export interface CreatorPlugin {
  register(textarena: Textarena): void;
}
