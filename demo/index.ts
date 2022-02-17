import TextarenaData from '../src/interfaces/TextarenaData';
import Textarena from '../src/Textarena';
import { debounce } from './debounce';
import './style.scss';
import oEmbedProviders from './oembed-providers.json';
import izoConfig from './izo-config.json';
import PlaceCenterIcon from './place-center-icon.svg';
import PlaceFillIcon from './place-fill-icon.svg';
import PlaceWideIcon from './place-wide-icon.svg';
import ArenaEvent from '../src/helpers/ArenaEvent';

function initTextarena(html: string): Textarena | undefined {
  const elem = document.getElementById('textarena-container');
  let dataHtml = html;
  if (!elem) {
    return undefined;
  }
  let storedData: string | undefined;
  // storedData = localStorage.getItem('dataHtml');
  try {
    if (storedData) {
      const data = JSON.parse(storedData);
      if (data && data.time && data.time > (+new Date() - 1000 * 60 * 60 * 24)) {
        dataHtml = data.dataHtml;
      }
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
  }
  const initData = {
    dataHtml,
  };
  const htmlElem = document.getElementById('html');
  const renderElem = document.getElementById('render');
  const [onChange] = debounce((data: TextarenaData) => {
    localStorage.setItem('dataHtml', JSON.stringify(
      {
        dataHtml: data.dataHtml,
        time: +new Date(),
      },
    ));
    if (htmlElem) {
      htmlElem.innerText = data.html;
    }
    if (renderElem) {
      renderElem.innerHTML = data.html;
    }
    document.querySelectorAll('iframe[id^="iframe-twitter"]')
      .forEach((frame) => frame.addEventListener('load', () => {
        (frame as HTMLIFrameElement).contentWindow?.postMessage(
          { element: frame.id, query: 'height' },
          'https://twitframe.com',
        );
      }));
  }, 500);
  window.addEventListener('message', (e) => {
    if (e.origin === 'https://twitframe.com' && e.data.element.match(/^iframe-twitter/)) {
      const element = document.getElementById(e.data.element);
      if (element) {
        (element as HTMLIFrameElement).height = e.data.height;
      }
    }
  });
  const onEvent = (e: ArenaEvent) => {
    if (e.name === 'customEvent') {
      // console.log(e);
    }
  };

  const {
    commonPlugin,
    pastePlugin,
    paragraphPlugin,
    formatingsPlugin,
    headersPlugin,
    hrPlugin,
    nestedlistsPlugin,
    blockquotePlugin,
    calloutPlugin,
    imagePlugin,
    figurePlugin,
    videoPlugin,
    embedPlugin,
    linkPlugin,
    asidePlugin,
    codePlugin,
    quotePlugin,
    typoSugarPlugin,
    twoColumnsPlugin,
    roadmapPlugin,
    tablePlugin,
    contentsPlugin,
    backImagePlugin,
  } = Textarena.constructor.prototype.getPlugins();

  return new Textarena(
    elem,
    {
      editable: true,
      debug: true,
      onChange,
      onEvent,
      onReady: onChange,
      initData,
      outputTypes: ['html', 'amp', 'rss'],
      placeholder: 'Type or Tab…',
      plugins: [
        commonPlugin(),
        pastePlugin(),
        formatingsPlugin(),
        paragraphPlugin(),
        headersPlugin(),
        hrPlugin({
          icon: '***',
          title: 'Separator',
          attributes: { class: 'asterisk' },
        }),
        nestedlistsPlugin(),
        blockquotePlugin({
          marks: [
            {
              tag: 'BLOCKQUOTE',
              attributes: [],
            },
            {
              tag: 'DIV',
              attributes: ['class="contentGroup contentGroup-quote"'],
            },
          ],
        }),
        calloutPlugin(),
        imagePlugin({ izoConfig }),
        videoPlugin({ izoConfig }),
        figurePlugin({
          classes: [
            {
              className: 'image place-center',
              ratio: 1.84,
              icon: PlaceCenterIcon,
              srcset: [
                {
                  media: '',
                  rations: [
                    {
                      ratio: 1,
                      width: 0,
                      height: 392,
                    },
                    {
                      ratio: 2,
                      width: 0,
                      height: 784,
                    },
                  ],
                },
              ],
            },
            {
              className: 'image place-fill',
              icon: PlaceFillIcon,
              srcset: [
                {
                  media: '',
                  rations: [
                    {
                      ratio: 1,
                      width: 721,
                      height: 0,
                    },
                    {
                      ratio: 2,
                      width: 1442,
                      height: 0,
                    },
                  ],
                },
              ],
            },
            {
              className: 'image place-wide',
              ratio: 1.84,
              icon: PlaceWideIcon,
            },
          ],
        }),
        embedPlugin({
          // You can fetch full list of providers from https://oembed.com/providers.json
          oEmbedProviders,
          providerOptions: [
            {
              name: 'YouTube',
              maxwidth: 760,
              maxheight: 760,
            },
          ],
        }),
        linkPlugin(),
        asidePlugin(),
        // asidePlugin({
        //   name: 'black-back',
        //   tag: 'ASIDE',
        //   attributes: { class: 'black-back' },
        //   title: 'Черная подложка',
        //   command: 'convert-to-black-back',
        //   marks: [
        //     {
        //       tag: 'ASIDE',
        //       attributes: ['class="black-back"'],
        //     },
        //   ],
        // }),
        codePlugin(),
        quotePlugin(),
        typoSugarPlugin(),
        roadmapPlugin(),
        twoColumnsPlugin(),
        tablePlugin(),
        contentsPlugin(),
        backImagePlugin(),
      ],
      toolbar: {
        enabled: true,
        tools: [
          'strong',
          'emphasized',
          'underline',
          'strikethrough',
          'subscript',
          'superscript',
          'mark',
          'inline-code',
          'link',
          'header2',
          'header3',
          'header4',
          'unordered-list',
          'ordered-list',
          'clearFormatings',
        ],
      },
      creatorBar: {
        enabled: true,
        creators: [
          'header2',
          'header3',
          'header4',
          'unordered-list',
          'ordered-list',
          'hr',
          'figure',
          'video',
          'blockquote',
          'embed',
          'aside',
          'two-columns',
          'roadmap',
          'add-table',
          'contents',
        ],
      },
    },
  );
}

function main() {
  document.querySelectorAll('[data-tab]').forEach((elem) => elem.addEventListener('click', (event) => {
    document.querySelectorAll('[data-tab]').forEach((other) => other.removeAttribute('pressed'));
    (event.currentTarget as HTMLElement).setAttribute('pressed', 'true');
    const tab = (event.currentTarget as HTMLElement).getAttribute('data-tab');
    document.querySelectorAll('.tab').forEach((other) => other.removeAttribute('show'));
    document.querySelector(`#${tab}`)?.setAttribute('show', 'true');
  }));
  let textarena: Textarena | undefined;

  const langItems = document.querySelectorAll('.menu .menu-item');
  langItems
    .forEach((elem) => elem.addEventListener('click', () => {
      langItems.forEach((elem2) => {
        if (elem2 !== elem) {
          elem2.classList.remove('active');
        }
      });
      elem.classList.add('active');
      const lang = elem.getAttribute('data-lang');
      import(`./${lang}.html`).then(({ default: dataHtml }) => {
        textarena?.setData({ dataHtml });
      });
    }));
  const activeItem = document.querySelector('.menu .menu-item.active');
  if (activeItem) {
    import(`./${activeItem.getAttribute('data-lang')}.html`)
      .then(({ default: dataHtml }) => {
        textarena = initTextarena(dataHtml);
      });
  }
}

main();
