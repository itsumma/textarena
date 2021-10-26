# linkPlugin
The linkPlugin registers inline link element.

A link plugin configuration object is passed to the plugin method parameter. This object consist of [the default plugin options](../plugins.md#default-plugin-options) and the following required additional properties:

<table>
<tr>
    <th>Property</th>
    <th>Description</th>
</tr>
<tr>
    <td> 
        moveCursorHandler 
    </td>
   <td>

   Handler for the carriage movement event. 
   
   This handler receives `Textarena`, `ArenaInlineInterface`, `ElementHelper` objects. 
   
   The `ArenaInlineInterface` object contains the Textarena plugin interface with the `linkPlugin` properties. 
   
   The `ElementHelper` object allows you to interact with the linkbar element.
   </td>
</tr>
<tr>
    <td> 
        commandFunction
    </td>
   <td>
    
   The function that is triggered when adding a link.
   
   It receives `ArenaInlineInterface` and `ElementHelper` objects. 
   
   The `ArenaInlineInterface` object contains the Textarena plugin interface with the `linkPlugin` properties. 
   
   The `ElementHelper` object allows you to interact with the element of the modal window in which the link is specified. 

   This function return `CommandAction` which receives `Textarena` and `ArenaSelection`. It helps to intract with the selected text and set inline link. The `CommandAction` returns `ArenaSelection` or `boolean` or `Promise<ArenaSelection>`.
   </td>
</tr>
</table>

The plugin registers own:  
Creator | Tool
--- | ---
yes | yes

This plugin has the following common default options: 
```js
{
  name: 'link',
  title: 'Link',
  tag: 'A',
  attributes: {
  },
  allowedAttributes: ['href', 'target'],
  shortcut: 'Ctrl + KeyK',
  hint: 'k',
  command: 'add-link',
  commandFunction: linkCommand,
  component: 'arena-linkbar',
  componentConstructor: ArenaLinkbar,
  marks: [
    {
      tag: 'A',
      attributes: [],
    },
  ],
  moveCursorHandler: linkManage,
}
```