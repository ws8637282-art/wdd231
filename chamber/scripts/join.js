const loadedAt = document.querySelector('#form-loaded');
if (loadedAt) loadedAt.value = new Date().toISOString();

document.querySelectorAll('.modal-link[data-dialog]').forEach((link) => {
  link.addEventListener('click', (event) => {
    const dialog = document.getElementById(link.dataset.dialog);
    if (!dialog || typeof dialog.showModal !== 'function') return;
    event.preventDefault();
    dialog.showModal();
  });
});

document.querySelectorAll('.benefit-dialog').forEach((dialog) => {
  dialog.querySelector('.dialog-close')?.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });
});
