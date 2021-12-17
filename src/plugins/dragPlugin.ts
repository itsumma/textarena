import { ArenaSelection } from '../helpers';
import { ArenaPlugin, ChildArena, ChildArenaNode } from '../interfaces';
/* eslint-disable no-param-reassign */
import Textarena from '../Textarena';

declare global {
  interface DragEvent {
    layerY: number;
  }
}

const clearElementClasses = (elem: HTMLElement): HTMLElement => {
  elem.classList.remove('ts-drag-entered', 'ts-drag-over-before', 'ts-drag-over-after');
  return elem;
};

export const dragPlugin = (): ArenaPlugin => ({
  register(textarena: Textarena): void {
    const model = textarena.getModel();
    let enteredElement: HTMLElement | undefined;
    const editor = textarena.getEditorElement();
    const editorHtmlElement = editor.getElem();

    const dragstartListener = (event: DragEvent): void => {
      const { target } = event;
      if (target && event.dataTransfer) {
        const elem = target as HTMLElement;
        const nodeId = elem.getAttribute('node-id');
        if (nodeId) {
          const node = model.getNodeById(nodeId);
          if (node) {
            elem.style.opacity = '0.4';
            event.dataTransfer.effectAllowed = 'move';
            event.dataTransfer.dropEffect = 'move';
            event.dataTransfer.setData('textarena', JSON.stringify({
              nodeId,
              arenaName: node.arena.name,
            }));
            return;
          }
        }
      }
      event.preventDefault();
    };

    const getElementWithCursorId = (elem: HTMLElement): HTMLElement | undefined => {
      let currentElement = elem;
      while (
        currentElement !== editorHtmlElement
        || currentElement !== editorHtmlElement.parentElement
      ) {
        if (currentElement.hasAttribute && currentElement.hasAttribute('cursor-id')) return currentElement;
        if (!currentElement.parentElement) return undefined;
        currentElement = currentElement.parentElement;
      }
      return undefined;
    };

    const handleDragEvent = (event: DragEvent) => {
      const elem = getElementWithCursorId(event.target as HTMLElement);
      if (elem) {
        enteredElement = elem;
        event.preventDefault();
        const { layerY } = event;
        elem.classList.add('ts-drag-entered');
        if (layerY < elem.clientHeight / 2) {
          elem.classList.add('ts-drag-over-before');
          elem.classList.remove('ts-drag-over-after');
        } else {
          elem.classList.add('ts-drag-over-after');
          elem.classList.remove('ts-drag-over-before');
        }
      }
    };

    const dragendListener = (event: DragEvent): void => {
      if (enteredElement) {
        clearElementClasses(enteredElement);
        enteredElement = undefined;
      }
      const { target } = event;
      if (target && event.dataTransfer) {
        const elem = target as HTMLElement;
        const nodeId = elem.getAttribute('node-id');
        if (nodeId) {
          const node = model.getNodeById(nodeId);
          if (node) {
            elem.style.opacity = '1';
          }
        }
      }
    };

    const dragoverListener = (event: DragEvent): void => {
      if (!event.target) {
        return;
      }

      handleDragEvent(event);
    };

    const dragenterListener = (event: DragEvent): void => {
      const elem = getElementWithCursorId(event.target as HTMLElement);
      if (!elem) {
        return;
      }
      if (enteredElement) {
        clearElementClasses(enteredElement);
      }
      elem.classList.add('ts-drag-entered');
      handleDragEvent(event);
    };

    textarena.subscribe('turnOn', () => {
      editor.addEventListener('dragstart', dragstartListener, false);
      editor.addEventListener('dragend', dragendListener, false);
      editor.addEventListener('dragover', dragoverListener, false);
      editor.addEventListener('dragenter', dragenterListener, false);
    });
    textarena.subscribe('turnOff', () => {
      editor.removeEventListener('dragstart', dragstartListener);
      editor.removeEventListener('dragend', dragendListener);
      editor.removeEventListener('dragover', dragoverListener);
      editor.removeEventListener('dragenter', dragenterListener);
    });
    textarena.registerMiddleware(
      (
        ta: Textarena,
        selection: ArenaSelection,
        data: string | DataTransfer,
      ): [boolean, ArenaSelection] => {
        if (typeof data === 'object') {
          const types: string[] = [...data.types || []];
          if (types.includes('textarena')) {
            const before: boolean = enteredElement?.classList.value.includes('before') ?? false;
            if (enteredElement) {
              clearElementClasses(enteredElement);
            }
            let { node, offset } = selection.getCursor();
            const { nodeId, arenaName } = JSON.parse(data.getData('textarena'));
            const targetNode = model.getNodeById(nodeId) as ChildArenaNode;
            const targetOffset = targetNode.getIndex();
            const arena = textarena.getArena(arenaName) as ChildArena;
            if (!targetNode || !arena) {
              return [false, selection];
            }
            if (!node.hasChildren || !node.isAllowedNode(arena)) {
              if (node.hasParent && node.parent.isAllowedNode(arena)) {
                offset = node.getIndex();
                node = node.parent;
              } else {
                return [false, selection];
              }
            }
            const newSelection = selection;
            targetNode.parent.cutChildren(targetOffset, 1);
            if (targetNode.parent === node && targetOffset <= offset) {
              offset -= 1;
            }
            node.insertChildren([targetNode], before ? offset : (offset + 1));
            newSelection.setBoth(targetNode, targetNode.getIndex());
            return [true, newSelection];
          }
        }
        return [false, selection];
      },
      'before',
    );
  },
});
