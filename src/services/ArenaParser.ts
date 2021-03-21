import AnyArena from '../interfaces/arena/AnyArena';
import ArenaFormating from '../interfaces/ArenaFormating';
import ArenaNode from '../interfaces/ArenaNode';
import ArenaNodeText from '../interfaces/ArenaNodeText';
import ArenaNodeScion from '../interfaces/ArenaNodeScion';

import RichTextManager from '../helpers/RichTextManager';

import ArenaServiceManager from './ArenaServiceManager';

export default class ArenaParser {
  constructor(protected asm: ArenaServiceManager) {
  }

  public insertHtmlToRoot(
    htmlString: string,
  ): void {
    this.asm.logger.log(htmlString);
    this.insertHtmlToModel(
      htmlString,
      this.asm.model.model,
      0,
    );
    this.asm.model.model.getTextCursor(0);
  }

  public insertHtmlToModel(
    htmlString: string,
    arenaNode: ArenaNode,
    offset: number,
  ): [ArenaNode, number] {
    const node = document.createElement('DIV');
    node.innerHTML = htmlString;
    return this.insertChildren(node, arenaNode, offset);
  }

  private insertChildren(
    node: HTMLElement,
    arenaNode: ArenaNode,
    offset: number,
  ): [ArenaNode, number] {
    let currentNode = arenaNode;
    let currentOffset = offset;
    let firstTextNode = true;
    node.childNodes.forEach((childNode) => {
      const result = this.insertChild(
        childNode,
        currentNode,
        currentOffset,
        firstTextNode,
        // i === 0,
        // i === node.childNodes.length - 1,
      );

      if (result) {
        [currentNode, currentOffset] = result;
        if (result[2] && firstTextNode) {
          firstTextNode = false;
        }
      }
    });
    return [currentNode, currentOffset];
  }

  private insertChild(
    node: ChildNode,
    arenaNode: ArenaNode,
    offset: number,
    firstTextNode: boolean,
    // first: boolean,
    // last: boolean,
  ): [ArenaNode, number, boolean] {
    // console.log('isert', node, arenaNode);
    if (node.nodeType === Node.TEXT_NODE) {
      const text = this.clearText(
        node.textContent,
        // first,
        // last,
        !('hasText' in arenaNode),
      );
      if (text.length === 0) {
        return [arenaNode, offset, false];
      }
      const result = arenaNode.insertText(text, offset);
      return [result.node, result.offset, true];
    }
    if (node.nodeType === Node.ELEMENT_NODE) {
      const elementNode = node as HTMLElement;
      const arena = this.checkArenaMark(elementNode);
      if (arena) {
        // if ('hasText' in arenaNode && firstTextNode) {
        //   const result = this.insertChildren(elementNode, arenaNode, offset);
        //   return [...result, true];
        // }
        // const newArenaNode = arenaNode.createAndInsertNode(arena, offset);
        let newArenaNode: ArenaNode & (ArenaNodeScion | ArenaNodeText) | undefined;
        if ('hasText' in arenaNode && firstTextNode && arenaNode.getTextLength() === 0) {
          const cursor = arenaNode.remove();
          newArenaNode = cursor.node.createAndInsertNode(arena, cursor.offset);
        } else {
          newArenaNode = arenaNode.createAndInsertNode(arena, offset);
        }
        if (newArenaNode) {
          this.setAttributes(newArenaNode, elementNode);
          if ('hasText' in newArenaNode) {
            const formatings = this.getText(elementNode);
            this.asm.logger.log('this is arena for text', formatings);
            newArenaNode.insertText(formatings, 0);
            this.clearTextNode(newArenaNode);
          } else {
            this.insertChildren(elementNode, newArenaNode, 0);
          }
          return [newArenaNode.parent, newArenaNode.getIndex() + 1, true];
        }
        this.asm.logger.log('this is arena');
        const res = this.insertChildren(elementNode, arenaNode, offset);
        return [...res, true];
      }
      const formating = this.checkFormatingMark(elementNode);
      if (formating) {
        const formatings = this.getText(elementNode);
        formatings.insertFormating(formating.name, 0, formatings.getTextLength());
        this.asm.logger.log('this is formating', formatings);
        const res = arenaNode.insertText(formatings, offset);
        return [res.node, res.offset, true];
      }
      const res = this.insertChildren(elementNode, arenaNode, offset);
      return [...res, true];
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
      const [name, value] = attribute.split('=');
      if (name === 'style') {
        const [styleName, styleValue] = value.split(':');
        if (!(styleName in node.style)
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          || node.style[styleName as any] !== styleValue.trim().toLowerCase()) {
          return false;
        }
      } else if (node.getAttribute(name) !== value) {
        return false;
      }
    }
    return true;
  }

  private getText(node: HTMLElement): RichTextManager {
    const formatings = new RichTextManager();
    let offset = 0;
    node.childNodes.forEach((childNode) => {
      if (childNode.nodeType === Node.TEXT_NODE) {
        const text = this.clearText(childNode.textContent);
        offset = formatings.insertText(text, offset);
      } else if (childNode.nodeType === Node.ELEMENT_NODE) {
        const elementNode = childNode as HTMLElement;
        const newFormatings = this.getText(elementNode);
        const arena = this.checkArenaMark(elementNode);
        if (arena?.inline) {
          const inlineNode = newFormatings.addInlineNode(arena, 0, newFormatings.getTextLength());
          if (inlineNode) {
            elementNode.getAttributeNames().forEach((attr) => {
              inlineNode.setAttribute(attr, elementNode.getAttribute(attr) || '');
            });
          }
        }
        const formating = this.checkFormatingMark(elementNode);
        if (formating) {
          newFormatings.insertFormating(formating.name, 0, newFormatings.getTextLength());
        }
        offset = formatings.insertText(newFormatings, offset);
      } else {
        this.asm.logger.error('unaccepted node type, remove', childNode);
      }
      // [currentNode, currentOffset] = this.parseNode(childNode, currentNode, currentOffset);
    });
    return formatings;
  }

  clearText(
    text: string | null,
    // first = false,
    // last = false,
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

  protected clearTextNode(newArenaNode: ArenaNodeText): void {
    newArenaNode.ltrim();
    newArenaNode.rtrim();
    newArenaNode.clearSpaces();
  }

  protected setAttributes(node: ArenaNode, element: HTMLElement): void {
    element.getAttributeNames().forEach((attr) => {
      if (node.arena.allowedAttributes.includes(attr)) {
        node.setAttribute(attr, element.getAttribute(attr) || '');
      }
    });
  }
}
