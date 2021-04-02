import Textarena from '../Textarena';
import ArenaPlugin from '../interfaces/ArenaPlugin';
import ArenaCursorText from '../interfaces/ArenaCursorText';

const typoSugarPlugin = (): ArenaPlugin => ({
  register(textarena: Textarena): void {
    const arenas = textarena.getArenas();
    arenas.forEach((arena) => {
      if (arena.hasText) {
        arena.registerMiddleware((ta: Textarena, cursor: ArenaCursorText, text: string) => {
          if (text === '-') {
            const { node, offset } = cursor;
            if (node.getRawText().slice(offset - 2, offset) === '--') {
              node.cutText(offset - 2, offset);
              node.insertText('—', offset - 2);
              return [true, { node, offset: offset - 1 }];
            }
          }
          return [false, cursor];
        });
      }
    });
  },
});

export default typoSugarPlugin;
