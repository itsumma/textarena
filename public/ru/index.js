(function (d, lc) {
  function debounce(func, wait, immediate) {
    let timeout;
    return function() {
      const context = this, args = arguments;
      const later = function() {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      const callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  };

  const elem = document.getElementById('textarena-container');

  if (elem && (typeof Textarena !== 'undefined')) {
    let dataHtml;
    const storedData = localStorage.getItem('dataHtml');
    try {
      if (storedData) {
        data = JSON.parse(storedData);
        if (data && data.time && data.time > (+ new Date() - 1000*60*60*24)) {
          dataHtml = data.dataHtml;
        }
      }
    } catch {}
    if (dataHtml === undefined) {
      dataHtml = "<h2>Дорожная карта Editorica</h2>\n<roadmap>\n<p class=\"paragraph\">Сентябрь 2021 — демо</p>\n<p class=\"paragraph\">Октябрь 2021 — дефолтный шаблон публичной части сайта</p>\n<p class=\"paragraph\">Ноябрь 2021 — управления баннерами</p>\n<p class=\"paragraph\">Декабрь 2021 — автопубликация в соцсети</p>\n</roadmap>\n<p class=\"paragraph\"><a href=\"https://www.orbitmedia.com/blog/blogging-statistics/\">A recent survey by Orbit Media</a> found that bloggers who invest more time in writing their blogs – and also write longer articles– generally have a higher number of readers and interactions. The best SEO results are booked with blogs that are approximately 2,000 words long. However, how do you keep a long read interesting? How do you make sure that your readers don&#039;t just scroll through, or tap out when they are halfway through your article?</p>\n<blockquote>\n<p class=\"paragraph\">Bloggers who spend 6 or more hours per post are 56% more likely to report “strong results” than those who don’t. (<a href=\"https://www.linkedin.com/in/jodiharriscontentconsulting/\">Jodi Harris, Content Marketing Institute</a>)</p>\n<p class=\"paragraph\">Here are some handy tips that will vastly improve your long read game.</p>\n</blockquote>\n<arena-figure class=\"image place-wide\">\n<arena-image slot=\"image\" src=\"https://d3qc8znfr3ejm3.cloudfront.net/images/6a7e0d35-c34b-4b08-ae05-b5bcaf702b47.png\"></arena-image>\n\n</arena-figure>\n<h3>Другие картинки</h3>\n<arena-figure class=\"image place-center\">\n<arena-image slot=\"image\" src=\"https://d3qc8znfr3ejm3.cloudfront.net/images/81400751-b6e7-4d7f-86a4-dca3e7c02a50.webp\"></arena-image>\n\n</arena-figure>\n\n\n\n";
      // dataHtml = `
      // <arena-image src="https://storage.yandexcloud.net/itsizo.app/ee907a4a-9ff2-40fb-ae3f-1e4f91a02800.png"></arena-image>
      // <arena-image src="https://storage.yandexcloud.net/itsizo.app/ee907a4a-9ff2-40fb-ae3f-1e4f91a02800.png"></arena-image>
      //   <aside class="aside aside-gray">
      //     <p>Другой блок с рамочкой.</p>
      //     <p>Чтобы выйти из него, можно в конце строки два раза нажать Enter.</p>
      //   </aside>
      //   <arena-quote class=textarena-quote>
      //     <arena-image width="100" height="100" src="https://storage.yandexcloud.net/itsizo.app/87e7c025-d3bd-4f6e-9e84-595dc629affb.jpg"></arena-image>
      //     <cite slot=quote_author class=textarena-quote__author>Меде́я</cite>
      //     <cite slot=quote_role class=textarena-quote__role>царевна из страны Эета</cite>
      //     <quote slot=quote_body class=body>…вы можете превратить старика в молодого человека, если разрежете его и бросите в кипящий котёл.</quote>
      //   </arena-quote>
      //   <arena-quote class=textarena-quote>
      //     <arena-image width="100" height="100" src="https://storage.yandexcloud.net/itsizo.app/87e7c025-d3bd-4f6e-9e84-595dc629affb.jpg"></arena-image>
      //     <cite slot=quote_author class=textarena-quote__author>Меде́я</cite>
      //     <cite slot=quote_role class=textarena-quote__role>царевна из страны Эета</cite>
      //     <quote slot=quote_body class=body>…вы можете превратить старика в молодого человека, если разрежете его и бросите в кипящий котёл.</quote>
      //   </arena-quote>
      //   `;
      // dataHtml = "<p class=\"paragraph\">Текст <em>Италик </em><strong>Жирный </strong><em>Жирный италик </em><s>Зачеркнуто</s>&nbsp;</p>\n<p class=\"paragraph\"><font color=\"#545454\">Покрашено </font>Не покрашено</p>\n<p class=\"paragraph\"><a href=\"http://reminder.media/\" target=\"_blank\">Ссылка</a></p>\n<p class=\"paragraph\"><mark>Текст с фоном</mark> без фона.</p>\n<pre>\n<p class=\"paragraph\">Моноширный текст.</p>\n</pre>\n<h2>Заголовок 2</h2>\n<h3>Заголовок 3</h3>\n<h4>Заголовок 4</h4>\n<hr></hr>\n<ol>\n<li>Список 1</li>\n<li>Список 2</li>\n<li>Список 3</li>\n</ol>\n<p class=\"paragraph\">Текст</p>\n<ul>\n<li>Список 1</li>\n<li>Список 2</li>\n<li>Список 3</li>\n</ul>\n<aside class=\"aside-fill aside-fill-grey\">\n<p class=\"paragraph\">Текст на сером фоне</p>\n</aside>\n<aside class=\"aside-fill aside-fill-purple\">\n<p class=\"paragraph\">Текст на фиолетовом фоне</p>\n</aside>\n<aside class=\"aside-fill aside-fill-orange\">\n<p class=\"paragraph\">Текст на морковном фоне.</p>\n<p class=\"paragraph\">В несколько строк</p>\n</aside>\n<blockquote>\n<p class=\"paragraph\">Цитата</p>\n</blockquote>\n<p class=\"paragraph\">Текст</p>\n<arena-figure class=\"image place-wide\">\n<arena-image slot=\"image\" src=\"https://d3qc8znfr3ejm3.cloudfront.net/images/e19a2301-e099-46f7-bc89-12bfded9b455.jpg\"></arena-image>\n<figcaption slot=\"image-caption\">Подпись к рисунку</figcaption>\n</arena-figure>\n\n<arena-figure class=\"image place-center\">\n<arena-image slot=\"image\" src=\"https://d3qc8znfr3ejm3.cloudfront.net/images/c4061779-d99e-45c9-91a2-66d9142c04b6.png\"></arena-image>\n<figcaption slot=\"image-caption\">Подпись к рисунку</figcaption>\n</arena-figure>\n<arena-figure class=\"image place-fill\">\n<arena-image slot=\"image\" src=\"https://d3qc8znfr3ejm3.cloudfront.net/images/8690b897-c596-4ffa-b8f0-448978bbef5f.jpg\"></arena-image>\n<figcaption slot=\"image-caption\">Подпись к рисунку</figcaption>\n</arena-figure>";
      // dataHtml = `<arena-two-columns>
      //   <arena-two-columns-col>
      //     <p class=\"paragraph\">1</p>
      //   </arena-two-columns-col>
      //   <arena-two-columns-col>
      //     <p class=\"paragraph\">2</p>
      //   </arena-two-columns-col>
      // </arena-two-columns>`;
      // dataHtml = `<h2><s>Простой</s> Крутой текстовый редактор</h2><arena-image src="https://storage.yandexcloud.net/itsizo.app/ee907a4a-9ff2-40fb-ae3f-1e4f91a02800.png"></arena-image><p>Выделите текст, появится панель для форматирования.</p>`;
    }
    const initData = {
      dataHtml,
    }
    const htmlElem = document.getElementById('html');
    const renderElem = document.getElementById('render');
    const onChange = debounce((data) => {
      localStorage.setItem('dataHtml', JSON.stringify(
        {
          dataHtml: data.dataHtml,
          time: + new Date(),
        }
      ));
      if (htmlElem) {
        htmlElem.innerText = data.html;
      }
      if (renderElem) {
        renderElem.innerHTML = data.html;
      }
    }, 500);
    const onEvent = (e) => {
      if (e.name === 'customEvent') {
        console.log(e);
      }
    }

    const {
      commonPlugin,
      paragraphPlugin,
      formatingsPlugin,
      headersPlugin,
      hrPlugin,
      listsPlugin,
      blockquotePlugin,
      calloutPlugin,
      imagePlugin,
      figurePlugin,
      embedPlugin,
      linkPlugin,
      asidePlugin,
      codePlugin,
      quotePlugin,
      typoSugarPlugin,
      twoColumnsPlugin,
      roadmapPlugin,
    } = Textarena.getPlugins();

    const textarena = new Textarena(
      elem,
      {
        editable: true,
        debug: true,
        onChange,
        onEvent,
        onReady: onChange,
        initData,
        outputTypes: ['html', 'amp', 'rss'],
        placeholder: 'Введите текст или нажмите Tab',
        plugins: [
          commonPlugin(),
          formatingsPlugin(),
          paragraphPlugin(),
          headersPlugin(),
          hrPlugin({
            marks: [
              {
                tag: 'HR',
                attributes: [],
              },
              {
                tag: 'DIV',
                attributes: [
                  'class=separator',
                ],
              },
            ],
          }),
          hrPlugin({
            name: 'hr-asterisk',
            icon: '***',
            title: '***',
            tag: 'HR',
            attributes: { class: 'asterisk' },
            command: 'add-hr-asterisk',
            marks: [
              {
                tag: 'HR',
                attributes: [
                  'class=asterisk'
                ],
              },
            ],
          }),
          listsPlugin(),
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
            }
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
                icon: `<svg viewBox="0 0 25 25" fill="currentColor"><path d="M5 20.558v-.9c0-.122.04-.226.122-.312a.404.404 0 0 1 .305-.13h13.347a.45.45 0 0 1 .32.13c.092.086.138.19.138.312v.9a.412.412 0 0 1-.138.313.435.435 0 0 1-.32.13H5.427a.39.39 0 0 1-.305-.13.432.432 0 0 1-.122-.31zm0-3.554V9.01c0-.12.04-.225.122-.31a.4.4 0 0 1 .305-.13h13.347c.122 0 .23.043.32.13.092.085.138.19.138.31v7.994a.462.462 0 0 1-.138.328.424.424 0 0 1-.32.145H5.427a.382.382 0 0 1-.305-.145.501.501 0 0 1-.122-.328zM5 6.342v-.87c0-.12.04-.23.122-.327A.382.382 0 0 1 5.427 5h13.347c.122 0 .23.048.32.145a.462.462 0 0 1 .138.328v.87c0 .12-.046.225-.138.31a.447.447 0 0 1-.32.13H5.427a.4.4 0 0 1-.305-.13.44.44 0 0 1-.122-.31z"></path></svg>`,
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
                icon: `<svg viewBox="0 0 25 25" fill="currentColor"><path d="M3 17.004V9.01a.4.4 0 0 1 .145-.31.476.476 0 0 1 .328-.13h17.74c.12 0 .23.043.327.13a.4.4 0 0 1 .145.31v7.994a.404.404 0 0 1-.145.313.48.48 0 0 1-.328.13H3.472a.483.483 0 0 1-.327-.13.402.402 0 0 1-.145-.313zm2.212 3.554v-.87c0-.13.05-.243.145-.334a.472.472 0 0 1 .328-.137H19c.124 0 .23.045.322.137a.457.457 0 0 1 .138.335v.86c0 .12-.046.22-.138.31a.478.478 0 0 1-.32.13H5.684a.514.514 0 0 1-.328-.13.415.415 0 0 1-.145-.32zm0-14.246v-.84c0-.132.05-.243.145-.334A.477.477 0 0 1 5.685 5H19a.44.44 0 0 1 .322.138.455.455 0 0 1 .138.335v.84a.451.451 0 0 1-.138.334.446.446 0 0 1-.32.138H5.684a.466.466 0 0 1-.328-.138.447.447 0 0 1-.145-.335z"></path></svg>`,
                srcset: [
                  {
                    media: '(max-width: 1441px)',
                    rations: [
                      {
                        ratio: 1,
                        width: 721,
                        height: 392,
                      },
                      {
                        ratio: 2,
                        width: 1442,
                        height: 784,
                      },
                    ],
                  },
                  {
                    media: '',
                    rations: [
                      {
                        ratio: 1,
                        width: 1161,
                        height: 631,
                      },
                      {
                        ratio: 2,
                        width: 2322,
                        height: 1262,
                      },
                    ],
                  },
                ],
              },
            ],
          }),
          embedPlugin(),
          linkPlugin(),
          asidePlugin({
            name: 'asideColoredGrey',
            tag: 'ASIDE',
            attributes: { class: 'aside-fill aside-fill-grey' },
            title: 'Цветной блок',
            icon: `<svg xmlns="http://www.w3.org/2000/svg"
              height="24px" viewBox="0 0 24 24" width="24px" fill="currentColor"><path d="M0 0h24v24H0z" fill="none"/>
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
              </svg>`,
            shortcut: 'Alt + Digit7',
            hint: '7',
            command: 'convert-to-aside-colored-grey',
            marks: [
              {
                tag: 'ASIDE',
                attributes: ['class="aside-fill aside-fill-grey"'],
              },
              {
                tag: 'DIV',
                attributes: ['class="contentGroup contentGroup-grey"'],
              },
            ],
          }),
          asidePlugin({
            name: 'asideColoredPurple',
            tag: 'ASIDE',
            attributes: { class: 'aside-fill aside-fill-purple' },
            title: 'Цветной блок',
            icon: `<svg xmlns="http://www.w3.org/2000/svg"
              height="24px" viewBox="0 0 24 24" width="24px" fill="#b460ff"><path d="M0 0h24v24H0z" fill="none"/>
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
              </svg>`,
            shortcut: 'Alt + Digit8',
            hint: '8',
            command: 'convert-to-aside-colored-purple',
            marks: [
              {
                tag: 'ASIDE',
                attributes: ['class="aside-fill aside-fill-purple"'],
              },
              {
                tag: 'DIV',
                attributes: ['class="contentGroup contentGroup-purple"'],
              },
            ],
          }),
          asidePlugin({
            name: 'asideColoredOrange',
            tag: 'ASIDE',
            attributes: { class: 'aside-fill aside-fill-orange' },
            title: 'Цветной блок',
            icon: `<svg xmlns="http://www.w3.org/2000/svg"
              height="24px" viewBox="0 0 24 24" width="24px" fill="#ffb09a"><path d="M0 0h24v24H0z" fill="none"/>
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
              </svg>`,
            shortcut: 'Alt + Digit9',
            hint: '9',
            command: 'convert-to-aside-colored-orange',
            marks: [
              {
                tag: 'ASIDE',
                attributes: ['class="aside-fill aside-fill-orange"'],
              },
              {
                tag: 'DIV',
                attributes: ['class="contentGroup contentGroup-orange"'],
              },
            ],
          }),
          codePlugin(),
          quotePlugin(),
          typoSugarPlugin(),
          roadmapPlugin(),
          twoColumnsPlugin(),
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
            'colored',
            'mark',
            'link',
            'header2',
            'header3',
            'header4',
            'code',
            'unordered-list',
            'ordered-list',
            'asideColoredGrey',
            'asideColoredPurple',
            'asideColoredOrange',
            'blockquote',
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
            'hr-asterisk',
            'figure',
            'blockquote',
            'embed',
            'asideColoredGrey',
            'asideColoredPurple',
            'asideColoredOrange',
            'two-columns',
            'roadmap',
          ],
        },
      }
    );
  }
}());
