let currentCity = "";
let isCelsius = true;
let weatherData = null;

const searchForm = document.getElementById("searchForm");
const cityInput = document.getElementById("cityInput");
const loader = document.getElementById("loader");
const emptyState = document.getElementById("emptyState");
const dashboard = document.getElementById("dashboard");
const errorMessage = document.getElementById("errorMessage");
const errorText = document.getElementById("errorText");

const cityName = document.getElementById("cityName");
const temperature = document.getElementById("temperature");
const tempUnit = document.getElementById("tempUnit");
const weatherDesc = document.getElementById("weatherDesc");
const weatherIcon = document.getElementById("weatherIcon");
const windSpeed = document.getElementById("windSpeed");
const humidity = document.getElementById("humidity");
const feelsLike = document.getElementById("feelsLike");
const visibility = document.getElementById("visibility");
const forecastGrid = document.getElementById("forecastGrid");
const locationLabel = document.getElementById("locationLabel");

const hoursEl = document.getElementById("hours");
const minutesEl = document.getElementById("minutes");
const ampmEl = document.getElementById("ampm");
const fullDateEl = document.getElementById("fullDate");

const weatherCodes = {
  0: { desc: "Clear sky", icon: "01d" },
  1: { desc: "Mainly clear", icon: "02d" },
  2: { desc: "Partly cloudy", icon: "03d" },
  3: { desc: "Overcast", icon: "04d" },
  45: { desc: "Foggy", icon: "50d" },
  48: { desc: "Depositing rime fog", icon: "50d" },
  51: { desc: "Light drizzle", icon: "09d" },
  53: { desc: "Moderate drizzle", icon: "09d" },
  55: { desc: "Dense drizzle", icon: "09d" },
  61: { desc: "Slight rain", icon: "10d" },
  63: { desc: "Moderate rain", icon: "10d" },
  65: { desc: "Heavy rain", icon: "10d" },
  71: { desc: "Slight snow", icon: "13d" },
  73: { desc: "Moderate snow", icon: "13d" },
  75: { desc: "Heavy snow", icon: "13d" },
  77: { desc: "Snow grains", icon: "13d" },
  80: { desc: "Slight rain showers", icon: "09d" },
  81: { desc: "Moderate rain showers", icon: "09d" },
  82: { desc: "Violent rain showers", icon: "09d" },
  85: { desc: "Slight snow showers", icon: "13d" },
  86: { desc: "Heavy snow showers", icon: "13d" },
  95: { desc: "Thunderstorm", icon: "11d" },
  96: { desc: "Thunderstorm with hail", icon: "11d" },
  99: { desc: "Heavy thunderstorm", icon: "11d" },
};

function updateClock() {
  const now = new Date();

  let hours = now.getHours();
  const minutes = now.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";

  hours = hours % 12;
  hours = hours ? hours : 12;

  hoursEl.textContent = hours.toString().padStart(2, "0");
  minutesEl.textContent = minutes.toString().padStart(2, "0");
  ampmEl.textContent = ampm;

  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  fullDateEl.textContent = now.toLocaleDateString("en-US", options);
}

setInterval(updateClock, 1000);
updateClock();

function getWeatherIconUrl(code, isDay = 1) {
  const weatherInfo = weatherCodes[code] || weatherCodes[0];
  let iconCode = weatherInfo.icon;

  if (isDay === 0) {
    iconCode = iconCode.replace("d", "n");
  }

  return `https://openweathermap.org/img/wn/${iconCode}@4x.png`;
}

function formatTemp(celsius) {
  if (isCelsius) {
    return Math.round(celsius) + "°C";
  } else {
    return Math.round((celsius * 9) / 5 + 32) + "°F";
  }
}

function showError(message) {
  errorText.textContent = message;
  errorMessage.classList.add("active");
  setTimeout(() => {
    errorMessage.classList.remove("active");
  }, 5000);
}

async function geocodeCity(city) {
  const response = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`,
  );
  const data = await response.json();

  if (!data.results || data.results.length === 0) {
    throw new Error("City not found");
  }

  return data.results[0];
}

async function fetchWeather(
  city,
  lat = null,
  lon = null,
  isGeoLocation = false,
) {
  loader.classList.add("active");
  errorMessage.classList.remove("active");

  try {
    let locationData;

    if (lat && lon) {
      locationData = {
        latitude: lat,
        longitude: lon,
        name: city,
        country: "",
      };
    } else {
      locationData = await geocodeCity(city);
    }

    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${locationData.latitude}&longitude=${locationData.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m,visibility&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`;

    const response = await fetch(weatherUrl);
    const data = await response.json();

    weatherData = {
      location: locationData,
      current: data.current,
      daily: data.daily,
    };

    displayWeather();

    emptyState.style.display = "none";
    dashboard.classList.add("active");

    if (isGeoLocation) {
      locationLabel.textContent = "Your Location";
    } else {
      locationLabel.textContent = "Current Location";
    }
  } catch (error) {
    showError(error.message || "Failed to fetch weather data");
    console.error("Error:", error);
  } finally {
    loader.classList.remove("active");
  }
}

function displayWeather() {
  if (!weatherData) return;

  const { location, current, daily } = weatherData;

  cityName.textContent =
    location.name + (location.country ? `, ${location.country}` : "");
  temperature.textContent = isCelsius
    ? Math.round(current.temperature_2m)
    : Math.round((current.temperature_2m * 9) / 5 + 32);
  tempUnit.textContent = isCelsius ? "°C" : "°F";

  const weatherInfo = weatherCodes[current.weather_code] || weatherCodes[0];
  weatherDesc.textContent = weatherInfo.desc;
  weatherIcon.src = getWeatherIconUrl(current.weather_code, current.is_day);

  windSpeed.innerHTML = `${Math.round(current.wind_speed_10m)} <small>km/h</small>`;
  humidity.innerHTML = `${current.relative_humidity_2m} <small>%</small>`;
  feelsLike.innerHTML = isCelsius
    ? `${Math.round(current.apparent_temperature)} <small>°C</small>`
    : `${Math.round((current.apparent_temperature * 9) / 5 + 32)} <small>°F</small>`;
  visibility.innerHTML = `${(current.visibility / 1000).toFixed(1)} <small>km</small>`;

  forecastGrid.innerHTML = "";
  for (let i = 0; i < 7; i++) {
    const date = new Date(daily.time[i]);
    const dayName =
      i === 0
        ? "Today"
        : date.toLocaleDateString("en-US", { weekday: "short" });
    const maxTemp = isCelsius
      ? Math.round(daily.temperature_2m_max[i])
      : Math.round((daily.temperature_2m_max[i] * 9) / 5 + 32);
    const minTemp = isCelsius
      ? Math.round(daily.temperature_2m_min[i])
      : Math.round((daily.temperature_2m_min[i] * 9) / 5 + 32);

    const forecastItem = document.createElement("div");
    forecastItem.className = "forecast-item";
    forecastItem.innerHTML = `
                    <div class="forecast-time">${dayName}</div>
                    <img src="${getWeatherIconUrl(daily.weather_code[i])}" 
                         alt="Weather" 
                         class="forecast-icon">
                    <div class="forecast-temp">${maxTemp}° / ${minTemp}°</div>
                `;
    forecastGrid.appendChild(forecastItem);
  }
}

function toggleUnits() {
  isCelsius = !isCelsius;
  if (weatherData) {
    displayWeather();
  }
}

function getLocation() {
  if (navigator.geolocation) {
    loader.classList.add("active");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        fetchWeather(
          "Your Location",
          position.coords.latitude,
          position.coords.longitude,
          true,
        );
      },
      (error) => {
        loader.classList.remove("active");
        showError("Unable to retrieve your location");
      },
    );
  } else {
    showError("Geolocation is not supported by your browser");
  }
}

searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const city = cityInput.value.trim();
  if (city) {
    currentCity = city;
    fetchWeather(city);
    cityInput.value = "";
  }
});

fetchWeather("London");
