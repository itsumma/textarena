import ToolOptions from './ToolOptions';

export default interface ToolbarOptions {
  enabled?: boolean;
  tools: (ToolOptions | string)[];
}
