import { IzoConfig } from '../image';
import { UploadVideoResult } from './types';

export function izoVideoUpload(config: IzoConfig) {
  return function upload(file: File): Promise<UploadVideoResult> {
    return new Promise((accept, reject) => {
      const data = new FormData();
      data.append('file', file);
      fetch(config.url, {
        method: 'POST',
        body: data,
        headers: {
          Authorization: `Bearer ${config.token}`,
        },
      }).then((response) => {
        if (response.ok) {
          response.json().then(({ location: src, mime }) => {
            if (src) {
              accept({ src, mime });
            } else {
              reject();
            }
          }).catch(() => {
            reject();
          });
        }
      }).catch(() => {
        reject();
      });
    });
  };
}
