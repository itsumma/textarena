import CreatorContext from '~/interfaces/CreatorContext';

export default function image(context: CreatorContext): void {
  const { focusElement } = context;
  let url = 'http://';
  if (focusElement && focusElement.tagName === 'IMG') {
    url = focusElement.getAttribute('src') || '';
  }
  if (focusElement?.children) {
    for (let i = 0; i < focusElement.children.length; i += 1) {
      const c = focusElement.children.item(i);
      if (c?.tagName === 'IMG') {
        url = c.getAttribute('src') || '';
        break;
      }
    }
  }
  const value = prompt('Введите IMAGE URL', url);
  if (value === null) return;
  if (focusElement && focusElement.tagName === 'IMG') {
    if (value) {
      focusElement.setAttribute('src', value);
    }
  } else if (value) {
    document.execCommand('insertImage', false, value);
  }
}
