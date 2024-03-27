import path from 'path';
import { app, BrowserWindow, ipcMain, nativeTheme } from 'electron';
import { getThemeModePreference, setThemeModePreference } from '@utils/storeUtils';
import { handleMenu } from '@electron/menu';
import { navigate } from './runTest';

let mainWindow: BrowserWindow;

function createWindow() {
  handleCreateWindow();
  handleMenu(mainWindow);
  handleDarkMode();
}

app.on('ready', createWindow);

ipcMain.on('navigate', (e, test) => {
  navigate(test)
    .then(navigationResults => {
      e.sender.send('navigate-reply', navigationResults);
    })
    .catch((error: Error) => {
      e.sender.send('navigate-error', error.message);
    });
});

ipcMain.on('dark-mode:dark', () => {
  nativeTheme.themeSource = 'dark';
  setThemeModePreference('dark');
});

ipcMain.on('dark-mode:light', () => {
  nativeTheme.themeSource = 'light';
  setThemeModePreference('light');
});

ipcMain.on('dark-mode:', () => {
  nativeTheme.themeSource = 'system';
  setThemeModePreference('system');
});

function handleCreateWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    icon: getAppIconPath(),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  mainWindow.loadFile(path.join(__dirname, 'index.html'));
  if (process.env.DEVTOOLS === 'true') {
    mainWindow.webContents.openDevTools();
  }
  mainWindow.maximize();
}

function getAppIconPath() {
  let iconFileName = '';
  if (process.platform === 'linux') {
    iconFileName = 'icon-256x256.png';
  } else if (process.platform === 'win32') {
    iconFileName = 'icon-256x256.ico';
  }
  return path.join(__dirname, 'assets', iconFileName);
}

function handleDarkMode() {
  const isDarkModeEnabled = getThemeModePreference();
  nativeTheme.themeSource = isDarkModeEnabled;
}
