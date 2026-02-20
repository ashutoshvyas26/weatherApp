# �️ WeatherHub - Weather Application

> A modern, feature-rich weather application with real-time data, animated forecasts, and timezone-aware displays. Built with vanilla JavaScript, custom CSS, and powered by the OpenWeather API.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![API: OpenWeather](https://img.shields.io/badge/API-OpenWeather-blue.svg)](https://openweathermap.org/)
[![Built With: JavaScript](https://img.shields.io/badge/Built%20With-JavaScript-yellow.svg)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

---

## 📋 Table of Contents
- [Overview](#overview)
- [Key Features](#key-features)
- [Technology Stack](#technology-stack)
- [Quick Start](#quick-start)
- [Installation & Setup](#installation--setup)
- [Usage Guide](#usage-guide)
- [Project Structure](#project-structure)
- [Responsive Design](#responsive-design)
- [Security Considerations](#security-considerations)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

WeatherHub is a full-featured weather application that brings weather information to life with smooth animations, real-time updates, and timezone-aware displays. Whether you're planning your day or just curious about the weather across the globe, WeatherHub provides comprehensive weather data in an intuitive, visually appealing interface.

The app fetches real-time weather data from the OpenWeather API and displays it with beautiful animations powered by GSAP. A unique feature is the timezone-aware clock that automatically adjusts to show the local time of the city you're viewing.

---

## Key Features

### 🔍 Smart Search
- **City search with auto-suggestions** - Start typing to see matching cities
- **Real-time suggestions** - Find cities quickly without having to type the full name
- **Worldwide coverage** - Search for any city globally

### 📊 Current Weather Display
- **Temperature and "feels like" temperature**
- **Weather conditions** with descriptive icons
- **Humidity levels**
- **Wind speed and direction** (with compass points)
- **Atmospheric pressure**
- **Sunrise and sunset times**
- **UV index and visibility**

### ⏰ Timezone-Aware Clock
- **Local time of selected city** - Not your device time
- **Auto-updates every second**
- **Displays city timezone offset**

### 📅 Intelligent Forecasts
- **5-hour hourly forecast** - Hour-by-hour predictions with temperature, conditions, and precipitation
- **7-day extended forecast** - Weekly overview with high/low temperatures and weather conditions
- **Smooth animated transitions** - Watch forecasts appear with graceful animations

### 💡 Weather Insights
- **AI-powered tips** - Smart suggestions based on current weather
- **Dynamic advice** - Tips change based on temperature, rain, wind, humidity
- **Helpful recommendations** - Guidance for outdoor activities and preparations

### 📱 Fully Responsive Design
- **Desktop experience** (768px+) - Full-width layout with optimal spacing
- **Tablet optimized** (600-767px) - Adjusted proportions for touch devices
- **Mobile optimized** (480-599px) - Stacked single-column layout
- **Small device support** (below 480px) - Compact design for minimal screens

### ✨ Smooth Animations
- **GSAP-powered transitions** - Professional-grade animations using GreenSock Animation Platform
- **Card entrance animations** - Forecast cards slide in smoothly
- **Number animations** - Temperature and metrics animate to their values
- **Hover effects** - Interactive visual feedback on all clickable elements

### 🎨 Modern UI/UX
- **Custom CSS styling** - No bootstrap or heavy frameworks
- **Beautiful color palette** - Sage green, warm gold, and rust accents
- **Light cream backgrounds** - Easy on the eyes, modern aesthetic
- **Intuitive layout** - Information organized logically and clearly

### 🔒 Secure Configuration
- **API key stored locally** - Not exposed in public repositories
- **Config file separation** - Keep sensitive data out of version control
- **.gitignore protection** - Configuration files automatically excluded from Git

---

## Technology Stack

| Category | Technology |
|----------|-----------|
| **Frontend** | HTML5, CSS3, JavaScript (ES6+) |
| **Styling** | Custom CSS with Flexbox & Grid |
| **Animation** | GSAP 3.12.2 |
| **API** | OpenWeather API (Free Tier) |
| **Architecture** | Vanilla JavaScript (No frameworks) |
| **Responsive** | Mobile-first media queries |

---

## Quick Start

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- An internet connection
- A free OpenWeather API key

### 30-Second Setup
```bash
# 1. Clone the repository
git clone https://github.com/ashutoshvyas26/weatherApp.git
cd weatherApp

# 2. Get your free API key from https://openweathermap.org/api

# 3. Set up config
cp config.example.js config.js
# Edit config.js and add your API key

# 4. Open in browser
open index.html
# or simply double-click index.html
```

---

## Installation & Setup

### Step 1: Get Your API Key
1. Visit [OpenWeather API](https://openweathermap.org/api)
2. Click **"Sign Up"** and create a free account
3. Confirm your email address
4. Navigate to **"API Keys"** in your account dashboard
5. Copy your **Default Key** (it's automatically generated)

### Step 2: Clone the Repository
```bash
git clone https://github.com/ashutoshvyas26/weatherApp.git
cd weatherApp
```

### Step 3: Configure Your API Key
```bash
# Copy the example config file
cp config.example.js config.js

# Open config.js in your editor and replace:
# const CONFIG = {
#     API_KEY: "YOUR_API_KEY_HERE"
# };
# 
# With your actual API key:
# const CONFIG = {
#     API_KEY: "2b72929a5ce379f7014e1f54728a5eae"  # Example
# };
```

### Step 4: Run the App
Simply open `index.html` in your web browser. That's it! No build process, no dependencies to install, no server setup needed.

---

## Usage Guide

### Searching for Weather
1. **Click the search input** at the top of the page
2. **Start typing a city name** (e.g., "New York", "Tokyo", "Dubai")
3. **Select from suggestions** that appear as you type
4. **Press Enter** or click a suggestion to view weather

### Understanding the Interface
- **Current Weather Card** (Left side) - Shows temperature, conditions, and key metrics
- **Additional Details** - Sunrise/sunset, wind direction, pressure, visibility
- **Hourly Forecast** - Scrollable 5-hour forecast with hour-by-hour breakdown
- **Weekly Forecast** - 7-day prediction with high/low temperatures
- **Weather Tips** - Dynamic suggestions based on current conditions
- **Clock** - Shows the current time in the selected city's timezone

### Interactive Elements
- **Hover over cards** - Visual feedback with color transitions
- **Click links** - Footer contains links to OpenWeather API and GitHub repository
- **Responsive layout** - App automatically adapts to your screen size

---

## Project Structure

```
weatherApp/
├── index.html          # Main HTML document with structure
├── style.css           # Complete styling and responsive design
├── script.js           # Core JavaScript logic and API integration
├── config.js           # Your API key (do not commit)
├── config.example.js   # Template for config.js
├── .gitignore          # Git ignore file (includes config.js)
├── README.md           # This file
└── README.md           # Documentation
```

### File Descriptions

**index.html**
- Document structure with semantic HTML5
- Sections for search, current weather, forecasts, and insights
- Loads GSAP library and configuration files

**style.css**
- Responsive design with 4 media query breakpoints
- Custom CSS variables for colors and spacing
- Flexbox and Grid layouts for responsive structure
- Smooth transitions and hover effects

**script.js**
- Weather API integration (fetchWeather, fetchForecast)
- DOM manipulation and event handling
- GSAP animations for smooth transitions
- Timezone calculation for accurate local time display

**config.js**
- Stores your OpenWeather API key
- Loaded before script.js to provide API_KEY global variable
- NOT included in GitHub (in .gitignore)

---

## Responsive Design

The app uses a mobile-first approach with breakpoints optimized for all device sizes:

### Desktop (768px and above)
- Full-width layout with maximum content width
- Side-by-side sections for weather card and forecast
- Optimal font sizes and spacing
- Base font size: 1.1rem

### Tablet (600px - 767px)
- Slightly reduced padding and margins
- Adjusted forecast card sizes
- Touch-friendly spacing
- Font size: 1rem

### Mobile (480px - 599px)
- Single-column stacked layout
- Compact card dimensions
- Increased font sizes for readability
- Font size: 1.5rem for headings

### Small Mobile (Below 480px)
- Minimal padding and spacing
- Condensed information display
- Extra-large text for small screens
- Optimized for landscape and portrait orientation

---

## Security Considerations

### API Key Protection
Your OpenWeather API key is valuable and should be protected:

✅ **What We Do Right**
- Store API key in `config.js` (not tracked by Git)
- Provide `config.example.js` as a safe template
- Add `config.js` to `.gitignore`
- Never commit sensitive credentials

⚠️ **Important Reminders**
- Don't share your API key publicly
- Regenerate your key if accidentally exposed
- Monitor your API usage at OpenWeather dashboard
- Free tier allows 1,000 API calls per day

### Best Practices
1. Keep `config.js` locally only
2. Always set API keys in environment files
3. Use different keys for development and production
4. Monitor API usage regularly
5. Regenerate keys periodically

---

## Customization

### Changing Colors
Edit the CSS variables in `style.css`:
```css
:root {
    --sage: #2d6a4f;        /* Primary color */
    --tan: #fbbf24;         /* Accent/hover */
    --rust: #913639;        /* Borders/highlights */
    --light-bg: #eef0dc;    /* Card backgrounds */
}
```

### Adjusting Animations
Modify GSAP animation settings in `script.js`:
- Change `duration` values for animation speed
- Adjust `opacity` initial values
- Modify `stagger` timing for sequence effects

### Changing Temperature Units
The API returns Celsius by default. To convert to Fahrenheit:
```javascript
// In script.js, modify temperature display:
const celsius = data.main.temp;
const fahrenheit = (celsius * 9/5) + 32;
```

---

## Browser Support

| Browser | Support | Notes |
|---------|---------|-------|
| Chrome | ✅ Full | Latest version recommended |
| Firefox | ✅ Full | Latest version recommended |
| Safari | ✅ Full | iOS 12+ required |
| Edge | ✅ Full | Latest version recommended |
| IE 11 | ❌ Not Supported | Uses modern ES6+ features |

---

## Contributing

Contributions are welcome! Here's how you can help:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Ideas for Contributions
- Additional weather metrics or visualizations
- Dark/light theme toggle
- Multi-city comparison view
- Weather alerts and notifications
- Internationalization (multiple languages)
- Unit conversion (°C ↔ °F)

---

## License

This project is open-source and available under the **MIT License**.

```
MIT License

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

For more details, see the LICENSE file in the repository.

---

## Acknowledgments

- **OpenWeather** for providing excellent weather data API
- **GreenSock (GSAP)** for smooth animation capabilities
- **MDN Web Docs** for comprehensive JavaScript documentation
- Everyone who contributes to open-source weather data projects

---

## Troubleshooting

### App not loading?
- Check that `config.js` exists in the same directory as `index.html`
- Verify your API key is correct in `config.js`
- Check browser console for errors (F12 → Console tab)

### No weather data appears?
- Confirm your OpenWeather API key is valid
- Check that your free tier hasn't exceeded quota (1,000 calls/day)
- Verify the city name is spelled correctly
- Check browser network tab to see API response

### Animations not working?
- Ensure GSAP library loads correctly from CDN
- Check browser console for JavaScript errors
- Try refreshing the page
- Clear browser cache if needed

### Styling looks off on mobile?
- Clear browser cache
- Ensure viewport meta tag is present in HTML
- Check that style.css is loading properly
- Test on actual device (not just browser emulation)

---

## Roadmap

### v2.0 (Planned)
- Dark mode toggle
- Weather alerts and notifications
- Multiple city saved favorites
- Weather history and trends
- Improved animations and interactions

### v3.0 (Future)
- Geolocation auto-detection
- Weather comparison between cities
- Advanced charts and statistics
- Mobile app version
- Backend integration for data caching

---

## Contact & Support

- **GitHub**: [ashutoshvyas26/weatherApp](https://github.com/ashutoshvyas26/weatherApp)
- **Issues**: Report bugs and request features on GitHub Issues
- **Pull Requests**: Submit improvements and enhancements

---

**Built with ❤️ by Ashutosh Vyas**

Last updated: February 2026