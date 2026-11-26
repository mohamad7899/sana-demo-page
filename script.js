
document.addEventListener("DOMContentLoaded", function () {
    "use strict";

    /* =========================================
       1. HELPER FUNCTIONS
    ========================================= */

    const $ = (selector) => document.querySelector(selector);

    function setText(id, value) {
        const element = document.getElementById(id);
        if (element) element.textContent = value;
    }

    function getBrowserInfo() {
        const ua = navigator.userAgent;

        let browser = "مرورگر ناشناخته";

        if (ua.includes("Edg/")) browser = "Microsoft Edge";
        else if (ua.includes("Chrome/")) browser = "Google Chrome";
        else if (ua.includes("Firefox/")) browser = "Mozilla Firefox";
        else if (ua.includes("Safari/")) browser = "Safari";

        return browser;
    }

    function getDeviceInfo() {
        const ua = navigator.userAgent;

        let device = "دستگاه ناشناخته";

        if (/Android/i.test(ua)) device = "Android";
        else if (/iPhone|iPad|iPod/i.test(ua)) device = "Apple iOS";
        else if (/Windows/i.test(ua)) device = "Windows";
        else if (/Macintosh|Mac OS/i.test(ua)) device = "macOS";
        else if (/Linux/i.test(ua)) device = "Linux";

        return device;
    }

    /* =========================================
       2. LIVE CLOCK AND DATE
    ========================================= */

    function updateClock() {
        const now = new Date();

        setText(
            "live-clock",
            now.toLocaleTimeString("fa-IR")
        );

        setText(
            "live-date",
            now.toLocaleDateString("fa-IR", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric"
            })
        );
    }

    updateClock();
    setInterval(updateClock, 1000);

    /* =========================================
       3. DEVICE AND BROWSER INFORMATION
    ========================================= */

    const deviceInfo = getDeviceInfo();
    const browserInfo = getBrowserInfo();

    setText("dashboard-device", deviceInfo);
    setText("feature-live-device", deviceInfo);
    setText("browser-info", browserInfo);

    setText(
        "browser-language",
        navigator.language || "نامشخص"
    );

    setText(
        "feature-live-language",
        navigator.language || "نامشخص"
    );

    setText(
        "screen-resolution",
        `${screen.width} × ${screen.height}`
    );

    /* =========================================
       4. INTERNET CONNECTION
    ========================================= */

    function updateNetwork() {
        const online = navigator.onLine;

        const status = online ? "متصل" : "قطع";

        setText("network-status", status);
        setText("feature-live-network", status);
        setText("site-status", status);

        const connection =
            navigator.connection ||
            navigator.mozConnection ||
            navigator.webkitConnection;

        const connectionType = connection
            ? (connection.effectiveType || connection.type || "نامشخص")
            : "پشتیبانی نمی‌شود";

        setText("connection-type", connectionType);
        setText("feature-live-connection", connectionType);
    }

    updateNetwork();

    window.addEventListener("online", updateNetwork);
    window.addEventListener("offline", updateNetwork);

    if (navigator.connection) {
        navigator.connection.addEventListener(
            "change",
            updateNetwork
        );
    }

    /* =========================================
       5. PAGE LOAD TIME
    ========================================= */

    window.addEventListener("load", function () {
        const loadTime = Math.round(
            performance.now()
        );

        setText(
            "page-load-time",
            loadTime + " ms"
        );

        setText(
            "feature-live-load",
            loadTime + " ms"
        );
    });

    /* =========================================
       6. PUBLIC IP ADDRESS
    ========================================= */

    async function getPublicIP() {
        try {
            const response = await fetch(
                "https://api.ipify.org?format=json"
            );

            if (!response.ok) {
                throw new Error("IP request failed");
            }

            const data = await response.json();

            setText("public-ip", data.ip);

        } catch (error) {
            setText("public-ip", "در دسترس نیست");
        }
    }

    getPublicIP();

    /* =========================================
       7. MOBILE NAVIGATION
    ========================================= */

    const menuToggle = $(".menu-toggle");
    const navLinks = $(".nav-links");

    if (menuToggle && navLinks) {
        menuToggle.addEventListener("click", function () {
            navLinks.classList.toggle("active");

            menuToggle.setAttribute(
                "aria-expanded",
                navLinks.classList.contains("active")
            );
        });

        navLinks.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", function () {
                navLinks.classList.remove("active");
                menuToggle.setAttribute("aria-expanded", "false");
            });
        });
    }

    /* =========================================
       8. WEATHER SYSTEM
    ========================================= */

    const weatherCard = $("#weather-card");
    const weatherPanel = $("#weather-panel");

    const weatherOpen = $("#weather-open");
    const weatherRefresh = $("#weather-refresh");

    const weatherTemperature = $("#weather-temperature");
    const weatherDescription = $("#weather-description");
    const weatherLocation = $("#weather-location");
    const weatherIcon = $("#weather-icon");

    const weatherCardStatus = $("#weather-card-status");
    const weatherDetailStatus = $("#weather-detail-status");

    let lastCoordinates = null;

    const weatherConditions = {
        0: {
            description: "آسمان صاف",
            icon: "☀️",
            theme: "sunny"
        },
        1: {
            description: "عمدتاً صاف",
            icon: "🌤️",
            theme: "partly-cloudy"
        },
        2: {
            description: "نیمه‌ابری",
            icon: "⛅",
            theme: "partly-cloudy"
        },
        3: {
            description: "ابری",
            icon: "☁️",
            theme: "cloudy"
        },
        45: {
            description: "مه‌آلود",
            icon: "🌫️",
            theme: "foggy"
        },
        48: {
            description: "مه یخ‌زده",
            icon: "🌫️",
            theme: "foggy"
        },
        51: {
            description: "نم‌نم باران",
            icon: "🌦️",
            theme: "rainy"
        },
        53: {
            description: "باران ملایم",
            icon: "🌧️",
            theme: "rainy"
        },
        55: {
            description: "باران نسبتاً شدید",
            icon: "🌧️",
            theme: "rainy"
        },
        61: {
            description: "بارندگی خفیف",
            icon: "🌦️",
            theme: "rainy"
        },
        63: {
            description: "بارندگی متوسط",
            icon: "🌧️",
            theme: "rainy"
        },
        65: {
            description: "بارندگی شدید",
            icon: "🌧️",
            theme: "rainy"
        },
        71: {
            description: "بارش برف خفیف",
            icon: "🌨️",
            theme: "snowy"
        },
        73: {
            description: "بارش برف",
            icon: "❄️",
            theme: "snowy"
        },
        75: {
            description: "بارش برف شدید",
            icon: "❄️",
            theme: "snowy"
        },
        77: {
            description: "دانه‌های برف",
            icon: "❄️",
            theme: "snowy"
        },
        80: {
            description: "رگبار خفیف",
            icon: "🌦️",
            theme: "rainy"
        },
        81: {
            description: "رگبار باران",
            icon: "🌧️",
            theme: "rainy"
        },
        82: {
            description: "رگبار شدید",
            icon: "🌧️",
            theme: "rainy"
        },
        85: {
            description: "رگبار برف",
            icon: "🌨️",
            theme: "snowy"
        },
        86: {
            description: "رگبار برف شدید",
            icon: "❄️",
            theme: "snowy"
        },
        95: {
            description: "رعد و برق",
            icon: "⛈️",
            theme: "stormy"
        },
        96: {
            description: "طوفان همراه با تگرگ",
            icon: "⛈️",
            theme: "stormy"
        },
        99: {
            description: "طوفان شدید",
            icon: "⛈️",
            theme: "stormy"
        }
    };

    function getWeatherInfo(code) {
        return weatherConditions[code] || {
            description: "وضعیت نامشخص",
            icon: "🌍",
            theme: "cloudy"
        };
    }

    /* =========================================
       9. DYNAMIC WEATHER THEME
    ========================================= */

    function setWeatherTheme(
        weatherCode,
        isDay,
        currentTime,
        sunrise,
        sunset
    ) {
        const weather = getWeatherInfo(weatherCode);

        let theme = weather.theme;

        // شرایط جوی اولویت بیشتری از زمان روز دارند
        if (theme === "sunny" || theme === "partly-cloudy") {
            if (!isDay) {
                theme = "night";
            } else if (sunrise && sunset && currentTime) {
                const current = new Date(currentTime).getTime();
                const rise = new Date(sunrise).getTime();
                const set = new Date(sunset).getTime();

                const nearSunrise =
                    Math.abs(current - rise) <= 45 * 60 * 1000;

                const nearSunset =
                    Math.abs(current - set) <= 45 * 60 * 1000;

                if (nearSunrise || nearSunset) {
                    theme = "sunrise";
                }
            }
        }

        // CSS این پروژه تم sunrise دارد؛ sunset به آن نگاشت می‌شود.
        document.body.dataset.weather = theme;

        document.documentElement.style.setProperty(
            "--weather-mode",
            theme
        );
    }

    /* =========================================
       10. REVERSE GEOCODING
    ========================================= */

    async function getLocationName(latitude, longitude) {
        try {
            const url =
                `https://geocoding-api.open-meteo.com/v1/reverse?latitude=${latitude}&longitude=${longitude}&language=fa&format=json`;

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error("Location request failed");
            }

            const data = await response.json();

            if (data.results && data.results.length > 0) {
                const place = data.results[0];

                return (
                    place.name ||
                    place.admin1 ||
                    "منطقه شما"
                );
            }

            return "منطقه شما";

        } catch (error) {
            return "موقعیت فعلی";
        }
    }

    /* =========================================
       11. FIVE-DAY FORECAST
    ========================================= */

    function renderForecast(daily) {
        const forecastContainer = $("#weather-forecast");

        if (!forecastContainer || !daily) return;

        forecastContainer.innerHTML = "";

        const days = daily.time || [];

        days.forEach((date, index) => {
            const code = daily.weather_code[index];
            const weather = getWeatherInfo(code);

            const maxTemp = daily.temperature_2m_max[index];
            const minTemp = daily.temperature_2m_min[index];

            const dateText = new Date(date + "T12:00:00")
                .toLocaleDateString("fa-IR", {
                    weekday: "short",
                    day: "numeric",
                    month: "short"
                });

            const item = document.createElement("div");
            item.className = "forecast-item";

            const day = document.createElement("span");
            day.textContent = dateText;

            const icon = document.createElement("span");
            icon.textContent = weather.icon;

            const description = document.createElement("span");
            description.textContent = weather.description;

            const temperature = document.createElement("strong");
            temperature.textContent =
                `${Math.round(maxTemp)}° / ${Math.round(minTemp)}°`;

            item.append(day, icon, description, temperature);

            forecastContainer.appendChild(item);
        });
    }

    /* =========================================
       12. WEATHER DETAILS
    ========================================= */

    function renderWeatherDetails(current, daily) {
        setText(
            "weather-detail-temp",
            Math.round(current.temperature_2m) + "°C"
        );

        setText(
            "weather-humidity",
            current.relative_humidity_2m + "%"
        );

        setText(
            "weather-wind",
            current.wind_speed_10m + " km/h"
        );

        setText(
            "weather-feels",
            Math.round(current.apparent_temperature) + "°C"
        );

        setText(
            "weather-rain",
            (current.precipitation ?? 0) + " mm"
        );

        setText(
            "weather-uv",
            daily && daily.uv_index_max
                ? daily.uv_index_max[0]
                : "نامشخص"
        );
    }

    /* =========================================
       13. LOAD WEATHER DATA
    ========================================= */

    async function loadWeather(latitude, longitude) {
        if (weatherCardStatus) {
            weatherCardStatus.textContent = "در حال دریافت اطلاعات...";
        }

        if (weatherDetailStatus) {
            weatherDetailStatus.textContent = "در حال دریافت اطلاعات...";
        }

        try {
            const url =
                `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}` +
                `&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m` +
                `&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,uv_index_max,sunrise,sunset` +
                `&timezone=auto&forecast_days=5`;

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error("Weather API error");
            }

            const data = await response.json();

            if (!data.current) {
                throw new Error("Weather data unavailable");
            }

            const current = data.current;
            const daily = data.daily;

            const weather = getWeatherInfo(
                current.weather_code
            );

            const temperature = Math.round(
                current.temperature_2m
            );

            if (weatherTemperature) {
                weatherTemperature.textContent =
                    temperature + "°C";
            }

            if (weatherDescription) {
                weatherDescription.textContent =
                    weather.description;
            }

            if (weatherIcon) {
                weatherIcon.textContent = weather.icon;
            }

            setText(
                "weather-card-status",
                "اطلاعات به‌روز شد"
            );

            setText(
                "weather-detail-status",
                "اطلاعات دریافت شد"
            );

            setWeatherTheme(
                current.weather_code,
                current.is_day,
                current.time,
                daily.sunrise?.[0],
                daily.sunset?.[0]
            );

            renderWeatherDetails(current, daily);
            renderForecast(daily);

            const locationName = await getLocationName(
                latitude,
                longitude
            );

            if (weatherLocation) {
                weatherLocation.textContent = locationName;
            }

        } catch (error) {
            console.error("Weather error:", error);

            setText(
                "weather-card-status",
                "دریافت اطلاعات ناموفق بود"
            );

            setText(
                "weather-detail-status",
                "اتصال به سرویس آب‌وهوا برقرار نشد"
            );
        }
    }

    /* =========================================
       14. REQUEST LOCATION
    ========================================= */

    function requestWeatherLocation() {
        if (!navigator.geolocation) {
            setText(
                "weather-card-status",
                "موقعیت مکانی پشتیبانی نمی‌شود"
            );
            return;
        }

        navigator.geolocation.getCurrentPosition(
            function (position) {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;

                lastCoordinates = {
                    latitude,
                    longitude
                };

                loadWeather(latitude, longitude);
            },

            function (error) {
                let message = "دسترسی به موقعیت مکانی ممکن نشد";

                if (error.code === 1) {
                    message = "اجازه موقعیت مکانی داده نشد";
                } else if (error.code === 2) {
                    message = "موقعیت مکانی در دسترس نیست";
                } else if (error.code === 3) {
                    message = "زمان دریافت موقعیت تمام شد";
                }

                setText("weather-card-status", message);
                setText("weather-detail-status", message);
            },

            {
                enableHighAccuracy: true,
                timeout: 20000,
                maximumAge: 0
            }
        );
    }

    requestWeatherLocation();

    /* =========================================
       15. WEATHER CARD INTERACTION
    ========================================= */

    function toggleWeatherPanel() {
        if (!weatherPanel) return;

        weatherPanel.classList.toggle("active");
    }

    if (weatherCard) {
        weatherCard.addEventListener("click", function (event) {
            if (event.target.closest("#weather-open")) return;

            toggleWeatherPanel();
        });
    }

    if (weatherOpen) {
        weatherOpen.addEventListener("click", function (event) {
            event.stopPropagation();
            toggleWeatherPanel();
        });
    }

    if (weatherRefresh) {
        weatherRefresh.addEventListener("click", function (event) {
            event.stopPropagation();

            if (lastCoordinates) {
                loadWeather(
                    lastCoordinates.latitude,
                    lastCoordinates.longitude
                );
            } else {
                requestWeatherLocation();
            }
        });
    }

    /* =========================================
       16. 3D CARD TILT EFFECT
    ========================================= */

    const tiltCards = document.querySelectorAll(
        ".dashboard-card, .monitor-item, .features-grid .card, .features-page-grid .card"
    );

    tiltCards.forEach(card => {
        card.addEventListener("pointermove", function (event) {
            if (event.pointerType === "touch") return;

            const rect = card.getBoundingClientRect();

            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (centerY - y) / 18;
            const rotateY = (x - centerX) / 18;

            card.style.transform =
                `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;

            card.style.setProperty(
                "--mouse-x",
                `${x}px`
            );

            card.style.setProperty(
                "--mouse-y",
                `${y}px`
            );
        });

        card.addEventListener("pointerleave", function () {
            card.style.transform = "";
        });
    });

    /* =========================================
       17. HERO PARALLAX
    ========================================= */

    const heroVisual = $(".hero-visual");

    if (heroVisual) {
        document.addEventListener("mousemove", function (event) {
            if (window.innerWidth < 768) return;

            const x =
                (event.clientX / window.innerWidth - 0.5) * 12;

            const y =
                (event.clientY / window.innerHeight - 0.5) * 12;

            heroVisual.style.transform =
                `translate3d(${x}px, ${y}px, 0)`;
        });
    }

    /* =========================================
       18. SCROLL REVEAL ANIMATION
    ========================================= */

    const revealElements = document.querySelectorAll(
        ".section-heading, .dashboard-card, .monitor-item, .features-grid .card, .features-page-grid .card, .info-box, .feature-detail"
    );

    if ("IntersectionObserver" in window) {
        const revealObserver = new IntersectionObserver(
            function (entries, observer) {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("visible");
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.12
            }
        );

        revealElements.forEach(element => {
            element.classList.add("reveal");
            revealObserver.observe(element);
        });
    } else {
        revealElements.forEach(element => {
            element.classList.add("visible");
        });
    }

    /* =========================================
       19. BACK TO TOP BUTTON
    ========================================= */

    if (!document.getElementById("back-to-top")) {
        const backToTop = document.createElement("button");

        backToTop.id = "back-to-top";
        backToTop.textContent = "↑";
        backToTop.setAttribute("aria-label", "بازگشت به بالا");

        backToTop.style.cssText = `
            position: fixed;
            bottom: 25px;
            right: 25px;
            width: 45px;
            height: 45px;
            border-radius: 50%;
            border: 1px solid rgba(0,225,255,.5);
            background: rgba(0,20,50,.8);
            color: white;
            font-size: 25px;
            cursor: pointer;
            z-index: 999;
            display: none;
            backdrop-filter: blur(10px);
            box-shadow: 0 0 15px rgba(0,225,255,.3);
        `;

        document.body.appendChild(backToTop);

        window.addEventListener("scroll", function () {
            backToTop.style.display =
                window.scrollY > 350 ? "block" : "none";
        });

        backToTop.addEventListener("click", function () {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });
    }

    /* =========================================
       20. ACTIVE NAVIGATION LINK
    ========================================= */

    const currentPage =
        location.pathname.split("/").pop() || "index.html";

    document.querySelectorAll(".nav-links a").forEach(link => {
        const linkPage = link.getAttribute("href");

        if (linkPage === currentPage) {
            link.classList.add("active");
        }
    });

    /* =========================================
       21. LIVE WEATHER THEME TEST PANEL
    ========================================= */

    if (!document.getElementById("weather-test-panel")) {

        const panel = document.createElement("div");

        panel.id = "weather-test-panel";

        panel.innerHTML = `
            <div class="weather-test-header">
                <span>🌦️ آزمایش تم آب‌وهوا</span>
                <button id="weather-test-close" aria-label="بستن">×</button>
            </div>

            <div class="weather-test-content">
                <p>یک وضعیت آب‌وهوایی انتخاب کن:</p>

                <div class="weather-test-buttons">
                    <button data-theme="sunny">☀️ آفتابی</button>
                    <button data-theme="partly-cloudy">🌤️ نیمه‌ابری</button>
                    <button data-theme="cloudy">☁️ ابری</button>
                    <button data-theme="rainy">🌧️ بارانی</button>
                    <button data-theme="snowy">❄️ برفی</button>
                    <button data-theme="stormy">⛈️ طوفانی</button>
                    <button data-theme="foggy">🌫️ مه‌آلود</button>
                    <button data-theme="sunrise">🌅 طلوع و غروب</button>
                    <button data-theme="night">🌙 شب</button>
                </div>

                <button id="weather-test-reset">
                    ↩ بازگشت به آب‌وهوای واقعی
                </button>
            </div>
        `;

        const panelStyle = document.createElement("style");

        panelStyle.textContent = `
            #weather-test-panel {
                position: fixed;
                bottom: 20px;
                left: 20px;
                width: min(320px, calc(100vw - 40px));
                z-index: 99998;
                direction: rtl;
                color: #fff;
                background: rgba(10, 15, 40, .94);
                border: 1px solid rgba(0, 225, 255, .5);
                border-radius: 18px;
                backdrop-filter: blur(18px);
                box-shadow: 0 0 25px rgba(0, 225, 255, .2);
                font-family: Tahoma, sans-serif;
                overflow: hidden;
            }

            .weather-test-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 13px 15px;
                background: rgba(0, 225, 255, .12);
                font-weight: bold;
            }

            #weather-test-close {
                color: white;
                background: transparent;
                border: none;
                font-size: 23px;
                cursor: pointer;
            }

            .weather-test-content {
                padding: 14px;
            }

            .weather-test-content p {
                font-size: 12px;
                margin: 0 0 12px;
            }

            .weather-test-buttons {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 8px;
            }

            .weather-test-buttons button,
            #weather-test-reset {
                color: white;
                background: rgba(255,255,255,.09);
                border: 1px solid rgba(255,255,255,.17);
                border-radius: 10px;
                padding: 10px 6px;
                cursor: pointer;
                font-family: inherit;
                font-size: 12px;
                transition: .25s ease;
            }

            .weather-test-buttons button:hover {
                background: rgba(0,225,255,.22);
                border-color: #00e5ff;
                transform: translateY(-3px);
                box-shadow: 0 0 14px rgba(0,225,255,.25);
            }

            .weather-test-buttons button.selected {
                outline: 2px solid #00e5ff;
                background: rgba(0,225,255,.2);
            }

            #weather-test-reset {
                width: 100%;
                margin-top: 12px;
                background: rgba(0,180,130,.2);
            }

            #weather-test-reset:hover {
                background: rgba(0,180,130,.4);
            }

            @media (max-width: 480px) {
                #weather-test-panel {
                    bottom: 10px;
                    left: 10px;
                }
            }

            @media (prefers-reduced-motion: reduce) {
                #weather-test-panel * {
                    transition: none !important;
                }
            }
        `;

        document.head.appendChild(panelStyle);
        document.body.appendChild(panel);

        // انتخاب تم آزمایشی
        panel.querySelectorAll("[data-theme]").forEach(button => {
            button.addEventListener("click", function () {
                const selectedTheme = this.dataset.theme;

                document.body.dataset.weather = selectedTheme;

                panel.querySelectorAll("[data-theme]").forEach(item => {
                    item.classList.remove("selected");
                });

                this.classList.add("selected");
            });
        });

        // بستن پنل
        $("#weather-test-close").addEventListener("click", function () {
            panel.remove();
        });

        // بازگشت به آب‌وهوای واقعی
        $("#weather-test-reset").addEventListener("click", function () {
            location.reload();
        });
    }

    console.log("SanaDemo Advanced System Loaded Successfully 🚀");
});
