
/* =====================================================
   SanaDemo Ultimate 4.0
   3D + Dynamic Weather + Live Monitoring
===================================================== */

document.addEventListener("DOMContentLoaded", () => {

    const $ = selector => document.querySelector(selector);

    const reduceMotion =
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const supportsHover =
        window.matchMedia("(hover: hover) and (pointer: fine)").matches;


    /* =================================================
       1. LIVE CLOCK
    ================================================= */

    function updateClock() {

        const now = new Date();

        const clock = $("#live-clock");
        const date = $("#live-date");

        if (clock) {
            clock.textContent = now.toLocaleTimeString("fa-IR");
        }

        if (date) {
            date.textContent = now.toLocaleDateString("fa-IR", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric"
            });
        }
    }

    updateClock();
    setInterval(updateClock, 1000);


    /* =================================================
       2. DEVICE INFORMATION
    ================================================= */

    function getDeviceInfo() {

        const ua = navigator.userAgent;

        let device = "دستگاه ناشناخته";
        let browser = "مرورگر ناشناخته";

        if (/Android/i.test(ua)) {
            device = "Android";
        } else if (/iPhone|iPad|iPod/i.test(ua)) {
            device = "Apple iOS";
        } else if (/Windows/i.test(ua)) {
            device = "Windows";
        } else if (/Macintosh|Mac OS/i.test(ua)) {
            device = "macOS";
        } else if (/Linux/i.test(ua)) {
            device = "Linux";
        }

        if (/Edg/i.test(ua)) {
            browser = "Microsoft Edge";
        } else if (/Chrome/i.test(ua)) {
            browser = "Google Chrome";
        } else if (/Firefox/i.test(ua)) {
            browser = "Mozilla Firefox";
        } else if (/Safari/i.test(ua)) {
            browser = "Safari";
        }

        return device + " | " + browser;
    }

    const deviceInfo = getDeviceInfo();

    [
        "#dashboard-device",
        "#feature-live-device"
    ].forEach(selector => {
        const element = $(selector);
        if (element) element.textContent = deviceInfo;
    });


    /* =================================================
       3. NETWORK INFORMATION
    ================================================= */

    function updateNetwork() {

        const online = navigator.onLine;

        const network = $("#network-status");
        const featureNetwork = $("#feature-live-network");
        const siteStatus = $("#site-status");

        if (network) {
            network.textContent = online ? "متصل" : "قطع اتصال";
        }

        if (featureNetwork) {
            featureNetwork.textContent = online
                ? "اتصال اینترنت برقرار است"
                : "اتصال اینترنت قطع است";
        }

        if (siteStatus) {
            siteStatus.textContent = online
                ? "فعال و متصل"
                : "بدون اتصال اینترنت";
        }

        const connection =
            navigator.connection ||
            navigator.mozConnection ||
            navigator.webkitConnection;

        const type = connection
            ? connection.effectiveType || connection.type || "نامشخص"
            : "در دسترس نیست";

        const connectionElement = $("#connection-type");
        const featureConnection = $("#feature-live-connection");

        if (connectionElement) {
            connectionElement.textContent = type;
        }

        if (featureConnection) {
            featureConnection.textContent = type;
        }
    }

    updateNetwork();

    window.addEventListener("online", updateNetwork);
    window.addEventListener("offline", updateNetwork);


    /* =================================================
       4. LANGUAGE
    ================================================= */

    const language = navigator.language || "نامشخص";

    [
        "#browser-language",
        "#feature-live-language"
    ].forEach(selector => {
        const element = $(selector);
        if (element) element.textContent = language;
    });


    /* =================================================
       5. PAGE LOAD TIME
    ================================================= */

    function updateLoadTime() {

        const navigation =
            performance.getEntriesByType("navigation")[0];

        if (!navigation) return;

        const time = Math.round(navigation.loadEventEnd);

        const result = time > 0
            ? time + " ms"
            : "نامشخص";

        [
            "#page-load-time",
            "#feature-live-load"
        ].forEach(selector => {
            const element = $(selector);
            if (element) element.textContent = result;
        });
    }

    window.addEventListener("load", () => {
        setTimeout(updateLoadTime, 200);
    });


    /* =================================================
       6. PUBLIC IP
    ================================================= */

    const publicIp = $("#public-ip");

    if (publicIp) {

        publicIp.textContent = "در حال دریافت...";

        fetch("https://api.ipify.org?format=json")
            .then(response => {
                if (!response.ok) {
                    throw new Error("IP request failed");
                }

                return response.json();
            })
            .then(data => {
                publicIp.textContent = data.ip || "نامشخص";
            })
            .catch(() => {
                publicIp.textContent = "دریافت نشد";
            });
    }


    /* =================================================
       7. MOBILE MENU
    ================================================= */

    const menuButton = $(".menu-toggle");
    const navigation = $(".nav-links");

    if (menuButton && navigation) {

        menuButton.addEventListener("click", () => {

            const isOpen =
                navigation.classList.toggle("active");

            menuButton.setAttribute(
                "aria-expanded",
                String(isOpen)
            );
        });

        navigation.querySelectorAll("a").forEach(link => {

            link.addEventListener("click", () => {

                navigation.classList.remove("active");

                menuButton.setAttribute(
                    "aria-expanded",
                    "false"
                );
            });
        });
    }


    /* =================================================
       8. WEATHER CONFIGURATION
    ================================================= */

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

    let currentCoordinates = null;
    let weatherLoading = false;

    const weatherCodes = {

        0: ["آسمان صاف", "☀️"],
        1: ["عمدتاً صاف", "🌤️"],
        2: ["نیمه‌ابری", "⛅"],
        3: ["ابری", "☁️"],

        45: ["مه‌آلود", "🌫️"],
        48: ["مه یخ‌زده", "🌫️"],

        51: ["نم‌نم باران سبک", "🌦️"],
        53: ["نم‌نم باران", "🌦️"],
        55: ["نم‌نم باران شدید", "🌧️"],

        56: ["باران یخ‌زده سبک", "🌧️"],
        57: ["باران یخ‌زده", "🌧️"],

        61: ["باران سبک", "🌦️"],
        63: ["باران", "🌧️"],
        65: ["باران شدید", "🌧️"],

        66: ["باران یخ‌زده سبک", "🌧️"],
        67: ["باران یخ‌زده شدید", "🌧️"],

        71: ["برف سبک", "🌨️"],
        73: ["بارش برف", "❄️"],
        75: ["برف شدید", "❄️"],
        77: ["دانه‌های برف", "🌨️"],

        80: ["رگبار سبک", "🌦️"],
        81: ["رگبار", "🌧️"],
        82: ["رگبار شدید", "⛈️"],

        85: ["رگبار برف سبک", "🌨️"],
        86: ["رگبار برف شدید", "❄️"],

        95: ["رعدوبرق", "⛈️"],
        96: ["رعدوبرق و تگرگ", "⛈️"],
        99: ["رعدوبرق و تگرگ شدید", "⛈️"]
    };

    function getWeatherInfo(code) {
        return weatherCodes[code] || [
            "وضعیت نامشخص",
            "🌡️"
        ];
    }


    /* =================================================
       9. WEATHER THEME ENGINE
    ================================================= */

    function setWeatherTheme(weatherCode, isDay, currentTime, sunrise, sunset) {

        let theme = "cloudy";

        const code = Number(weatherCode);

        // Fog
        if (code === 45 || code === 48) {
            theme = "foggy";
        }

        // Snow
        else if (
            [71, 73, 75, 77, 85, 86].includes(code)
        ) {
            theme = "snowy";
        }

        // Thunderstorm
        else if ([95, 96, 99].includes(code)) {
            theme = "stormy";
        }

        // Rain and drizzle
        else if (
            (code >= 51 && code <= 67) ||
            (code >= 80 && code <= 82)
        ) {
            theme = "rainy";
        }

        // Clear sky
        else if (code === 0) {
            theme = Number(isDay) === 1
                ? "sunny"
                : "night";
        }

        // Partly cloudy
        else if (code === 1 || code === 2) {
            theme = Number(isDay) === 1
                ? "partly-cloudy"
                : "night";
        }

        // Cloudy
        else if (code === 3) {
            theme = Number(isDay) === 1
                ? "cloudy"
                : "night";
        }

        // Sunrise and sunset
        if (
            Number(isDay) === 1 &&
            currentTime &&
            sunrise &&
            sunset &&
            (theme === "sunny" || theme === "partly-cloudy")
        ) {

            const now = new Date(currentTime).getTime();
            const rise = new Date(sunrise).getTime();
            const set = new Date(sunset).getTime();

            const minutesAfterSunrise =
                (now - rise) / 60000;

            const minutesBeforeSunset =
                (set - now) / 60000;

            if (
                minutesAfterSunrise >= 0 &&
                minutesAfterSunrise <= 45
            ) {
                theme = "sunrise";
            }

            else if (
                minutesBeforeSunset >= 0 &&
                minutesBeforeSunset <= 45
            ) {
                theme = "sunset";
            }
        }

        document.body.dataset.weather = theme;

        console.log("SanaDemo weather theme:", theme);
    }


    /* =================================================
       10. WEATHER LOCATION NAME
    ================================================= */

    function getWeatherLocation(latitude, longitude) {

        const url =
            "https://geocoding-api.open-meteo.com/v1/reverse" +
            "?latitude=" + encodeURIComponent(latitude) +
            "&longitude=" + encodeURIComponent(longitude) +
            "&language=fa&format=json";

        return fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error("Location lookup failed");
                }

                return response.json();
            })
            .then(data => {

                const place =
                    data.results && data.results[0];

                if (!place) {
                    return "منطقه شناسایی نشد";
                }

                return [
                    place.name,
                    place.admin1,
                    place.country
                ].filter(Boolean).join("، ");
            })
            .catch(() => "موقعیت شناسایی شد");
    }


    /* =================================================
       11. WEATHER FORECAST
    ================================================= */

    function renderForecast(daily) {

        const container = $("#weather-forecast");

        if (!container) return;

        container.replaceChildren();

        daily.time.forEach((date, index) => {

            const info = getWeatherInfo(
                daily.weather_code[index]
            );

            const item = document.createElement("div");
            item.className = "forecast-item";

            const day = new Date(date + "T12:00:00");

            const dayName = day.toLocaleDateString(
                "fa-IR",
                { weekday: "long" }
            );

            const max = Math.round(
                daily.temperature_2m_max[index]
            );

            const min = Math.round(
                daily.temperature_2m_min[index]
            );

            const rain =
                daily.precipitation_probability_max[index];

            const title = document.createElement("strong");
            title.textContent = dayName;

            const icon = document.createElement("div");
            icon.textContent = info[1];
            icon.style.fontSize = "30px";
            icon.style.margin = "10px 0";

            const description = document.createElement("div");
            description.textContent = info[0];

            const temperatures = document.createElement("div");
            temperatures.textContent =
                max + "° / " + min + "°";

            const rainText = document.createElement("div");
            rainText.textContent =
                "احتمال بارش: " + rain + "٪";

            item.append(
                title,
                icon,
                description,
                temperatures,
                rainText
            );

            container.appendChild(item);
        });
    }


    /* =================================================
       12. WEATHER DATA
    ================================================= */

    function setWeatherValue(id, value) {

        const element = $("#" + id);

        if (element) {
            element.textContent = value;
        }
    }

    function showWeatherError(message) {

        if (weatherCardStatus) {
            weatherCardStatus.textContent = message;
        }

        if (weatherDetailStatus) {
            weatherDetailStatus.textContent = message;
        }
    }

    async function loadWeather(latitude, longitude) {

        if (weatherLoading) return;

        weatherLoading = true;

        if (weatherCardStatus) {
            weatherCardStatus.textContent =
                "در حال دریافت اطلاعات آب‌وهوا...";
        }

        if (weatherDetailStatus) {
            weatherDetailStatus.textContent =
                "در حال دریافت اطلاعات...";
        }

        const url =
            "https://api.open-meteo.com/v1/forecast" +
            "?latitude=" + encodeURIComponent(latitude) +
            "&longitude=" + encodeURIComponent(longitude) +
            "&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m" +
            "&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,uv_index_max,sunrise,sunset" +
            "&timezone=auto&forecast_days=5";

        try {

            const [response, locationName] = await Promise.all([

                fetch(url).then(result => {
                    if (!result.ok) {
                        throw new Error("Weather service unavailable");
                    }

                    return result.json();
                }),

                weatherCard
                    ? getWeatherLocation(latitude, longitude)
                    : Promise.resolve("")
            ]);

            const current = response.current;
            const daily = response.daily;

            if (!current || !daily) {
                throw new Error("Incomplete weather data");
            }

            // Change the theme on EVERY page
            setWeatherTheme(
                current.weather_code,
                current.is_day,
                current.time,
                daily.sunrise?.[0],
                daily.sunset?.[0]
            );

            // Weather card exists only on the features page
            if (weatherCard) {

                const info = getWeatherInfo(
                    current.weather_code
                );

                const temperature = Math.round(
                    current.temperature_2m
                );

                if (weatherTemperature) {
                    weatherTemperature.textContent =
                        temperature + "°";
                }

                if (weatherDescription) {
                    weatherDescription.textContent = info[0];
                }

                if (weatherIcon) {
                    weatherIcon.textContent = info[1];
                }

                if (weatherLocation) {
                    weatherLocation.textContent = locationName;
                }

                if (weatherCardStatus) {
                    weatherCardStatus.textContent =
                        "آخرین بروزرسانی: " +
                        new Date().toLocaleTimeString("fa-IR");
                }

                if (weatherDetailStatus) {
                    weatherDetailStatus.textContent =
                        "اطلاعات هواشناسی برای " + locationName;
                }

                setWeatherValue(
                    "weather-detail-temp",
                    temperature + " °C"
                );

                setWeatherValue(
                    "weather-humidity",
                    current.relative_humidity_2m + "٪"
                );

                setWeatherValue(
                    "weather-wind",
                    current.wind_speed_10m + " km/h"
                );

                setWeatherValue(
                    "weather-feels",
                    current.apparent_temperature + " °C"
                );

                setWeatherValue(
                    "weather-rain",
                    daily.precipitation_probability_max[0] + "٪"
                );

                setWeatherValue(
                    "weather-uv",
                    daily.uv_index_max[0]
                );

                renderForecast(daily);
            }

        } catch (error) {

            console.error("SanaDemo weather error:", error);

            showWeatherError(
                "دریافت اطلاعات هواشناسی ناموفق بود. اتصال اینترنت را بررسی کنید."
            );

        } finally {
            weatherLoading = false;
        }
    }


    /* =================================================
       13. LOCATION PERMISSION
    ================================================= */

    function requestWeatherLocation() {

        if (!navigator.geolocation) {

            showWeatherError(
                "مرورگر شما از موقعیت مکانی پشتیبانی نمی‌کند."
            );

            return;
        }

        if (!window.isSecureContext) {

            showWeatherError(
                "برای دریافت موقعیت مکانی، اتصال HTTPS لازم است."
            );

            return;
        }

        if (weatherCardStatus) {
            weatherCardStatus.textContent =
                "در انتظار اجازه موقعیت مکانی...";
        }

        navigator.geolocation.getCurrentPosition(

            position => {

                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;

                currentCoordinates = {
                    latitude,
                    longitude
                };

                loadWeather(latitude, longitude);
            },

            error => {

                let message =
                    "دریافت موقعیت مکانی انجام نشد.";

                if (error.code === error.PERMISSION_DENIED) {

                    message =
                        "دسترسی موقعیت مکانی مجاز نیست. از تنظیمات مرورگر اجازه دسترسی بدهید.";

                } else if (
                    error.code === error.POSITION_UNAVAILABLE
                ) {

                    message =
                        "موقعیت مکانی در حال حاضر در دسترس نیست.";

                } else if (error.code === error.TIMEOUT) {

                    message =
                        "زمان دریافت موقعیت مکانی تمام شد. دوباره تلاش کنید.";
                }

                showWeatherError(message);

            },

            {
                enableHighAccuracy: true,
                timeout: 20000,
                maximumAge: 0
            }
        );
    }

    // Request location on all four pages
    requestWeatherLocation();


    /* =================================================
       14. WEATHER CARD INTERACTION
    ================================================= */

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

        if (isOpen) {
            weatherPanel.scrollIntoView({
                behavior: "smooth",
                block: "nearest"
            });
        }
    }

    if (weatherCard) {

        weatherCard.addEventListener("click", event => {

            if (event.target.closest("#weather-open")) {
                return;
            }

            toggleWeatherPanel();
        });

        weatherCard.addEventListener("keydown", event => {

            if (
                event.target === weatherCard &&
                (event.key === "Enter" || event.key === " ")
            ) {
                event.preventDefault();
                toggleWeatherPanel();
            }
        });
    }

    if (weatherOpen) {

        weatherOpen.addEventListener("click", event => {
            event.stopPropagation();
            toggleWeatherPanel();
        });
    }

    if (weatherRefresh) {

        weatherRefresh.addEventListener("click", () => {

            if (currentCoordinates) {

                loadWeather(
                    currentCoordinates.latitude,
                    currentCoordinates.longitude
                );

            } else {

                requestWeatherLocation();
            }
        });
    }


    /* =================================================
       15. 3D CARD TILT
    ================================================= */

    const cards = document.querySelectorAll(
        ".dashboard-card, .monitor-item, .features-grid .card, .features-page-grid .card"
    );

    if (supportsHover && !reduceMotion) {

        cards.forEach(card => {

            card.addEventListener("pointermove", event => {

                const rect = card.getBoundingClientRect();

                const x = event.clientX - rect.left;
                const y = event.clientY - rect.top;

                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const rotateY =
                    ((x - centerX) / centerX) * 7;

                const rotateX =
                    ((centerY - y) / centerY) * 7;

                card.style.setProperty(
                    "--mouse-x",
                    (x / rect.width * 100) + "%"
                );

                card.style.setProperty(
                    "--mouse-y",
                    (y / rect.height * 100) + "%"
                );

                card.style.transform =
                    `perspective(900px) translateY(-10px) scale(1.025) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            });

            card.addEventListener("pointerleave", () => {

                card.style.transform = "";

                card.style.removeProperty("--mouse-x");
                card.style.removeProperty("--mouse-y");
            });
        });
    }


    /* =================================================
       16. HERO PARALLAX
    ================================================= */

    const heroVisual = $(".hero-visual");

    if (heroVisual && supportsHover && !reduceMotion) {

        document.addEventListener("pointermove", event => {

            const x =
                (event.clientX / window.innerWidth - 0.5) * 12;

            const y =
                (event.clientY / window.innerHeight - 0.5) * 12;

            heroVisual.style.transform =
                `translate3d(${x}px, ${y}px, 0)`;
        });

        document.addEventListener("pointerleave", () => {
            heroVisual.style.transform = "";
        });
    }


    /* =================================================
       17. SCROLL REVEAL
    ================================================= */

    const revealElements = document.querySelectorAll(
        ".section-heading, .dashboard-card, .monitor-item, .features-grid .card, .features-page-grid .card, .info-box, .feature-detail"
    );

    if (
        "IntersectionObserver" in window &&
        !reduceMotion
    ) {

        const observer = new IntersectionObserver(entries => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    entry.target.classList.add("visible");

                    observer.unobserve(entry.target);
                }
            });

        }, {
            threshold: 0.12
        });

        revealElements.forEach(element => {

            element.classList.add("reveal");

            observer.observe(element);
        });

    } else {

        revealElements.forEach(element => {
            element.classList.add("visible");
        });
    }


    /* =================================================
       18. BACK TO TOP
    ================================================= */

    const backToTop = document.createElement("button");

    backToTop.type = "button";
    backToTop.className = "back-to-top";
    backToTop.textContent = "↑";

    backToTop.setAttribute(
        "aria-label",
        "بازگشت به بالای صفحه"
    );

    document.body.appendChild(backToTop);

    window.addEventListener("scroll", () => {

        if (window.scrollY > 400) {
            backToTop.classList.add("show");
        } else {
            backToTop.classList.remove("show");
        }
    });

    backToTop.addEventListener("click", () => {

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });


    /* =================================================
       19. ACTIVE NAVIGATION
    ================================================= */

    const currentPage =
        window.location.pathname.split("/").pop() ||
        "index.html";

    document.querySelectorAll(".nav-links a").forEach(link => {

        const href = link.getAttribute("href");

        if (href === currentPage) {
            link.classList.add("active");
        } else {
            link.classList.remove("active");
        }
    });


    console.log("SanaDemo Ultimate 4.0 initialized");

});
