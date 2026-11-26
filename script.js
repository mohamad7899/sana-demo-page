
/* =========================================
   SAN DEMO ULTIMATE 4.0
   INTERACTIVE JAVASCRIPT
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================
       1. LIVE CLOCK AND DATE
    ===================================== */

    const clock = document.getElementById("live-clock");
    const date = document.getElementById("live-date");

    function updateClock() {
        const now = new Date();

        if (clock) {
            clock.textContent = now.toLocaleTimeString("fa-IR", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit"
            });
        }

        if (date) {
            date.textContent = now.toLocaleDateString("fa-IR", {
                year: "numeric",
                month: "long",
                day: "numeric",
                weekday: "long"
            });
        }
    }

    updateClock();
    setInterval(updateClock, 1000);


    /* =====================================
       2. DEVICE AND BROWSER INFORMATION
    ===================================== */

    const deviceElement = document.getElementById("dashboard-device");

    function detectDevice() {
        const ua = navigator.userAgent;

        let device = "دستگاه نامشخص";
        let browser = "مرورگر نامشخص";
        let os = "سیستم‌عامل نامشخص";

        if (/iPhone/i.test(ua)) {
            device = "Apple iPhone";
        } else if (/iPad/i.test(ua)) {
            device = "Apple iPad";
        } else if (/Android/i.test(ua)) {
            device = /Mobile/i.test(ua) ? "Android Mobile" : "Android Tablet";
        } else if (/Windows/i.test(ua)) {
            device = "Windows PC";
        } else if (/Macintosh|Mac OS/i.test(ua)) {
            device = "Mac Computer";
        } else if (/Linux/i.test(ua)) {
            device = "Linux Computer";
        }

        if (/Edg\//i.test(ua)) {
            browser = "Microsoft Edge";
        } else if (/Firefox\//i.test(ua)) {
            browser = "Mozilla Firefox";
        } else if (/Chrome\//i.test(ua)) {
            browser = "Google Chrome";
        } else if (/Safari\//i.test(ua)) {
            browser = "Apple Safari";
        }

        if (/Windows NT/i.test(ua)) {
            os = "Windows";
        } else if (/Android/i.test(ua)) {
            os = "Android";
        } else if (/iPhone|iPad|iPod/i.test(ua)) {
            os = "iOS / iPadOS";
        } else if (/Mac OS/i.test(ua)) {
            os = "macOS";
        } else if (/Linux/i.test(ua)) {
            os = "Linux";
        }

        return `${device} | ${os} | ${browser}`;
    }

    if (deviceElement) {
        deviceElement.textContent = detectDevice();
    }


    /* =====================================
       3. NETWORK STATUS
    ===================================== */

    const networkStatus = document.getElementById("network-status");
    const connectionType = document.getElementById("connection-type");

    function updateNetwork() {
        const connected = navigator.onLine;

        if (networkStatus) {
            networkStatus.textContent = connected
                ? "متصل به اینترنت"
                : "بدون اتصال شبکه";
        }

        if (connectionType) {
            const connection =
                navigator.connection ||
                navigator.mozConnection ||
                navigator.webkitConnection;

            connectionType.textContent =
                connection && connection.effectiveType
                    ? connection.effectiveType.toUpperCase()
                    : "در دسترس نیست";
        }
    }

    window.addEventListener("online", updateNetwork);
    window.addEventListener("offline", updateNetwork);

    if (navigator.connection) {
        navigator.connection.addEventListener("change", updateNetwork);
    }

    updateNetwork();


    /* =====================================
       4. BROWSER LANGUAGE
    ===================================== */

    const languageElement = document.getElementById("browser-language");

    if (languageElement) {
        languageElement.textContent =
            navigator.language || "نامشخص";
    }


    /* =====================================
       5. PAGE LOAD TIME
    ===================================== */

    const loadTimeElement = document.getElementById("page-load-time");

    function showLoadTime() {
        if (!loadTimeElement) return;

        const navigation = performance.getEntriesByType("navigation")[0];

        if (navigation && navigation.loadEventEnd > 0) {
            loadTimeElement.textContent =
                Math.round(navigation.loadEventEnd) + " ms";
        } else {
            loadTimeElement.textContent = "ثبت نشده";
        }
    }

    window.addEventListener("load", () => {
        setTimeout(showLoadTime, 100);
    });

    showLoadTime();


    /* =====================================
       6. PUBLIC IP
    ===================================== */

    const ipElement = document.getElementById("public-ip");

    async function getPublicIP() {
        if (!ipElement) return;

        if (!navigator.onLine) {
            ipElement.textContent = "اتصال اینترنت برقرار نیست";
            return;
        }

        ipElement.textContent = "در حال دریافت...";

        try {
            const response = await fetch(
                "https://api.ipify.org?format=json",
                { cache: "no-store" }
            );

            if (!response.ok) {
                throw new Error("IP service unavailable");
            }

            const data = await response.json();

            if (
                typeof data.ip !== "string" ||
                !/^[0-9a-fA-F:.]+$/.test(data.ip)
            ) {
                throw new Error("Invalid IP response");
            }

            ipElement.textContent = data.ip;

        } catch (error) {
            ipElement.textContent = "دریافت IP ناموفق بود";
            console.warn("Public IP could not be loaded.");
        }
    }

    getPublicIP();


    /* =====================================
       7. SYSTEM STATUS
    ===================================== */

    const siteStatus = document.getElementById("site-status");

    if (siteStatus) {
        siteStatus.textContent = "فعال و آماده";
    }


    /* =====================================
       8. MOBILE NAVIGATION
    ===================================== */

    const menuToggle = document.querySelector(".menu-toggle");
    const navLinks = document.querySelector(".nav-links");

    if (menuToggle && navLinks) {

        menuToggle.addEventListener("click", () => {
            const isOpen = navLinks.classList.toggle("active");

            menuToggle.setAttribute("aria-expanded", String(isOpen));
            menuToggle.setAttribute(
                "aria-label",
                isOpen ? "بستن منو" : "باز کردن منو"
            );
        });

        navLinks.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", () => {
                navLinks.classList.remove("active");
                menuToggle.setAttribute("aria-expanded", "false");
            });
        });

        document.addEventListener("click", event => {
            if (
                !navLinks.contains(event.target) &&
                !menuToggle.contains(event.target)
            ) {
                navLinks.classList.remove("active");
                menuToggle.setAttribute("aria-expanded", "false");
            }
        });
    }


    /* =====================================
       9. INTERACTIVE 3D CARD TILT
    ===================================== */

    const cards = document.querySelectorAll(
        ".dashboard-card, .monitor-item, .features-grid .card"
    );

    const supportsHover = window.matchMedia(
        "(hover: hover) and (pointer: fine)"
    ).matches;

    const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

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

                card.style.transform = `
                    perspective(900px)
                    translateY(-13px)
                    scale3d(1.035, 1.035, 1.035)
                    rotateX(${rotateX}deg)
                    rotateY(${rotateY}deg)
                `;

                card.style.setProperty(
                    "--mouse-x",
                    `${x}px`
                );

                card.style.setProperty(
                    "--mouse-y",
                    `${y}px`
                );
            });

            card.addEventListener("pointerleave", () => {
                card.style.transform = "";
            });

        });
    }


    /* =====================================
       10. HERO PARALLAX
    ===================================== */

    const heroVisual = document.querySelector(".hero-visual");

    if (heroVisual && supportsHover && !reduceMotion) {

        heroVisual.addEventListener("pointermove", event => {

            const rect = heroVisual.getBoundingClientRect();

            const x = (event.clientX - rect.left) / rect.width - 0.5;
            const y = (event.clientY - rect.top) / rect.height - 0.5;

            heroVisual.style.transform = `
                perspective(900px)
                rotateY(${x * 12}deg)
                rotateX(${-y * 12}deg)
            `;
        });

        heroVisual.addEventListener("pointerleave", () => {
            heroVisual.style.transform = "";
        });
    }


    /* =====================================
       11. SCROLL REVEAL
    ===================================== */

    const revealElements = document.querySelectorAll(
        ".section-heading, .dashboard-card, .monitor-item, " +
        ".features-grid .card, .info-box"
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
       12. BACK TO TOP BUTTON
    ===================================== */

    const backToTop = document.createElement("button");

    backToTop.className = "back-to-top";
    backToTop.type = "button";
    backToTop.textContent = "↑";
    backToTop.setAttribute("aria-label", "بازگشت به بالای صفحه");

    document.body.appendChild(backToTop);

    window.addEventListener("scroll", () => {

        if (window.scrollY > 350) {
            backToTop.classList.add("show");
        } else {
            backToTop.classList.remove("show");
        }

    }, { passive: true });

    backToTop.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: reduceMotion ? "auto" : "smooth"
        });
    });


    /* =====================================
       13. ACTIVE NAVIGATION LINK
    ===================================== */

    const currentPage = window.location.pathname
        .split("/")
        .pop() || "index.html";

    document.querySelectorAll(".nav-links a").forEach(link => {

        const href = link.getAttribute("href");

        if (href === currentPage) {
            link.classList.add("active");
        } else {
            link.classList.remove("active");
        }

    });


    console.log("SanaDemo Ultimate 4.0 initialized successfully.");

});
