# quotePlugin
The blockquotePlugin registers complex qoute element. It consists of the author name of the quote, his role, the quote itself and the image.

A default plugin configuration object is passed to the plugin method parameter. You can view all the properties at [the table of default plugin options](../plugins.md#default-plugin-options).

The plugin registers own:  
Creator | Tool
--- | ---
yes | no

This plugin has the following common default options: 
```js
{
  name: 'quote-block',
  title: 'Block with qoute',
  tag: 'ARENA-QUOTE-BLOCK',
  attributes: { class: 'quote-block' },
  shortcut: 'Alt + KeyB',
  hint: 'q',
  command: 'add-quote-block',
  component: 'arena-quote-block',
  componentConstructor: ArenaQuoteBlock,
  marks: [
    {
      tag: 'ARENA-QUOTE-BLOCK',
      attributes: [],
    },
    {
      tag: 'ARENA-QUOTE',
      attributes: [],
    },
    {
      tag: 'BLOCKQUOTE',
      attributes: ['class="quote-block"'],
    },
  ],
  output: outputQuoteBlock,
}
```