import { DefaulPluginOptions } from '../../interfaces/ArenaPlugin';
import {
  IzoConfig, ScrProcessor, Srcset, UploadProcessor,
} from '../image/types';

export type BackImagePluginOptions = DefaulPluginOptions & {
  srcset?: Srcset,
  prepareSrc?: ScrProcessor,
  upload?: UploadProcessor,
  izoConfig?: IzoConfig,
};
