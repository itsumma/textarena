# roadmapPlugin
The roadmapPlugin registers a roadmap element.

A default plugin configuration object is passed to the plugin method parameter. You can view all the properties at [the table of default plugin options](../plugins.md#default-plugin-options).

The plugin registers own:  
Creator | Tool
--- | ---
yes | yes

This plugin has the following common default options: 
```js
{
  name: 'roadmap',
  tag: 'ROADMAP',
  attributes: { },
  title: 'Roadmap',
  shortcut: 'Alt + KeyU',
  hint: 'u',
  command: 'convert-to-roadmap',
  marks: [
    {
      tag: 'ROADMAP',
      attributes: [],
    },
  ],
}
```