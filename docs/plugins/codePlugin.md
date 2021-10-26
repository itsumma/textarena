# codePlugin
The codePlugin registers element where text is displayed in a fixed-width font, and the text preserves both spaces and line breaks. The text will be displayed exactly as written in the HTML source code.

A default plugin configuration object is passed to the plugin method parameter. You can view all the properties at [the table of default plugin options](../plugins.md#default-plugin-options).

The plugin registers own:  
Creator | Tool
--- | ---
yes | yes

This plugin has the following common default options:
```js
{
  name: 'code',
  tag: 'PRE',
  attributes: {},
  title: 'Fixed-width',
  icon: 'pre',
  shortcut: 'Alt + KeyP',
  hint: 'p',
  command: 'convert-to-code',
  marks: [
    {
      tag: 'PRE',
      attributes: [],
    },
  ],
}
```