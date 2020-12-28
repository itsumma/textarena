import CreatorContext from 'interfaces/CreatorContext';
import { insertImage } from 'utils';

export default function image(context: CreatorContext): HTMLElement | undefined {
  const url = 'http://';
  const value = prompt('Введите IMAGE URL', url);
  if (value === null || !value) return;
  // eslint-disable-next-line consistent-return
  return insertImage(value, context);
}
