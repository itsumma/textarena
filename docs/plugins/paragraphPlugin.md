# paragraphPlugin
Common plugin wich provides simple text paragraph. This plugin sets root element and is required.

A default plugin configuration object is passed to the plugin method parameter. You can view all the properties at [the table of default plugin options](../plugins.md#default-plugin-options).

The plugin registers own:  
Creator | Tool
--- | ---
no | yes

This plugin has the following common default options:
```js
{
  name: 'paragraph',
  title: 'Paragraph',
  tag: 'P',
  attributes: { class: 'paragraph' },
  icon: '<b>¶</b>',
  shortcut: 'Alt + Digit0',
  hint: '0',
  marks: [
    {
      tag: 'P',
      attributes: [],
    },
    {
      tag: 'DIV',
      attributes: [],
    },
  ],
};
```

**[Return to plugins list.](../plugins.md#list-of-standard-plugins)**