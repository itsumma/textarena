import { DefaultPluginOptions } from '../../interfaces/ArenaPlugin';

type ImgSize = {
  width: number;
  height: number;
};

export type Srcset = Array<{
  media: string;
  rations: Array<ImgSize & { ratio: number }>
}>;

export type ScrProcessor = (src: string, width?: number, height?: number) => string;

export type UploadProcessor = (file: File) => Promise<{ src: string, [key: string]: unknown }>;

export type IzoConfig = {
  url: string,
  token: string,
};

export type ImagePluginOptions = DefaultPluginOptions & {
  srcset?: Srcset,
  prepareSrc?: ScrProcessor,
  upload?: UploadProcessor,
  izoConfig?: IzoConfig,
};
