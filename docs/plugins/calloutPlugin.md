# calloutPlugin
The calloutPlugin registers a block for displaying important information inside which you can add other elements of the Textarena.

A default plugin configuration object is passed to the plugin method parameter. You can view all the properties at [the table of default plugin options](../plugins.md#default-plugin-options).

The plugin registers own:  
Creator | Tool
--- | ---
yes | no

This plugin has the following common default options: 
```js
{
  name: 'callout',
  title: 'Warning',
  tag: 'ARENA-CALLOUT',
  attributes: {},
  command: 'add-callout',
  component: 'arena-callout',
  componentConstructor: ArenaCallout,
  marks: [
    {
      tag: 'ARENA-CALLOUT',
      attributes: [],
    },
  ],
  output: defaultOutputCallout,
}
```

**[Return to plugins list.](../plugins.md#list-of-standard-plugins)**