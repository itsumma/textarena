import CreatorOptions from './CreatorOptions';

export default interface CreatorBarOptions {
  enabled?: boolean;
  creators: (CreatorOptions | string)[];
};
