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
action | 
