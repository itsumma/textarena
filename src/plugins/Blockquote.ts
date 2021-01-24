import CreatorContext from 'interfaces/CreatorContext';
import CreatorOptions from 'interfaces/CreatorOptions';
import CreatorPlugin from 'interfaces/CreatorPlugin';
import Textarena from 'Textarena';

export default class Blockquote implements CreatorPlugin {
  html = '<blockquote></blockquote>';

  register(textarena: Textarena): void {
    textarena.creatorBar.registerCreator('blockquote', this.getCreatorOptions());
    textarena.parser.registerTag('BLOCKQUOTE', {
      level: 'ROOT_LEVEL',
      insideLevel: 'ROOT_LEVEL',
    });
  }

  getCreatorOptions(): CreatorOptions {
    return {
      name: 'blockquote',
      icon: '”',
      title: 'Blockquote',
      processor: this.processor.bind(this),
    };
  }

  processor(context: CreatorContext): void {
    context.parser.prepareAndPasteHtml(this.html);
  }
}
