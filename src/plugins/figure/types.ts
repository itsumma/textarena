import { DefaulPluginOptions } from '../../interfaces/ArenaPlugin';
import { Srcset } from '../image/types';

export type FigurePluginOptions = DefaulPluginOptions & {
  srcset?: Srcset,
  placeholder: string,
};
