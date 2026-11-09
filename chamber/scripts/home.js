const spotlightContainer = document.querySelector('#spotlight-list');
const currentWeather = document.querySelector('#current-weather');
const forecastContainer = document.querySelector('#weather-forecast');

// Add your OpenWeatherMap API key here. Do not commit a personal key to a public repository.
const WEATHER_API_KEY = 'YOUR_OPENWEATHERMAP_API_KEY';
// Plainside Valley is a course-project location; these coordinates represent the nearby Seattle area.
const WEATHER_LAT = 47.3073;
const WEATHER_LON = -122.2285;
const membershipNames = { 2: 'Silver Member', 3: 'Gold Member' };
const escapeHTML = (value = '') => String(value).replace(/[&<>"']/g, (character) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
})[character]);

function shuffled(items) {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [result[index], result[randomIndex]] = [result[randomIndex], result[index]];
  }
  return result;
}

async function loadSpotlights() {
  if (!spotlightContainer) return;
  try {
    const response = await fetch('data/members.json');
    if (!response.ok) throw new Error(`Member data request failed: ${response.status}`);
    const members = await response.json();
    if (!Array.isArray(members)) throw new TypeError('Member data must be an array.');
    const eligible = shuffled(members.filter((member) => [2, 3].includes(Number(member.membershipLevel)))).slice(0, 3);
    if (!eligible.length) throw new Error('No silver or gold chamber members are available.');
    spotlightContainer.innerHTML = eligible.map((member) => {
      const level = Number(member.membershipLevel);
      const website = /^https?:\/\//i.test(member.website) ? member.website : `https://${member.website}`;
      const phoneLink = String(member.phone || '').replace(/[^\d+]/g, '');
      return `<article class="spotlight-card">
        <div class="spotlight-logo-wrap"><img class="spotlight-logo" src="images/${escapeHTML(member.image)}" alt="${escapeHTML(member.company)} logo" width="220" height="68" loading="lazy"></div>
        <div class="spotlight-details">
          <div class="spotlight-title-row"><h3>${escapeHTML(member.company)}</h3><span class="membership-badge membership-${level}">${membershipNames[level]}</span></div>
          <p><strong>Address:</strong> ${escapeHTML(member.address)}</p>
          <p><strong>Phone:</strong> <a href="tel:${escapeHTML(phoneLink)}">${escapeHTML(member.phone)}</a></p>
          <p><strong>Website:</strong> <a href="${escapeHTML(website)}" target="_blank" rel="noopener noreferrer">${escapeHTML(member.website)}</a></p>
        </div>
      </article>`;
    }).join('');
  } catch (error) {
    console.error('Unable to load chamber spotlights:', error);
    spotlightContainer.innerHTML = '<p class="member-empty spotlight-error">Business spotlights are temporarily unavailable. Please visit the <a href="directory.html">member directory</a>.</p>';
  } finally {
    spotlightContainer.setAttribute('aria-busy', 'false');
  }
}

function weatherIcon(iconCode, description) {
  const icon = escapeHTML(iconCode);
  return `<img class="weather-icon" src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${escapeHTML(description)}" width="56" height="56">`;
}

function updateWeatherError(message) {
  if (currentWeather) {
    currentWeather.innerHTML = `<p class="weather-message">${escapeHTML(message)}</p>`;
    currentWeather.setAttribute('aria-busy', 'false');
  }
  if (forecastContainer) {
    forecastContainer.innerHTML = '<p class="weather-message">Forecast unavailable.</p>';
    forecastContainer.setAttribute('aria-busy', 'false');
  }
}

async function loadWeather() {
  if (!currentWeather || !forecastContainer) return;
  if (!WEATHER_API_KEY || WEATHER_API_KEY === 'YOUR_OPENWEATHERMAP_API_KEY') {
    updateWeatherError('Add an OpenWeatherMap API key in scripts/home.js to show live weather.');
    return;
  }
  try {
    const query = `lat=${WEATHER_LAT}&lon=${WEATHER_LON}&units=imperial&appid=${encodeURIComponent(WEATHER_API_KEY)}`;
    const [currentResponse, forecastResponse] = await Promise.all([
      fetch(`https://api.openweathermap.org/data/2.5/weather?${query}`),
      fetch(`https://api.openweathermap.org/data/2.5/forecast?${query}`)
    ]);
    if (!currentResponse.ok || !forecastResponse.ok) throw new Error('Weather service request failed. Check the API key and try again.');
    const [current, forecast] = await Promise.all([currentResponse.json(), forecastResponse.json()]);
    const condition = current.weather?.[0];
    const temperature = Math.round(current.main.temp);
    const description = condition?.description || 'Conditions unavailable';
    currentWeather.innerHTML = `${weatherIcon(condition?.icon || '01d', description)}<div><p class="current-temperature">${temperature}&deg;F</p><p class="current-description">${escapeHTML(description)}</p></div>`;
    currentWeather.setAttribute('aria-busy', 'false');

    const daily = new Map();
    forecast.list.forEach((entry) => {
      const date = new Date(entry.dt * 1000);
      const key = date.toISOString().slice(0, 10);
      if (key <= new Date().toISOString().slice(0, 10)) return;
      const distanceFromNoon = Math.abs(date.getUTCHours() - 12);
      if (!daily.has(key) || distanceFromNoon < daily.get(key).distance) {
        daily.set(key, { entry, date, distance: distanceFromNoon });
      }
    });
    const days = [...daily.values()].slice(0, 3);
    if (days.length < 3) throw new Error('The three-day forecast is not available yet.');
    forecastContainer.innerHTML = days.map(({ entry, date }) => {
      const weekday = date.toLocaleDateString(undefined, { weekday: 'short', timeZone: 'UTC' });
      const icon = entry.weather?.[0]?.icon || '01d';
      return `<div class="forecast-day"><strong>${escapeHTML(weekday)}</strong><img src="https://openweathermap.org/img/wn/${escapeHTML(icon)}.png" alt="${escapeHTML(entry.weather?.[0]?.description || 'Weather')}" width="40" height="40" loading="lazy"><span>${Math.round(entry.main.temp)}&deg;F</span></div>`;
    }).join('');
    forecastContainer.setAttribute('aria-busy', 'false');
  } catch (error) {
    console.error('Unable to load chamber weather:', error);
    updateWeatherError('Live weather is temporarily unavailable. Please try again later.');
  }
}

function setUpcomingEventDates() {
  document.querySelectorAll('[data-event-day]').forEach((dateElement) => {
    const targetDay = Number(dateElement.dataset.eventDay);
    const today = new Date();
    const daysUntil = (targetDay - today.getDay() + 7) % 7 || 7;
    const upcoming = new Date(today.getFullYear(), today.getMonth(), today.getDate() + daysUntil);
    dateElement.textContent = upcoming.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
    dateElement.dateTime = upcoming.toISOString().slice(0, 10);
    const monthLabel = dateElement.parentElement?.querySelector('.event-month');
    if (monthLabel) monthLabel.textContent = upcoming.toLocaleDateString(undefined, { month: 'long' }).toUpperCase();
  });
}

loadSpotlights();
loadWeather();
setUpcomingEventDates();
