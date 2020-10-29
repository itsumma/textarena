import ToolProcessor from './ToolProcessor';
import ToolState from './ToolState';

export type ToolOptionsType = { [key: string]: string|number|Element };

export default interface ToolOptions<T = ToolOptionsType> {
  name: string;
  icon: string;
  title: string;
  config?: T;
  controlKey?: string;
  altKey?: string;
  state?: ToolState<T>;
  processor: ToolProcessor<T>;
}
