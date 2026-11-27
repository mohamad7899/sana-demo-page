
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

        if (ua.includes("Edg/")) return "Microsoft Edge";
        if (ua.includes("Chrome/")) return "Google Chrome";
        if (ua.includes("Firefox/")) return "Mozilla Firefox";
        if (ua.includes("Safari/")) return "Safari";

        return "مرورگر ناشناخته";
    }

    function getDeviceInfo() {
        const ua = navigator.userAgent;

        if (/Android/i.test(ua)) return "Android";
        if (/iPhone|iPad|iPod/i.test(ua)) return "Apple iOS";
        if (/Windows/i.test(ua)) return "Windows";
        if (/Macintosh|Mac OS/i.test(ua)) return "macOS";
        if (/Linux/i.test(ua)) return "Linux";

        return "دستگاه ناشناخته";
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
            ? (
                connection.effectiveType ||
                connection.type ||
                "نامشخص"
            )
            : "پشتیبانی نمی‌شود";

        setText("connection-type", connectionType);
        setText("feature-live-connection", connectionType);
    }

    updateNetwork();

    window.addEventListener("online", updateNetwork);
    window.addEventListener("offline", updateNetwork);

    const browserConnection =
        navigator.connection ||
        navigator.mozConnection ||
        navigator.webkitConnection;

    if (
        browserConnection &&
        typeof browserConnection.addEventListener === "function"
    ) {
        browserConnection.addEventListener(
            "change",
            updateNetwork
        );
    }

    /* =========================================
       5. PAGE LOAD TIME
    ========================================= */

    window.addEventListener("load", function () {
        const loadTime = Math.round(performance.now());
        const result = loadTime + " ms";

        setText("page-load-time", result);
        setText("feature-live-load", result);
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

            setText(
                "public-ip",
                data.ip || "در دسترس نیست"
            );

        } catch (error) {
            setText("public-ip", "در دسترس نیست");
        }
    }

    if (document.getElementById("public-ip")) {
        getPublicIP();
    }

    /* =========================================
       7. MOBILE NAVIGATION
    ========================================= */

    const menuToggle = $(".menu-toggle");
    const navLinks = $(".nav-links");

    if (menuToggle && navLinks) {
        menuToggle.addEventListener("click", function () {
            const isOpen =
                navLinks.classList.toggle("active");

            menuToggle.setAttribute(
                "aria-expanded",
                String(isOpen)
            );
        });

        navLinks.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", function () {
                navLinks.classList.remove("active");

                menuToggle.setAttribute(
                    "aria-expanded",
                    "false"
                );
            });
        });

        document.addEventListener("click", function (event) {
            if (
                !navLinks.contains(event.target) &&
                !menuToggle.contains(event.target)
            ) {
                navLinks.classList.remove("active");

                menuToggle.setAttribute(
                    "aria-expanded",
                    "false"
                );
            }
        });
    }

    /* =========================================
       8. WEATHER ELEMENTS
    ========================================= */

    const weatherCard = $("#weather-card");
    const weatherPanel = $("#weather-panel");

    const weatherOpen = $("#weather-open");
    const weatherRefresh = $("#weather-refresh");

    const weatherTemperature = $("#weather-temperature");
    const weatherDescription = $("#weather-description");
    const weatherLocation = $("#weather-location");
    const weatherIcon = $("#weather-icon");

    let lastCoordinates = null;
    let weatherRequestInProgress = false;

    const weatherConditions = {
        0: {
            description: "آسمان صاف",
            icon: "☀️"
        },
        1: {
            description: "عمدتاً صاف",
            icon: "🌤️"
        },
        2: {
            description: "نیمه‌ابری",
            icon: "⛅"
        },
        3: {
            description: "ابری",
            icon: "☁️"
        },
        45: {
            description: "مه‌آلود",
            icon: "🌫️"
        },
        48: {
            description: "مه یخ‌زده",
            icon: "🌫️"
        },
        51: {
            description: "نم‌نم باران",
            icon: "🌦️"
        },
        53: {
            description: "باران ملایم",
            icon: "🌧️"
        },
        55: {
            description: "باران نسبتاً شدید",
            icon: "🌧️"
        },
        61: {
            description: "بارندگی خفیف",
            icon: "🌦️"
        },
        63: {
            description: "بارندگی متوسط",
            icon: "🌧️"
        },
        65: {
            description: "بارندگی شدید",
            icon: "🌧️"
        },
        71: {
            description: "بارش برف خفیف",
            icon: "🌨️"
        },
        73: {
            description: "بارش برف",
            icon: "❄️"
        },
        75: {
            description: "بارش برف شدید",
            icon: "❄️"
        },
        77: {
            description: "دانه‌های برف",
            icon: "❄️"
        },
        80: {
            description: "رگبار خفیف",
            icon: "🌦️"
        },
        81: {
            description: "رگبار باران",
            icon: "🌧️"
        },
        82: {
            description: "رگبار شدید",
            icon: "🌧️"
        },
        85: {
            description: "رگبار برف",
            icon: "🌨️"
        },
        86: {
            description: "رگبار برف شدید",
            icon: "❄️"
        },
        95: {
            description: "رعد و برق",
            icon: "⛈️"
        },
        96: {
            description: "طوفان همراه با تگرگ",
            icon: "⛈️"
        },
        99: {
            description: "طوفان شدید",
            icon: "⛈️"
        }
    };

    function getWeatherInfo(code) {
        return weatherConditions[code] || {
            description: "وضعیت نامشخص",
            icon: "🌍"
        };
    }

    /* =========================================
       9. LOCATION NAME
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
       10. FIVE-DAY FORECAST
    ========================================= */

    function renderForecast(daily) {
        const container = $("#weather-forecast");

        if (!container || !daily || !daily.time) {
            return;
        }

        container.innerHTML = "";

        daily.time.forEach((date, index) => {
            const weather = getWeatherInfo(
                daily.weather_code[index]
            );

            const maxTemp =
                daily.temperature_2m_max[index];

            const minTemp =
                daily.temperature_2m_min[index];

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

            const temperature =
                document.createElement("strong");

            temperature.textContent =
                `${Math.round(maxTemp)}° / ${Math.round(minTemp)}°`;

            item.append(
                day,
                icon,
                description,
                temperature
            );

            container.appendChild(item);
        });
    }

    /* =========================================
       11. WEATHER DETAILS
    ========================================= */

    function renderWeatherDetails(current, daily) {
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

        const rainProbability =
            daily &&
            daily.precipitation_probability_max &&
            daily.precipitation_probability_max[0] !== undefined
                ? daily.precipitation_probability_max[0] + "%"
                : "نامشخص";

        setText("weather-rain", rainProbability);

        setText(
            "weather-uv",
            daily &&
            daily.uv_index_max &&
            daily.uv_index_max[0] !== undefined
                ? daily.uv_index_max[0]
                : "نامشخص"
        );

        setText(
            "weather-detail-temp",
            Math.round(current.temperature_2m) + "°C"
        );
    }

    /* =========================================
       12. LOAD WEATHER DATA
    ========================================= */

    async function loadWeather(latitude, longitude) {
        if (weatherRequestInProgress) return;

        weatherRequestInProgress = true;

        setText(
            "weather-card-status",
            "در حال دریافت اطلاعات..."
        );

        setText(
            "weather-detail-status",
            "در حال دریافت اطلاعات..."
        );

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

            if (!data.current || !data.daily) {
                throw new Error("Weather data unavailable");
            }

            const current = data.current;
            const daily = data.daily;

            const weather = getWeatherInfo(
                current.weather_code
            );

            if (weatherTemperature) {
                weatherTemperature.textContent =
                    Math.round(current.temperature_2m) + "°C";
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
                "اطلاعات آب‌وهوا به‌روز شد"
            );

            setText(
                "weather-detail-status",
                "اطلاعات پیش‌بینی دریافت شد"
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

        } finally {
            weatherRequestInProgress = false;
        }
    }

    /* =========================================
       13. REQUEST LOCATION
    ========================================= */

    function requestWeatherLocation() {
        if (!navigator.geolocation) {
            setText(
                "weather-card-status",
                "موقعیت مکانی پشتیبانی نمی‌شود"
            );

            setText(
                "weather-detail-status",
                "مرورگر شما از موقعیت مکانی پشتیبانی نمی‌کند"
            );

            return;
        }

        setText(
            "weather-card-status",
            "در انتظار اجازه موقعیت مکانی..."
        );

        navigator.geolocation.getCurrentPosition(
            function (position) {
                const latitude =
                    position.coords.latitude;

                const longitude =
                    position.coords.longitude;

                lastCoordinates = {
                    latitude,
                    longitude
                };

                loadWeather(latitude, longitude);
            },

            function (error) {
                let message =
                    "دسترسی به موقعیت مکانی ممکن نشد";

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

    if (weatherCard) {
        requestWeatherLocation();
    }

    /* =========================================
       14. WEATHER PANEL INTERACTION
    ========================================= */

    function toggleWeatherPanel() {
        if (!weatherPanel) return;

        const isOpen =
            weatherPanel.classList.toggle("active");

        if (weatherCard) {
            weatherCard.setAttribute(
                "aria-expanded",
                String(isOpen)
            );
        }
    }

    if (weatherCard && weatherPanel) {
        if (weatherOpen) {
            weatherOpen.addEventListener("click", function (event) {
                event.stopPropagation();
                toggleWeatherPanel();
            });
        }
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
       15. 3D CARD TILT EFFECT
    ========================================= */

    const tiltCards = document.querySelectorAll(
        ".dashboard-card, .monitor-item, .features-grid .card, .features-page-grid .card"
    );

    const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    if (!reduceMotion) {
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

                card.style.setProperty("--mouse-x", `${x}px`);
                card.style.setProperty("--mouse-y", `${y}px`);
            });

            card.addEventListener("pointerleave", function () {
                card.style.transform = "";
            });
        });
    }

    /* =========================================
       16. HERO PARALLAX
    ========================================= */

    const heroVisual = $(".hero-visual");

    if (heroVisual && !reduceMotion) {
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
       17. SCROLL REVEAL ANIMATION
    ========================================= */

    const revealElements = document.querySelectorAll(
        ".section-heading, .section-title, .dashboard-card, .monitor-item, .features-grid .card, .features-page-grid .card, .info-box, .feature-detail"
    );

    if (
        "IntersectionObserver" in window &&
        !reduceMotion
    ) {
        const revealObserver = new IntersectionObserver(
            function (entries, observer) {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("visible");
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.12 }
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
       18. BACK TO TOP BUTTON
    ========================================= */

    if (!document.getElementById("back-to-top")) {
        const backToTop =
            document.createElement("button");

        backToTop.id = "back-to-top";
        backToTop.type = "button";
        backToTop.textContent = "↑";

        backToTop.setAttribute(
            "aria-label",
            "بازگشت به بالا"
        );

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
       19. ACTIVE NAVIGATION LINK
    ========================================= */

    const currentPage =
        location.pathname.split("/").pop() || "index.html";

    document.querySelectorAll(".nav-links a").forEach(link => {
        const linkPage = link.getAttribute("href");

        if (linkPage === currentPage) {
            link.classList.add("active");
        } else {
            link.classList.remove("active");
        }
    });

    console.log(
        "SanaDemo Advanced System Loaded Successfully 🚀"
    );
});
