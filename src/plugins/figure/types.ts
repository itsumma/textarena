import { DefaultPluginOptions } from '../../interfaces';
import { Srcset } from '../image';

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
