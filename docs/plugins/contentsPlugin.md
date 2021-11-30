# contentsPlugin

The contentsPlugin registers element of the table of contents.

A `ContentsOptions` configuration object is passed to the plugin method parameter. This object consist of [the default plugin options](../plugins.md#default-plugin-options) and `processor` additional property.

The function which receives `Textarena` and `AnyArenaNode` objects is passed to the `processor` property. These objects allow you to interact with the elements of Textarena and the table of contents element. Processor function is needed to generate table of contents data and set it to an `data` attribute.

The plugin registers own:  
Creator | Tool
--- | ---
yes | no

This plugin has the following common default options:
```js
{
    name: 'contents',
    title: 'Contents',
    tag: 'ARENA-CONTENTS',
    attributes: {},
    allowedAttributes: ['list'],
    shortcut: 'Ctrl + Alt + C',
    command: 'add-contents',
    component: 'arena-contents',
    componentConstructor: ArenaContents,
    description: 'Contents',
    marks: [
        {
            tag: 'ARENA-CONTENTS',
            attributes: [],
        },
    ],
    output: outputContents,
    processor: contentsProcessor,
}
```

**[Return to plugins list.](../plugins.md#list-of-standard-plugins)**