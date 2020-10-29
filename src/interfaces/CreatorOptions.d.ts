import CreatorProcessor from './CreatorProcessor';

export default interface CreatorOptions<T = unknown> {
  name: string;
  icon: string;
  title: string;
  config?: T;
  controlKey?: string;
  altKey?: string;
  processor: CreatorProcessor<T>;
}
