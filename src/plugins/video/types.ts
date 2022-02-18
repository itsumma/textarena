import { DefaultPluginOptions } from '../../interfaces';
import { IzoConfig } from '../image';

export interface UploadVideoResult {
  src: string;
  mime?: string;
  [key: string]: unknown;
}

export type UploadVideoProcessor = (file: File) => Promise<UploadVideoResult>;

export type VideoPluginOptions = DefaultPluginOptions & {
  classes?: string,
  upload?: UploadVideoProcessor,
  izoConfig?: IzoConfig,
};
