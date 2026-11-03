const yearElement = document.querySelector('#currentYear');
const modifiedElement = document.querySelector('#lastModified');
if (yearElement) yearElement.textContent = new Date().getFullYear();
if (modifiedElement) {
  const date = document.lastModified;
  const formattedDate = Number.isNaN(Date.parse(date)) ? 'Date unavailable' : new Date(date).toLocaleString(undefined, { dateStyle: 'long', timeStyle: 'short' });
  const target = modifiedElement.querySelector('span') || modifiedElement;
  target.textContent = target === modifiedElement ? `Last modified: ${formattedDate}` : formattedDate;
}
