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
    // try {
    //   if (storedData) {
    //     dataHtml = JSON.parse(storedData);
    //   }
    // } catch {}
    if (!dataHtml) {
      dataHtml = `<h2>Простой текстовый редактор</h2>
        <p><a href="https://github.com/devopsprodigy/textarena/">Textarena</a> адаптирована для быстрой работы. Все функции доступны с помощью горячих клавиш.</p>
`;
        // content: `<h2>Простой визуальный редактор</h2>
        // <p>Textarena адаптирована для быстрой работы. Все функции доступны с помощью горячих клавиш.</p>
        // <arena-callout>
        //   <p slot="title">
        //     Внимание!
        //   </p>
        //   <arena-callout-body slot="body">
        //     <ul>
        //     <li>
        //     Это удобно
        //     </li><li>
        //     Это быстро
        //     </li>
        //     </ul>
        //   </arena-callout-body>
        // </arena-callout>
        // <ul>
        // <li>Быстро.</li>
        // <li>Удобно.</li>
        // <li>Настраиваемо.</li>
        // </ul>
        // <figure><img src="https://www.itsumma.ru/img/services/musthave.png"></figure>
        // <p>Выделите текст, появится панель для форматирования.</p>
        // <hr />
        // <p>Зажмите Ctrl (⌘ для Mac) или Alt (⌥ для Mac) и вы увидите подсказки.</p>
        // <p>Ctrl (⌘) + B — изменит <b>жирность</b> выделенного текста.</p>
        // <p>Ctrl (⌘) + I — выделенный текст станет <i>италиком</i>. Повторное нажатие уберёт италик.</p>
        // <p>И так далее…</p>
        // <p>Alt (⌥) + O — переключает между обычным текстом и нумерованным списком.</p>
        // <h2>Легко доступные стили оформления текста</h2><h3>Заголовки</h3>
        // <ol>
        // <li>H2 — второй по величине.</li>
        // <li>H3 — третий по величине.</li>
        // <li>H4 — четвёртый.</li>
        // </ol>
        // <p>Почему нет первого? Во-первых, какие заголовки доступны в редакторе, настраивается. Во-вторых, не рекомендуется на странице использовать более одного заголовка первого уровня. На этой странице уже есть — «TEXTARENA» — в верху страницы.</p>`,
// content: `
// <h2>&nbsp;2</h2>
// <p> а
// на<b> берегу

//     </b><i> на </i> берегу<!----></p>
//     `,
// content: `
// <p>1<b>234</b>56789123</p>
//     `,
    }
    const initData = {
      dataHtml,
    }
    const htmlElem = document.getElementById('html');
    const onChange = debounce((data) => {
      localStorage.setItem('dataHtml', JSON.stringify(data.dataHtml));
      if (htmlElem) {
        htmlElem.innerText = data.html;
      }
    }, 500);
    const calloutPlugin = function () {
      const self = {
        register: (textarena) => {
          console.log(self, textarena);
          textarena.parser.registerTag('DIV', {
            level: 'ROOT_LEVEL',
            insideLevel: 'ROOT_LEVEL',
          })
          textarena.parser.registerTag('ARENA-CALLOUT', {
            level: 'ROOT_LEVEL',
            insideLevel: 'ROOT_LEVEL',
          })
          textarena.creatorBar.registerCreator('callout', {
            name: 'callout',
            icon: '!',
            title: 'Callout',
            processor: (context) => {
              context.parser.prepareAndPasteHtml(
                `<arena-callout>
                  <p slot="title">Пиши заголовок сюды</p>
                  <p slot="body">А текст сюды</p>
                </arena-callout>`
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
        // plugins: [
        //   calloutPlugin(),
        // ],
        // creatorBar: {
        //   creators: [
        //     'hr',
        //     'image',
        //     'blockquote',
        //     'callout',
        //   ],
        // },
        // toolbar: {
        //   enabled: true,
        //   tools: [
        //     'strong',
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
          // ],
        // }
      },
    );
  }
}());
