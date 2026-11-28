
const currentYear = document.querySelector("#currentYear");
const lastModified = document.querySelector("#lastModified span");

if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
}

if (lastModified) {
    lastModified.textContent = document.lastModified;
}
