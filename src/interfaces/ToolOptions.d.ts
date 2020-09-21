export default interface ToolOptions<T = {}> {
  name: string;
  icon?: string;
  config?: T;
  processor?: (context: any, config: T) => void;
}