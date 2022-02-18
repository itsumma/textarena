import { DefaultPluginOptions } from '../../interfaces';
import {
  IzoConfig, ScrProcessor, Srcset, UploadProcessor,
} from '../image';

export type BackImagePluginOptions = DefaultPluginOptions & {
  srcset?: Srcset,
  prepareSrc?: ScrProcessor,
  upload?: UploadProcessor,
  izoConfig?: IzoConfig,
};
