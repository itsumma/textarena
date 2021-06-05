import ArenaFormating from '../interfaces/ArenaFormating';

import RichTextManager from '../helpers/RichTextManager';

import ArenaServiceManager from './ArenaServiceManager';
import { AnyArenaNode, ArenaNodeText } from '../interfaces/ArenaNode';
import { AnyArena } from '../interfaces/Arena';
import ArenaSelection from '../helpers/ArenaSelection';

export default class ArenaParser {
  constructor(protected asm: ArenaServiceManager) {
  }

  public insertHtmlToRoot(
    htmlString: string,
  ): ArenaSelection | undefined {
    this.asm.logger.log(htmlString);
    this.insertHtmlToModel(
      htmlString,
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
        const inlineNode = text.addInlineNode(arena, 0, text.getTextLength());
        if (!inlineNode) {
          return [...this.insertChildren(elementNode, arenaNode, offset), true];
        }
        elementNode.getAttributeNames().forEach((attr) => {
          inlineNode.setAttribute(attr, elementNode.getAttribute(attr) || '');
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
          if (arenaNode.isEmpty()) {
            const cursot = arenaNode.remove();
            return this.insertChild(
              htmlNode,
              cursot.node,
              cursot.offset,
              firstNode,
            );
          }
          return [...this.insertChildren(elementNode, arenaNode, offset), true];
        }
        const newArenaNode = this.asm.model.createAndInsertNode(arena, arenaNode, offset);
        if (!newArenaNode) {
          return [...this.insertChildren(elementNode, arenaNode, offset), true];
        }
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
          if (cursorNode.hasParent) {
            return [cursorNode.parent, cursorNode.getIndex() + 1, true];
          }
          return [cursorNode, cursorOffset, true];
          // this.insertChildren(elementNode, newArenaNode, 0);
          // return [newArenaNode.parent, newArenaNode.getIndex() + 1, true];
        }

        // if (arenaNode.hasChildren && arenaNode.protected && !arenaNode.isAllowedNode(arena)) {
        //   return [arenaNode, offset, false];
        // }
        // if ('hasText' in arenaNode && firstTextNode) {
        //   const result = this.insertChildren(elementNode, arenaNode, offset);
        //   return [...result, true];
        // }
        // const newArenaNode = arenaNode.createAndInsertNode(arena, offset);
        // let newArenaNode: ChildArenaNode | undefined;
        // if (firstNode && arenaNode.hasText && arenaNode.isEmpty()) {
        //   // remove current node
        //   const cursor = arenaNode.remove();
        //   if (cursor.node.isAllowedNode(arena)) {
        //     newArenaNode = this.asm.model.createChildNode(arena);
        //     newArenaNode = cursor.node.insertNode(newArenaNode, cursor.offset);
        //     // arenaNode.createAndInsertNode(arena, offset);
        //   }
        //   // newArenaNode = cursor.node.createAndInsertNode(arena, cursor.offset);
        // } else if (arenaNode.hasChildren && arenaNode.isAllowedNode(arena)) {
        //   newArenaNode = this.asm.model.createChildNode(arena);
        //   newArenaNode = arenaNode.insertNode(newArenaNode, offset);
        //   // arenaNode.createAndInsertNode(arena, offset);
        //   // newArenaNode = arenaNode.createAndInsertNode(arena, offset);
        // } else if (arenaNode.hasParent && !(arenaNode.hasChildren && arenaNode.protected)) {
        //   newArenaNode = this.asm.model.createAndInsertNode(
        //     arena,
        //     arenaNode.parent,
        //     arenaNode.getIndex() + 1,
        //   );
        // }
        // if (newArenaNode) {
        //   this.setAttributes(newArenaNode, elementNode);
        //   if (newArenaNode.hasText) {
        //     const formatings = this.getText(elementNode);
        //     newArenaNode.insertText(formatings, newArenaNode.getTextLength());
        //     this.clearTextNode(newArenaNode);
        //   } else if (newArenaNode.single) {
        //     return [newArenaNode.parent, newArenaNode.getIndex() + 1, true];
        //   } else {
        //     this.insertChildren(elementNode, newArenaNode, 0);
        //   }
        //   return [newArenaNode.parent, newArenaNode.getIndex() + 1, true];
        // }
        // const res = this.insertChildren(elementNode, arenaNode, offset);
        // return [...res, true];
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
        if (this.checkAttributes(node, mark.attributes)) {
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
        if (this.checkAttributes(node, mark.attributes)) {
          return mark.formating;
        }
      }
    }
    return undefined;
  }

  private checkAttributes(node: HTMLElement, attributes: string[]): boolean {
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
          const inlineNode = newFormatings.addInlineNode(arena, 0, newFormatings.getTextLength());
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

  protected clearText(
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
    result = result.replace(/\n/g, ' ')
      .replace(/ {2,}/g, ' ')
      .replace(/\u00A0/, ' ');
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
