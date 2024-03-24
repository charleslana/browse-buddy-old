import { ipcRenderer } from 'electron';
/* eslint-disable no-console */

getById('execute-test')!.addEventListener('click', () => {
  console.log('execute test');
  const url = getById('url')!.textContent;
  const checkboxSaveLastScreenshot = getById('checkbox-save-last-screenshot') as HTMLInputElement;
  const checkboxSaveEveryScreenshot = getById('checkbox-save-every-screenshot') as HTMLInputElement;
  const isSaveLastScreenshot = checkboxSaveLastScreenshot.checked;
  const isSaveEveryScreenshot = checkboxSaveEveryScreenshot.checked;
  const inputActions = getById('actions') as HTMLInputElement;
  const actions = JSON.parse(inputActions.value);
  getById('overlay-loading')!.style.display = 'block';
  getById('success-notification')!.classList.add('is-hidden');
  getById('error-notification')!.classList.add('is-hidden');
  ipcRenderer.send('navigate', {
    url,
    isSaveLastScreenshot,
    isSaveEveryScreenshot,
    actions,
  });
});

ipcRenderer.on('navigate-reply', (_event, message) => {
  console.log('Received message:', message);
  getById('overlay-loading')!.style.display = 'none';
  getById('success-notification')!.classList.remove('is-hidden');
});

ipcRenderer.on('navigate-error', (_event, message) => {
  console.log('Received message:', message);
  getById('overlay-loading')!.style.display = 'none';
  getById('error-log')!.textContent = message;
  getById('error-notification')!.classList.remove('is-hidden');
});

function getById(id: string): HTMLElement | null {
  return document.getElementById(id);
}
