
const API_KEY = "YOUR_API_KEY";

// Plainside Valley, Washington (approximate coordinates)
const LAT = 47.5;
const LON = -121.9;

const currentWeather = document.querySelector("#current-weather");
const weatherForecast = document.querySelector("#weather-forecast");

async function getWeather() {
    try {
        const currentURL =
            `https://api.openweathermap.org/data/2.5/weather?lat=${LAT}&lon=${LON}&appid=${API_KEY}&units=imperial`;

        const forecastURL =
            `https://api.openweathermap.org/data/2.5/forecast?lat=${LAT}&lon=${LON}&appid=${API_KEY}&units=imperial`;

        const [currentResponse, forecastResponse] = await Promise.all([
            fetch(currentURL),
            fetch(forecastURL)
        ]);

        if (!currentResponse.ok || !forecastResponse.ok) {
            throw new Error("Weather information could not be loaded.");
        }

        const currentData = await currentResponse.json();
        const forecastData = await forecastResponse.json();

        displayCurrentWeather(currentData);
        displayForecast(forecastData);

    } catch (error) {
        currentWeather.innerHTML = "<p>Weather information is currently unavailable.</p>";
        weatherForecast.innerHTML = "<p>Forecast is currently unavailable.</p>";
        console.error("Weather error:", error);
    }
}

function displayCurrentWeather(data) {
    const temperature = Math.round(data.main.temp);
    const description = data.weather[0].description;
    const icon = data.weather[0].icon;
    const humidity = data.main.humidity;

    currentWeather.innerHTML = `
        <img src="https://openweathermap.org/img/wn/${icon}@2x.png"
             alt="${description}" width="80" height="80">
        <p class="temperature">${temperature}&deg;F</p>
        <p>${description}</p>
        <p>Humidity: ${humidity}%</p>
    `;
}

function displayForecast(data) {
    const dailyForecasts = {};

    data.list.forEach(item => {
        const date = item.dt_txt.split(" ")[0];

        if (!dailyForecasts[date]) {
            dailyForecasts[date] = {
                temperatures: [],
                descriptions: [],
                icons: []
            };
        }

        dailyForecasts[date].temperatures.push(item.main.temp);
        dailyForecasts[date].descriptions.push(item.weather[0].description);
        dailyForecasts[date].icons.push(item.weather[0].icon);
    });

    const nextThreeDays = Object.entries(dailyForecasts).slice(1, 4);

    weatherForecast.innerHTML = nextThreeDays.map(([date, info]) => {
        const averageTemp = Math.round(
            info.temperatures.reduce((sum, temp) => sum + temp, 0) /
            info.temperatures.length
        );

        const dayName = new Date(`${date}T12:00:00`)
            .toLocaleDateString("en-US", { weekday: "long" });

        const description = info.descriptions[0];
        const icon = info.icons[0];

        return `
            <div class="forecast-day">
                <h4>${dayName}</h4>
                <img src="https://openweathermap.org/img/wn/${icon}.png"
                     alt="${description}" width="50" height="50">
                <p>${averageTemp}&deg;F average</p>
                <p>${description}</p>
            </div>
        `;
    }).join("");
}

getWeather();
