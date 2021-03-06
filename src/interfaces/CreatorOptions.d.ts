import CreatorProcessor from './CreatorProcessor';

export default interface CreatorOptions<T = unknown> {
  name: string;
  icon: string;
  title: string;
  command: string;
  hint: string;
  shortcut: string;
}
