import { INavigationResult } from '@interface/ITest';
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
  let actions = [];
  if (inputActions.value) {
    actions = JSON.parse(inputActions.value);
  }
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

ipcRenderer.on('navigate-reply', (_event, navigationResults: INavigationResult[]) => {
  console.log('Received message:', navigationResults);
  showModalResult(navigationResults);
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

document.addEventListener('DOMContentLoaded', () => {
  handleTheme();
});

function handleTheme() {
  document.querySelectorAll('.theme-button').forEach(function (button) {
    button.addEventListener('click', () => {
      const theme = button.getAttribute('data-t');
      document.documentElement.setAttribute('data-theme', theme!);
      ipcRenderer.send(`dark-mode:${theme}`);
    });
  });
}

function showModalResult(navigationResults: INavigationResult[]): void {
  let totalDuration = 0;
  let div = `
    <header class="timeline-header">
      <span class="tag is-medium is-primary">Início</span>
    </header>
  `;
  navigationResults.forEach(navigationResult => {
    switch (navigationResult.action) {
      case 'navigate':
        div += `
          <div class="timeline-item">
            <div class="timeline-marker is-primary is-icon">
              <i class="fa-solid fa-route"></i>
            </div>
            <div class="timeline-content">
              <p class="heading">${navigationResult.title}</p>
              <p>${navigationResult.message}</p>
            </div>`;
        if (navigationResult.image) {
          div += `
            <div class="timeline-content">
              <figure class="image is-128x128">
                <img src="data:image/png;base64,${navigationResult.image}" alt="Screenshot" class="is-clickable" onclick="openImageModal('${navigationResult.image}')">
              </figure>
            </div>`;
        }
        div += '</div>';
        break;
      case 'wait-click':
        div += `
          <div class="timeline-item">
            <div class="timeline-marker is-primary is-icon">
              <i class="fa-solid fa-computer-mouse"></i>
            </div>
            <div class="timeline-content">
              <p class="heading">${navigationResult.title}</p>
              <p>${navigationResult.message}</p>
            </div>`;
        if (navigationResult.image) {
          div += `
            <div class="timeline-content">
              <figure class="image is-128x128">
                <img src="data:image/png;base64,${navigationResult.image}" alt="Screenshot" class="is-clickable" onclick="openImageModal('${navigationResult.image}')">
              </figure>
            </div>`;
        }
        div += '</div>';
        break;
      case 'end':
        div += `
          <div class="timeline-item">
            <div class="timeline-marker is-primary is-icon">
              <i class="fa-solid fa-hourglass-end"></i>
            </div>
            <div class="timeline-content">
              <p class="heading">${navigationResult.title}</p>
              <p>${navigationResult.message}</p>
            </div>`;
        if (navigationResult.image) {
          div += `
            <div class="timeline-content">
              <figure class="image is-128x128">
                <img src="data:image/png;base64,${navigationResult.image}" alt="Screenshot" class="is-clickable" onclick="openImageModal('${navigationResult.image}')">
              </figure>
            </div>`;
        }
        div += '</div>';
        break;
      default:
        break;
    }
    if (navigationResult.duration) {
      totalDuration += navigationResult.duration;
      div += `
      <header class="timeline-header">
        <span class="tag is-info">${navigationResult.duration}s</span>
      </header>
    `;
    }
  });
  div += `
  <header class="timeline-header">
    <span class="tag is-warning">${parseFloat(totalDuration.toFixed(2))}s</span>
  </header>
`;
  div += `
    <header class="timeline-header">
      <span class="tag is-medium is-primary">Fim</span>
    </header>
  `;
  getById('timeline-results')!.innerHTML = div;
}
