import CreatorContext from './CreatorContext';

type CreatorProcessor<T> = (context: CreatorContext, config: T) => void;

export default CreatorProcessor;
