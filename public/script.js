const actions = [];

document.addEventListener('DOMContentLoaded', () => {
  handleAddEventListener();
  handleClearButton();
  handleModalClick();
  handleActionModal();
});

function handleAddEventListener() {
  const button = getById('save-navigate');
  button.addEventListener('click', saveNavigate);
  const input = getById('input-url');
  input.addEventListener('input', () => {
    const url = input.value;
    const modalNavigateNotification = getById('modal-navigate-notification');
    if (isValidURL(url)) {
      modalNavigateNotification.classList.add('is-hidden');
      return;
    }
    modalNavigateNotification.classList.remove('is-hidden');
  });
}

function saveNavigate() {
  const input = getById('input-url');
  const value = input.value;
  if (isValidURL(value)) {
    if (value.trim() !== '') {
      const url = getById('url');
      url.textContent = input.value;
      enableTestButtons();
    }
    return;
  }
}

function enableTestButtons() {
  const actionsButton = getById('actions-button');
  actionsButton?.removeAttribute('disabled');
  const executeTestButton = getById('execute-test');
  executeTestButton.removeAttribute('disabled');
  const saveTestButton = getById('save-test-button');
  saveTestButton.removeAttribute('disabled');
}

function getById(id) {
  return document.getElementById(id);
}

function getAll(selector) {
  return document.querySelectorAll(selector);
}

function isValidURL(url) {
  var regex = /^(ftp|http|https):\/\/[^ "]+$/;
  if (regex.test(url)) {
    return true;
  }
  return false;
}

function handleClearButton() {
  getById('clear-test').addEventListener('click', () => {
    location.reload();
  });
}

function hideModalActions() {
  getById('modal-actions').classList.remove('is-active');
}

function showModalActions() {
  getById('modal-actions').classList.add('is-active');
}

function handleModalClick() {
  getAll('.modal-click').forEach(modal => {
    modal.addEventListener('click', () => {
      hideModalActions();
    });
  });
  getAll('.open-modal-actions').forEach(modal => {
    modal.addEventListener('click', () => {
      showModalActions();
    });
  });
}

function handleActionModal() {
  handleWaitClick();
}

function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function handleWaitClick() {
  getById('wait-click-save').addEventListener('click', () => {
    const type = getById('wait-click-type').value;
    const element = getById('wait-click-value').value;
    actions.push({
      id: generateUUID(),
      action: 'wait-click',
      element: `${type}${element}`,
    });
    getById('actions').value = JSON.stringify(actions);
    saveClick(`${type}${element}`);
    getById('wait-click-value').value = '';
  });
}

function saveClick(element) {
  const div = `
  <div class="card is-fullwidth">
    <header class="card-header card-toggle is-clickable">
      <p class="card-header-title">Esperar e Clicar</p>
      <a class="card-header-icon">
        <i class="fa-solid fa-angle-down"></i>
      </a>
    </header>
    <div class="card-content is-hidden">
      <div class="content">${element}</div>
      <footer class="buttons">
        <button class="button card-footer-item is-primary">Editar</button>
        <button class="button card-footer-item is-danger">Excluir</button>
      </footer>
    </div>
  </div>
  `;
  getById('show-actions').insertAdjacentHTML('beforeend', div);
  handleExpandableCards();
}

function handleExpandableCards() {
  const cardToggles = document.querySelectorAll('.card-toggle');
  cardToggles.forEach(cardToggle => {
    cardToggle.removeEventListener('click', toggleCardContent);
    cardToggle.addEventListener('click', toggleCardContent);
  });
}

function toggleCardContent(event) {
  const cardContent = event.currentTarget.parentElement.querySelector('.card-content');
  if (cardContent) {
    cardContent.classList.toggle('is-hidden');
  }
}
