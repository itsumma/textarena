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
        if (data && data.dataHtml && data.time && data.time > (+ new Date() - 1000*60*60*24)) {
          dataHtml = data.dataHtml;
        }
      }
    } catch {}
    if (!dataHtml) {
      dataHtml = `
        <h2><s>Простой</s> Крутой текстовый редактор</h2>

        <p><strong>Textarena</strong> адаптирована для быстрой работы с текстом. К тому же она легко расширяется с помощью плагинов.</p>

        <p>Выделите текст, появится панель для форматирования.</p>

        <p>Зажмите Ctrl (⌘ для Mac) или Alt (⌥ для Mac) и вы увидите подсказки.</p>

        <arena-image src="https://storage.yandexcloud.net/itsizo.app/ee907a4a-9ff2-40fb-ae3f-1e4f91a02800.png"></arena-image>

        <p>Ctrl (⌘) + I — выделенный текст станет <em>италиком</em>. Повторное нажатие уберёт италик.</p>

        <p>Ctrl (⌘) + B — изменит <strong>жирность</strong> выделенного текста.</p>

        <p>И так далее…</p>

        <h3>Заголовки</h3>

        <ul>
          <li>H2 — второй по величине.</li>
          <li>H3 — третий по величине.</li>
          <li>H4 — четвёртый.</li>
        </ul>

        <p>Почему нет первого? Во-первых, какие заголовки доступны в редакторе, настраивается. Во-вторых, не рекомендуется на странице использовать более одного заголовка первого уровня. На этой странице уже есть — «TEXTARENA» — в верху страницы.</p>

        <p>Чтобы превратить текст в заголовок можно нажать Alt (⌥) + 2 или 3 или 4.</p>

        <p>Чтобы вернуть параграф — Alt (⌥) + 0.</p>

        <h3>Списки</h3>

        <p>Чтобы начать список:</p>

        <ol>
          <li>напечатать в начале строки 1. и пробел или дефис с пробелом;</li>
          <li>нажать Alt (⌥) + O или Alt (⌥) + L для нумерованного или списка с буллетами соответственно.</li>
        </ol>

        <h3>Несложные текстовые блоки</h3>

        <blockquote>
          <p>Для того чтобы сделать простой блок цитаты, нажмите Alt (⌥) + &quot;.</p>
          <p>Или нажмите кнопку с плюсом на пустой строке.</p>
        </blockquote>

        <aside>
          <p>Другой блок с рамочкой.</p>
          <p>Чтобы выйти из него, можно в конце строки два раза нажать Enter.</p>
        </aside>

        <h3>Сложные текстовые блоки</h3>

        <arena-quote class=textarena-quote>
          <arena-image width="100" height="100" src="https://storage.yandexcloud.net/itsizo.app/87e7c025-d3bd-4f6e-9e84-595dc629affb.jpg"></arena-image>
          <cite slot=quote_author class=textarena-quote__author>Меде́я</cite>
          <cite slot=quote_role class=textarena-quote__role>царевна из страны Эета</cite>
          <quote slot=quote_body class=body>…вы можете превратить старика в молодого человека, если разрежете его и бросите в кипящий котёл.</quote>
        </arena-quote>

        <p>Такие блоки настраиваются с помощью плагинов.</p>

        <h3>Эмбеды</h3>

        <arena-embed contenteditable="false" type="instagram" href="https://www.instagram.com/p/CMxXv-pFi6y/?utm_source=ig_web_copy_link"></arena-embed>

        <h3>Картинки</h3>

        <arena-image src="https://storage.yandexcloud.net/itsizo.app/2292deee-ae9c-4114-8aef-cebaefd8ec05.jpg"></arena-image>

        <p>И многое другое…</p>

        <p><br/></p>
      `;
      // dataHtml = `<h2><s>Простой</s> Крутой текстовый редактор</h2><arena-image src="https://storage.yandexcloud.net/itsizo.app/ee907a4a-9ff2-40fb-ae3f-1e4f91a02800.png"></arena-image><p>Выделите текст, появится панель для форматирования.</p>`;
    }
    const initData = {
      dataHtml,
    }
    const htmlElem = document.getElementById('html');
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
    }, 500);

    const textarena = new Textarena(
      elem,
      {
        editable: true,
        debug: true,
        onChange,
        onReady: onChange,
        initData,
      },
    );
  }
}());
