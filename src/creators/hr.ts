import CreatorContext from '~/interfaces/CreatorContext';

export default function hr(context: CreatorContext): void {
  const elem = document.createElement('p');
  // elem.contentEditable = "false";
  elem.className = 'textarena__hr';
  const hrElement = document.createElement('HR');
  elem.appendChild(hrElement);
  if (context.focusElement) {
    const nextElement = context.focusElement.nextElementSibling;
    if (nextElement) {
      context.focusElement.replaceWith(elem);

      // this.eventManager.fire({
      //   name: 'changeFocusElement',
      //   target: nextElement,
      // });
      const s = window.getSelection();
      const r = document.createRange();
      r.setStart(nextElement, 0);
      r.setEnd(nextElement, 0);
      if (s) {
        s.removeAllRanges();
        s.addRange(r);
      }
      nextElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } else if (context.focusElement.parentNode) {
      context.focusElement.parentNode.insertBefore(elem, context.focusElement);
      const s = window.getSelection();
      const r = document.createRange();
      r.setStart(context.focusElement, 0);
      r.setEnd(context.focusElement, 0);
      if (s) {
        s.removeAllRanges();
        s.addRange(r);
      }
    }
  }
}
