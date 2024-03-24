import path from 'path';
import { app, BrowserWindow, globalShortcut, ipcMain, Menu, shell } from 'electron';
import { navigate } from './puppeterTest';

let win: BrowserWindow | null;

function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    icon: getAppIconPath(),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  win.loadURL(`file://${__dirname}/index.html`);
  if (process.env.DEVTOOLS === 'true') {
    win.webContents.openDevTools();
  }
  win.maximize();
  globalShortcut.register('CommandOrControl+Shift+I', () => {
    win!.webContents.openDevTools();
  });
  handleMenu();
}

app.on('ready', createWindow);

ipcMain.on('navigate', (e, test) => {
  navigate(test)
    .then(() => {
      e.sender.send('navigate-reply', 'success');
    })
    .catch((error: Error) => {
      e.sender.send('navigate-error', error.message);
    });
});

function getAppIconPath() {
  let iconFileName = '';
  if (process.platform === 'linux') {
    iconFileName = 'icon-256x256.png';
  } else if (process.platform === 'win32') {
    iconFileName = 'icon-256x256.ico';
  }
  return path.join(__dirname, 'assets', iconFileName);
}

function handleMenu(): void {
  Menu.setApplicationMenu(null);
  const template: Electron.MenuItemConstructorOptions[] = [
    {
      label: 'Browse Buddy',
      submenu: [
        {
          label: 'Recarregar',
          accelerator: 'CmdOrCtrl+R',
          click: () => {
            win!.reload();
          },
        },
        { type: 'separator' },
        {
          label: 'Fechar',
          accelerator: 'CmdOrCtrl+W',
          click: () => {
            win!.close();
          },
        },
      ],
    },
    {
      label: 'Ajuda',
      submenu: [
        {
          label: 'Documentação',
          click: () => {
            shell.openExternal('https://example.com');
          },
        },
        {
          label: 'GitHub',
          click: () => {
            shell.openExternal('https://example.com');
          },
        },
        {
          label: 'Discord',
          click: () => {
            shell.openExternal('https://example.com');
          },
        },
        {
          label: 'Reportar um problema',
          click: () => {
            shell.openExternal('https://example.com');
          },
        },
        { type: 'separator' },
        {
          label: 'Abrir DevTools',
          accelerator: 'CmdOrCtrl+Shift+I',
          click: () => {
            win!.webContents.openDevTools();
          },
        },
        { type: 'separator' },
        {
          label: 'Sobre',
          click: () => {
            const aboutWindow = new BrowserWindow({
              width: 400,
              height: 300,
              title: 'Sobre',
              webPreferences: {
                nodeIntegration: true,
                contextIsolation: false,
              },
              autoHideMenuBar: true,
              resizable: false,
              maximizable: false,
              minimizable: false,
            });
            aboutWindow.loadURL(`file://${__dirname}/about.html`);
          },
        },
      ],
    },
  ];
  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}
