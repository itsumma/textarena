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
        if (data && data.dataHtml && data.time && data.time > (+ new Date() - 1000*60*60*24)) {
          dataHtml = data.dataHtml;
        }
      }
    } catch {}
    if (!dataHtml) {
      dataHtml = `
        <p></p>
        <arena-image src="https://storage.yandexcloud.net/itsizo.app/7b128593-5c11-4850-8560-6047d71e79b5.jpg">
          <p slot=image-caption>
        Мозьно мине карсиньки  <a href="https://storage.yandexcloud.net">грюсить</a>
          </p>
        </arena-image>
        <p>Alt (⌥) + O — переключает между обычным текстом и нумерованным списком.</p>
        <blockquote>
          <p>Alt (⌥) + O — переключает между обычным текстом и нумерованным списком.</p>
        </blockquote>
        <arena-recomendation postid="Статья про здоровье"></arena-recomendation>
        <h2>Легко доступные стили оформления текста</h2><h3>Заголовки</h3>
        <ol>
        <li>H2 — второй по величине.</li>
        <li>H3 — третий по величине.</li>
        <li>H4 — четвёртый.</li>
        </ol>
        <arena-callout>
          <p slot="title">
            Внимание!
          </p>
          <arena-callout-body slot="body">
            <ul>
            <li>
            Это удобно
            </li><li>
            Это быстро
            </li>
            </ul>
          </arena-callout-body>
        </arena-callout>
        <p>Почему нет первого? Во-первых, какие заголовки доступны в редакторе, настраивается. Во-вторых, не рекомендуется на странице использовать более одного заголовка первого уровня. На этой странице уже есть — «TEXTARENA» — в верху страницы.</p>

        <arena-embed contenteditable="false" href="https://www.youtube.com/embed/xY4fWRrwwOU" type="youtube" border=""></arena-embed>
        <arena-embed type="twitter" contenteditable="false" href="https://twitter.com/StalinGulag/status/1374843004503089157?s=20" postid="1374843004503089157"></arena-embed>
        <arena-embed type="instagram" contenteditable="false" href="https://www.instagram.com/p/CMxXv-pFi6y/?utm_source=ig_web_copy_link"></arena-embed>
        <arena-embed type="facebook" contenteditable="false" href="https://www.facebook.com/asus.ru/posts/3907045806048911"></arena-embed>
        <p></p>

        `;
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
