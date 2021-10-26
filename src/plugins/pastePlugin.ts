import Textarena from '../Textarena';
import ArenaPlugin from '../interfaces/ArenaPlugin';
import ArenaSelection from '../helpers/ArenaSelection';

const pastePlugin = (): ArenaPlugin => ({
  register(textarena: Textarena): void {
    textarena.registerMiddleware(
      (
        ta: Textarena,
        selection: ArenaSelection,
        data: string | DataTransfer,
      ): [boolean, ArenaSelection] => {
        if (typeof data === 'object') {
          const types: string[] = [...data.types || []];
          if (types.includes('text/html')) {
            let html = data.getData('text/html');
            if (!html) {
              return [false, selection];
            }
            const matchStart = /(<!--StartFragment-->)|(<meta charset=['"][^'"]+['"]>)/.exec(html);
            if (matchStart) {
              html = html.slice(matchStart.index + matchStart[0].length);
              html = html.trimLeft();
            }
            const matchEnd = /<!--EndFragment-->/.exec(html);
            if (matchEnd) {
              html = html.slice(0, matchEnd.index);
              html = html.trimRight();
            }
            if (!html) {
              return [false, selection];
            }
            // html = html.replace(/\u00A0/, ' ');

            const newSelection = ta.insertHtml(selection, html);
            return [true, newSelection];
          }
          if (types.includes('text/plain')) {
            const text = data.getData('text/plain');
            if (!text) {
              return [false, selection];
            }
            const newSelection = ta.insertText(selection, text);
            return [true, newSelection];
          }
        }
        return [false, selection];
      },
      'before',
    );
  },
});

export default pastePlugin;
