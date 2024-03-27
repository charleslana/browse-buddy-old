window.Sortable = require('sortablejs');

const actions = [];

document.addEventListener('DOMContentLoaded', () => {
  handleAddEventListener();
  handleClearButton();
  handleModalClick();
  handleActionModal();
  handleSearchActions();
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
    const id = generateUUID();
    actions.push({
      id: id,
      action: 'wait-click',
      element: `${type}${element}`,
    });
    getById('actions').value = JSON.stringify(actions);
    saveClick(`${type}${element}`, id);
    getById('wait-click-value').value = '';
  });
}

function saveClick(element, id) {
  const div = `
  <div class="card is-fullwidth" data-id="${id}">
    <header class="card-header card-toggle is-clickable">
      <p class="card-header-title">Esperar e Clicar</p>
      <a class="card-header-icon">
        <i class="fa-solid fa-angle-down"></i>
      </a>
    </header>
    <div class="card-content is-hidden">
      <div class="content break-words">${element}</div>
      <footer class="buttons">
        <button class="button card-footer-item is-primary" data-id="${id}">Editar</button>
        <button class="button card-footer-item is-danger" data-id="${id}">Excluir</button>
      </footer>
    </div>
  </div>
  `;
  getById('show-actions').insertAdjacentHTML('beforeend', div);
  handleExpandableCards();
  setupDeleteButtonEvent();
  setupEditButtonEvent();
  handleSortable();
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

function updateActions() {
  getById('actions').value = JSON.stringify(actions);
}

function removeAction(id) {
  const index = actions.findIndex(action => action.id === id);
  if (index !== -1) {
    actions.splice(index, 1);
    updateActions();
  }
  const elementToRemove = document.querySelector(`[data-id="${id}"]`);
  if (elementToRemove) {
    elementToRemove.remove();
  }
}

function setupDeleteButtonEvent() {
  const deleteButtons = document.querySelectorAll('.card-footer-item.is-danger');
  deleteButtons.forEach(button => {
    button.addEventListener('click', () => {
      const id = button.getAttribute('data-id');
      if (id) {
        const modal = getById('confirm-modal');
        modal.classList.add('is-active');
        const confirmDeleteButton = getById('confirm-delete');
        confirmDeleteButton.addEventListener('click', () => {
          removeAction(id);
          modal.classList.remove('is-active');
        });
        const cancelDeleteButton = getById('cancel-delete');
        cancelDeleteButton.addEventListener('click', () => {
          modal.classList.remove('is-active');
        });
      }
    });
  });
}

function determineActionType(content) {
  if (content.startsWith('#')) {
    return '#';
  } else if (content.startsWith('.')) {
    return '.';
  } else if (content.startsWith('xpath/')) {
    return 'xpath/';
  }
  return '#';
}

function editAction(id, newValue) {
  const actionIndex = actions.findIndex(action => action.id === id);
  if (actionIndex !== -1) {
    actions[actionIndex].element = newValue;
    updateActions();
  }
}

function setupEditButtonEvent() {
  const editButtons = document.querySelectorAll('.card-footer-item.is-primary');
  editButtons.forEach(button => {
    button.addEventListener('click', () => {
      const id = button.getAttribute('data-id');
      if (id) {
        const modal = getById('click-edit-modal');
        modal.classList.add('is-active');
        const contentElement = button.closest('.card').querySelector('.content');
        if (contentElement) {
          const currentValue = contentElement.textContent || '';
          const newValueInput = getById('new-value-input');
          let newValueWithoutType = currentValue;
          if (currentValue.startsWith('#') || currentValue.startsWith('.')) {
            newValueWithoutType = currentValue.slice(1);
          } else if (currentValue.startsWith('xpath/')) {
            newValueWithoutType = currentValue.slice(6);
          }
          newValueInput.value = newValueWithoutType;
          const currentActionType = determineActionType(currentValue);
          const typeSelect = getById('new-wait-click-type');
          typeSelect.value = currentActionType;
        }
        const confirmEditButton = getById('confirm-click-edit');
        confirmEditButton.addEventListener('click', () => {
          const newValueInput = getById('new-value-input');
          const newValue = newValueInput.value;
          const typeSelect = getById('new-wait-click-type');
          const newType = typeSelect.value;
          let fullValue = newValue;
          if (newType !== 'xpath/') {
            fullValue = newType + newValue;
          } else {
            fullValue = 'xpath/' + newValue;
          }
          contentElement.textContent = fullValue;
          editAction(id, fullValue);
          modal.classList.remove('is-active');
        });
        const cancelEditButton = getById('cancel-click-edit');
        cancelEditButton.addEventListener('click', () => {
          modal.classList.remove('is-active');
        });
      }
    });
  });
}

function openImageModal(base64Image) {
  const modal = document.getElementById('modal-image');
  const modalImage = document.getElementById('modal-src-image');
  modalImage.src = `data:image/png;base64,${base64Image}`;
  modal?.classList.add('is-active');
}

function handleSearchActions() {
  const searchInput = document.querySelector(".panel-block .control input[type='text']");
  const panelItems = document.querySelectorAll('.panel-block');
  searchInput.addEventListener('input', function () {
    const searchText = this.value.toLowerCase();
    for (let i = 1; i < panelItems.length; i++) {
      const item = panelItems[i];
      const itemText = item.textContent.toLowerCase();
      if (itemText.includes(searchText)) {
        item.classList.remove('is-hidden');
      } else {
        item.classList.add('is-hidden');
      }
    }
  });
  searchInput.addEventListener('input', function () {
    const searchText = this.value.toLowerCase();
    if (searchText === '') {
      for (let i = 1; i < panelItems.length; i++) {
        const item = panelItems[i];
        item.classList.remove('is-hidden');
      }
    }
  });
  const panelTabs = document.querySelectorAll('.panel-tabs a');
  panelTabs.forEach(tab => {
    tab.addEventListener('click', function () {
      searchInput.value = '';
    });
  });
}

function handleSortable() {
  const showActions = document.getElementById('show-actions');
  new Sortable(showActions, {
    animation: 150,
    ghostClass: 'sortable-ghost',
    chosenClass: 'sortable-chosen',
    dragClass: 'sortable-drag',
    onEnd: function (_event) {
      const cards = showActions.querySelectorAll('.card');
      const newActions = [];
      cards.forEach(card => {
        const id = card.getAttribute('data-id');
        const action = actions.find(action => action.id === id);
        if (action) {
          newActions.push(action);
        }
      });
      actions.splice(0, actions.length, ...newActions);
      updateActions();
    },
  });
}
