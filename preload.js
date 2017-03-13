//Hook desired APIs here
const fs = require('fs');
const path = require('path');
const {dialog} = require('electron').remote
const {app} = require('electron').remote
const beacon = require('./beacon.js');
//const {ipcRenderer} = require('electron');

process.once('loaded', () => {
    window.process = process;
 //   window.ipcRenderer = ipcRenderer;
    window.OROVE = {Test : "aabbcc"};
    window.OROVE.AltStorage = {};
    window.OROVE.AltStorage.GetFileHandle = function(options,callback){
        dialog.showSaveDialog({title: options.title || 'Save File As', defaultPath: path.join(app.getPath('home'),options.defaultPath)}, function(filename){
            if (!filename){
                callback(new Error("no filename selected"));
            }
            callback(null,function(data,appendCallBack){
                fs.appendFile(filename, data, appendCallBack)
            })
        })
    }

    window.OROVE.Beacon = beacon;
//    beacon.on('deviceAnnouncement',function(beacon){
//      console.warn("got beacon", beacon);
//    });
//    beacon.listen();
  
})