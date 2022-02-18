/* eslint-disable no-useless-escape */
import { EmbedServiceMap } from './types';

export const embedServices: EmbedServiceMap = {
  vimeo: {
    regex: /^(?:http[s]?:\/\/)?(?:www.)?(?:player.)?vimeo\.co(?:.+\/([^\/]\d+)(?:#t=[\d]+)?s?$)$/,
    embedUrl: 'https://player.vimeo.com/video/<%= remote_id %>?title=0&byline=0',
    html: '<iframe style="width:100%;" height="320" frameborder="0"></iframe>',
    height: 320,
    width: 580,
  },
  youtube: {
    regex: /^(?:https?:\/\/)?(?:www\.)?(?:(?:youtu\.be\/)|(?:youtube\.com)\/(?:v\/|u\/\w\/|embed\/|watch))(?:(?:\?v=)?([^#&?=]*))?((?:[?&]\w*=\w*)*)$/,
    embedUrl: 'https://www.youtube.com/embed/<%= remote_id %>',
    html: '<iframe class="embed-youtube-iframe" style="width:100%;" height="320" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"></iframe>',
    height: 320,
    width: 580,
    id: ([id, params]: string[]) => {
      if (!params && id) {
        return id;
      }

      const paramsMap: {[key: string]: string} = {
        start: 'start',
        end: 'end',
        t: 'start',
        // eslint-disable-next-line camelcase
        time_continue: 'start',
        list: 'list',
      };

      let paramId = id;
      const paramsFiltered = params.slice(1)
        .split('&')
        .map((param) => {
          const [name, value] = param.split('=');

          if (!id && name === 'v') {
            paramId = value;

            return null;
          }

          if (!(name in paramsMap)) {
            return null;
          }

          return `${paramsMap[name]}=${value}`;
        })
        .filter((param) => !!param);

      return `${paramId}?${paramsFiltered.join('&')}`;
    },
  },
  coub: {
    regex: /^https?:\/\/coub\.com\/view\/([^\/\?\&]+)$/,
    embedUrl: 'https://coub.com/embed/<%= remote_id %>',
    html: '<iframe style="width:100%;" height="320" frameborder="0" allowfullscreen></iframe>',
    height: 320,
    width: 580,
  },
  imgur: {
    regex: /^https?:\/\/(?:i\.)?imgur\.com.*\/([a-zA-Z0-9]+)(?:\.gifv)?$/,
    embedUrl: 'https://imgur.com/<%= remote_id %>/embed',
    html: '<iframe allowfullscreen="true" scrolling="no" class="imgur-embed-iframe-pub" style="height: 500px; width: 100%; border: 1px solid #000"></iframe>',
    height: 500,
    width: 540,
  },
  gfycat: {
    regex: /^https?:\/\/gfycat\.com(?:\/detail)?\/([a-zA-Z]+)$/,
    embedUrl: 'https://gfycat.com/ifr/<%= remote_id %>',
    html: "<iframe frameborder='0' scrolling='no' style=\"width:100%;\" height='436' allowfullscreen ></iframe>",
    height: 436,
    width: 580,
  },
  'twitch-channel': {
    regex: /^https?:\/\/www\.twitch\.tv\/([^\/\?\&]*)\/?$/,
    embedUrl: `https://player.twitch.tv/?channel=<%= remote_id %>&parent=${window.location.hostname}`,
    html: '<iframe frameborder="0" allowfullscreen="true" scrolling="no" height="366" style="width:100%;"></iframe>',
    height: 366,
    width: 600,
  },
  'twitch-video': {
    regex: /^https?:\/\/www\.twitch\.tv\/(?:[^\/\?\&]*\/v|videos)\/([0-9]*)$/,
    embedUrl: `https://player.twitch.tv/?video=v<%= remote_id %>&parent=${window.location.hostname}`,
    html: '<iframe frameborder="0" allowfullscreen="true" scrolling="no" height="366" style="width:100%;"></iframe>',
    height: 366,
    width: 600,
  },
  'yandex-music-album': {
    regex: /^https?:\/\/music\.yandex\.ru\/album\/([0-9]*)\/?$/,
    embedUrl: 'https://music\.yandex\.ru/iframe/#album/<%= remote_id %>/',
    html: '<iframe frameborder=\"0\" style=\"border:none;width:540px;height:400px;\" style=\"width:100%;\" height=\"400\"></iframe>',
    height: 400,
    width: 540,
  },
  'yandex-music-track': {
    regex: /^https?:\/\/music\.yandex\.ru\/album\/([0-9]*)\/track\/([0-9]*)$/,
    embedUrl: 'https://music\.yandex\.ru/iframe/#track/<%= remote_id %>/',
    html: '<iframe frameborder="0" style="border:none;width:540px;height:100px;" style="width:100%;" height="100"></iframe>',
    height: 100,
    width: 540,
    id: (ids: string[]) => ids.reverse().join('/'),
  },
  'yandex-music-playlist': {
    regex: /^https?:\/\/music\.yandex\.ru\/users\/([^\/\?\&]*)\/playlists\/([0-9]*)$/,
    embedUrl: 'https://music\.yandex\.ru/iframe/#playlist/<%= remote_id %>/show/cover/description/',
    html: '<iframe frameborder="0" style="border:none;width:540px;height:400px;" width="540" height="400"></iframe>',
    height: 400,
    width: 540,
    id: (ids: string[]) => ids.join('/'),
  },
  codepen: {
    regex: /^https?:\/\/codepen\.io\/([^\/\?\&]*)\/pen\/([^\/\?\&]*)\/?(?:\?.*)?$/,
    embedUrl: 'https://codepen.io/<%= remote_id %>?height=300&theme-id=0&default-tab=css,result&embed-version=2',
    html: "<iframe height='300' scrolling='no' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'></iframe>",
    height: 300,
    width: 600,
    id: (ids: string[]) => ids.join('/embed/'),
  },
  instagram: {
    regex: /^https?:\/\/www\.instagram\.com\/p\/([^\/\?\&]+)\/?(?:\?.*)?$/,
    embedUrl: 'https://www.instagram.com/p/<%= remote_id %>/embed',
    html: '<iframe frameborder="0" scrolling="no" allowtransparency="true"></iframe>',
    resizable: true,
  },
  twitter: {
    regex: /^https?:\/\/twitter\.com\/(?:#!\/)?(\w+)\/status(?:es)?\/(\d+)\/?(?:\?.*)?$/,
    embedUrl: 'https://twitframe.com/show?url=https://twitter.com/<%= remote_id %>',
    html: '<iframe width="550" height="250" style="margin: 0 auto;" frameborder="0" scrolling="no" allowtransparency="true"></iframe>',
    height: 250,
    width: 550,
    id: (ids: string[]) => ids.join('/status/'),
  },
  pinterest: {
    regex: /^https?:\/\/([^\/\?\&]*).pinterest.(?:com|ru)\/pin\/([^\/\?\&]*)\/?$/,
    embedUrl: 'https://assets.pinterest.com/ext/embed.html?id=<%= remote_id %>',
    html: "<iframe scrolling='no' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%; min-height: 400px; max-height: 1000px;'></iframe>",
    id: (ids: string[]) => ids[1],
  },
  facebook: {
    regex: /^https?:\/\/(?:www.)?facebook.com\/([^\/\?\&]*)\/(.*)$/,
    embedUrl: 'https://www.facebook.com/plugins/post.php?href=https://www.facebook.com/<%= remote_id %>&width=500',
    html: "<iframe scrolling='no' frameborder='no' allowtransparency='true' allowfullscreen='true'></iframe>",
    id: (ids: string[]) => ids.join('/'),
    resizable: true,
  },
  aparat: {
    regex: /^(?:http[s]?:\/\/)?(?:www.)?aparat\.com\/v\/([^\/\?\&]+)\/?$/,
    embedUrl: 'https://www.aparat.com/video/video/embed/videohash/<%= remote_id %>/vt/frame',
    html: '<iframe width="600" height="300" style="margin: 0 auto;" frameborder="0" scrolling="no" allowtransparency="true"></iframe>',
    height: 300,
    width: 600,
  },
  'apple-podcasts': {
    regex: /^http[s]?:\/\/podcasts\.apple\.com\/([^\/\?\&]+)\/podcast\/([^\/\?\&]*)\/(id\d+)\/?(?:\?.*)?$/,
    embedUrl: 'https://embed.podcasts.apple.com/<%= remote_id %>',
    html: '<iframe allow="autoplay *; encrypted-media *; fullscreen *" frameborder="0" height="450" style="width:100%;overflow:hidden;background:transparent;" sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation"></iframe>',
    id: (ids: string[]) => `${ids.shift()}/podcast/${ids.join('/')}`,
  },
  spotify: {
    regex: /^http[s]?:\/\/open\.spotify\.com\/(show|episode)\/([^\/\?\&]*)\/?(?:\?.*)?$/,
    embedUrl: 'https://open.spotify.com/embed/<%= remote_id %>',
    html: '<iframe width="100%" height="232" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"></iframe>',
    id: (ids: string[]) => ids.join('/'),
  },
  castbox: {
    regex: /^http[s]?:\/\/castbox\.fm\/channel\/(?:[^\/\?\&]*?)(id\d+)\/?(?:\?.*)?$/,
    embedUrl: 'https://castbox.fm/app/castbox/player/<%= remote_id %>?v=8.22.11&autoplay=0',
    html: '<iframe frameborder="0" width="100%" height="500"></iframe>',
  },
};
