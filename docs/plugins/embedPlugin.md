# embedPlugin
The embedPlugin registers element that allows you to embed external content. This content is provided by an external applications, like Twitter, Instagram or Facebook and etc.

An embed plugin configuration object is passed to the plugin method parameter. This object consist of [the default plugin options](../plugins.md#default-plugin-options) and the required additional property `components`.

The `components` property is an array of objects having the following properties:

* component - String with the name of tag for define customElements.
* componentConstructor - Constructor for define customElements. Allows you to convert the source code into arena elements.

The plugin registers own:  
Creator | Tool
--- | ---
yes | no

This plugin has the following common default options: 
```js
{
  name: 'embed',
  title: 'Embed',
  tag: 'ARENA-EMBED',
  attributes: {
    contenteditable: false,
  },
  allowedAttributes: ['href', 'type', 'postid', 'border'],
  shortcut: 'Alt + KeyE',
  hint: 'e',
  command: 'add-embed',
  components: [
    {
      component: 'arena-embed',
      componentConstructor: ArenaEmbed,
    },
    {
      component: 'arena-embed-simple',
      componentConstructor: ArenaEmbedSimple,
    },
    {
      component: 'arena-embed-form',
      componentConstructor: ArenaEmbedForm,
    },
    {
      component: 'arena-embed-youtube',
      componentConstructor: ArenaEmbedYoutube,
    },
  ],
  marks: [
    {
      tag: 'ARENA-EMBED',
      attributes: [],
    },
  ],
  output: outputEmbed,
}
```