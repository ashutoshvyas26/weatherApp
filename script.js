const API_KEY = CONFIG.API_KEY;
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";
const GEO_URL = "https://api.openweathermap.org/geo/1.0/direct";
const FORECAST_URL = "https://api.openweathermap.org/data/2.5/forecast";

// DOM Elements (will be initialized after DOM loads)
let searchForm, cityInput, weatherContainer, errorMsg, suggestionsDropdown;
let selectedSuggestionIndex = -1;
let debounceTimer = null;
let lastSuggestions = [];
let currentTimezoneOffsetSeconds = 0;

// Utility Functions
function degToCompass(degrees) {
    const val = Math.floor((degrees / 22.5) + 0.5);
    const arr = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
    return arr[(val % 16)];
}

function formatTime(unixTime, timezoneOffset) {
    const date = new Date((unixTime + timezoneOffset) * 1000);
    let hours = date.getUTCHours();
    let minutes = date.getUTCMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    
    return `${hours}:${minutes} ${ampm}`;
}

function updateCurrentTime() {
    const nowUtcMs = Date.now() + new Date().getTimezoneOffset() * 60000;
    const now = new Date(nowUtcMs + currentTimezoneOffsetSeconds * 1000);
    const timeStr = now.toLocaleString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    });
    const currentTimeElement = document.getElementById("currentTime");
    if (currentTimeElement) {
        currentTimeElement.textContent = timeStr;
    }
}

// Animate number changes smoothly
function animateNumber(element, targetValue, duration = 0.4) {
    const currentValue = parseFloat(element.textContent) || 0;
    gsap.to({ value: currentValue }, {
        value: targetValue,
        duration: duration,
        onUpdate: function() {
            element.textContent = Math.round(this.targets()[0].value);
        }
    });
}

// Fetch weather data
async function fetchWeather(city) {
    try {
        errorMsg.classList.remove("show");
        errorMsg.textContent = "";

        const response = await fetch(`${BASE_URL}?q=${city}&appid=${API_KEY}&units=metric`);
        
        if (!response.ok) {
            throw new Error(response.status === 404 ? "City not found" : "Unable to fetch weather data");
        }

        const data = await response.json();
        updateWeatherDisplay(data);
        updateInsights(data);
        fetchForecast(data.coord.lat, data.coord.lon, data.timezone, data.weather[0].main);

    } catch (error) {
        showError(error.message);
        console.error("Error:", error);
    }
}

async function fetchWeatherForQuery(query) {
    const result = await geocodeCity(query);
    if (!result) {
        showError("City not found");
        return;
    }

    cityInput.value = result.name;
    await fetchWeatherByCoords(result.lat, result.lon, result.displayName);
}

async function geocodeCity(query) {
    if (!query || query.length < 2) return null;

    try {
        const response = await fetch(`${GEO_URL}?q=${encodeURIComponent(query)}&limit=1&appid=${API_KEY}`);
        if (!response.ok) return null;

        const data = await response.json();
        if (!data || data.length === 0) return null;

        const city = data[0];
        return {
            name: city.name,
            country: city.country,
            state: city.state,
            lat: city.lat,
            lon: city.lon,
            displayName: city.state ? `${city.name}, ${city.state}, ${city.country}` : `${city.name}, ${city.country}`
        };
    } catch (error) {
        console.error("Error geocoding city:", error);
        return null;
    }
}

async function fetchWeatherByCoords(lat, lon, displayName) {
    try {
        errorMsg.classList.remove("show");
        errorMsg.textContent = "";

        const response = await fetch(`${BASE_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        
        if (!response.ok) {
            throw new Error("Unable to fetch weather data");
        }

        const data = await response.json();
        updateWeatherDisplay(data, displayName);
        updateInsights(data);
        fetchForecast(data.coord.lat, data.coord.lon, data.timezone, data.weather[0].main);

    } catch (error) {
        showError(error.message);
        console.error("Error:", error);
    }
}

function updateWeatherDisplay(data, overrideLocation) {
    // Update location and time
    document.getElementById("cityName").textContent = overrideLocation || `${data.name}, ${data.sys.country}`;
    currentTimezoneOffsetSeconds = data.timezone || 0;
    updateCurrentTime();

    // Update main temperature
    const tempElement = document.getElementById("temp");
    const newTemp = Math.round(data.main.temp);
    animateNumber(tempElement, newTemp);

    // Update weather icon
    const weatherIcon = document.getElementById("weatherIcon");
    weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`;
    gsap.from(weatherIcon, { opacity: 0, duration: 0.3 });

    document.getElementById("description").textContent = data.weather[0].description;
    document.getElementById("feelsLike").textContent = `Feels like ${Math.round(data.main.feels_like)}°C`;

    // Clear input
    cityInput.value = "";
}

function updateInsights(data) {
    const feelsLike = Math.round(data.main.feels_like);
    const windSpeed = Math.round(data.wind.speed * 3.6);
    const humidity = Math.round(data.main.humidity);

    const clothingHint = getClothingHint(feelsLike, windSpeed, humidity);
    setInsightText("clothingHint", clothingHint.title, "clothingHintMeta", clothingHint.meta);

    const coldExposure = getColdExposureTimer(feelsLike, windSpeed);
    setInsightText("coldExposure", coldExposure.title, "coldExposureMeta", coldExposure.meta);

    setInsightText("commuterWindow", "Checking forecast...", "commuterWindowMeta", "Looking for a low-rain, low-wind window.");
    setInsightText("rainTimer", "Checking forecast...", "rainTimerMeta", "Using the next few hours.");
}

function updateHourlyForecast(list, timezoneOffset) {
    const hourlyForecast = document.getElementById("hourlyForecast");
    hourlyForecast.innerHTML = "";

    // Get next 5 forecast items (3-hour intervals)
    const upcomingHours = list.slice(0, 5);

    upcomingHours.forEach(item => {
        const time = new Date((item.dt + timezoneOffset) * 1000);
        let hours = time.getUTCHours();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12;
        const timeStr = `${hours} ${ampm}`;

        const temp = Math.round(item.main.temp);
        const icon = item.weather[0].icon;
        const rainChance = Math.round((item.pop || 0) * 100);

        const card = document.createElement("div");
        card.className = "hourly-card";
        card.innerHTML = `
            <div class="hourly-time">${timeStr}</div>
            <img class="hourly-icon" src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="Weather">
            <div class="hourly-temp">${temp}°</div>
            <div class="hourly-rain">${rainChance}% rain</div>
        `;

        hourlyForecast.appendChild(card);
    });

    // Animate in
    const hourlySection = document.getElementById("hourlySection");
    gsap.to(hourlySection, { opacity: 1, duration: 0.5 });
}

function updateDailyForecast(list, timezoneOffset) {
    const dailyForecast = document.getElementById("dailyForecast");
    dailyForecast.innerHTML = "";

    // Group forecast by day (get daily highs/lows)
    const dailyData = {};

    list.forEach(item => {
        const date = new Date((item.dt + timezoneOffset) * 1000);
        const dateKey = date.toISOString().split('T')[0]; // YYYY-MM-DD

        if (!dailyData[dateKey]) {
            dailyData[dateKey] = {
                temps: [],
                icon: item.weather[0].icon,
                description: item.weather[0].main,
                rainChance: item.pop || 0
            };
        }

        dailyData[dateKey].temps.push(item.main.temp);
        // Update to latest/most relevant icon and rain chance
        dailyData[dateKey].icon = item.weather[0].icon;
        dailyData[dateKey].rainChance = Math.max(dailyData[dateKey].rainChance, item.pop || 0);
    });

    // Convert to array and take next 7 days
    const days = Object.entries(dailyData)
        .slice(1, 8) // Skip today, get next 7 days
        .map(([dateKey, data]) => {
            const date = new Date(dateKey);
            const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
            const high = Math.round(Math.max(...data.temps));
            const low = Math.round(Math.min(...data.temps));
            return {
                dayName,
                high,
                low,
                icon: data.icon,
                rainChance: Math.round(data.rainChance * 100)
            };
        });

    days.forEach(day => {
        const card = document.createElement("div");
        card.className = "daily-card";
        card.innerHTML = `
            <div class="daily-day">${day.dayName}</div>
            <img class="daily-icon" src="https://openweathermap.org/img/wn/${day.icon}@2x.png" alt="Weather">
            <div class="daily-temps">
                <span class="daily-high">${day.high}°</span>
                <span class="daily-low">${day.low}°</span>
            </div>
            <div class="daily-rain">${day.rainChance}%</div>
        `;

        dailyForecast.appendChild(card);
    });

    // Animate in
    const weeklySection = document.getElementById("weeklySection");
    gsap.to(weeklySection, { opacity: 1, duration: 0.5 });
}



function setInsightText(valueId, valueText, metaId, metaText) {
    const valueEl = document.getElementById(valueId);
    const metaEl = document.getElementById(metaId);
    if (valueEl) valueEl.textContent = valueText;
    if (metaEl) metaEl.textContent = metaText;
}

function updateWindDisplay(windKmh, windDeg) {
    const windSpeedEl = document.getElementById("wind_speed");
    const windDegEl = document.getElementById("wind_deg");

    if (windSpeedEl) windSpeedEl.textContent = Math.round(windKmh);
    if (windDegEl) windDegEl.textContent = degToCompass(windDeg);
}

function getClothingHint(feelsLike, windSpeed, humidity) {
    let title = "";
    let meta = "";

    if (feelsLike <= 0) {
        title = "Bundle up";
        meta = "Heavy coat, gloves, and a hat.";
    } else if (feelsLike <= 8) {
        title = "Warm jacket";
        meta = "Add a scarf if you are out long.";
    } else if (feelsLike <= 16) {
        title = "Light jacket";
        meta = "Layered tops work well.";
    } else if (feelsLike <= 24) {
        title = "Light layers";
        meta = "Comfortable for a walk.";
    } else {
        title = "Stay cool";
        meta = "Light fabrics and water.";
    }

    if (windSpeed >= 10) {
        meta += " Windy conditions.";
    }
    if (humidity >= 75) {
        meta += " Humid feel.";
    }

    return { title, meta };
}

async function fetchForecast(lat, lon, timezoneOffset, currentMain) {
    try {
        const response = await fetch(`${FORECAST_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        if (!response.ok) throw new Error("Forecast unavailable");

        const data = await response.json();
        updateRainTimer(data.list, timezoneOffset, currentMain);
        updateCommuterWindow(data.list, timezoneOffset);
        updateHourlyForecast(data.list, timezoneOffset);
        updateDailyForecast(data.list, timezoneOffset);
    } catch (error) {
        setInsightText("rainTimer", "Unavailable", "rainTimerMeta", "Forecast not available.");
        setInsightText("commuterWindow", "Unavailable", "commuterWindowMeta", "Forecast not available.");
        console.error("Error fetching forecast:", error);
    }
}

function updateRainTimer(list, timezoneOffset, currentMain) {
    const isRainingNow = ["Rain", "Drizzle", "Thunderstorm"].includes(currentMain);
    const rainIndex = list.findIndex(item => isRainItem(item));

    if (isRainingNow) {
        const endIndex = list.findIndex(item => !isRainItem(item));
        if (endIndex !== -1) {
            const endTime = formatTime(list[endIndex].dt, timezoneOffset);
            setInsightText("rainTimer", "Raining now", "rainTimerMeta", `Likely to ease around ${endTime}.`);
            return;
        }
        setInsightText("rainTimer", "Raining now", "rainTimerMeta", "No clear stop time yet.");
        return;
    }

    if (rainIndex === -1) {
        setInsightText("rainTimer", "No rain soon", "rainTimerMeta", "Clear for the next several hours.");
        return;
    }

    const startTime = formatTime(list[rainIndex].dt, timezoneOffset);
    let stopTime = "";
    for (let i = rainIndex + 1; i < list.length; i++) {
        if (!isRainItem(list[i])) {
            stopTime = formatTime(list[i].dt, timezoneOffset);
            break;
        }
    }

    const stopText = stopTime ? `Likely stopping around ${stopTime}.` : "No clear stop time yet.";
    setInsightText("rainTimer", `Starts around ${startTime}`, "rainTimerMeta", stopText);
}

function updateCommuterWindow(list, timezoneOffset) {
    const nextSlots = list.slice(0, 3);
    if (nextSlots.length === 0) {
        setInsightText("commuterWindow", "Unavailable", "commuterWindowMeta", "No forecast slots available.");
        return;
    }

    let best = null;
    nextSlots.forEach(slot => {
        const rainScore = (slot.pop || 0) * 100;
        const windScore = slot.wind ? (slot.wind.speed * 3.6) * 2 : 0;
        const weatherPenalty = isRainItem(slot) ? 20 : 0;
        const score = rainScore + windScore + weatherPenalty;

        if (!best || score < best.score) {
            best = { slot, score };
        }
    });

    const bestTime = formatTime(best.slot.dt, timezoneOffset);
    const rainPct = Math.round((best.slot.pop || 0) * 100);
    const wind = Math.round(best.slot.wind ? best.slot.wind.speed * 3.6 : 0);

    setInsightText(
        "commuterWindow",
        `Best around ${bestTime}`,
        "commuterWindowMeta",
        `Rain ${rainPct}%, wind ${wind} km/h.`
    );
}

function getColdExposureTimer(feelsLike, windSpeed) {
    let title = "";
    let meta = "";

    if (feelsLike <= -20) {
        title = "Limit to 10-20 min";
        meta = "High frostbite risk. Cover all skin.";
    } else if (feelsLike <= -10) {
        title = "Limit to 20-40 min";
        meta = "Gloves and face cover recommended.";
    } else if (feelsLike <= -5) {
        title = "Limit to 40-60 min";
        meta = "Take warm breaks if outside long.";
    } else if (feelsLike <= 0) {
        title = "Layer up";
        meta = "Low risk, but chill builds over time.";
    } else {
        title = "No cold limit";
        meta = "Comfortable for extended time.";
    }

    if (windSpeed >= 20 && feelsLike <= 5) {
        meta += " Wind can shorten safe time.";
    }

    return { title, meta };
}

function isRainItem(item) {
    const main = item.weather && item.weather[0] ? item.weather[0].main : "";
    return ["Rain", "Drizzle", "Thunderstorm"].includes(main) || !!item.rain;
}

function showError(message) {
    errorMsg.textContent = message;
    errorMsg.classList.add("show");
    
    gsap.from(errorMsg, {
        opacity: 0,
        y: -5,
        duration: 0.2
    });
}

// Autocomplete functions
async function fetchCitySuggestions(inputValue) {
    if (!inputValue.trim() || inputValue.length < 2) {
        return [];
    }
    
    try {
        const response = await fetch(`${GEO_URL}?q=${encodeURIComponent(inputValue)}&limit=8&appid=${API_KEY}`);
        if (!response.ok) return [];
        
        const data = await response.json();
        return data.map(city => ({
            name: city.name,
            country: city.country,
            state: city.state,
            lat: city.lat,
            lon: city.lon,
            displayName: city.state ? `${city.name}, ${city.state}, ${city.country}` : `${city.name}, ${city.country}`
        }));
    } catch (error) {
        console.error("Error fetching city suggestions:", error);
        return [];
    }
}

function filterSuggestions(inputValue) {
    if (!inputValue.trim()) {
        return [];
    }
    return null; // Will trigger async fetch
}

function showSuggestions(suggestions) {
    suggestionsDropdown.innerHTML = '';
    lastSuggestions = suggestions || [];
    
    if (!suggestions || suggestions.length === 0) {
        suggestionsDropdown.classList.remove("active");
        selectedSuggestionIndex = -1;
        return;
    }
    
    suggestions.forEach((city) => {
        const div = document.createElement('div');
        div.className = 'suggestion-item';
        
        const inputValue = cityInput.value.toLowerCase();
        const cityNameLower = city.name.toLowerCase();
        const matchIndex = cityNameLower.indexOf(inputValue);
        const before = city.name.substring(0, matchIndex);
        const match = city.name.substring(matchIndex, matchIndex + inputValue.length);
        const after = city.name.substring(matchIndex + inputValue.length);
        
        div.innerHTML = `<div class="suggestion-main"><strong>${before}<span class="match">${match}</span>${after}</strong></div><div class="suggestion-meta">${city.displayName}</div>`;
        
        div.addEventListener('click', () => {
            cityInput.value = city.displayName;
            hideSuggestions();
            fetchWeatherByCoords(city.lat, city.lon, city.displayName);
        });
        
        div.addEventListener('mouseover', () => {
            document.querySelectorAll('.suggestion-item').forEach(item => {
                item.classList.remove('selected');
            });
            div.classList.add('selected');
            selectedSuggestionIndex = index;
        });
        
        suggestionsDropdown.appendChild(div);
    });
    
    gsap.to(suggestionsDropdown, {
        opacity: 1,
        maxHeight: 300,
        duration: 0.2,
        ease: "power1.out"
    });
    
    suggestionsDropdown.classList.add("active");
    selectedSuggestionIndex = -1;
}

function hideSuggestions() {
    gsap.to(suggestionsDropdown, {
        opacity: 0,
        maxHeight: 0,
        duration: 0.15,
        ease: "power1.in",
        onComplete: () => {
            suggestionsDropdown.classList.remove("active");
            suggestionsDropdown.innerHTML = '';
        }
    });
    selectedSuggestionIndex = -1;
    lastSuggestions = [];
}

function updateSelectedSuggestion(items) {
    items.forEach((item, index) => {
        item.classList.remove('selected');
    });
    
    if (selectedSuggestionIndex >= 0 && items[selectedSuggestionIndex]) {
        items[selectedSuggestionIndex].classList.add('selected');
        items[selectedSuggestionIndex].scrollIntoView({ block: 'nearest' });
    }
}


// Show weather container with animation
function showWeatherContainer() {
    if (!weatherContainer) return;

    gsap.to(weatherContainer, {
        opacity: 1,
        duration: 0.4,
        ease: "power2.inOut"
    });
}

// Initial setup
document.addEventListener("DOMContentLoaded", () => {
    // Initialize DOM elements
    searchForm = document.getElementById("searchForm");
    cityInput = document.getElementById("city");
    weatherContainer = document.getElementById("weatherContainer");
    errorMsg = document.getElementById("errorMsg");
    suggestionsDropdown = document.getElementById("suggestionsDropdown");

    // Attach event listeners for search form
    if (searchForm) {
        searchForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const city = cityInput.value.trim();
            
            if (!city) return;

            if (selectedSuggestionIndex >= 0 && lastSuggestions[selectedSuggestionIndex]) {
                const selected = lastSuggestions[selectedSuggestionIndex];
                hideSuggestions();
                await fetchWeatherByCoords(selected.lat, selected.lon, selected.displayName);
                return;
            }

            hideSuggestions();
            await fetchWeatherForQuery(city);
        });
    }

    // Autocomplete input listener with debouncing
    if (cityInput) {
        cityInput.addEventListener("input", async (e) => {
            const value = e.target.value;
            
            // Clear previous debounce timer
            clearTimeout(debounceTimer);
            
            if (!value.trim() || value.length < 2) {
                hideSuggestions();
                return;
            }
            
            // Debounce the API call - wait 300ms after user stops typing
            debounceTimer = setTimeout(async () => {
                const suggestions = await fetchCitySuggestions(value);
                
                if (suggestions.length > 0) {
                    showSuggestions(suggestions);
                } else {
                    hideSuggestions();
                }
            }, 300);
        });

        // Keyboard navigation for suggestions
        cityInput.addEventListener("keydown", (e) => {
            if (!suggestionsDropdown.classList.contains("active")) return;
            
            const items = document.querySelectorAll(".suggestion-item");
            
            if (e.key === "ArrowDown") {
                e.preventDefault();
                selectedSuggestionIndex++;
                if (selectedSuggestionIndex >= items.length) {
                    selectedSuggestionIndex = 0;
                }
                updateSelectedSuggestion(items);
            } else if (e.key === "ArrowUp") {
                e.preventDefault();
                selectedSuggestionIndex--;
                if (selectedSuggestionIndex < 0) {
                    selectedSuggestionIndex = items.length - 1;
                }
                updateSelectedSuggestion(items);
            } else if (e.key === "Enter") {
                e.preventDefault();
                if (selectedSuggestionIndex >= 0 && items[selectedSuggestionIndex]) {
                    items[selectedSuggestionIndex].click();
                } else if (cityInput.value.trim()) {
                    hideSuggestions();
                    fetchWeatherForQuery(cityInput.value.trim());
                }
            } else if (e.key === "Escape") {
                hideSuggestions();
            }
        });

        // Hide suggestions when clicking outside
        document.addEventListener("click", (e) => {
            if (!e.target.closest(".search-wrapper")) {
                hideSuggestions();
            }
        });
    }


    // Fetch weather for user's current location on page load
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                try {
                    // Reverse geocode to get city name
                    const geoResponse = await fetch(
                        `${GEO_URL}?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_KEY}`
                    );
                    const geoData = await geoResponse.json();
                    
                    if (geoData.length > 0) {
                        const { name, state, country } = geoData[0];
                        const displayName = state ? `${name}, ${state}` : name;
                        await fetchWeatherByCoords(latitude, longitude, displayName);
                    } else {
                        // If reverse geocoding fails, fetch by coordinates anyway
                        await fetchWeatherByCoords(latitude, longitude, "Your Location");
                    }
                    // Show container after successful fetch
                    showWeatherContainer();
                } catch (error) {
                    console.error("Error fetching location weather:", error);
                    // Fallback to Toronto
                    await fetchWeather("Toronto");
                    showWeatherContainer();
                }
            },
            async (error) => {
                // Permission denied or location unavailable, fallback to Toronto
                console.log("Geolocation unavailable, using default location");
                await fetchWeather("Toronto");
                showWeatherContainer();
            }
        );
    } else {
        // Geolocation not supported
        fetchWeather("Toronto").then(() => showWeatherContainer());
    }
    
    // Update time every second
    setInterval(updateCurrentTime, 1000);
    updateCurrentTime();
});




