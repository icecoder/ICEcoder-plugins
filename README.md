#ICEcoder Plugins
##Plugins available via ICEcoder code editor(https://icecoder.net)

This repo contains the plugins available whilst using ICEcoder, so you can get involed with the code, put in pull requests to add your own plugins etc.

It's a very early repo setup, full details coming soon.

Comments, improvements & feedback welcomed!

#how to install offline/manual
------

>how to install plugins offline or no internet on the host server

1. download the zip and extract all the folders in the directory **\icecoder\plugins**
2. then edit the file in **\icecoder\lib\config-USERNAME-IP_SERVER.php** or the **config___users-template.php**
3. find the line that says **"plugins"=> array(),** add this inside the array:

```
array("Adminer - MySQL database manager","plugins/adminer/icon.png","margin-left: 2px","plugins/adminer/adminer-4.0.3-en.php","_blank",""),
array("Emmet - Snippet type booster","plugins/emmet/icon.png","","http://docs.emmet.io","_blank",""),
array("LESSPHP - LESS compile on save","plugins/lessphp/icon.png","","javascript:top.ICEcoder.message('Compiles .less file to .css file in same dir on save. Can define settings in processes/on-file-save.php');","fileControl:<b>Showing SCSSPHP info</b>",""),
array("SCSSPHP - Sass compile on save","plugins/scssphp/icon.png","","javascript:top.ICEcoder.message('Compiles .scss file to .css file in same dir on save. Can define settings in processes/on-file-save.php');","fileControl:<b>Showing SCSSPHP info</b>",""),
array("Terminal - Console shell","plugins/terminal/icon.png","","plugins/terminal","_blank",""),
array("Linux Dash - Linux monitoring dashboard","plugins/linux-dash/icon.png","","plugins/linux-dash/linux-dash/index.html","_blank",""),
array("stats.js - FPS and MS to render meter","plugins/stats.js/icon.png","","javascript:top.ICEcoder.message('Displays a FPS and MS to render meter in the preview window');","fileControl:<b>Showing stats.js info<\/b>",""),
array("Perfmap - front-end performance heatmap","plugins/perfmap/icon.png","","javascript:top.ICEcoder.doPerfMap = function(){var el=document.createElement('script');el.src=window.location+'plugins/perfmap/perfmap.js';top.ICEcoder.previewWindow.document.body.appendChild(el);};top.ICEcoder.doPerfMap();","fileControl:<b>Showing Perfmap overlay</b>",""),
array("CSS Beautify - Tidy up your CSS","plugins/cssbeautify/icon.png","","plugins/cssbeautify","fileControl:<b>Tidying your CSS</b>",""),
array("JSHint - Show JS warnings/errors as you code","plugins/jshint/icon.png","","javascript:top.ICEcoder.message('Displays error and warning icons in gutter when coding in JS and JSON files');","fileControl:<b>Showing JSHint info</b>",""),
array("JSON Prettify - Tidy up your JSON","plugins/jsonprettify/icon.png","","plugins/jsonprettify","fileControl:<b>Tidying your JSON</b>",""),
array("Pesticide - Faster CSS layout debugging","plugins/pesticide/icon.png","","javascript:if(top.ICEcoder.previewWindow){top.ICEcoder.pesticide = !top.ICEcoder.pesticide; top.ICEcoder.doPesticide();};",0,""),
array("Window Keys - Global vars to console.log","plugins/window-keys/icon.png","","plugins/window-keys","fileControl:<b>Showing Window Keys</b>",""),
array("SVG Edit - In browser SVG editor","plugins/svg-edit/icon.png","","plugins/svg-edit/svg-edit-2.6/svg-editor.html","_blank",""),
array("ICErepo - Github repo manager","plugins/ice-repo/icon.png","","plugins/ice-repo","_blank",""),
array("Zip It! - File/folder zip utility","plugins/zip-it/icon.png","margin-left: 3px","plugins/zip-it/?zip=|&exclude=*.doc*.gif*.jpg*.jpeg*.pdf*.png*.swf*.xml*.zip","fileControl:<b>Zipping Files</b>","30"),
```

remember that in the end there must be an array closure
