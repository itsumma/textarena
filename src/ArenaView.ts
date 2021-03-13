import { render } from 'lit-html';
import ArenaServiceInterface from 'interfaces/ArenaServiceInterface';
import Textarena from 'Textarena';
import ArenaSelection from 'ArenaSelection';
import ArenaNodeText from 'interfaces/ArenaNodeText';

export default class ArenaView implements ArenaServiceInterface {
  constructor(private textarena: Textarena) {
  }

  public render(selection?: ArenaSelection): void {
    const result = this.textarena.model.model.getHtml(this.textarena.model);
    const container = this.textarena.editor.getElem();
    render(result, container);
    if (selection) {
      this.setArenaSelection(selection);
    }
  }

  public setArenaSelection(selection: ArenaSelection): ArenaView {
    const s = window.getSelection();
    if (s) {
      const {
        startNode,
        startOffset,
        endNode,
        endOffset,
      } = selection;
      const startResult = this.getElementAndOffset(startNode, startOffset);
      const endResult = selection.isCollapsed()
        ? startResult : this.getElementAndOffset(endNode, endOffset);
      if (startResult && endResult) {
        const [anchorNode, anchorOffset] = startResult;
        const [focusNode, focusOffset] = endResult;
        s.setBaseAndExtent(anchorNode, anchorOffset, focusNode, focusOffset);
      }
    }
    return this;
  }

  public getArenaSelection(): ArenaSelection | undefined {
    const s = window.getSelection();
    const range = s ? s.getRangeAt(0) : undefined;
    if (s && range) {
      const startId = this.getNodeIdAndOffset(range.startContainer, range.startOffset);
      const endId = this.getNodeIdAndOffset(range.endContainer, range.endOffset);
      if (startId && endId) {
        const startNode = this.textarena.model.getTextNodeById(startId[0]);
        const endNode = this.textarena.model.getTextNodeById(endId[0]);
        if (startNode && endNode) {
          const direction = s.focusNode === range.endContainer ? 'forward' : 'backward';
          return new ArenaSelection(startNode, startId[1], endNode, endId[1], direction);
        }
      }
    }
    return undefined;
  }

  private getNodeIdAndOffset(
    node: Node | HTMLElement,
    offset: number,
  ): [string, number] | undefined {
    if (node.nodeType === Node.ELEMENT_NODE) {
      const elementNode = node as HTMLElement;
      const id = elementNode.getAttribute('observe-id');
      if (id) {
        if (!node.textContent
          || (!/\u00A0/.test(node.textContent) && /^[\s\n]*$/g.test(node.textContent))
        ) {
          return [id, 0];
        }
        return [id, offset];
      }
    }
    if (node.parentElement) {
      let newOffset = offset;
      const siblings = this.getChildNodes(node.parentElement);
      const myIndex = siblings.indexOf(node as ChildNode);
      if (node.nodeType === Node.TEXT_NODE
        && myIndex === siblings.length - 1
        && this.isEmptyNode(node)) {
        newOffset = 0;
      }
      let stillEmpty = true;
      for (let i = 0; i < myIndex; i += 1) {
        const sibling = siblings[i];
        if (stillEmpty) {
          if (!this.isEmptyNode(sibling)) {
            stillEmpty = false;
          }
        }
        if (!stillEmpty) {
          newOffset += this.getTextLength(sibling);
        }
      }
      return this.getNodeIdAndOffset(node.parentElement, newOffset);
    }
    return undefined;
  }

  private getChildNodes(node: HTMLElement): ChildNode[] {
    return Array.from(node.childNodes)
      .filter((child) => [Node.TEXT_NODE, Node.ELEMENT_NODE].includes(child.nodeType));
  }

  private isEmptyNode(node: Node): boolean {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent || '';
      return !/\u00A0/.test(text) && /^[\s\n]*$/.test(text);
    }
    if (node.nodeType === Node.ELEMENT_NODE) {
      if ((node as HTMLElement).tagName === 'BR') {
        return true;
      }
      return false;
    }
    return true;
  }

  private getTextLength(
    node: ChildNode,
  ): number {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent || '';
      return text.length;
    }
    if (node.nodeType === Node.ELEMENT_NODE) {
      let len = 0;
      (node as HTMLElement).childNodes.forEach((childNode) => {
        len += this.getTextLength(childNode);
      });
      return len;
    }
    return 0;
  }

  private getElementAndOffset(
    node: ArenaNodeText,
    offset: number,
  ): [ChildNode, number] | undefined {
    const element = this.findElementById(node.getGlobalIndex());
    if (!element) {
      return undefined;
    }
    if (offset === 0) {
      return [element, 0];
    }
    const result = this.reachOffset(element, offset);
    if (typeof result === 'number') {
      return undefined;
    }
    return result;
  }

  public findElementById(id: string): Element | null {
    return document.querySelector(`[observe-id="${id}"]`);
  }

  public reachOffset(element: Element, offset: number): [ChildNode, number] | number {
    let reachedOffset = 0;
    let stillEmpty = true;
    for (let i = 0; i < element.childNodes.length; i += 1) {
      const childNode = element.childNodes[i];
      if (stillEmpty) {
        if (!this.isEmptyNode(childNode)) {
          stillEmpty = false;
        }
      }
      if (!stillEmpty) {
        if (childNode.nodeType === Node.TEXT_NODE) {
          const text = childNode.textContent || '';
          const curOffset = Math.min(text.length, offset - reachedOffset);
          reachedOffset += curOffset;
          if (reachedOffset === offset) {
            return [childNode, curOffset];
          }
        } else if (childNode.nodeType === Node.ELEMENT_NODE) {
          const result = this.reachOffset(childNode as HTMLElement, offset - reachedOffset);
          if (typeof result === 'number') {
            reachedOffset += result;
          } else {
            return result;
          }
        }
      }
    }
    return reachedOffset;
  }
}
