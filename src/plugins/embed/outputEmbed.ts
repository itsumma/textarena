import { AnyArenaNode } from '../../interfaces/ArenaNode';
import { EmbedTypes, RenderTypes } from './types';

const embedRender = (
  embedType: string,
  href: string,
  postid?: string,
  border?: string,
): string => {
  let res = `<div embed class="embed" type=${embedType}>`;
  switch (embedType) {
    case EmbedTypes.twitter:
      res += ` <blockquote class="twitter-tweet" postid=${postid || ''} data-lang="ru">
        </blockquote>`;
      break;
    case EmbedTypes.facebook:
      res += `<div class="fb-post"
               data-href="${href}"
               data-width="auto"
               data-show-captions="false">
          </div>`;
      break;
    case EmbedTypes.instagram:
      res += `<blockquote
            class="instagram-media"
            data-instgrm-version="10"
            data-instgrm-captioned
            data-instgrm-permalink="${href}"
            postid="${postid || ''}"
            style='background:#FFF; border:0; border-radius:3px; box-shadow:0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15); margin: 1px; max-width:540px; min-width:326px; padding:0; width:99.375%; width:-webkit-calc(100% - 2px); width:calc(100% - 2px);'
            data-lang="ru">
          </blockquote>`;
      break;
    case EmbedTypes.youtube:
      res += `<div class='embed-youtube ${border ? 'embed-youtube_border' : ''}'>
        <iframe
          class="embed-youtube-iframe"
          src="${href}"
          frameborder="0"
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          width="560"
          height="315"
          allowfullscreen=""
        ></iframe>
      </div>`;
      break;
    default:
      res = '';
  }
  if (res) res += '</div>';
  return res;
};

const ampRender = (embedType: string, href: string, postid?: string): string => {
  let res = `<div data-embed data-type=${embedType}>`;
  switch (embedType) {
    case EmbedTypes.twitter:
      res += `<amp-twitter width="375" height="472" layout="responsive" data-tweetid="${postid}">
              </amp-twitter>`;
      break;
    case EmbedTypes.facebook:
      res += `<amp-facebook class="fb-post" width="552" height="310"
              layout="responsive"
              data-href="${href}">
              </amp-facebook>`;

      break;
    case EmbedTypes.instagram:
      res += `<amp-instagram
          data-shortcode="${postid}"
          data-captioned
          width="400"
          height="400"
          layout="responsive"
          >
        </amp-instagram>`;
      break;
    case EmbedTypes.youtube:
      res += `<amp-youtube
          data-videoid="${href.split('/').reverse()[0]}"
          layout="responsive"
          width="480"
          height="270"
          class="embed-youtube-iframe"
        ></amp-youtube>`;
      break;
    default:
      res = '';
  }
  if (res) res += '</div>';
  return res;
};

const outputEmbed = (type: string, node: AnyArenaNode): string => {
  const embedType = (node.getAttribute('type') || '') as string;
  const href = (node.getAttribute('href') || '') as string;
  let postid = (node.getAttribute('postid') || '') as string;
  const border = (node.getAttribute('border') || '') as string;
  if (embedType === EmbedTypes.instagram) {
    let path = new URL(href).pathname;
    path = path.endsWith('/') ? path.slice(0, -1) : path;
    [postid] = path.split('/').reverse();
  }
  if (type === RenderTypes.AMP) {
    return ampRender(embedType, href, postid);
  }
  return embedRender(embedType, href, postid, border);
};

export default outputEmbed;
