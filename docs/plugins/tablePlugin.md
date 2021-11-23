# tablePlugin
The tablePlugin registers table element.

A table plugin configuration object is passed to the plugin method parameter. This object consist of the following properties:
* tableOptions
* rowOptions
* cellOptions
* commands

Properties `tableOptions`, `rowOptions` and `cellOptions` are objects that have [the default plugin options](../plugins.md#default-plugin-options).

The `commands` property is an array of objects. Each object has the following properties:

Property | Description
--- | ---
command | String with the command identifier, which will also be saved in the history and displayed in the logs. Must be unique. Required property.
action | The function that is triggered when the command is called. It receives `Textarena` and `ArenaSelection` objects with which it is possible to interact with Textarena elements. This function returns `ArenaSelection` or `boolean` or `Promise<ArenaSelection>`.
shortcut | String with keyboard shortcut that you can use call the command.
icon | HTML that defines how the element will be displayed in the bars.
checkStatus | 
canShow | 
