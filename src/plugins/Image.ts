import CreatorContext from 'interfaces/CreatorContext';
import CreatorOptions from 'interfaces/CreatorOptions';
import CreatorPlugin from 'interfaces/CreatorPlugin';
import Textarena from 'Textarena';
import { insertImage } from 'utils';

export default class Image implements CreatorPlugin {
  url = 'http://';

  promtText = 'Введите IMAGE URL';

  register(textarena: Textarena): void {
    textarena.creatorBar.registerCreator('image', this.getCreatorOptions());
  }

  getCreatorOptions(): CreatorOptions {
    return {
      name: 'image',
      title: 'Add image',
      icon: '🌄',
      controlKey: 'g',
      processor: this.processor.bind(this),
    };
  }

  processor(context: CreatorContext): void {
    // eslint-disable-next-line no-alert
    const value = prompt(this.promtText, this.url);
    if (value === null || !value) return;
    insertImage(value, context);
  }
}
