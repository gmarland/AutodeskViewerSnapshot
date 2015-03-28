# Autodesk Viewer Snapshot Tool

## Summary

I wanted to try to create a simple app that loaded the Autodesk Viewer and then captures a PNG image out of whatever is currently in the view frame.

For this example it creates a deck of slides on the left hand side which could then be used in presentations etc.

### Setting up

If you want to use this yourself you will need to fill in the following

<b>package.json</b><br/>
viewerAPIKey - Your Autodesk viewer API Key<br/>
viewerAPISecret - Your Autodesk viewer API Secret key<br/>

<b>/app/modules/viewer.js</b><br/>
_documentId: "urn:" - The URN of the Autodesk model you have previously uploaded into the cloud

### Using the screenshot hack

In order to take a screenshot you should look at the code in /app/modules/viewer.js. 

<i>Line 75.  that._viewer.canvas = that._viewer.canvas.getContext("experimental-webgl", {preserveDrawingBuffer: true}).canvas</i>

This keeps the rendering buffer which allows the pulling of the image.

<i>Line 113. that._viewer.canvas.toDataURL("image/png")</i>

### Screenshots

![alt tag](https://raw.githubusercontent.com/gmarland/AutodeskViewerSnapshot/master/example_images/capture-1.PNG)
