import Toolbar from '~/Toolbar';

type ToolProcessor<T = {}> = (toolbar: Toolbar, config: T) => void;

export default ToolProcessor;
