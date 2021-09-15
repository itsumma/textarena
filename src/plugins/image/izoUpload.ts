import { IzoConfig } from './types';

export function izoUpload(config: IzoConfig) {
  return function upload(file: File): Promise<{ src: string, [key: string]: unknown }> {
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
          response.json().then((src) => {
            if (src) {
              accept({ src });
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
