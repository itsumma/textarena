import { DefaultPluginOptions } from '../../interfaces/ArenaPlugin';
import {
  IzoConfig, ScrProcessor, Srcset, UploadProcessor,
} from '../image/types';

export type BackImagePluginOptions = DefaultPluginOptions & {
  srcset?: Srcset,
  prepareSrc?: ScrProcessor,
  upload?: UploadProcessor,
  izoConfig?: IzoConfig,
};
