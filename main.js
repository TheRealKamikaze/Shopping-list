const electron = require('electron');
const url      = require('url');
const path     = require('path');

const {app, BrowserWindow, Menu, ipcMain} = electron;

let mainWindow;
let addWindow;
//listen for app to be ready, event driven system

app.on('ready',()=>{
  //create new Window
  mainWindow = new BrowserWindow({
    webPreferences: {
            nodeIntegration: true
        }
  });
  //load html into Window
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname,'index.html'),
    protocol: 'file:',
    slashes: true
  }));
  // quit app when closed
  mainWindow.on('close',()=>app.quit());
  //build menu from Template
  const menu = Menu.buildFromTemplate(menuTemplate);
  // insert menu
  Menu.setApplicationMenu(menu);
});

// add Window
let createAddWindow = ()=>{
  addWindow = new BrowserWindow({
    webPreferences: {
            nodeIntegration: true
        },
    width: 300,
    height: 200,
    title: 'Add shopping List item'
  });
  addWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'addWindow.html'),
    protocol: 'file:',
    slashes: true
  }));
  //garbage collection set addwindow to null
  addWindow.on('close',()=>addWindow=null);
}

//catvh item:add
ipcMain.on('item:add',(event,item)=>{
  console.log(123,item)
  mainWindow.webContents.send('item:add',item);
  addWindow.close();
})
//create menuTemplate

const menuTemplate = [
  {
    label: 'File',
    submenu: [
      {
        label: 'Add Menu',
        click(){
          createAddWindow();
        }
      },
      {
        label: 'Clear Menu',
        click(){
          mainWindow.webContents.send('item:clear');
        }
      },
      {
        label: 'Quit',
        accelerator: process.platform =='darwin'? 'Command+Q' : 'Ctrl+Q',
        click(){
          app.quit();
        }
      },
    ]
  }
]
//sorting things for mac
if(process.platform==='darwin'){
  menuTemplate.unshift({})
}

// add developer tools if not in production

if(process.env.NODE_ENV!== 'production'){
  menuTemplate.push({
    label: 'developer tools',
    submenu: [
      {
        label: 'Toggle DevTools',
        accelerator: process.platform==='darwin'? 'Command+I': 'Ctrl+I',
        click(item, focusedWindow){
          focusedWindow.toggleDevTools();
        }
      },
      {
        role: 'reload'
      }
    ]
  })
}
