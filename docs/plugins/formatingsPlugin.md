# formatingsPlugin
The formatingsPlugin registers elements of inline text formatting.

A configuration object with the property `formatings` is passed to the plugin method parameter. This property is an array of configuration objects of text formatting elements. These objects have the following properties:

<table>
<tr>
    <th>Property</th>
    <th>Required</th>
    <th>Description</th>
</tr>
<tr>
    <td> 
        name 
    </td>
    <td> 
        yes 
    </td>
   <td>
        String with the name of the Textarena formatting, which is also specified in the options of the creator bar or toolbar (if the plugin has a creator or tool).
   </td>
</tr>
<tr>
    <td> 
        tag 
    </td>
    <td> 
        yes 
    </td>
   <td>
        String with the tag of the generated textarena formatting.
   </td>
</tr>
<tr>
    <td> 
        attributes 
    </td>
    <td> 
        yes 
    </td>
    <td>

   String array with the attributes added when the textarena formatting is generated. Each string has a format like `style=fontWeight:bold` where the attribute and its value are separated by a sign '`=`'.
   </td>
</tr>
<tr>
    <td> 
        shortcut 
    </td>
    <td> 
        no 
    </td>
   <td>
        String with the keyboard shortcut that you can use to add or remove the Textarena formatting.
   </td>
</tr>
<tr>
    <td> 
        description 
    </td>
    <td> 
        no 
    </td>
   <td>
        String with the description of the keyboard shortcut that will be displayed in the tooltips window.
   </td>
</tr>
<tr>
    <td> 
        hint 
    </td>
    <td> 
        no 
    </td>
   <td>
        String with a hint that you can see on the bars by holding down Ctrl (Cmd ⌘ on Mac) or Alt (Option ⌥ on Mac).
   </td>
</tr>
<tr>
    <td> 
        command 
    </td>
    <td> 
        yes 
    </td>
   <td>
        String with the command identifier of adding an Textarena formatting, which will also be saved in the history and displayed in the logs. Must be unique.
   </td>
</tr>
<tr>
    <td> 
        marks 
    </td>
    <td> 
        yes 
    </td>
   <td>

   Object with tags and attributes with values by which the Textarena parser determines which elements will be converted into an Textarena element. Has the following properties:
   * tag - string with the tag.
   * attributes - string array with the attributes. Each string has a format like `style=fontWeight:bold` where the attribute and its value are separated by a sign '`=`'.
   * excludeAttributes - string array with the attributes by which the parser will ignore the element. Each string has a format like `style=fontWeight:bold` where the attribute and its value are separated by a sign '`=`'.

   </td>
</tr>
<tr>
    <td> 
        tool 
    </td>
    <td> 
        no 
    </td>
   <td>

   An object for registering a tool to display it in the toolbar. Has the following properties:
   * icon - HTML that defines how the tool will be displayed in the toolbar.
   * title - the title of the plugin that is displayed in the toolbar when the cursor hovers.
   </td>
</tr>
</table>

The plugin registers own:  
Creator | Tool
--- | ---
no | multiple

This plugin has the following common default options: 
```js
{
  formatings: [
    {
      name: 'strong',
      tag: 'STRONG',
      attributes: [],
      shortcut: 'Ctrl + KeyB',
      description: 'Bold',
      hint: 'b',
      command: 'format-strong',
      marks: [
        {
          tag: 'B',
          attributes: [],
          excludeAttributes: [
            'style=fontWeight:normal',
          ],
        },
        {
          tag: 'STRONG',
          attributes: [],
        },
        {
          tag: 'SPAN',
          attributes: [
            'style=fontWeight:bold',
          ],
        },
        {
          tag: 'SPAN',
          attributes: [
            'style=fontWeight:900',
          ],
        },
        {
          tag: 'SPAN',
          attributes: [
            'style=fontWeight:800',
          ],
        },
        {
          tag: 'SPAN',
          attributes: [
            'style=fontWeight:700',
          ],
        },
        {
          tag: 'SPAN',
          attributes: [
            'style=fontWeight:600',
          ],
        },
      ],
      tool: {
        title: 'Strong (bold)',
        icon: '<b>B</b>',
      },
    },
    {
      name: 'emphasized',
      tag: 'EM',
      attributes: [],
      command: 'format-emphasized',
      shortcut: 'Ctrl + KeyI',
      description: 'Italics',
      hint: 'i',
      marks: [
        {
          tag: 'I',
          attributes: [],
        },
        {
          tag: 'EM',
          attributes: [],
        },
        {
          tag: 'SPAN',
          attributes: [
            'style=fontStyle:italic',
          ],
        },
      ],
      tool: {
        title: 'Italic (emphasized)',
        icon: '<i>I</i>',
      },
    },
    {
      name: 'underline',
      tag: 'U',
      attributes: [],
      shortcut: 'Ctrl + KeyU',
      description: 'Underlined text',
      hint: 'u',
      command: 'format-underline',
      marks: [
        {
          tag: 'U',
          attributes: [],
        },
        {
          tag: 'SPAN',
          attributes: [
            'style=textDecoration:underline;',
          ],
        },
      ],
      tool: {
        title: 'Underline',
        icon: '<u>U</u>',
      },
    },
    {
      name: 'strikethrough',
      tag: 'S',
      attributes: [],
      shortcut: 'Ctrl + KeyD',
      description: 'Strikethrough text',
      hint: 'd',
      command: 'format-strikethrough',
      marks: [
        {
          tag: 'S',
          attributes: [],
        },
        {
          tag: 'DEL',
          attributes: [],
        },
        {
          tag: 'STRIKE',
          attributes: [],
        },
        {
          tag: 'SPAN',
          attributes: [
            'style=textDecoration:line-through;',
          ],
        },
      ],
      tool: {
        title: 'Strikethrough',
        icon: '<s>S</s>',
      },
    },
    {
      name: 'subscript',
      tag: 'SUB',
      attributes: [],
      shortcut: 'Ctrl + Comma',
      hint: ',',
      command: 'format-subscript',
      marks: [
        {
          tag: 'SUB',
          attributes: [],
        },
        {
          tag: 'SPAN',
          attributes: [
            'style=verticalAlign:sub;',
          ],
        },
      ],
      tool: {
        title: 'Subscript',
        icon: '<sub>sub</sub>',
      },
    },
    {
      name: 'superscript',
      tag: 'SUP',
      attributes: [],
      shortcut: 'Ctrl + KeyP',
      hint: 'p',
      command: 'format-superscript',
      marks: [
        {
          tag: 'SUP',
          attributes: [],
        },
        {
          tag: 'SPAN',
          attributes: [
            'style=verticalAlign:sup;',
          ],
        },
      ],
      tool: {
        title: 'Superscript',
        icon: '<sup>sup</sup>',
      },
    },
    {
      name: 'colored',
      tag: 'FONT',
      attributes: [
        'color="#545454"',
      ],
      command: 'format-colored',
      marks: [
        {
          tag: 'FONT',
          attributes: [
            'color="#545454"',
          ],
        },
        {
          tag: 'SPAN',
          attributes: [
            'style="color:#545454"',
          ],
        },
      ],
      tool: {
        title: 'Colored',
        icon: '/*svg tag*/',
      },
    },
    {
      name: 'mark',
      tag: 'MARK',
      attributes: [],
      command: 'format-mark',
      shortcut: 'Ctrl + KeyH',
      hint: 'h',
      marks: [
        {
          tag: 'MARK',
          attributes: [],
        },
      ],
      tool: {
        title: 'Mark',
        icon: '/*svg tag*/',
      },
    },
    {
      name: 'inline-code',
      tag: 'CODE',
      attributes: [],
      command: 'format-inline-code',
      shortcut: 'Ctrl + KeyE',
      hint: 'e',
      marks: [
        {
          tag: 'CODE',
          attributes: [],
        },
      ],
      tool: {
        title: 'Inline Code',
        icon: '〈&nbsp;〉',
      },
    },
  ],
}
```

**[Return to plugins list.](../plugins.md#list-of-standard-plugins)**