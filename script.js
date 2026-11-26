
/* =========================================
   SanaDemo - Main JavaScript
   ========================================= */

document.addEventListener("DOMContentLoaded", () => {

    const $ = (selector) => document.querySelector(selector);

    /* =====================================
       1. LIVE CLOCK AND DATE
    ===================================== */

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


    /* =====================================
       2. DEVICE AND BROWSER INFORMATION
    ===================================== */

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

    const dashboardDevice = $("#dashboard-device");
    const featureDevice = $("#feature-live-device");

    if (dashboardDevice) {
        dashboardDevice.textContent = deviceInfo;
    }

    if (featureDevice) {
        featureDevice.textContent = deviceInfo;
    }


    /* =====================================
       3. NETWORK STATUS
    ===================================== */

    function updateNetwork() {
        const online = navigator.onLine;

        const network = $("#network-status");
        const featureNetwork = $("#feature-live-network");

        if (network) {
            network.textContent = online ? "متصل" : "قطع اتصال";
        }

        if (featureNetwork) {
            featureNetwork.textContent = online
                ? "اتصال اینترنت برقرار است"
                : "اتصال اینترنت قطع است";
        }

        const connection = navigator.connection ||
                           navigator.mozConnection ||
                           navigator.webkitConnection;

        const connectionType = connection
            ? connection.effectiveType || connection.type || "نامشخص"
            : "در دسترس نیست";

        const connectionElement = $("#connection-type");
        const featureConnection = $("#feature-live-connection");

        if (connectionElement) {
            connectionElement.textContent = connectionType;
        }

        if (featureConnection) {
            featureConnection.textContent = connectionType;
        }
    }

    updateNetwork();

    window.addEventListener("online", updateNetwork);
    window.addEventListener("offline", updateNetwork);


    /* =====================================
       4. BROWSER LANGUAGE
    ===================================== */

    const language = navigator.language || "نامشخص";

    const languageElement = $("#browser-language");
    const featureLanguage = $("#feature-live-language");

    if (languageElement) {
        languageElement.textContent = language;
    }

    if (featureLanguage) {
        featureLanguage.textContent = language;
    }


    /* =====================================
       5. PAGE LOAD TIME
    ===================================== */

    function updateLoadTime() {
        const navigation = performance.getEntriesByType("navigation")[0];

        if (!navigation) return;

        const loadTime = Math.round(navigation.loadEventEnd);

        const loadElement = $("#page-load-time");
        const featureLoad = $("#feature-live-load");

        const result = loadTime > 0 ? loadTime + " ms" : "در حال محاسبه";

        if (loadElement) {
            loadElement.textContent = result;
        }

        if (featureLoad) {
            featureLoad.textContent = result;
        }
    }

    window.addEventListener("load", () => {
        setTimeout(updateLoadTime, 100);
    });


    /* =====================================
       6. PUBLIC IP
    ===================================== */

    const publicIpElement = $("#public-ip");

    if (publicIpElement) {
        publicIpElement.textContent = "در حال دریافت...";

        fetch("https://api.ipify.org?format=json")
            .then(response => {
                if (!response.ok) {
                    throw new Error("IP service unavailable");
                }
                return response.json();
            })
            .then(data => {
                publicIpElement.textContent = data.ip || "نامشخص";
            })
            .catch(() => {
                publicIpElement.textContent = "دریافت نشد";
            });
    }


    /* =====================================
       7. MOBILE NAVIGATION
    ===================================== */

    const menuButton = $(".menu-toggle");
    const navigation = $(".nav-links");

    if (menuButton && navigation) {

        menuButton.addEventListener("click", () => {
            const isOpen = navigation.classList.toggle("active");

            menuButton.setAttribute("aria-expanded", String(isOpen));
        });

        navigation.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", () => {
                navigation.classList.remove("active");
                menuButton.setAttribute("aria-expanded", "false");
            });
        });
    }


    /* =====================================
       8. WEATHER SYSTEM
       Open-Meteo API
    ===================================== */

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
        return weatherCodes[code] || ["وضعیت نامشخص", "🌡️"];
    }

    function showWeatherError(message) {
        if (weatherCardStatus) {
            weatherCardStatus.textContent = message;
        }

        if (weatherDetailStatus) {
            weatherDetailStatus.textContent = message;
        }
    }

    function setWeatherValue(id, value) {
        const element = $("#" + id);

        if (element) {
            element.textContent = value;
        }
    }

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
                const place = data.results && data.results[0];

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

    function loadWeather(latitude, longitude) {

        if (weatherLoading) return;

        weatherLoading = true;

        if (weatherCardStatus) {
            weatherCardStatus.textContent =
                "در حال دریافت اطلاعات هواشناسی...";
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
            "&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,uv_index_max" +
            "&timezone=auto&forecast_days=5";

        Promise.all([
            fetch(url).then(response => {
                if (!response.ok) {
                    throw new Error("Weather service unavailable");
                }

                return response.json();
            }),
            getWeatherLocation(latitude, longitude)
        ])
        .then(([data, locationName]) => {

            const current = data.current;
            const daily = data.daily;

            if (!current || !daily) {
                throw new Error("Incomplete weather data");
            }

            const info = getWeatherInfo(current.weather_code);

            const temperature = Math.round(current.temperature_2m);

            if (weatherTemperature) {
                weatherTemperature.textContent = temperature + "°";
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

        })
        .catch(error => {
            console.error("Weather error:", error);

            showWeatherError(
                "دریافت اطلاعات آب‌وهوا ناموفق بود. اتصال اینترنت را بررسی کنید."
            );
        })
        .finally(() => {
            weatherLoading = false;
        });
    }


    /* =====================================
       9. FIVE DAY FORECAST
    ===================================== */

    function renderForecast(daily) {

        const forecastContainer = $("#weather-forecast");

        if (!forecastContainer) return;

        forecastContainer.innerHTML = "";

        daily.time.forEach((date, index) => {

            const info = getWeatherInfo(daily.weather_code[index]);

            const item = document.createElement("div");
            item.className = "forecast-item";

            const day = new Date(date + "T12:00:00");

            const dayName = day.toLocaleDateString("fa-IR", {
                weekday: "long"
            });

            const temperature = Math.round(
                daily.temperature_2m_max[index]
            );

            const minTemperature = Math.round(
                daily.temperature_2m_min[index]
            );

            const rain = daily.precipitation_probability_max[index];

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
                temperature + "° / " + minTemperature + "°";

            const rainText = document.createElement("div");
            rainText.textContent = "احتمال بارش: " + rain + "٪";

            item.append(
                title,
                icon,
                description,
                temperatures,
                rainText
            );

            forecastContainer.appendChild(item);
        });
    }


    /* =====================================
       10. GET PRECISE LOCATION
    ===================================== */

    function requestWeatherLocation() {

        if (!weatherCard) return;

        if (!navigator.geolocation) {
            showWeatherError(
                "مرورگر شما از دریافت موقعیت مکانی پشتیبانی نمی‌کند."
            );
            return;
        }

        if (!window.isSecureContext) {
            showWeatherError(
                "برای دریافت موقعیت مکانی، سایت باید از اتصال امن HTTPS استفاده کند."
            );
            return;
        }

        if (weatherCardStatus) {
            weatherCardStatus.textContent =
                "در انتظار اجازه دسترسی به موقعیت مکانی...";
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

                let message = "دریافت موقعیت مکانی انجام نشد.";

                if (error.code === error.PERMISSION_DENIED) {
                    message =
                        "دسترسی موقعیت مکانی مجاز نیست. از تنظیمات مرورگر اجازه دسترسی بدهید.";
                } else if (error.code === error.POSITION_UNAVAILABLE) {
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


    /* =====================================
       11. WEATHER CARD INTERACTIONS
    ===================================== */

    function toggleWeatherPanel() {

        if (!weatherPanel) return;

        const isOpen = weatherPanel.classList.toggle("active");

        if (weatherCard) {
            weatherCard.setAttribute("aria-expanded", String(isOpen));
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
            if (event.target.closest("#weather-open")) return;
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

    if (weatherCard) {
        requestWeatherLocation();
    }


    /* =====================================
       12. 3D CARD EFFECTS
    ===================================== */

    const cards = document.querySelectorAll(
        ".dashboard-card, .monitor-item, .features-grid .card, .features-page-grid .card"
    );

    const supportsHover =
        window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    const reduceMotion =
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (supportsHover && !reduceMotion) {

        cards.forEach(card => {

            card.addEventListener("pointermove", event => {

                const rect = card.getBoundingClientRect();

                const x = event.clientX - rect.left;
                const y = event.clientY - rect.top;

                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const rotateY = ((x - centerX) / centerX) * 7;
                const rotateX = ((centerY - y) / centerY) * 7;

                card.style.transform =
                    `perspective(900px) translateY(-10px) scale(1.025) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            });

            card.addEventListener("pointerleave", () => {
                card.style.transform = "";
            });
        });
    }


    /* =====================================
       13. HERO PARALLAX
    ===================================== */

    const heroVisual = $(".hero-visual");

    if (heroVisual && supportsHover && !reduceMotion) {

        document.addEventListener("pointermove", event => {

            const x = (event.clientX / window.innerWidth - 0.5) * 12;
            const y = (event.clientY / window.innerHeight - 0.5) * 12;

            heroVisual.style.transform =
                `translate3d(${x}px, ${y}px, 0)`;
        });

        document.addEventListener("pointerleave", () => {
            heroVisual.style.transform = "";
        });
    }


    /* =====================================
       14. SCROLL REVEAL
    ===================================== */

    const revealElements = document.querySelectorAll(
        ".section-heading, .dashboard-card, .monitor-item, .features-grid .card, .features-page-grid .card, .info-box, .feature-detail"
    );

    if ("IntersectionObserver" in window && !reduceMotion) {

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


    /* =====================================
       15. BACK TO TOP
    ===================================== */

    const backToTop = document.createElement("button");

    backToTop.type = "button";
    backToTop.className = "back-to-top";
    backToTop.textContent = "↑";
    backToTop.setAttribute("aria-label", "بازگشت به بالای صفحه");

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


    /* =====================================
       16. ACTIVE NAVIGATION
    ===================================== */

    const currentPage =
        window.location.pathname.split("/").pop() || "index.html";

    document.querySelectorAll(".nav-links a").forEach(link => {

        const href = link.getAttribute("href");

        if (href === currentPage) {
            link.classList.add("active");
        } else {
            link.classList.remove("active");
        }
    });

});
