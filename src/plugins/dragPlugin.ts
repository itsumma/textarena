import { ArenaSelection } from '../helpers';
import { ArenaPlugin, ChildArena, ChildArenaNode } from '../interfaces';
/* eslint-disable no-param-reassign */
import Textarena from '../Textarena';

export const dragPlugin = (): ArenaPlugin => ({
  register(textarena: Textarena): void {
    const model = textarena.getModel();
    // const view = textarena.getView();
    const editor = textarena.getEditorElement();

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

    const dragendListener = (event: DragEvent): void => {
      editor.querySelectorAll('.ts-drag-entered')
        .map((elem) => elem.removeClass('ts-drag-entered'));
      const { target } = event;
      if (target && event.dataTransfer) {
        const elem = target as HTMLElement;
        const nodeId = elem.getAttribute('arena-id');
        if (nodeId) {
          const node = model.getNodeById(nodeId);
          if (node) {
            elem.style.opacity = '1';
          }
        }
      }
    };

    const dragoverListener = (event: DragEvent): void => {
      if (!event.target || !event.dataTransfer) {
        return;
      }
      const { dataTransfer } = event;
      const types: string[] = [...dataTransfer.types || []];
      if (!types.includes('textarena')) {
        return;
      }
      const elem = event.target as HTMLElement;
      if (elem.hasAttribute('cursor-id')) {
        event.preventDefault();
      }

      // const selection = view.getSelectionForElem(elem);
      // if (!selection) {
      //   return;
      // }
      // const { node } = selection.getCursor();

      // try {
      //   const data = dataTransfer.getData('textarena');
      //   const { nodeId, arenaName } = JSON.parse(data);
      //   if (!arenaName) {
      //     return;
      //   }
      //   const arena = textarena.getArena(arenaName) as ChildArena;
      //   if (!arena) {
      //     return;
      //   }
      //   if (textarena.isAllowedNode(node, arena)) {
      //     event.preventDefault();
      //   }
      // } catch (e) {
      //   event.preventDefault();
      // }
    };

    const dragenterListener = (event: DragEvent): void => {
      const elem = event.target as HTMLElement;
      if (!elem.hasAttribute('cursor-id')) {
        return;
      }
      elem.classList.add('ts-drag-entered');
    };

    const dragleaveListener = (event: DragEvent): void => {
      const elem = event.target as HTMLElement;
      if (!elem.hasAttribute('cursor-id')) {
        return;
      }
      elem.classList.remove('ts-drag-entered');
    };

    textarena.subscribe('turnOn', () => {
      editor.addEventListener('dragstart', dragstartListener, false);
      editor.addEventListener('dragend', dragendListener, false);
      editor.addEventListener('dragover', dragoverListener, false);
      editor.addEventListener('dragenter', dragenterListener, false);
      editor.addEventListener('dragleave', dragleaveListener, false);
    });
    textarena.subscribe('turnOff', () => {
      editor.removeEventListener('dragstart', dragstartListener);
      editor.removeEventListener('dragend', dragendListener);
      editor.removeEventListener('dragover', dragoverListener);
      editor.removeEventListener('dragenter', dragenterListener);
      editor.removeEventListener('dragleave', dragleaveListener);
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
            editor.querySelectorAll('.ts-drag-entered')
              .map((elem) => elem.removeClass('ts-drag-entered'));
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
            node.insertChildren([targetNode], offset);
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
