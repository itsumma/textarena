# listsPlugin
The listsPlugin registers list elements. It is recommended to use only one list plugin, since a plugin initialized later will overwrite the previous one.

A `ListOptions` configuration  object with the properties `item` and `lists` is passed to the plugin method parameter.

An object with the following properties is passed to the property `item` that configures the Textarena element:
* name - a string with the name of the Textarena element, which is also specified in the options of the creator bar or toolbar.
* tag -  a string with the tag of the generated textarena HTML element.
* attributes - an object with attributes as the properties and their values which added when the textarena HTML element is generated.

The property `lists` is an array of objects that configure lists. Each object has default plugin options that you can view at [the table](../plugins.md#default-plugin-options), as well as the following additional ones:
* prefix - the function which receives the `ArenaNodeText` object that provides an Textarena element node. This function determines which character the marker will be changed to when copying the list. Returns string with this character.
* pattern - the regular expression by which the character that will be converted to a marker is defined in the inserted text

The plugin registers own:  
Creator | Tool
--- | ---
yes | yes

This plugin has the following common default options: 
```js
{
  item: {
    name: 'li',
    tag: 'LI',
    attributes: {},
  },
  lists: [
    {
      prefix: () => '  — ',
      name: 'unordered-list',
      tag: 'UL',
      attributes: {},
      title: 'List',
      icon: '/*svg tag*/',
      shortcut: 'Ctrl + Alt + L',
      command: 'convert-to-unordered-list',
      pattern: /^(-\s+).*$/,
      marks: [
        {
          tag: 'UL',
          attributes: [],
        },
      ],
    },
    {
      prefix: (node: ArenaNodeText) => `  ${node.getIndex() + 1}. `,
      name: 'ordered-list',
      tag: 'OL',
      attributes: {},
      allowedAttributes: ['start'],
      title: 'Ordered list',
      icon: '/*svg tag*/',
      shortcut: 'Ctrl + Alt + O',
      command: 'convert-to-ordered-list',
      pattern: /^(\d+(?:\.|\))\s+).*$/,
      marks: [
        {
          tag: 'OL',
          attributes: [],
        },
      ],
    },
  ],
}
```

**[Return to plugins list.](../plugins.md#list-of-standard-plugins)**