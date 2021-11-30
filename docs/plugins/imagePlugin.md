# imagePlugin
The imagePlugin registers element of the image.

An image plugin configuration object is passed to the plugin method parameter. This object consist of [the default plugin options](../plugins.md#default-plugin-options) and the following additional properties:

<table>
<tr>
    <th>Property</th>
    <th>Description</th>
</tr>
<tr>
    <td> 
        srcset 
    </td>
  <td>

   An array of objects defining a set of possible images to display in the browser. Each object matches the `source` tag with the media expression specified in the string property `media`. 

   The `rations` property is an array of objects that configures the `srcset` attribute. Each object corresponds to a value for a specific resolution. This object has following properties:

   * ratio - a pixel density descriptor (a positive floating point number)
   * width - the intrinsic width of the image in pixels
   * height - the intrinsic height of the image in pixels
  </td>
</tr>
<tr>
    <td> 
        prepareSrc
    </td>
  <td>

   The function that generates src. It receives required `src` string and additional `width` and `height` numbers and returns string with src.
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
  name: 'image',
  icon: '/*svg tag*/',
  title: 'Image',
  tag: 'ARENA-IMAGE',
  attributes: {},
  allowedAttributes: ['src', 'width', 'height', 'alt'],
  command: 'add-image',
  marks: [
    {
      tag: 'ARENA-IMAGE',
      attributes: [],
    },
    {
      tag: 'IMG',
      attributes: [],
    },
  ],
  component: 'arena-image',
  componentConstructor: ArenaImage,
  prepareSrc: prepareImageSrc,
  output: outputImage,
}
```

**[Return to plugins list.](../plugins.md#list-of-standard-plugins)**