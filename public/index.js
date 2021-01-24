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
    let initData;
    const storedData = localStorage.getItem('data');
    try {
      if (storedData) {
        initData = JSON.parse(storedData);
      }
    } catch {}
    if (!initData) {
      initData = {
        content: '<h2>Простой визуальный редактор</h2><p>Textarena адаптирована для быстрой работы. Все функции доступны с помощью горячих клавиш.</p><figure><img src="https://www.itsumma.ru/img/services/musthave.png"></figure><p>Выделите текст, появится панель для форматирования.</p><hr /><p>Зажмите Ctrl (⌘ для Mac) или Alt (⌥ для Mac) и вы увидите подсказки.</p><p>Ctrl (⌘) + B — изменит <b>жирность</b> выделенного текста.</p><p>Ctrl (⌘) + I — выделенный текст станет <i>италиком</i>. Повторное нажатие уберёт италик.</p><p>И так далее…</p><p>Alt (⌥) + O — переключает между обычным текстом и нумерованным списком.</p><h2>Легко доступные стили оформления текста</h2><h3>Заголовки</h3><ol><li>H2 — второй по величине.</li><li>H3 — третий по величине.</li><li>H4 — четвёртый.</li></ol><p>Почему нет первого? Во-первых, какие заголовки доступны в редакторе, настраивается. Во-вторых, не рекомендуется на странице использовать более одного заголовка первого уровня. На этой странице уже есть — «TEXTARENA» — в верху страницы.</p>',
      };
    }
    const htmlElem = document.getElementById('html');
    const onChange = debounce((data) => {
      localStorage.setItem('data', JSON.stringify(data));
      if (htmlElem) {
        htmlElem.innerText = data.content;
      }
    }, 500);
    const calloutPlugin = function () {
      const self = {
        register: (textarena) => {
          console.log(self, textarena);
          textarena.creatorBar.registerCreator('callout', {
            name: 'callout',
            icon: '!',
            title: 'Callout',
            processor: (context) => {
              context.parser.prepareAndPasteHtml(
                `<div contenteditable="false" class="callout">
                  <div class="callout-icon">!</div>
                  <div contenteditable="true" class="callout-text"></div>
                </div>`
              );
            }
          })
        }
      }
      return self;
    }
    const textarena = new Textarena(
      elem,
      {
        editable: true,
        debug: true,
        onChange,
        onReady: onChange,
        initData,
        plugins: [
          calloutPlugin(),
        ],
        creatorBar: {
          creators: [
            'hr',
            'image',
            'blockquote',
            'callout',
          ],
        },
        // toolbar: {
        //   tools: [
        //     'bold',
        //     'italic',
        //     'underline',
        //     'strikethrough',
        //     {
        //       name: 'foreColor',
        //       icon: 'f',
        //       title: 'ForeColor',
        //       config: {
        //         color: '#545454',
        //       },
        //       processor: foreColor,
        //     },
        //   ],
        // }
      },
    );
  }
}());
