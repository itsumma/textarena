import Textarena from 'Textarena';

export default interface CreatorPlugin {
  register(textarena: Textarena): void;
}
