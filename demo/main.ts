import TextarenaData from '../src/interfaces/TextarenaData';
import Textarena from '../src/Textarena';
import { debounce } from './debounce';
import './style.scss';

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
        (frame as HTMLIFrameElement).contentWindow.postMessage(
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
  const onEvent = (e) => {
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
        imagePlugin({
          izoConfig: {
            url: 'https://izo.itsumma.ru',
            token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiY2xpZW50IiwidG9rZW5JZCI6ImQyNzRhOTAzLTAyYWMtNGE2MS1hNmNiLTdiOTlkZGQ0YmIyNiIsInVzZXJuYW1lIjoidGVzdCIsImlhdCI6MTYxNDIzMzY4NywiZXhwIjoxNjQ1NzY5Njg3fQ.fEzuI8L9P7z9tcZ7PiocLQrf_gW9CF_JxrpQLxYHDRk',
          },
        }),
        videoPlugin({
          izoConfig: {
            url: 'https://izo.itsumma.ru',
            token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiY2xpZW50IiwidG9rZW5JZCI6ImQyNzRhOTAzLTAyYWMtNGE2MS1hNmNiLTdiOTlkZGQ0YmIyNiIsInVzZXJuYW1lIjoidGVzdCIsImlhdCI6MTYxNDIzMzY4NywiZXhwIjoxNjQ1NzY5Njg3fQ.fEzuI8L9P7z9tcZ7PiocLQrf_gW9CF_JxrpQLxYHDRk',
          },
        }),
        figurePlugin({
          classes: [
            {
              className: 'image place-center',
              ratio: 1.84,
              icon: `<svg viewBox="0 0 20 20" fill="currentColor"><path d="M4,16.4v-0.7c0-0.1,0-0.2,0.1-0.2c0.1-0.1,0.2-0.1,0.2-0.1H15c0.1,0,0.2,0,0.3,0.1c0.1,0.1,0.1,0.2,0.1,0.2v0.7
                c0,0.1,0,0.2-0.1,0.3c-0.1,0.1-0.2,0.1-0.3,0.1H4.3c-0.1,0-0.2,0-0.2-0.1C4,16.6,4,16.5,4,16.4L4,16.4z M7.2,13.6V7.2
                c0-0.1,0-0.2,0-0.2c0-0.1,0.1-0.1,0.1-0.1h4.7c0,0,0.1,0,0.1,0.1c0,0.1,0,0.2,0,0.2v6.4c0,0.1,0,0.2,0,0.3c0,0.1-0.1,0.1-0.1,0.1
                H7.3c0,0-0.1,0-0.1-0.1C7.2,13.8,7.2,13.7,7.2,13.6z M4,5.1V4.4c0-0.1,0-0.2,0.1-0.3C4.2,4,4.2,4,4.3,4H15c0.1,0,0.2,0,0.3,0.1
                c0.1,0.1,0.1,0.2,0.1,0.3v0.7c0,0.1,0,0.2-0.1,0.2c-0.1,0.1-0.2,0.1-0.3,0.1H4.3c-0.1,0-0.2,0-0.2-0.1C4,5.3,4,5.2,4,5.1L4,5.1z"></path></svg>`,
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
              icon: '<svg viewBox="0 0 25 25" fill="currentColor"><path d="M5 20.558v-.9c0-.122.04-.226.122-.312a.404.404 0 0 1 .305-.13h13.347a.45.45 0 0 1 .32.13c.092.086.138.19.138.312v.9a.412.412 0 0 1-.138.313.435.435 0 0 1-.32.13H5.427a.39.39 0 0 1-.305-.13.432.432 0 0 1-.122-.31zm0-3.554V9.01c0-.12.04-.225.122-.31a.4.4 0 0 1 .305-.13h13.347c.122 0 .23.043.32.13.092.085.138.19.138.31v7.994a.462.462 0 0 1-.138.328.424.424 0 0 1-.32.145H5.427a.382.382 0 0 1-.305-.145.501.501 0 0 1-.122-.328zM5 6.342v-.87c0-.12.04-.23.122-.327A.382.382 0 0 1 5.427 5h13.347c.122 0 .23.048.32.145a.462.462 0 0 1 .138.328v.87c0 .12-.046.225-.138.31a.447.447 0 0 1-.32.13H5.427a.4.4 0 0 1-.305-.13.44.44 0 0 1-.122-.31z"></path></svg>',
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
              icon: '<svg viewBox="0 0 25 25" fill="currentColor"><path d="M3 17.004V9.01a.4.4 0 0 1 .145-.31.476.476 0 0 1 .328-.13h17.74c.12 0 .23.043.327.13a.4.4 0 0 1 .145.31v7.994a.404.404 0 0 1-.145.313.48.48 0 0 1-.328.13H3.472a.483.483 0 0 1-.327-.13.402.402 0 0 1-.145-.313zm2.212 3.554v-.87c0-.13.05-.243.145-.334a.472.472 0 0 1 .328-.137H19c.124 0 .23.045.322.137a.457.457 0 0 1 .138.335v.86c0 .12-.046.22-.138.31a.478.478 0 0 1-.32.13H5.684a.514.514 0 0 1-.328-.13.415.415 0 0 1-.145-.32zm0-14.246v-.84c0-.132.05-.243.145-.334A.477.477 0 0 1 5.685 5H19a.44.44 0 0 1 .322.138.455.455 0 0 1 .138.335v.84a.451.451 0 0 1-.138.334.446.446 0 0 1-.32.138H5.684a.466.466 0 0 1-.328-.138.447.447 0 0 1-.145-.335z"></path></svg>',
            },
          ],
        }),
        embedPlugin({
          // You can fetch full list of providers from https://oembed.com/providers.json
          oEmbedProviders: JSON.parse('[{"provider_name":"YouTube","provider_url":"https://www.youtube.com/","endpoints":[{"schemes":["https://*.youtube.com/watch*","https://*.youtube.com/v/*","https://youtu.be/*","https://*.youtube.com/playlist?list=*"],"url":"https://www.youtube.com/oembed","discovery":true}]},{"provider_name":"TikTok","provider_url":"http://www.tiktok.com/","endpoints":[{"schemes":["https://www.tiktok.com/*/video/*"],"url":"https://www.tiktok.com/oembed"}]},{"provider_name":"SoundCloud","provider_url":"http://soundcloud.com/","endpoints":[{"schemes":["http://soundcloud.com/*","https://soundcloud.com/*","https://soundcloud.app.goog.gl/*"],"url":"https://soundcloud.com/oembed"}]}]'),
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
    document.querySelector(`#${tab}`).setAttribute('show', 'true');
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
