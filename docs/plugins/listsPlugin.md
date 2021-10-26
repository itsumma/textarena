# listsPlugin
The listsPlugin registers list elements. 

A configuration  object with the properties `item` and `lists` is passed to the plugin method parameter.

An object with the following properties is passed to the property `item` that configures the Textarena element:
* name - a string with the name of the Textarena element, which is also specified in the options of the creator bar or toolbar.
* tag -  a string with the tag of the generated textarena HTML element.
* attributes - an object with attributes as the properties and their values which added when the textarena HTML element is generated.

The property `lists` is an array of objects that configure lists. Each object has default plugin options that you can view at [the table](../plugins.md#default-plugin-options), as well as the following additional ones:
* prefix - 
<!-- the function which receives the `ArenaNodeText` object that provides an Textarena element node. This function configure list marker by  -->
* pattern - 
