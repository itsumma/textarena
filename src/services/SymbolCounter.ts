import Typograf from 'typograf';
import ArenaServiceManager from './ArenaServiceManager';
import ElementHelper from '../helpers/ElementHelper';
import { AnyArenaNode } from '../interfaces/ArenaNode';

function debounce<T extends Array<unknown>>(
  func: (...args: T) => void,
  wait: number,
  immediate = false,
) {
  let timeout: number | undefined;
  return (...args: T) => {
    const later = () => {
      timeout = undefined;
      if (!immediate) {
        func(...args);
      }
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait) as unknown as number;
    if (callNow) {
      func(...args);
    }
  };
}

export default class SymbolCounter {
  elem: ElementHelper;

  content: ElementHelper;

  constructor(
    private asm: ArenaServiceManager,
  ) {
    this.elem = new ElementHelper('ARENA-COUNTER', 'textarena-counter');
    this.content = new ElementHelper('DIV', 'textarena-counter__content');
    const button = new ElementHelper('BUTTON', 'textarena-typograf', 'Типограф <sup>beta</sup>');
    button.onClick(() => {
      this.typograf();
    });
    this.elem.appendChild(this.content);
    this.elem.appendChild(button);
    const container = this.asm.textarena.getContainerElement();
    container.appendChild(this.elem);
    this.asm.eventManager.subscribe('ready', this.update.bind(this));
    this.asm.eventManager.subscribe('modelChanged', debounce(this.update.bind(this), 1000));
  }

  private update(): void {
    let symbols = 0;
    let words = 0;
    this.asm.model.runOfChildren(this.asm.model.model, (n: AnyArenaNode) => {
      if (n.hasText) {
        symbols += n.getTextLength();
        words += n.getRawText().split(/\s/).filter((w) => w !== '').length;
        // TODO считать количество картинок
      }
    });
    const time = Math.round(symbols / 1500);
    const readTime = time > 0 ? `${time} мин.` : 'меньше минуты';
    this.content.setInnerHTML(`Символов: ${symbols}, слов: ${words}, время чтения: ${readTime}`);
  }

  public typograf(): void {
    const tp = new Typograf({ locale: ['ru', 'en-US'] });
    this.asm.model.runOfChildren(this.asm.model.model, (n: AnyArenaNode) => {
      if (n.hasText) {
        n.setRawText(tp.execute(n.getRawText()));
      }
    });
    const sel = this.asm.view.getCurrentSelection();
    if (sel) {
      this.asm.history.save(sel);
    }
    this.asm.eventManager.fire('modelChanged', sel);
  }
}
