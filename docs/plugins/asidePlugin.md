# asidePlugin
The asidePlugin registers a block with a frame inside which you can add other elements of the Textarena.

A default plugin configuration object is passed to the plugin method parameter. You can view all the properties at [the table of default plugin options](../plugins.md#default-plugin-options).

The plugin registers own:  
Creator | Tool
--- | ---
yes | yes

This plugin has the following common default options: 
```js
{
  name: 'aside',
  tag: 'ASIDE',
  attributes: { class: 'aside aside-gray' },
  title: 'Block with a frame',
  shortcut: 'Alt + KeyA',
  hint: 'a',
  command: 'convert-to-aside',
  marks: [
    {
      tag: 'ASIDE',
      attributes: ['class="aside aside-gray"'],
    },
  ],
}
```