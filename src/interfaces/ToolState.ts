type ToolState<T = { [key: string]: string|number|Element }> = (context: any, config: T) => boolean;

export default ToolState;
