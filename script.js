
/* =========================================
   SanaDemo Ultimate 4.0
   Interactive Dashboard & 3D Effects
========================================= */

document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    const $ = (selector) => document.querySelector(selector);

    // ---------- Live Clock & Date ----------
    const clock = $("#live-clock");
    const date = $("#live-date");

    function updateDateTime() {
        const now = new Date();

        if (clock) {
            clock.textContent = new Intl.DateTimeFormat("fa-IR", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: false
            }).format(now);
        }

        if (date) {
            date.textContent = new Intl.DateTimeFormat("fa-IR", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric"
            }).format(now);
        }
    }

    updateDateTime();
    setInterval(updateDateTime, 1000);


    // ---------- Browser & Device ----------
    const deviceElement = $("#dashboard-device");

    function getDeviceInfo() {
        const ua = navigator.userAgent || "";
        let device = "دستگاه ناشناخته";
        let os = "سیستم‌عامل نامشخص";

        if (/iPhone/i.test(ua)) {
            device = "Apple iPhone";
            os = "iOS";
        } else if (/iPad/i.test(ua)) {
            device = "Apple iPad";
            os = "iPadOS";
        } else if (/Android/i.test(ua)) {
            device = "دستگاه Android";
            os = "Android";
        } else if (/Windows/i.test(ua)) {
            device = "کامپیوتر";
            os = "Windows";
        } else if (/Macintosh|Mac OS/i.test(ua)) {
            device = "دستگاه Mac";
            os = "macOS";
        } else if (/Linux/i.test(ua)) {
            device = "کامپیوتر";
            os = "Linux";
        }

        let browser = "مرورگر ناشناخته";

        if (/Edg/i.test(ua)) browser = "Microsoft Edge";
        else if (/Chrome/i.test(ua) && !/Chromium/i.test(ua)) browser = "Google Chrome";
        else if (/Firefox/i.test(ua)) browser = "Mozilla Firefox";
        else if (/Safari/i.test(ua) && !/Chrome/i.test(ua)) browser = "Safari";

        return { device, os, browser };
    }

    const deviceInfo = getDeviceInfo();

    if (deviceElement) {
        deviceElement.textContent =
            `${deviceInfo.device} | ${deviceInfo.os}`;
        deviceElement.title = `مرورگر: ${deviceInfo.browser}`;
    }


    // ---------- Network Status ----------
    const networkStatus = $("#network-status");
    const connectionType = $("#connection-type");

    function updateNetwork() {
        if (networkStatus) {
            networkStatus.textContent = navigator.onLine
                ? "متصل"
                : "قطع";
        }

        if (connectionType) {
            const connection =
                navigator.connection ||
                navigator.mozConnection ||
                navigator.webkitConnection;

            connectionType.textContent =
                connection && connection.effectiveType
                    ? connection.effectiveType.toUpperCase()
                    : "نامشخص";
        }
    }

    updateNetwork();

    window.addEventListener("online", updateNetwork);
    window.addEventListener("offline", updateNetwork);

    if (navigator.connection) {
        navigator.connection.addEventListener?.("change", updateNetwork);
    }


    // ---------- Browser Language ----------
    const languageElement = $("#browser-language");

    if (languageElement) {
        languageElement.textContent =
            navigator.language || "نامشخص";
    }


    // ---------- Page Load Time ----------
    const loadElement = $("#page-load-time");

    function updateLoadTime() {
        if (!loadElement) return;

        const timing = performance.getEntriesByType("navigation")[0];

        if (timing && timing.loadEventEnd > 0) {
            loadElement.textContent =
                `${Math.round(timing.loadEventEnd - timing.startTime)} ms`;
        } else {
            loadElement.textContent = "در دسترس نیست";
        }
    }

    window.addEventListener("load", () => {
        setTimeout(updateLoadTime, 100);
    });

    setTimeout(updateLoadTime, 1500);


    // ---------- Public IP (External Service) ----------
    const ipElement = $("#public-ip");

    if (ipElement) {
        ipElement.textContent = "در حال بررسی...";

        fetch("https://api.ipify.org?format=json", {
            method: "GET",
            cache: "no-store"
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error("IP lookup failed");
                }
                return response.json();
            })
            .then(data => {
                ipElement.textContent = data.ip || "نامشخص";
            })
            .catch(() => {
                ipElement.textContent = "قابل دریافت نیست";
            });
    }


    // ---------- Mobile Navigation ----------
    const menuButton = $(".menu-toggle");
    const navLinks = $(".nav-links");

    if (menuButton && navLinks) {
        menuButton.setAttribute("aria-expanded", "false");

        menuButton.addEventListener("click", () => {
            const isOpen = navLinks.classList.toggle("active");

            menuButton.setAttribute(
                "aria-expanded",
                String(isOpen)
            );
        });

        navLinks.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", () => {
                navLinks.classList.remove("active");
                menuButton.setAttribute("aria-expanded", "false");
            });
        });
    }


    // ---------- Active Navigation Link ----------
    const currentPage =
        window.location.pathname.split("/").pop() || "index.html";

    document.querySelectorAll(".nav-links a").forEach(link => {
        const href = link.getAttribute("href");

        if (href && href.split("/").pop() === currentPage) {
            link.classList.add("active");
        }
    });


    // ---------- Scroll Reveal ----------
    const revealElements = document.querySelectorAll(
        ".section-title, .dashboard-card, .monitor-item, " +
        ".features-grid > .card, .info-box, .hero-content"
    );

    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver((entries) => {
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


    // ---------- 3D Mouse Tilt ----------
    const tiltElements = document.querySelectorAll(
        ".dashboard-card, .monitor-item, .features-grid > .card"
    );

    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
        tiltElements.forEach(element => {
            element.addEventListener("mousemove", event => {
                const rect = element.getBoundingClientRect();

                const x = event.clientX - rect.left;
                const y = event.clientY - rect.top;

                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const rotateY = ((x - centerX) / centerX) * 5;
                const rotateX = ((centerY - y) / centerY) * 5;

                element.style.transform =
                    `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
            });

            element.addEventListener("mouseleave", () => {
                element.style.transform = "";
            });
        });
    }


    // ---------- Hero Parallax ----------
    const heroVisual = $(".hero-visual");

    if (
        heroVisual &&
        window.matchMedia("(hover: hover) and (pointer: fine)").matches
    ) {
        document.addEventListener("mousemove", event => {
            const x = (event.clientX / window.innerWidth - 0.5) * 10;
            const y = (event.clientY / window.innerHeight - 0.5) * 10;

            heroVisual.style.transform =
                `translate3d(${x}px, ${y}px, 0)`;
        });
    }


    // ---------- Back To Top ----------
    let backToTop = $("#back-to-top");

    if (!backToTop) {
        backToTop = document.createElement("button");
        backToTop.id = "back-to-top";
        backToTop.type = "button";
        backToTop.textContent = "↑";
        backToTop.setAttribute("aria-label", "بازگشت به بالای صفحه");
        document.body.appendChild(backToTop);
    }

    function updateBackToTop() {
        backToTop.classList.toggle(
            "show",
            window.scrollY > 350
        );
    }

    window.addEventListener("scroll", updateBackToTop, {
        passive: true
    });

    updateBackToTop();

    backToTop.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });


    // ---------- System Status ----------
    const siteStatus = $("#site-status");

    if (siteStatus) {
        siteStatus.textContent = "فعال";
    }

    console.log("SanaDemo Ultimate 4.0 initialized successfully.");
});
