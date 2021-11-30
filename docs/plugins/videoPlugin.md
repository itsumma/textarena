# videoPlugin

The videoPlugin registers video element.

A video plugin configuration object is passed to the plugin method parameter. This object consist of [the default plugin options](../plugins.md#default-plugin-options) and the following additional properties:

<table>
<tr>
    <th>Property</th>
    <th>Description</th>
</tr>
<tr>
    <td> 
        classes
    </td>
  <td>

   A string of class names that is assigned to the `class` attribute  of `video` tag.
  </td>
</tr>
<tr>
    <td> 
        upload
    </td>
  <td>

   А function that allows to configure the upload of a video file. It receives the `File` object of the uploaded video file and returns upload result promise.
  </td>
</tr>
<tr>
    <td> 
        izoConfig
    </td>
  <td>

   Configuration object for connecting to a IZO microservice for uploadingfiles to the cloud. This object has following properties:
   * url - microservice connection address
   * token - access token
  </td>
</tr>
</table>

The plugin registers own:  
Creator | Tool
--- | ---
yes | no

This plugin has the following common default options:
```js
{
    name: 'video',
    icon: '/*svg tag*/',
    title: 'Video',
    tag: 'ARENA-VIDEO',
    classes: 'video',
    attributes: {},
    allowedAttributes: ['src', 'type', 'classes'],
    command: 'add-video',
    shortcut: 'Ctrl + Alt + V',
    marks: [
        {
            tag: 'ARENA-VIDEO',
            attributes: [],
        },
        {
            tag: 'VIDEO',
            attributes: [],
        },
    ],
    component: 'arena-video',
    componentConstructor: ArenaVideo,
    output: outputVideo,
}
```

**[Return to plugins list.](../plugins.md#list-of-standard-plugins)**