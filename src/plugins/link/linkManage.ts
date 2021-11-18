import Textarena from '../../Textarena';
import { ArenaInlineInterface } from '../../interfaces/Arena';
import { ArenaNodeInline, ArenaNodeText } from '../../interfaces/ArenaNode';
import ElementHelper from '../../helpers/ElementHelper';

function hideLinkbar(linkbar: ElementHelper) {
  linkbar.removeAttribute('show');
}

const leftPadding = 15;

function showLinkbar(
  inlinePair: [ArenaNodeText, ArenaNodeInline],
  linkbar: ElementHelper,
  ta: Textarena,
) {
  const s = window.getSelection();
  if (!s || !s.isCollapsed || s.rangeCount === 0) {
    return;
  }
  const { focusNode } = s;
  if (!focusNode) {
    return;
  }
  let focusElement = focusNode as HTMLElement;
  if (focusNode.nodeType !== 1) {
    focusElement = focusNode.parentElement as HTMLElement;
  }
  if (!focusElement) {
    return;
  }
  const rootElement = focusElement.closest('.textarena-editor');
  if (!rootElement) {
    return;
  }
  const range = s.getRangeAt(0);
  const rect = range.getBoundingClientRect();
  const containerRect = ta.getContainerElement().getBoundingClientRect();
  let positionTop = true;
  if (rect.y < window.innerHeight / 2) {
    positionTop = rect.top >= window.innerHeight - rect.bottom;
  }
  if (positionTop) {
    let elemBottom = containerRect.bottom - rect.top;
    if (rect.top < 100) {
      elemBottom -= 100;
    }
    linkbar.css({
      top: 'auto',
      bottom: `${elemBottom}px`,
    });
  } else {
    let elemTop = rect.top - containerRect.top + rect.height;
    if (window.innerHeight - rect.bottom < 100) {
      elemTop -= 100;
    }
    linkbar.css({
      top: `${elemTop}px`,
      bottom: 'auto',
    });
  }
  const centerPosition = (rect.left + rect.right) / 2;
  linkbar.setAttribute('centerPosition', centerPosition.toString());
  const [parent, node] = inlinePair;
  linkbar.setProperty('node', node);
  linkbar.setProperty('parent', parent);
  linkbar.setAttribute('show', '');
  setTimeout(() => {
    const linkBarRect = linkbar.getElem().shadowRoot?.children[0].getBoundingClientRect();
    if (!linkBarRect) return;
    let left = rect.left - containerRect.left - linkBarRect.width / 2;
    const right = containerRect.right - window.innerWidth;
    if (containerRect.left - leftPadding + left < 0) left = -containerRect.left + leftPadding;
    if (rect.left + linkBarRect.width / 2 + leftPadding > window.innerWidth) {
      left = window.innerWidth - leftPadding - linkBarRect.width - containerRect.left;
    }
    linkbar.css({
      left: `${left}px`,
      right: `${right}px`,
    });
  });
}

export default function linkManage(
  ta: Textarena,
  arena: ArenaInlineInterface,
  linkbar: ElementHelper,
): void {
  const selection = ta.getCurrentSelection();
  if (!selection || !selection.isCollapsed()) {
    hideLinkbar(linkbar);
    return;
  }
  const inlinePair = ta.getInlineNode(selection, arena);
  if (!inlinePair) {
    hideLinkbar(linkbar);
    return;
  }
  showLinkbar(inlinePair, linkbar, ta);
}
