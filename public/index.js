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
        <p>Alt (⌥) + O — переключает между обычным текстом и нумерованным списком.</p>
        <h2>Легко доступные стили оформления текста</h2><h3>Заголовки</h3>
        <ol>
        <li>H2 — второй по величине.</li>
        <li>H3 — третий по величине.</li>
        <li>H4 — четвёртый.</li>
        </ol>
        <p>Почему нет первого? Во-первых, какие заголовки доступны в редакторе, настраивается. Во-вторых, не рекомендуется на странице использовать более одного заголовка первого уровня. На этой странице уже есть — «TEXTARENA» — в верху страницы.</p>

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
