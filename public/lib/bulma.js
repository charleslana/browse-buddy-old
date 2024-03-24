document.addEventListener('DOMContentLoaded', () => {
  handleModal();
  handleMenuBurger();
  handleNotificationCloseButton();
  handleExpandableCards();
});

function handleModal() {
  function openModal($el) {
    $el.classList.add('is-active');
  }
  function closeModal($el) {
    $el.classList.remove('is-active');
  }
  function closeAllModals() {
    (document.querySelectorAll('.modal') || []).forEach($modal => {
      closeModal($modal);
    });
  }
  (document.querySelectorAll('.js-modal-trigger') || []).forEach($trigger => {
    const modal = $trigger.dataset.target;
    const $target = document.getElementById(modal);
    $trigger.addEventListener('click', () => {
      openModal($target);
    });
  });
  (
    document.querySelectorAll(
      '.modal-background, .modal-close, .modal-card-head .delete, .modal-card-foot .button'
    ) || []
  ).forEach($close => {
    const $target = $close.closest('.modal');
    $close.addEventListener('click', () => {
      closeModal($target);
    });
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      closeAllModals();
    }
  });
}

function handleNotificationCloseButton() {
  (document.querySelectorAll('.notification .delete') || []).forEach($delete => {
    const $notification = $delete.parentNode;
    $delete.addEventListener('click', () => {
      $notification.classList.add('is-hidden');
    });
  });
}

function handleMenuBurger() {
  const $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);
  $navbarBurgers.forEach(el => {
    el.addEventListener('click', () => {
      const target = el.dataset.target;
      const $target = document.getElementById(target);
      el.classList.toggle('is-active');
      $target.classList.toggle('is-active');
    });
  });
}

function handleExpandableCards() {
  const cardToggles = document.querySelectorAll('.card-toggle');
  cardToggles.forEach(cardToggle => {
    cardToggle.addEventListener('click', e => {
      e.currentTarget.parentElement.querySelector('.card-content').classList.toggle('is-hidden');
    });
  });
}
