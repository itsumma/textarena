import CreatorContext from 'interfaces/CreatorContext';
import CreatorOptions from 'interfaces/CreatorOptions';
import CreatorPlugin from 'interfaces/CreatorPlugin';
import Textarena from 'Textarena';

export default class Hr implements CreatorPlugin {
  html = '<hr />';

  register(textarena: Textarena): void {
    textarena.creatorBar.registerCreator('hr', this.getCreatorOptions());
  }

  getCreatorOptions(): CreatorOptions {
    return {
      name: 'hr',
      title: 'Add text separator',
      icon: '<b>—</b>',
      controlKey: 'h',
      processor: this.processor.bind(this),
    };
  }

  processor(context: CreatorContext): void {
    context.parser.prepareAndPasteHtml(this.html);
  }
}
