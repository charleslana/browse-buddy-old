import path from 'path';
import { BrowserWindow, globalShortcut, Menu, shell } from 'electron';

export function handleMenu(mainWindow: BrowserWindow): void {
  Menu.setApplicationMenu(null);
  const template: Electron.MenuItemConstructorOptions[] = [
    {
      label: 'Browse Buddy',
      submenu: [
        {
          label: 'Recarregar',
          accelerator: 'CmdOrCtrl+R',
          click: () => {
            mainWindow.reload();
          },
        },
        { type: 'separator' },
        {
          label: 'Fechar',
          accelerator: 'CmdOrCtrl+W',
          click: () => {
            mainWindow.close();
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
            mainWindow.webContents.openDevTools();
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
            aboutWindow.loadFile(path.join(__dirname, '..', 'about.html'));
          },
        },
      ],
    },
  ];
  globalShortcut.register('CommandOrControl+Shift+I', () => {
    mainWindow.webContents.openDevTools();
  });
  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}
