# headersPlugin
The headersPlugin registers headings elements. 

A configuration object with the properties of headings is passed to the plugin method parameter. Each property is the default plugin configuration objects. You can view all the properties at [the table of default plugin options](../plugins.md#default-plugin-options).

The plugin registers own:  
Creator | Tool
--- | ---
multiple | multiple

This plugin has the following common default options: 
```js
{
  h2: {
    name: 'header2',
    tag: 'H2',
    attributes: {},
    title: 'Header 2',
    icon: '<b>H2</b>',
    command: 'convert-to-header2',
    shortcut: 'Alt + Digit2',
    description: 'Заголовок второго уровня',
    hint: '2',
    marks: [
      {
        tag: 'H2',
        attributes: [],
      },
    ],
  },
  h3: {
    name: 'header3',
    tag: 'H3',
    attributes: {},
    title: 'Header 3',
    icon: '<b>H3</b>',
    command: 'convert-to-header3',
    shortcut: 'Alt + Digit3',
    description: 'Заголовок третьего уровня',
    hint: '3',
    marks: [
      {
        tag: 'H3',
        attributes: [],
      },
    ],
  },
  h4: {
    name: 'header4',
    tag: 'H4',
    attributes: {},
    title: 'Header 4',
    icon: '<b>H4</b>',
    command: 'convert-to-header4',
    shortcut: 'Alt + Digit4',
    description: 'Заголовок четвёртого уровня',
    hint: '4',
    marks: [
      {
        tag: 'H4',
        attributes: [],
      },
    ],
  },
}
```