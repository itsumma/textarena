# hrPlugin
The hrPlugin registers a horizontal rule - a line that goes across the Textarena area.

A default plugin configuration object is passed to the plugin method parameter. You can view all the properties at [the table of default plugin options](../plugins.md#default-plugin-options).

The plugin registers own:  
Creator | Tool
--- | ---
yes | no

This plugin has the following common default options: 
```js
{
  name: 'hr',
  title: 'Horizontal rule',
  tag: 'HR',
  attributes: {},
  shortcut: 'Alt + KeyH',
  hint: 'h',
  command: 'add-hr',
  marks: [
    {
      tag: 'HR',
      attributes: [],
    },
  ],
}
```