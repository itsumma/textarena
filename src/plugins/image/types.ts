import { DefaulPluginOptions } from '../../interfaces/ArenaPlugin';

type ImgSize = {
  width: number;
  height: number;
};

export type Srcset = Array<{
  media: string;
  rations: Array<ImgSize & { ratio: number }>
}>;

export type ScrProcessor = (src: string, width?: number, height?: number) => string;

export type UploadProcessor = (file: File) => void;

export type ImagePluginOptions = DefaulPluginOptions & {
  srcset?: Srcset,
  prepareSrc?: ScrProcessor,
  upload?: UploadProcessor,
};
