import Typograf from 'typograf';
import ArenaServiceManager from './ArenaServiceManager';
import ElementHelper from '../helpers/ElementHelper';
import { AnyArenaNode } from '../interfaces/ArenaNode';
import helpTextRu from '../helpTextRu';
import utils from '../utils';

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

  container: ElementHelper;

  content: ElementHelper;

  helpWrap: ElementHelper | undefined;

  lastDocumentOverflow = '';

  constructor(
    private asm: ArenaServiceManager,
  ) {
    this.elem = new ElementHelper('ARENA-COUNTER', 'textarena-counter');
    this.content = new ElementHelper('DIV', 'textarena-counter__content');
    const typoButton = new ElementHelper('BUTTON', 'textarena-typograf', 'Типограф <sup>beta</sup>');
    typoButton.setAttribute('type', 'button');
    typoButton.onClick((e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      this.typograf();
    });
    const helpButton = new ElementHelper('BUTTON', 'textarena-help', '?');
    helpButton.setAttribute('type', 'button');
    helpButton.onClick((e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      this.openHelp();
    });
    this.elem.appendChild(this.content);
    this.elem.appendChild(typoButton);
    this.elem.appendChild(helpButton);
    this.container = this.asm.textarena.getContainerElement();
    this.container.appendChild(this.elem);
    this.asm.eventManager.subscribe('ready', this.update.bind(this));
    this.asm.eventManager.subscribe('modelChanged', debounce(this.update.bind(this), 1000));
  }

  private update(): void {
    let symbols = 0;
    let words = 0;
    utils.modelTree.runOfChildren(this.asm.model.model, (n: AnyArenaNode) => {
      if (n.hasText) {
        symbols += n.getTextLength();
        words += n.getRawText().replace(/[^a-zA-Zа-яА-Я]/, '').split(/\s/).filter((w) => w !== '').length;
        // TODO считать количество картинок
      }
    });
    const time = Math.round(symbols / 1500);
    const readTime = time > 0 ? `${time} мин.` : 'меньше минуты';
    this.content.setInnerHTML(`Символов: ${symbols}, слов: ${words}, время чтения: ${readTime}`);
  }

  public typograf(): void {
    const tp = new Typograf({ locale: ['ru', 'en-US'] });
    utils.modelTree.runOfChildren(this.asm.model.model, (n: AnyArenaNode) => {
      if (n.hasText) {
        n.clearSpaces();
        n.delBeforeDot();
        n.setRawText(tp.execute(n.getRawText()));
      }
    });
    const sel = this.asm.view.getCurrentSelection();
    if (sel) {
      this.asm.history.save(sel);
    }
    this.asm.eventManager.fire('modelChanged', { selection: sel });
  }

  public openHelp(): void {
    const wrap = new ElementHelper('DIV', 'textarena-help-wrap');
    wrap.onClick(() => {
      this.closeHelp();
    });
    const close = new ElementHelper('BUTTON', 'textarena-help-close', `<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
    viewBox="0 0 512.001 512.001" xml:space="preserve">
    <g>
      <path d="M294.111,256.001L504.109,46.003c10.523-10.524,10.523-27.586,0-38.109c-10.524-10.524-27.587-10.524-38.11,0L256,217.892
        L46.002,7.894c-10.524-10.524-27.586-10.524-38.109,0s-10.524,27.586,0,38.109l209.998,209.998L7.893,465.999
        c-10.524,10.524-10.524,27.586,0,38.109c10.524,10.524,27.586,10.523,38.109,0L256,294.11l209.997,209.998
        c10.524,10.524,27.587,10.523,38.11,0c10.523-10.524,10.523-27.586,0-38.109L294.111,256.001z" fill="currentColor"/>
    </g>
    </svg>`);
    close.setAttribute('type', 'button');
    close.onClick((e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      this.closeHelp();
    });
    const shortcutsHelp = this.asm.commandManager.getHelp()
      .map((item) => `<tr><td>${item.shortcut}</td><td>${item.description}</td></tr>`).join('\n');
    const help = new ElementHelper('DIV', 'textarena-help-popup', `${helpTextRu}<table>${shortcutsHelp}</table>`);
    help.appendChild(close);
    wrap.appendChild(help);
    this.lastDocumentOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    this.container.appendChild(wrap);
    this.helpWrap = wrap;
  }

  public closeHelp(): void {
    if (this.helpWrap) {
      this.helpWrap.remove();
      this.helpWrap = undefined;
    }
    document.body.style.overflow = this.lastDocumentOverflow;
  }
}
