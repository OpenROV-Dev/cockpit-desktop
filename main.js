const {app, BrowserWindow} = require('electron')
const path = require('path')
const url = require('url')
const beacon = require('./beacon.js')();

const { autoUpdater } =require("electron-updater");



var settings = {
    "NODE_ENV": "development",
    "PLATFORM": "mock",
    "BOARD":	"mock3000",
    "DEV_MODE": "true",
    "USE_MOCK": "true",
    "CPU_MOCK": "123MOCK",
    "MOCK_VIDEO_TYPE": "GEOMUX",
    "MOCK_VIDEO_HARDWARE": "true",
    "DEBUG": "bridge, mcu, cpu, *:Notifications, app:mjpeg*",
    "port": 8080,
    "configfile": "/tmp/rovconfig.json",
    "plugins__ui-manager__selectedUI": "new-ui",
    "pluginsDownloadDirectory": "/tmp/plugins",
    "cacheDirectory": "/tmp/cache",
    "DATADIR": "/tmp",
    "IGNORE_CACHE": "true",
    "LOG_LEVEL":"debug"
}

Object.keys(settings).forEach(function(key){
    process.env[key] = settings[key];
    console.log(`Setting ${key} to ${settings[key]}`);
});

//const cockpit = require('./cockpit/src/cockpit.js')
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({width: 800, height: 600,   webPreferences: {
    nodeIntegration: false,
    preload: path.join(__dirname, 'preload.js')
  }
  })

  // and load the index.html of the app.
/*  win.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))
*/

  win.loadURL('http://localhost:8080/');
  // Open the DevTools.
  win.webContents.openDevTools()

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null
  })

}


function notify(title, mesage) {
  let windows = BrowserWindowElectron.getAllWindows()
  if (windows.length == 0) {
    return
  }

  windows[0].webContents.send("notify", title, message)
}

function startServices(){
    beacon.listen();

    autoUpdater.logger = require("electron-log")
    autoUpdater.logger.transports.file.level = "info"    
    autoUpdater.signals.updateDownloaded(it => {
      notify("A new update is ready to install", `Version ${it.version} is downloaded and will be automatically installed on Quit`)
    })
    autoUpdater.checkForUpdates()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
    createWindow();
    startServices();
})

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.