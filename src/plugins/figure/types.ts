import { DefaultPluginOptions } from '../../interfaces/ArenaPlugin';
import { Srcset } from '../image/types';

export type FigureClass = {
  className: string,
  ratio?: number,
  icon: string,
  srcset?: Srcset,
};

export type FigurePluginOptions = DefaultPluginOptions & {
  srcset?: Srcset,
  classes?: FigureClass[],
  placeholder: string,
};
