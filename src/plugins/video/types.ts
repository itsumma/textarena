import { DefaulPluginOptions } from '../../interfaces/ArenaPlugin';

export interface UploadResult {
  src: string;
  mime?: string;
  [key: string]: unknown;
}

export type UploadProcessor = (file: File) => Promise<UploadResult>;

export type IzoConfig = {
  url: string,
  token: string,
};

export type VideoPluginOptions = DefaulPluginOptions & {
  classes?: string,
  upload?: UploadProcessor,
  izoConfig?: IzoConfig,
};
