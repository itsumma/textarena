import CreatorContext from 'interfaces/CreatorContext';

export default function hr(context: CreatorContext): void {
  document.execCommand('insertHorizontalRule');
}
