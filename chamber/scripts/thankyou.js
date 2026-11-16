const params = new URLSearchParams(window.location.search);
const fields = [
  ['firstName', 'submitted-first-name'],
  ['lastName', 'submitted-last-name'],
  ['email', 'submitted-email'],
  ['phone', 'submitted-phone'],
  ['organization', 'submitted-organization'],
];

fields.forEach(([key, elementId]) => {
  const element = document.getElementById(elementId);
  const value = params.get(key);
  if (element && value) element.textContent = value;
});

const timestampElement = document.getElementById('submitted-timestamp');
const timestamp = params.get('timestamp');
if (timestampElement && timestamp) {
  const parsedDate = new Date(timestamp);
  timestampElement.textContent = Number.isNaN(parsedDate.getTime())
    ? timestamp
    : parsedDate.toLocaleString(undefined, { dateStyle: 'long', timeStyle: 'short' });
}
