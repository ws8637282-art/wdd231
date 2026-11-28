import { attractions } from "../data/attractions.mjs";

const grid = document.querySelector("#discover-grid");

function renderAttractions() {
  if (!grid) return;

  grid.innerHTML = attractions.map((place) => `
    <article class="discover-card" style="--card-area: ${place.id}">
      <h2>${place.name}</h2>
      <figure>
        <img src="${place.image}" alt="${place.alt}" width="300" height="200" loading="lazy">
      </figure>
      <address>${place.address}</address>
      <p>${place.description}</p>
      <p class="discover-detail" id="detail-${place.id}" hidden>${place.detail}</p>
      <button class="learn-more" type="button" aria-expanded="false" aria-controls="detail-${place.id}">Learn more</button>
    </article>
  `).join("");

  grid.addEventListener("click", (event) => {
    const button = event.target.closest(".learn-more");
    if (!button) return;
    const detail = document.getElementById(button.getAttribute("aria-controls"));
    const isExpanded = button.getAttribute("aria-expanded") === "true";
    button.setAttribute("aria-expanded", String(!isExpanded));
    button.textContent = isExpanded ? "Learn more" : "Show less";
    detail.hidden = isExpanded;
  });
}

function showVisitMessage() {
  const message = document.querySelector("#visit-message");
  if (!message) return;

  const storageKey = "plainsideDiscoverLastVisit";
  const now = Date.now();
  let previousVisit;

  try {
    previousVisit = Number(localStorage.getItem(storageKey));
    if (!previousVisit || !Number.isFinite(previousVisit)) {
      message.textContent = "Welcome! Let us know if you have any questions.";
    } else {
      const elapsed = now - previousVisit;
      if (elapsed < 24 * 60 * 60 * 1000) {
        message.textContent = "Back so soon! Awesome!";
      } else {
        const days = Math.floor(elapsed / (24 * 60 * 60 * 1000));
        message.textContent = `You last visited ${days} ${days === 1 ? "day" : "days"} ago.`;
      }
    }
    localStorage.setItem(storageKey, String(now));
  } catch {
    message.textContent = "Welcome! Let us know if you have any questions.";
  }
}

renderAttractions();
showVisitMessage();
