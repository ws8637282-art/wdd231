import { attractions } from "../data/discover.mjs";

const grid = document.querySelector("#discover-grid");

attractions.forEach(item => {

    const card = document.createElement("section");
    card.classList.add("card");

    card.innerHTML = `
        <h2>${item.name}</h2>

        <figure>
            <img src="${item.image}"
                 alt="${item.name}"
                 loading="lazy"
                 width="300"
                 height="200">
        </figure>

        <address>${item.address}</address>

        <p>${item.description}</p>

        <button>Learn More</button>
    `;

    grid.appendChild(card);
});

/* Visit Message */

const message = document.querySelector("#visit-message");

const today = Date.now();
const lastVisit = localStorage.getItem("lastVisit");

if (!lastVisit) {

    message.textContent =
        "Welcome! Let us know if you have any questions.";

} else {

    const difference = today - Number(lastVisit);

    const daysBetween =
        Math.floor(difference / 86400000);

    if (daysBetween < 1) {

        message.textContent =
            "Back so soon! Awesome!";

    } else if (daysBetween === 1) {

        message.textContent =
            "You last visited 1 day ago.";

    } else {

        message.textContent =
            `You last visited ${daysBetween} days ago.`;
    }
}

localStorage.setItem("lastVisit", today);
