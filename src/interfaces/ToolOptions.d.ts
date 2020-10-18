import ToolProcessor from './ToolProcessor';
import ToolState from './ToolState';

export default interface ToolOptions<T = { [key: string]: string|number|Element }> {
  name: string;
  icon: string;
  title: string;
  config?: T;
  controlKey?: string;
  altKey?: string;
  state?: ToolState<T>;
  processor: ToolProcessor<T>;
}
