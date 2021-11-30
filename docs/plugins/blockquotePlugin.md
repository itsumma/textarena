# blockquotePlugin
The blockquotePlugin registers simple qoute element.

A default plugin configuration object is passed to the plugin method parameter. You can view all the properties at [the table of default plugin options](../plugins.md#default-plugin-options).

The plugin registers own:  
Creator | Tool
--- | ---
yes | yes

This plugin has the following common default options:
```js
{
  name: 'blockquote',
  tag: 'BLOCKQUOTE',
  attributes: {},
  title: 'Blockquote',
  icon: '/*svg tag*/',
  shortcut: 'Alt + Quote',
  hint: '"',
  command: 'convert-to-blockquote',
  marks: [
    {
      tag: 'BLOCKQUOTE',
      attributes: [],
    },
  ],
}
```

**[Return to plugins list.](../plugins.md#list-of-standard-plugins)**