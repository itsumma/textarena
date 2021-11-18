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