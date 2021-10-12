import Textarena from '../../Textarena';
import { ArenaInlineInterface } from '../../interfaces/Arena';
import ElementHelper from '../../helpers/ElementHelper';

function showModal(
  linkModal: ElementHelper,
  _ta: Textarena,
) {
  linkModal.setProperty('showed', true);
}

export default function linkManage(
  ta: Textarena,
  arena: ArenaInlineInterface,
  linkModal: ElementHelper,
): void {
  showModal(linkModal, ta);
}
