
const apiKey = "2b72929a5ce379f7014e1f54728a5eae";
document.getElementById("searchForm").addEventListener("submit", async function getWeather(event) {
    event.preventDefault();
    const city = document.getElementById("city").value;
    document.getElementById("cityHeading").innerHTML = "WEATHER IN " + city.toUpperCase();

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();

        document.getElementById("temp").innerHTML = Math.round(data.main.temp);
        document.getElementById("temp_min").innerHTML = Math.round(data.main.temp_min);
        document.getElementById("temp_max").innerHTML = Math.round(data.main.temp_max);
        document.getElementById("feels_like").innerHTML = Math.round(data.main.feels_like);
        let desc = data.weather[0].description;
        desc = desc.charAt(0).toUpperCase() + desc.slice(1);
        document.getElementById("description").innerHTML = desc;
        document.getElementById("clouds").innerHTML = Math.round(data.clouds.all);
        document.getElementById("visibility").innerHTML = Math.round(data.visibility);
        document.getElementById("wind_speed").innerHTML = Math.round(data.wind.speed);
        let windDeg = data.wind.deg; // e.g., 110

        // Function to convert degrees to compass direction
        function degToCompass(num) {
            const val = Math.floor((num / 22.5) + 0.5);
            const arr = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE",
                "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
            return arr[(val % 16)];
        }

        // Display wind direction
        document.getElementById("wind_deg").innerHTML = degToCompass(windDeg);

        // Example timestamps from API (in seconds)
        let sunriseUnix = data.sys.sunrise;  // e.g., 1755428004
        let sunsetUnix = data.sys.sunset;

        // Function to convert UNIX timestamp to HH:MM AM/PM
        function formatTime(unixTime, timezoneOffset) {
            // Convert to milliseconds and apply timezone offset (seconds)
            let date = new Date((unixTime + timezoneOffset) * 1000);

            let hours = date.getUTCHours();
            let minutes = date.getUTCMinutes();
            let ampm = hours >= 12 ? 'PM' : 'AM';

            hours = hours % 12;
            hours = hours ? hours : 12; // hour 0 -> 12
            minutes = minutes < 10 ? '0' + minutes : minutes;

            return `${hours}:${minutes} ${ampm}`;
        }
        let tzOffset = data.timezone; // seconds

        document.getElementById("sunrise").innerHTML = formatTime(sunriseUnix, tzOffset);
        document.getElementById("sunset").innerHTML = formatTime(sunsetUnix, tzOffset);



    } catch (error) {
        console.error("Error fetching weather data:", error);
    }

})

const url1 = `https://api.openweathermap.org/data/2.5/weather?q=hamilton&appid=${apiKey}&units=metric`;
try {
    const response = await fetch(url1);
    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    document.getElementById("h_temp").innerHTML = Math.round(data.main.temp);
    document.getElementById("h_feels_like").innerHTML = Math.round(data.main.feels_like);
    document.getElementById("h_temp_min").innerHTML = Math.round(data.main.temp_min);
    document.getElementById("h_temp_max").innerHTML = Math.round(data.main.temp_max);
    document.getElementById("h_humidity").innerHTML = Math.round(data.main.humidity);
    document.getElementById("h_sea_level").innerHTML = Math.round(data.main.sea_level);

} catch (error) {
    console.error("Error fetching weather data:", error);
}

const url2 = `https://api.openweathermap.org/data/2.5/weather?q=vancouver&appid=${apiKey}&units=metric`;
try {
    const response = await fetch(url2);
    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    document.getElementById("v_temp").innerHTML = Math.round(data.main.temp);
    document.getElementById("v_feels_like").innerHTML = Math.round(data.main.feels_like);
    document.getElementById("v_temp_min").innerHTML = Math.round(data.main.temp_min);
    document.getElementById("v_temp_max").innerHTML = Math.round(data.main.temp_max);
    document.getElementById("v_humidity").innerHTML = Math.round(data.main.humidity);
    document.getElementById("v_sea_level").innerHTML = Math.round(data.main.sea_level);

} catch (error) {
    console.error("Error fetching weather data:", error);
}

const url3 = `https://api.openweathermap.org/data/2.5/weather?q=toronto&appid=${apiKey}&units=metric`;
try {
    const response = await fetch(url3);
    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    document.getElementById("t_temp").innerHTML = Math.round(data.main.temp);
    document.getElementById("t_feels_like").innerHTML = Math.round(data.main.feels_like);
    document.getElementById("t_temp_min").innerHTML = Math.round(data.main.temp_min);
    document.getElementById("t_temp_max").innerHTML = Math.round(data.main.temp_max);
    document.getElementById("t_humidity").innerHTML = Math.round(data.main.humidity);
    document.getElementById("t_sea_level").innerHTML = Math.round(data.main.sea_level);

} catch (error) {
    console.error("Error fetching weather data:", error);
}


document.addEventListener("DOMContentLoaded", () => {
    getWeather("Mississauga");
});



