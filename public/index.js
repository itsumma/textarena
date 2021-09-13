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
    // const storedData = localStorage.getItem('dataHtml');
    try {
      if (storedData) {
        data = JSON.parse(storedData);
        if (data && data.time && data.time > (+ new Date() - 1000*60*60*24)) {
          dataHtml = data.dataHtml;
        }
      }
    } catch {}
    if (dataHtml === undefined) {
      // dataHtml = `<p>Чтобы выйти из него, можно в конце строки два раза нажать Enter.</p>`;
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
      dataHtml = `
      <p>Текст <i>Италик </i><b>Жирный </b><i>Жирный италик </i><strike>Зачеркнуто</strike>&nbsp;<font color="#545454">Покрашено</font></p><p><a href="http://ссфлка" target="_blank">Текст</a></p><p><mark>Текст с фоном<br></mark> без фона.</p><pre>Моноширный текст.</pre><h2>Заголовок 2</h2><h3>Заголовок 3</h3><h4>Заголовок 4</h4><div class="separator mode-black" contenteditable="false"><div></div></div><ol><li>Список 1&nbsp;</li><li>Список 2</li><li>

      Список 3&nbsp; &nbsp;</li></ol><p>Текст</p><ul><li>Список 1</li><li>Список 2</li><li>Список 3</li></ul><div class="contentGroup contentGroup-grey"><p>Текст на сером фоне</p></div><div class="contentGroup contentGroup-purple"><p>Текст на виолет</p></div><div class="contentGroup contentGroup-orange"><p>Текст на морковном</p></div><div class="contentGroup contentGroup-quote"><p>Цитата</p></div><p>Текст</p>
      `;
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
      asideColoredPlugin,
      codePlugin,
      quotePlugin,
      typoSugarPlugin,
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
        plugins: [
          commonPlugin(),
          paragraphPlugin(),
          formatingsPlugin(),
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
          imagePlugin(),
          figurePlugin(),
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
            'paragraph',
            'unordered-list',
            'ordered-list',
            'header2',
            'header3',
            'header4',
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
            'unordered-list',
            'ordered-list',
            'header2',
            'header3',
            'header4',
            'hr',
            'fugire',
            'blockquote',
            'embed',
            'asideColoredGrey',
            'asideColoredPurple',
            'asideColoredOrange',
          ],
        },
      },
    );
  }
}());
