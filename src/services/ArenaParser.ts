import ArenaFormating from '../interfaces/ArenaFormating';

import RichTextManager from '../helpers/RichTextManager';

import ArenaServiceManager from './ArenaServiceManager';
import { AnyArenaNode, ArenaNodeText } from '../interfaces/ArenaNode';
import { AnyArena } from '../interfaces/Arena';
import ArenaSelection from '../helpers/ArenaSelection';
import { ArenaMark, FormatingMark } from './ArenaModel';
import utils from '../utils';

export default class ArenaParser {
  constructor(protected asm: ArenaServiceManager) {
  }

  public insertHtmlToRoot(
    htmlString: string,
  ): ArenaSelection | undefined {
    this.asm.logger.log(htmlString);
    const resultHtml = this.clearText(htmlString);
    this.insertHtmlToModel(
      resultHtml,
      this.asm.model.model,
      0,
    );
    const cursor = this.asm.model.getOrCreateNodeForText(this.asm.model.model);
    if (cursor) {
      return new ArenaSelection(
        cursor.node,
        cursor.offset,
        cursor.node,
        cursor.offset,
        'backward',
      );
    }
    return undefined;
  }

  public insertHtmlToModel(
    htmlString: string,
    arenaNode: AnyArenaNode,
    offset: number,
  ): [AnyArenaNode, number] {
    const node = document.createElement('DIV');
    node.innerHTML = htmlString;
    return this.insertChildren(node, arenaNode, offset);
  }

  private insertChildren(
    node: HTMLElement,
    arenaNode: AnyArenaNode,
    offset: number,
  ): [AnyArenaNode, number] {
    let currentNode = arenaNode;
    let currentOffset = offset;
    let successful;
    let firstNode = true;
    node.childNodes.forEach((childNode) => {
      [currentNode, currentOffset, successful] = this.insertChild(
        childNode,
        currentNode,
        currentOffset,
        firstNode,
      );

      if (successful && firstNode) {
        firstNode = false;
      }
    });
    return [currentNode, currentOffset];
  }

  /**
   * Insert html node into some arena node.
   * @param htmlNode ChildNode from DOM
   * @param arenaNode AnyArenaNode. Current Node in the tree
   * @param offset number. Current offset in the arenaNode
   * @param firstNode boolean. If true, it was not inserted any node into arenaNode.
   * @returns [AnyArenaNode, number, boolean]. Current node, offset
   * and whether it was successfully inserted arena node.
   */
  private insertChild(
    htmlNode: ChildNode,
    arenaNode: AnyArenaNode,
    offset: number,
    firstNode: boolean,
  ): [AnyArenaNode, number, boolean] {
    if (htmlNode.nodeType === Node.TEXT_NODE) {
      if (arenaNode.hasChildren && arenaNode.protected) {
        // dont insert any text in the protected node
        return [arenaNode, offset, false];
      }
      // if curent node has not text, ignore impty ctring
      const ignoreEmpty = !(arenaNode.hasText);
      const text = this.clearText(
        htmlNode.textContent,
        ignoreEmpty,
      );
      if (text.length === 0) {
        return [arenaNode, offset, false];
      }
      const cursor = this.asm.model.getOrCreateNodeForText(arenaNode, offset);

      if (cursor) {
        // TODO do not insert but replace
        const result = cursor.node.insertText(text, cursor.offset);
        return [result.node, result.offset, true];
      }
      return [arenaNode, offset, false];
    }
    if (htmlNode.nodeType === Node.ELEMENT_NODE) {
      const elementNode = htmlNode as HTMLElement;
      const arena = this.checkArenaMark(elementNode);
      if (arena && arena.inline) {
        const text = this.getText(elementNode);
        if (!text) {
          return [...this.insertChildren(elementNode, arenaNode, offset), true];
        }
        const inlineNode = this.asm.model.createInlineNode(arena);
        text.addInlineNode(inlineNode, 0, text.getTextLength());
        if (!inlineNode) {
          return [...this.insertChildren(elementNode, arenaNode, offset), true];
        }
        elementNode.getAttributeNames().forEach((attr) => {
          if (arena.allowedAttributes.includes(attr)) {
            inlineNode.setAttribute(attr, elementNode.getAttribute(attr) || '');
          }
        });
        const cursor = this.asm.model.getOrCreateNodeForText(arenaNode, offset);

        if (cursor) {
          const result = cursor.node.insertText(text, cursor.offset);
          return [result.node, result.offset, true];
        }
        return [arenaNode, offset, false];
      }
      if (arena && !arena.inline) {
        if (firstNode && arena.hasText && arenaNode.hasText) {
          if (arenaNode.isEmpty() && arenaNode.hasParent && !arenaNode.parent.protected) {
            const cursor = arenaNode.remove();
            return this.insertChild(
              htmlNode,
              cursor.node,
              cursor.offset,
              firstNode,
            );
          }
          return [...this.insertChildren(elementNode, arenaNode, offset), true];
        }
        if (arenaNode.hasChildren
          && arenaNode.protected
          && !arenaNode.arena.allowedArenas.includes(arena)
        ) {
          // dont insert not allowed nodes in the protected node
          // return [arenaNode, offset, false];
          return [...this.insertChildren(elementNode, arenaNode, offset), true];
        }
        const newArenaNode = this.asm.model.createAndInsertNode(arena, arenaNode, offset);
        if (!newArenaNode) {
          return [...this.insertChildren(elementNode, arenaNode, offset), true];
        }
        // try {
        //   this.asm.model.getTextCursor(newArenaNode, 0);
        // } catch (e) {
        //   //
        // }
        // const newArenaNode = this.asm.model.createChildNode(arena);
        this.setAttributes(newArenaNode, elementNode);
        if (newArenaNode.hasText) {
          const text = this.getText(elementNode);
          if (!text) {
            //
            return [...this.insertChildren(elementNode, newArenaNode, 0), true];
          }
          newArenaNode.insertText(text, newArenaNode.getTextLength());
          this.clearTextNode(newArenaNode);
          return [newArenaNode.parent, newArenaNode.getIndex() + 1, true];
        }
        if (newArenaNode.single) {
          return [newArenaNode.parent, newArenaNode.getIndex() + 1, true];
        }
        if (newArenaNode.hasChildren) {
          const [cursorNode, cursorOffset] = this.insertChildren(elementNode, newArenaNode, 0);
          const [commonAncestor, , offset2] = utils.modelTree.getCommonAncestor(
            { node: cursorNode, offset: cursorOffset },
            newArenaNode.getParent(),
          );
          if (commonAncestor) {
            return [commonAncestor, offset2 + 1, true];
          }
          if (cursorNode.hasParent && cursorNode.containsParent(newArenaNode.parent)) {
            return [newArenaNode.parent, newArenaNode.getIndex() + 1, true];
          }
          if (cursorNode.hasParent) {
            return [cursorNode.parent, cursorNode.getIndex() + 1, true];
          }
          return [cursorNode, cursorOffset, true];
          // this.insertChildren(elementNode, newArenaNode, 0);
          // return [newArenaNode.parent, newArenaNode.getIndex() + 1, true];
        }
      }
      const formating = this.checkFormatingMark(elementNode);
      if (formating) {
        const text = this.getText(elementNode);
        if (text) {
          text.insertFormating(formating.name, 0, text.getTextLength());
          // TODO dont insert text in node, but in model service.
          const cursor = this.asm.model.getOrCreateNodeForText(arenaNode, offset);
          if (cursor) {
            const res = cursor.node.insertText(text, cursor.offset);
            return [res.node, res.offset, true];
          }
        }
      }
      return [...this.insertChildren(elementNode, arenaNode, offset), true];
    }
    return [arenaNode, offset, false];
  }

  private checkArenaMark(node: HTMLElement): AnyArena | undefined {
    const marks = this.asm.model.getArenaMarks(node.tagName);
    if (marks) {
      for (let i = 0; i < marks.length; i += 1) {
        const mark = marks[i];
        if (this.checkAttributes(node, mark)) {
          return mark.arena;
        }
      }
    }
    return undefined;
  }

  private checkFormatingMark(node: HTMLElement): ArenaFormating | undefined {
    const marks = this.asm.model.getFormatingMarks(node.tagName);
    if (marks) {
      for (let i = 0; i < marks.length; i += 1) {
        const mark = marks[i];
        if (this.checkAttributes(node, mark)) {
          return mark.formating;
        }
      }
    }
    return undefined;
  }

  private checkAttributes(node: HTMLElement, mark: ArenaMark | FormatingMark): boolean {
    const { attributes, excludeAttributes } = mark;
    if (excludeAttributes) {
      for (let i = 0; i < excludeAttributes.length; i += 1) {
        const attribute: string = excludeAttributes[i];
        let [name, value] = attribute.split('=');
        name = name.trim();
        value = value.trim().replace(/^"(.*)"$/, '$1');
        if (name === 'style') {
          const [styleName, styleValue] = value.split(':');
          if (styleName in node.style
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            && node.style[styleName as any] === styleValue.trim().toLowerCase()) {
            return false;
          }
        } else if (name === 'class') {
          const values = value.split(' ').filter((v) => v.trim()).filter((v) => v.length > 0);
          for (let j = 0; j < values.length; j += 1) {
            if (node.classList.contains(values[j])) {
              return false;
            }
          }
        } else if (node.getAttribute(name) === value) {
          return false;
        }
      }
    }
    if (attributes.length === 0) {
      return true;
    }
    for (let i = 0; i < attributes.length; i += 1) {
      const attribute = attributes[i];
      let [name, value] = attribute.split('=');
      name = name.trim();
      value = value.trim().replace(/^"(.*)"$/, '$1');
      if (name === 'style') {
        const [styleName, styleValue] = value.split(':');
        if (!(styleName in node.style)
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          || node.style[styleName as any] !== styleValue.trim().toLowerCase()) {
          return false;
        }
      } else if (name === 'class') {
        const values = value.split(' ').filter((v) => v.trim()).filter((v) => v.length > 0);
        for (let j = 0; j < values.length; j += 1) {
          if (!node.classList.contains(values[j])) {
            return false;
          }
        }
        return true;
      } else if (node.getAttribute(name) !== value) {
        return false;
      }
    }
    return true;
  }

  private getText(node: HTMLElement): RichTextManager | undefined {
    const formatings = new RichTextManager();
    let offset = 0;
    for (let i = 0; i < node.childNodes.length; i += 1) {
      const childNode = node.childNodes[i];
      if (childNode.nodeType === Node.TEXT_NODE) {
        const text = this.clearText(childNode.textContent);
        offset = formatings.insertText(text, offset);
      } else if (childNode.nodeType === Node.ELEMENT_NODE) {
        const elementNode = childNode as HTMLElement;
        const newFormatings = this.getText(elementNode);
        if (!newFormatings) {
          return undefined;
        }
        const arena = this.checkArenaMark(elementNode);
        if (arena?.inline) {
          const inlineNode = this.asm.model.createInlineNode(arena);
          newFormatings.addInlineNode(inlineNode, 0, newFormatings.getTextLength());
          if (inlineNode) {
            elementNode.getAttributeNames().forEach((attr) => {
              if (arena.allowedAttributes.includes(attr)) {
                inlineNode.setAttribute(attr, elementNode.getAttribute(attr) || '');
              }
            });
          }
        } else if (arena) {
          return undefined;
        }
        const formating = this.checkFormatingMark(elementNode);
        if (formating) {
          newFormatings.insertFormating(formating.name, 0, newFormatings.getTextLength());
        }
        offset = formatings.insertText(newFormatings, offset);
      } else {
        // this.asm.logger.error('unaccepted node type, remove', childNode);
      }
      // [currentNode, currentOffset] = this.parseNode(childNode, currentNode, currentOffset);
    }
    return formatings;
  }

  public clearText(
    text: string | null,
    ignoreEmpty = false,
  ): string {
    let result = text || '';
    // const dontInsertEmptyString = first || last || !('hasText' in arenaNode);
    // console.log('Clear text', `«${result}»`, `fisrt: ${first}`, `last: ${first}`,
    // console.log('Clear text', `«${result}»`,
    //   `ignoreEmpty: ${ignoreEmpty}`);
    //  `dontInsertEmptyString: ${dontInsertEmptyString}`);
    // TODO except char 160
    if (ignoreEmpty && /^[\s\n]*$/.test(result)) {
      // console.log('\tDont insert');
      return '';
    }

    // We have to clear html from this empty tags because they mess up the
    // cursor movements and actions
    // TODO: Why?
    const tags = [
      'strong',
      'em',
      'u',
      's',
      'sub',
      'sup',
      'font',
      'mark',
      'code',
    ];
    const reg = new RegExp(`<(${tags.join('|')})[^>]*>\\s*?<\\/\\1>`, 'gi');

    result = result.replace(/\n/g, ' ')
      .replace(/ {2,}/g, ' ')
      .replace(/\u00A0/, ' ')
      .replace(reg, ' ');
    // if (first) {
    //   result = result.replace(/^[\s\n]+/, '');
    // }
    // if (last) {
    //   result = result.replace(/[\s\n]+$/, '');
    // }
    return result;
  }

  protected clearTextNode(textNode: ArenaNodeText): void {
    textNode.ltrim();
    textNode.rtrim();
    textNode.clearSpaces();
  }

  protected setAttributes(node: AnyArenaNode, element: HTMLElement): void {
    element.getAttributeNames().forEach((attr) => {
      if (node.arena.allowedAttributes.includes(attr)) {
        node.setAttribute(attr, element.getAttribute(attr) || true);
      }
    });
  }
}
