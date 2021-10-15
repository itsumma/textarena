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
      dataHtml = `
      <h2><s>Простой</s> Крутой текстовый редактор</h2>
      <p class="paragraph"><strong>Textarena</strong> адаптирована для быстрой работы с текстом. К тому же она легко расширяется с помощью плагинов.</p>
      <p class="paragraph">Выделите текст, появится панель для форматирования.</p>
      <p class="paragraph">Зажмите Ctrl (⌘ для Mac) или Alt (⌥ для Mac) и вы увидите подсказки.</p>
      <figure class="">
        <picture>
          <img src="https://d3qc8znfr3ejm3.cloudfront.net/images/7d7b94c6-72d0-4756-9da2-984e8496c817.png" alt="" class="">
        </picture>
        <figcaption slot="image-caption">Панелька для форматирования появляется когда выделен текст, но работает по горячим клавишам</figcaption>
      </figure>
      <p class="paragraph">Ctrl (⌘) + I — выделенный текст станет <em>италиком</em>. Повторное нажатие уберёт италик.</p>
      <p class="paragraph">Ctrl (⌘) + B — изменит <strong>жирность</strong> выделенного текста.</p>
      <p class="paragraph">И так далее: <em>италик</em>, <u>подчеркнутый</u>, <s>зачеркнутый</s>, <sub>нижний</sub> и <sup>верхний</sup> индексы, <mark>маркированный</mark>, <code>строчный код</code>, <a href="https://github.com/itsumma/textarena" target="_blank">ссылка</a>…&nbsp;</p>

      <h3>Заголовки</h3>
      <ul>
        <li>H2 — второй по величине.</li>
        <li>H3 — третий по величине.</li>
        <li>H4 — четвёртый.</li>
      </ul>
      <p class="paragraph">Почему нет первого? Во-первых, какие заголовки доступны в редакторе, настраивается. Во-вторых, не рекомендуется на странице использовать более одного заголовка первого уровня. На этой странице уже есть заголовок — «TEXTARENA» — в верху страницы.</p>
      <p class="paragraph">Чтобы превратить текст в заголовок можно нажать Alt (⌥) + 2 или 3 или 4.</p>
      <p class="paragraph">Чтобы вернуть параграф — Alt (⌥) + 0.</p>

      <h3>Списки</h3>
      <p class="paragraph">Чтобы начать список:</p>
      <ol><li>напечатать в начале строки «1.» и пробел или «-» с пробелом;</li>
      <li>нажать Alt (⌥) + O или Alt (⌥) + L для нумерованного или списка с буллетами соответственно.</li></ol>

      <h3>Несложные текстовые блоки</h3>
      <blockquote><p class="paragraph">Для того чтобы сделать простой блок цитаты, нажмите Alt (⌥) + &quot;.</p></blockquote>
      <p class="paragraph">Или нажмите кнопку с плюсом на пустой строке.</p>
      <figure class="">
        <picture>
          <img src="https://d3qc8znfr3ejm3.cloudfront.net/images/f2a48b32-3db9-456a-b03b-e142a0bc38ca.png" alt="" class="">
        </picture>
        <figcaption slot="image-caption">Панель для создания заголовков, списков и других блоков оформления</figcaption>
      </figure>
      <aside class="aside aside-gray">
        <p class="paragraph">Текстовый блок с рамочкой.</p>
        <p class="paragraph">Чтобы выйти из него, можно в конце строки два раза нажать Enter.</p>
      </aside>

      <h3>Сложные текстовые блоки</h3>
      <blockquote class="quote-block">
        <div class="quote-block__line">
          <div class="quote-block__author-block">
            <cite slot="quote_author" class="quote-block__author">Меде́я</cite>
            <cite slot="quote_role" class="quote-block__role">царевна из страны Эета</cite>
          </div>

          <div class="quote-block__image">
            <picture>
              <source media="(max-width: 600px)"
                srcset="https://d3qc8znfr3ejm3.cloudfront.net/images/bcc46c3f-b4d9-4f04-8b68-fe2878f9490a_200_200.jpg 1x, https://d3qc8znfr3ejm3.cloudfront.net/images/bcc46c3f-b4d9-4f04-8b68-fe2878f9490a_400_400.jpg 2x"/>
              <source media=""
                srcset="https://d3qc8znfr3ejm3.cloudfront.net/images/bcc46c3f-b4d9-4f04-8b68-fe2878f9490a_100_100.jpg 1x, https://d3qc8znfr3ejm3.cloudfront.net/images/bcc46c3f-b4d9-4f04-8b68-fe2878f9490a_200_200.jpg 2x, https://d3qc8znfr3ejm3.cloudfront.net/images/bcc46c3f-b4d9-4f04-8b68-fe2878f9490a_400_400.jpg 4x"/>
              <img src="https://d3qc8znfr3ejm3.cloudfront.net/images/bcc46c3f-b4d9-4f04-8b68-fe2878f9490a_200_200.jpg" alt="true" class="quote-block__image">
            </picture>
          </div>
        </div>
        <quote slot="quote_body" class="quote-block__body">…вы можете превратить старика в молодого человека, если разрежете его и бросите в кипящий котёл.</quote>
      </blockquote>
      <p class="paragraph">Такие блоки настраиваются с помощью плагинов.</p>

      <h4>Картинки</h4>
      <figure class="">
        <picture>
          <img src="https://d3qc8znfr3ejm3.cloudfront.net/images/bdf131ea-e9ea-4b29-8d63-96a9c440ddff.jpg" alt="" class="">
        </picture>
        <figcaption slot="image-caption">С подписью</figcaption>
      </figure>

      <h4>Колонки</h4>
      <div class="arena-two-col">
          <div class="arena-col">
            <p class="paragraph">Хоба!</p>
          </div>
          <div class="arena-col">
            <figure class="">
              <picture>
                <img src="https://d3qc8znfr3ejm3.cloudfront.net/images/09c2b96f-961b-4797-8ed8-41e2166bc670.jpg" alt="" class="">
              </picture>
            </figure>
          </div>
      </div>

      <h4>Роадмап</h4>
      <roadmap>
        <p class="paragraph">✨ Форматирование</p>
        <p class="paragraph">🎉 Списки</p>
        <p class="paragraph">🎈 Эмбеды</p>
        <p class="paragraph">✨ Сложные блоки</p>
        <p class="paragraph">⌛ Таблицы</p>
        <p class="paragraph">⌛ Вложенные списки</p>
      </roadmap>

      <h4>Таблицы <sup>Alpha</sup></h4>
      <table>
        <tr>
          <td>Shift + Enter — добавить строку</td>
          <td>
            Shift + Tab — добавить колонку
          </td>
        </tr>
        <tr>
          <td>Ctrl + Shift + Backspace — удалить строку</td>
          <td>
            Ctrl + Backspace — удалить колонку
          </td>
        </tr>
      </table>

      <h4>Вложенные списки<sup>Alpha</sup></h4>
      <ol start="1"><li>Первый уровень</li>
      <ol><li>Второй</li>
      <ol><li>Третий</li>
      <li>Снова третий</li>
      <ul><li>…внезапно булеты</li>
      <ul><li>ещё булеты</li></ul></ul></ol>
      <li>Обратно второй</li></ol>
      <li>И опять первый</li></ol>

      <hr class="asterisk"></hr>
      <p class="paragraph">И многое другое с помощью плагинов…</p>
      `;
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
      nestedlistsPlugin,
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
      tablePlugin,
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
          asidePlugin(),
          codePlugin(),
          quotePlugin(),
          typoSugarPlugin(),
          roadmapPlugin(),
          twoColumnsPlugin(),
          tablePlugin(),
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
            'hr-asterisk',
            'figure',
            'blockquote',
            'embed',
            'aside',
            'two-columns',
            'roadmap',
            'add-table',
          ],
        },
      }
    );
  }
}());
