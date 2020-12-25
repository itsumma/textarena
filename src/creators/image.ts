import CreatorContext from 'interfaces/CreatorContext';
import { insertImage } from 'utils';

export default function image(context: CreatorContext): void {
  let url = 'http://';
  const value = prompt('Введите IMAGE URL', url);
  if (value === null || !value) return;
  insertImage(value, context);
}
