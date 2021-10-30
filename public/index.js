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
      <h2><s>Simple</s> Cool text editor</h2>
      <p class="paragraph"><strong>Textarena</strong> is adapted for quick work with text. In addition, it is easily expanded with plugins.</p>
      <p class="paragraph">When the text is selected, the formatting panel will appear.</p>
      <p class="paragraph">On the open panel, hold down Ctrl (⌘ for Mac) or Ctrl + Alt (⌘ + ⌥ for Mac) and you will see keyboard shortcuts hints.</p>
      <figure class="">
        <picture>
          <img src="https://d3qc8znfr3ejm3.cloudfront.net/images/781b832a-2fe6-46f0-b561-08b81799f809.png" alt="true" class="">
        </picture>
        <figcaption slot="image-caption">The formatting panel appears when the text is highlighted, and can also be controlled by keyboard shortcuts</figcaption>
      </figure>
      <p class="paragraph">Ctrl (⌘) + I — the highlighted text will become <em>italic</em>. Pressing again will remove the italic.</p>
      <p class="paragraph">Ctrl (⌘) + B — will change <strong>bold</strong> of the selected text.</p>
      <p class="paragraph">And so on: <em>italic</em>, <u>underline</u>, <s>strikethrough</s>, <sub>subscript</sub> and <sup>superscript</sup>, <mark>mark</mark>, <code>inline code</code>, <a href="https://github.com/itsumma/textarena" target="_blank">link</a>…&nbsp;</p>

      <h3>Headings</h3>
      <ul>
        <li>H2 — second level.</li>
        <li>H3 — third level.</li>
        <li>H4 — fourth.</li>
      </ul>
      <p class="paragraph">Why is there no first level? First of all, which headers are available in the editor is configurable. Secondly, it is not recommended to use more than one first-level heading on the page. This page already has a title - "TEXTARENA" - at the top of the page.</p>
      <p class="paragraph">To turn the text into a heading, you can press Ctrl + Alt (⌘ + ⌥) + 2 or 3 or 4.</p>
      <p class="paragraph">To return a paragraph — Ctrl + Alt (⌘ + ⌥) + 0.</p>

      <h3>Lists</h3>
      <p class="paragraph">To start the list:</p>
      <ol><li>type at the beginning of the line "1." and a space or "-" with a space;</li>
      <li>press Ctrl + Alt (⌘ + ⌥) + O or Ctrl + Alt (⌘ + ⌥) + L for ordered or bullet list, respectively.</li></ol>

      <h3>Simple text blocks</h3>
      <blockquote><p class="paragraph">To make a simple quote block, press Ctrl + Alt (⌘ + ⌥) + &quot;.</p></blockquote>
      <p class="paragraph">Or press the plus button on an empty line.</p>
      <figure class="">
        <picture>
          <img src="https://d3qc8znfr3ejm3.cloudfront.net/images/f2a48b32-3db9-456a-b03b-e142a0bc38ca.png" alt="" class="">
        </picture>
        <figcaption slot="image-caption">Panel for creating headings, lists and other elements</figcaption>
      </figure>
      <aside class="aside aside-gray">
        <p class="paragraph">A text block with a frame.</p>
        <p class="paragraph">To exit it, you can press Enter twice at the end of the line.</p>
      </aside>

      <h3>Complex text blocks</h3>
      <blockquote class="quote-block">
        <div class="quote-block__line">
          <div class="quote-block__author-block">
            <cite slot="quote_author" class="quote-block__author">A. A. Milne</cite>
            <cite slot="quote_role" class="quote-block__role">an English author</cite>
          </div>

          <div class="quote-block__image">
          <picture>
            <source media="(max-width: 600px)"
              srcset="https://d3qc8znfr3ejm3.cloudfront.net/images/16bc58c6-66aa-4a99-81d9-67bc8fe44307_200_200.jpg 1x, https://d3qc8znfr3ejm3.cloudfront.net/images/16bc58c6-66aa-4a99-81d9-67bc8fe44307_400_400.jpg 2x"/>
            <source media=""
              srcset="https://d3qc8znfr3ejm3.cloudfront.net/images/16bc58c6-66aa-4a99-81d9-67bc8fe44307_100_100.jpg 1x, https://d3qc8znfr3ejm3.cloudfront.net/images/16bc58c6-66aa-4a99-81d9-67bc8fe44307_200_200.jpg 2x, https://d3qc8znfr3ejm3.cloudfront.net/images/16bc58c6-66aa-4a99-81d9-67bc8fe44307_400_400.jpg 4x"/>
            <img src="https://d3qc8znfr3ejm3.cloudfront.net/images/16bc58c6-66aa-4a99-81d9-67bc8fe44307_200_200.jpg" alt="true" class="quote-block__image">
          </picture>
          </div>
        </div>
        <quote slot="quote_body" class="quote-block__body">People say nothing is impossible, but I do nothing every day.</quote>
      </blockquote>
      <p class="paragraph">Such blocks are configured using plugins.</p>

      <h4>Pictures</h4>
      <figure class="">
        <picture>
          <img src="https://d3qc8znfr3ejm3.cloudfront.net/images/bdf131ea-e9ea-4b29-8d63-96a9c440ddff.jpg" alt="" class="">
        </picture>
        <figcaption slot="image-caption">With a caption</figcaption>
      </figure>

      <h4>Columns</h4>
      <div class="arena-two-col">
          <div class="arena-col">
            <p class="paragraph">You don't need to look for a good text editor if you've already found the Textarena</p>
          </div>
          <div class="arena-col">
            <figure class="">
              <picture>
                <img src="https://d3qc8znfr3ejm3.cloudfront.net/images/df1ba26d-aaf9-4b01-a600-e59547a083cb.jpg" alt="" class="">
              </picture>
            </figure>
          </div>
      </div>

      <h4>Roadmap</h4>
      <roadmap>
        <p class="paragraph">✨ Formatting</p>
        <p class="paragraph">🎉 Lists</p>
        <p class="paragraph">🎈 Embeds</p>
        <p class="paragraph">✨ Complex blocks</p>
        <p class="paragraph">⌛ Tables</p>
        <p class="paragraph">⌛ Nested lists</p>
      </roadmap>

      <h4>Tables <sup>Alpha</sup></h4>
      <table>
        <tr>
          <td>Shift + Enter — add a row</td>
          <td>
            Shift + Tab — add a column
          </td>
        </tr>
        <tr>
          <td>Ctrl + Shift + Backspace — remove a row</td>
          <td>
            Ctrl + Backspace — remove a column
          </td>
        </tr>
      </table>

      <h4>Nested lists<sup>Alpha</sup></h4>
      <ol start="1"><li>First level</li>
      <ol><li>Second</li>
      <ol><li>Third</li>
      <li>Third again</li>
      <ul><li>…suddenly bullet list</li>
      <ul><li>more bullets</li></ul></ul></ol>
      <li>Back to the second level</li></ol>
      <li>And again the first</li></ol>

      <hr class="asterisk"></hr>
      <p class="paragraph">And much more with plugins…</p>
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
            }
          }),
          videoPlugin({
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
              },
            ],
          }),
          embedPlugin(),
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
      }
    );
  }
}());
