# figurePlugin
The figurePlugin registers element of the image with caption. In order for the plugin to work, you must first connect the imagePlugin.

A figure plugin configuration object is passed to the plugin method parameter. This object consist of [the default plugin options](../plugins.md#default-plugin-options) and the following required additional properties:

<table>
<tr>
    <th>Property</th>
    <th>Required</th>
    <th>Description</th>
</tr>
<tr>
    <td> 
        srcset 
    </td>
    <td> 
        no 
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
        classes
    </td>
    <td> 
        no 
    </td>
  <td>
    
   An array of objects that defines a set of classes, of which you can select the appropriate one in the editor. Each object has the following properties:
   * className - the name of the assigned class (required property)
   * icon - HTML that defines how the class selector will be displayed (required property)
   * srcset - the same as `srcset` property of the plugin
   * ratio
  </td>
</tr>
<tr>
    <td> 
        placeholder
    </td>
    <td> 
        yes 
    </td>
    <td>
        A string which value will be set to the image caption by default.
    </td>
</tr>
</table>