import { render } from 'lit';

import { ArenaSelection } from '../helpers';
import { AnyArenaNode } from '../interfaces';
import utils from '../utils';
import { ArenaServiceManager } from './ArenaServiceManager';

export class ArenaView {
  constructor(protected asm: ArenaServiceManager) {
    this.asm.eventManager.subscribe('moveCursor', () => {
      this.selectNodes();
    });
  }

  public selectNodes() {
    const editor = this.asm.textarena
      .getEditorElement();
    editor.querySelectorAll('.textarena-selected')
      .map((elem) => elem.removeClass('textarena-selected'));
    const selection = this.getCurrentSelection();
    if (selection) {
      utils.modelTree.runThroughSelection(selection, (node, start, end) => {
        if (start === undefined && end === undefined) {
          const elem = editor.querySelector(`[arena-id="${node.getGlobalIndex()}"]`);
          if (elem) {
            elem.addClass('textarena-selected');
          }
        } else if (node.hasChildren) {
          const len = node.children.length;
          for (let i = start || 0; i < (end || len); i += 1) {
            const elem = editor.querySelector(`[arena-id="${node.children[i].getGlobalIndex()}"]`);
            if (elem) {
              elem.addClass('textarena-selected');
            }
          }
        }
      });
    }
  }

  public render(selection?: ArenaSelection): void {
    const result = this.asm.model.getTemplate();
    const container = this.asm.textarena.getEditorElement().getElem();
    const offset = selection?.startOffset;
    this.asm.logger.log('Render', offset);
    render(result, container);
    if (selection) {
      this.currentSelection = selection;
    }
    if (this.currentSelection) {
      this.applyArenaSelection(this.currentSelection);
      this.selectNodes();
    }
    this.asm.eventManager.fire('rendered');
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
            // (focusNode as HTMLElement)?.scrollIntoView({
            //   block: 'nearest',
            //   behavior: 'smooth',
            // });
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
      const startId = this.getNodeIdAndOffset(range.startContainer, range.startOffset, true);
      const endId = this.getNodeIdAndOffset(range.endContainer, range.endOffset, true);
      if (startId && endId) {
        const startNode = this.asm.model.getNodeById(startId[0]);
        const endNode = this.asm.model.getNodeById(endId[0]);
        if (startNode && endNode) {
          const direction = s.focusNode === range.endContainer ? 'forward' : 'backward';
          return new ArenaSelection(startNode, startId[1], endNode, endId[1], direction);
        }
      }
    }
    return undefined;
  }

  public getSelectionForElem(elem: HTMLElement): ArenaSelection | undefined {
    const startId = this.getNodeIdAndOffset(elem, 0, true);
    if (startId) {
      const startNode = this.asm.model.getNodeById(startId[0]);
      if (startNode) {
        return new ArenaSelection(startNode, startId[1], startNode, startId[1], 'forward');
      }
    }
    return undefined;
  }

  protected getNodeIdAndOffset(
    node: Node | HTMLElement,
    offset: number,
    first = false,
  ): [string, number] | undefined {
    if (node.nodeType === Node.ELEMENT_NODE) {
      const elementNode = node as HTMLElement;
      const arenaId = elementNode.getAttribute('arena-id');
      if (arenaId) {
        if (!node.textContent
          || (!/\u00A0/.test(node.textContent) && /^[\s\n]*$/g.test(node.textContent))
        ) {
          return [arenaId, 0];
        }
        if (!first || (offset > 0 && elementNode.childNodes.length === 0)) {
          return [arenaId, offset];
        }
        let newOffset = 0;
        for (let i = 0; i < offset; i += 1) {
          if (elementNode.childNodes[i]) {
            const sibling = elementNode.childNodes[i];
            newOffset += this.getTextLength(sibling);
          }
        }
        return [arenaId, newOffset];
      }
      const cursorId = elementNode.getAttribute('cursor-id');
      if (cursorId) {
        const ids = cursorId.split('.');
        if (ids.length > 1) {
          const parentOffset = ids.pop();
          const parentId = ids.join('.');
          return [parentId, parentOffset ? parseInt(parentOffset, 10) : 0];
        }
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
      return (node as HTMLElement).tagName === 'BR';
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
    node: AnyArenaNode,
    offset: number,
  ): [ChildNode, number] | undefined {
    const element = this.findElementByNodeAndOffset(node, offset);
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

  public findElementByNodeAndOffset(
    node: AnyArenaNode,
    offset: number,
  ): Element | null {
    if (node.hasText) {
      return document.querySelector(`[arena-id="${node.getGlobalIndex()}"]`);
    }
    if (node.hasChildren) {
      return document.querySelector(`[cursor-id="${node.getGlobalIndex()}.${offset}"]`);
    }
    return null;
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
