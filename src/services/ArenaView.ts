import { render } from 'lit-html';
import ArenaSelection from '../helpers/ArenaSelection';
import { ArenaNodeText } from '../interfaces/ArenaNode';
import ArenaServiceManager from './ArenaServiceManager';

export default class ArenaView {
  constructor(protected asm: ArenaServiceManager) {
  }

  public render(selection?: ArenaSelection): void {
    const result = this.asm.model.getHtml();
    const container = this.asm.textarena.getEditorElement().getElem();
    console.log('REEEEEEEEEEEEnder');
    render(result, container);
    if (selection) {
      this.currentSelection = selection;
    }
    if (this.currentSelection) {
      this.applyArenaSelection(this.currentSelection);
    }
    this.asm.eventManager.fire({ name: 'rendered' });
  }

  public getCurrentSelection(): ArenaSelection | undefined {
    if (!this.currentSelection) {
      this.currentSelection = this.detectArenaSelection();
    }
    return this.currentSelection;
  }

  public resetCurrentSelection(): void {
    this.currentSelection = undefined;
  }

  protected currentSelection: ArenaSelection | undefined;

  protected applyArenaSelection(selection: ArenaSelection): ArenaView {
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
        setTimeout(() => {
          try {
            (focusNode as HTMLElement)?.scrollIntoView({
              block: 'nearest',
              behavior: 'smooth',
            });
          } catch (e) {
            //
          }
        }, 100);
      }
    }
    return this;
  }

  public detectArenaSelection(): ArenaSelection | undefined {
    const s = window.getSelection();
    const range = s && s.rangeCount > 0 ? s.getRangeAt(0) : undefined;
    if (s && range) {
      const startId = this.getNodeIdAndOffset(range.startContainer, range.startOffset);
      const endId = this.getNodeIdAndOffset(range.endContainer, range.endOffset);
      if (startId && endId) {
        const startNode = this.asm.model.getTextNodeById(startId[0]);
        const endNode = this.asm.model.getTextNodeById(endId[0]);
        if (startNode && endNode) {
          const direction = s.focusNode === range.endContainer ? 'forward' : 'backward';
          return new ArenaSelection(startNode, startId[1], endNode, endId[1], direction);
        }
      }
    }
    return undefined;
  }

  protected getNodeIdAndOffset(
    node: Node | HTMLElement,
    offset: number,
  ): [string, number] | undefined {
    if (node.nodeType === Node.ELEMENT_NODE) {
      const elementNode = node as HTMLElement;
      const id = elementNode.getAttribute('arena-id');
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

  protected getChildNodes(node: HTMLElement): ChildNode[] {
    return Array.from(node.childNodes)
      .filter((child) => [Node.TEXT_NODE, Node.ELEMENT_NODE].includes(child.nodeType))
      .filter((child) => child.nodeType !== Node.ELEMENT_NODE
        || (child as HTMLElement).contentEditable !== 'false');
  }

  protected isEmptyNode(node: Node): boolean {
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

  protected getTextLength(
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

  protected getElementAndOffset(
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
    return document.querySelector(`[arena-id="${id}"]`);
  }

  protected reachOffset(element: Element, offset: number): [ChildNode, number] | number {
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
