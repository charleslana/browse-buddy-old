import Store from 'electron-store';

const store = new Store();

type ThemeModeType = 'light' | 'dark' | 'system';

export function setThemeModePreference(mode: ThemeModeType) {
  store.set('darkMode', mode);
}

export function getThemeModePreference(): ThemeModeType {
  const darkMode = store.get('darkMode') as ThemeModeType;
  return darkMode || 'system';
}
