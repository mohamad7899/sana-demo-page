
/* =========================================
   SanaDemo Ultimate 5.0
   3D Clock + Persian Calendar + Device Monitor
========================================= */

(() => {
"use strict";

function initSanaDemo() {

const $ = (s, p = document) => p.querySelector(s);
const $$ = (s, p = document) => [...p.querySelectorAll(s)];

/* 1. DASHBOARD */

const siteStatus = $("#site-status");
const dashboardDevice = $("#dashboard-device");

if (siteStatus) siteStatus.textContent = "فعال";

/* 2. LIVE CLOCK AND PERSIAN DATE */

function createClock() {
    if ($(".sana-time-widget")) return;

    const widget = document.createElement("section");
    widget.className = "sana-time-widget reveal";

    widget.innerHTML = `
        <div class="container">

            <div class="section-heading">
                <span class="section-tag">LIVE TIME SYSTEM</span>
                <h2>زمان زنده SanaDemo</h2>
                <p>ساعت و تقویم زنده بر اساس زمان دستگاه</p>
            </div>

            <div class="time-grid">

                <div class="time-card clock-card">
                    <div class="time-icon">◷</div>
                    <span class="time-label">ساعت محلی</span>

                    <div class="digital-clock" id="live-clock">
                        --:--:--
                    </div>

                    <div class="clock-status">
                        <span class="live-dot"></span>
                        LIVE
                    </div>

                    <div class="clock-zone" id="clock-zone">
                        در حال دریافت منطقه زمانی...
                    </div>
                </div>

                <div class="time-card calendar-card">
                    <div class="time-icon">▦</div>
                    <span class="time-label">تقویم شمسی</span>

                    <div class="calendar-day" id="calendar-day">
                        --
                    </div>

                    <div class="calendar-date" id="live-date">
                        در حال دریافت تاریخ...
                    </div>

                    <div class="calendar-year" id="calendar-year">
                        --
                    </div>
                </div>

            </div>
        </div>
    `;

    const dashboard = $(".dashboard-section");

    if (dashboard) {
        dashboard.after(widget);
    } else {
        const footer = $("footer");
        if (footer) footer.before(widget);
        else document.body.appendChild(widget);
    }
}

createClock();

const clock = $("#live-clock");
const date = $("#live-date");
const calendarDay = $("#calendar-day");
const calendarYear = $("#calendar-year");
const clockZone = $("#clock-zone");

function updateClock() {
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
            year: "numeric",
            month: "long",
            day: "numeric"
        }).format(now);
    }

    if (calendarDay) {
        calendarDay.textContent = new Intl.DateTimeFormat("fa-IR", {
            weekday: "long"
        }).format(now);
    }

    if (calendarYear) {
        calendarYear.textContent =
            new Intl.DateTimeFormat("fa-IR", {
                year: "numeric"
            }).format(now);
    }

    if (clockZone) {
        clockZone.textContent =
            Intl.DateTimeFormat().resolvedOptions().timeZone ||
            "منطقه زمانی نامشخص";
    }
}

updateClock();
setInterval(updateClock, 1000);

/* 3. DEVICE INFORMATION */

function detectDevice() {
    const ua = navigator.userAgent;

    if (/iPad|Tablet/i.test(ua)) return "تبلت";
    if (/Android|iPhone|iPod|Mobile/i.test(ua)) return "موبایل";

    return "کامپیوتر";
}

function detectOS() {
    const ua = navigator.userAgent;

    if (/Windows/i.test(ua)) return "Windows";
    if (/Android/i.test(ua)) return "Android";
    if (/iPhone|iPad|iPod/i.test(ua)) return "iOS";
    if (/Macintosh|Mac OS/i.test(ua)) return "macOS";
    if (/Linux/i.test(ua)) return "Linux";

    return "نامشخص";
}

function detectBrowser() {
    const ua = navigator.userAgent;

    if (/Edg/i.test(ua)) return "Microsoft Edge";
    if (/OPR|Opera/i.test(ua)) return "Opera";
    if (/Firefox/i.test(ua)) return "Firefox";
    if (/Chrome/i.test(ua)) return "Google Chrome";
    if (/Safari/i.test(ua)) return "Safari";

    return "نامشخص";
}

const deviceType = detectDevice();

if (dashboardDevice) {
    dashboardDevice.textContent = deviceType;
}

/* 4. DEVICE PANEL */

function createDevicePanel() {
    if ($(".device-section")) return;

    const panel = document.createElement("section");
    panel.className = "device-section reveal active";

    panel.innerHTML = `
        <div class="container">

            <div class="section-heading">
                <span class="section-tag">DEVICE MONITOR</span>
                <h2>مرکز اطلاعات دستگاه</h2>
                <p>اطلاعات قابل دسترسی مرورگر</p>
            </div>

            <div class="device-grid">

                <div class="device-card">
                    <span>نوع دستگاه</span>
                    <strong id="device-type">--</strong>
                </div>

                <div class="device-card">
                    <span>سیستم‌عامل</span>
                    <strong id="device-os">--</strong>
                </div>

                <div class="device-card">
                    <span>مرورگر</span>
                    <strong id="device-browser">--</strong>
                </div>

                <div class="device-card">
                    <span>مدل دستگاه</span>
                    <strong id="device-model">در حال بررسی...</strong>
                </div>

                <div class="device-card">
                    <span>اندازه صفحه</span>
                    <strong id="device-screen">--</strong>
                </div>

                <div class="device-card">
                    <span>پردازنده منطقی</span>
                    <strong id="device-cores">--</strong>
                </div>

                <div class="device-card">
                    <span>وضعیت اینترنت</span>
                    <strong id="device-online">--</strong>
                </div>

                <div class="device-card">
                    <span>نوع اتصال</span>
                    <strong id="device-network">--</strong>
                </div>

                <div class="device-card">
                    <span>سرعت تقریبی شبکه</span>
                    <strong id="device-speed">--</strong>
                </div>

                <div class="device-card">
                    <span>زبان مرورگر</span>
                    <strong id="device-language">--</strong>
                </div>

                <div class="device-card">
                    <span>IP عمومی</span>
                    <strong id="device-public-ip">در حال بررسی...</strong>
                </div>

                <div class="device-card">
                    <span>IP محلی</span>
                    <strong>مستقیماً در دسترس نیست</strong>
                </div>

                <div class="device-card">
                    <span>منطقه زمانی</span>
                    <strong id="device-timezone">--</strong>
                </div>

            </div>

            <p class="device-note">
                اطلاعات مدل و شبکه به پشتیبانی مرورگر بستگی دارد.
                برای دریافت IP عمومی، درخواست به سرویس خارجی ipify
                ارسال می‌شود و آن سرویس می‌تواند IP را مشاهده کند.
                این سایت IP را در پایگاه داده خود ذخیره نمی‌کند.
            </p>

        </div>
    `;

    const footer = $("footer");

    if (footer) footer.before(panel);
    else document.body.appendChild(panel);

    $("#device-type").textContent = deviceType;
    $("#device-os").textContent = detectOS();
    $("#device-browser").textContent = detectBrowser();

    $("#device-screen").textContent =
        `${screen.width} × ${screen.height}`;

    $("#device-cores").textContent =
        navigator.hardwareConcurrency || "نامشخص";

    $("#device-language").textContent =
        navigator.language || "نامشخص";

    $("#device-timezone").textContent =
        Intl.DateTimeFormat().resolvedOptions().timeZone || "نامشخص";

    updateNetwork();
    getDeviceModel();
    getPublicIP();
}

async function getDeviceModel() {
    const element = $("#device-model");

    if (!element) return;

    try {
        if (!navigator.userAgentData?.getHighEntropyValues) {
            element.textContent = "مدل دقیق توسط مرورگر اعلام نمی‌شود";
            return;
        }

        const data =
            await navigator.userAgentData.getHighEntropyValues([
                "model"
            ]);

        element.textContent = data.model || "مدل اعلام نشده";

    } catch {
        element.textContent = "در دسترس نیست";
    }
}

/* 5. PUBLIC IP */

async function getPublicIP() {
    const element = $("#device-public-ip");
    if (!element) return;

    try {
        const response = await fetch(
            "https://api.ipify.org?format=json",
            { cache: "no-store" }
        );

        if (!response.ok) throw new Error("IP error");

        const data = await response.json();

        element.textContent = data.ip || "نامشخص";

    } catch {
        element.textContent = "دریافت ناموفق";
    }
}

/* 6. NETWORK MONITOR */

function updateNetwork() {
    const online = navigator.onLine;

    const networkStatus = $("#network-status");
    const connectionType = $("#connection-type");
    const deviceOnline = $("#device-online");
    const deviceNetwork = $("#device-network");
    const deviceSpeed = $("#device-speed");

    const connection =
        navigator.connection ||
        navigator.mozConnection ||
        navigator.webkitConnection;

    if (networkStatus) {
        networkStatus.textContent =
            online ? "متصل" : "آفلاین";
    }

    if (deviceOnline) {
        deviceOnline.textContent =
            online ? "متصل" : "آفلاین";
    }

    if (connection) {
        const type = connection.effectiveType || "نامشخص";

        if (connectionType) {
            connectionType.textContent = type;
        }

        if (deviceNetwork) {
            deviceNetwork.textContent = type;
        }

        if (deviceSpeed) {
            deviceSpeed.textContent =
                connection.downlink
                    ? `حدود ${connection.downlink} Mbps`
                    : "نامشخص";
        }
    } else {
        if (connectionType) {
            connectionType.textContent = "نامشخص";
        }

        if (deviceNetwork) {
            deviceNetwork.textContent = "پشتیبانی نمی‌شود";
        }

        if (deviceSpeed) {
            deviceSpeed.textContent = "پشتیبانی نمی‌شود";
        }
    }
}

updateNetwork();

window.addEventListener("online", updateNetwork);
window.addEventListener("offline", updateNetwork);

const connection =
    navigator.connection ||
    navigator.mozConnection ||
    navigator.webkitConnection;

if (connection) {
    connection.addEventListener("change", updateNetwork);
}

/* 7. BROWSER LANGUAGE */

const browserLanguage = $("#browser-language");

if (browserLanguage) {
    browserLanguage.textContent =
        navigator.language || "نامشخص";
}

/* 8. PAGE LOAD TIME */

const pageLoadTime = $("#page-load-time");

if (pageLoadTime) {
    function showLoadTime() {
        const timing =
            performance.getEntriesByType("navigation")[0];

        const duration = timing
            ? timing.loadEventEnd - timing.startTime
            : performance.now();

        pageLoadTime.textContent =
            `${Math.round(Math.max(0, duration))} ms`;
    }

    if (document.readyState === "complete") {
        showLoadTime();
    } else {
        window.addEventListener("load", showLoadTime, { once: true });
    }
}

createDevicePanel();

/* 9. 3D TILT */

$$(".feature-card, .dashboard-card, .monitor-card, .time-card")
.forEach(card => {

    card.addEventListener("mousemove", event => {
        if (matchMedia("(max-width: 760px)").matches) return;

        const rect = card.getBoundingClientRect();

        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        const rotateX =
            ((y - rect.height / 2) / (rect.height / 2)) * -7;

        const rotateY =
            ((x - rect.width / 2) / (rect.width / 2)) * 7;

        card.style.transform =
            `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
    });

    card.addEventListener("mouseleave", () => {
        card.style.transform = "";
    });

});

/* 10. MOUSE NEON */

if (!$(".neon-pointer")) {
    const pointer = document.createElement("div");

    pointer.className = "neon-pointer";

    Object.assign(pointer.style, {
        position: "fixed",
        width: "260px",
        height: "260px",
        borderRadius: "50%",
        pointerEvents: "none",
        zIndex: "0",
        background: "radial-gradient(circle, rgba(0,220,255,.10), transparent 70%)",
        transform: "translate(-50%, -50%)",
        left: "-500px",
        top: "-500px"
    });

    document.body.appendChild(pointer);

    window.addEventListener("mousemove", event => {
        pointer.style.left = event.clientX + "px";
        pointer.style.top = event.clientY + "px";
    });
}

/* 11. HERO PARALLAX */

const heroVisual = $(".hero-visual");

if (heroVisual) {
    window.addEventListener("mousemove", event => {
        if (matchMedia("(max-width: 760px)").matches) return;

        const x = (event.clientX / innerWidth - 0.5) * 12;
        const y = (event.clientY / innerHeight - 0.5) * 12;

        heroVisual.style.setProperty("--mouse-x", `${x}px`);
        heroVisual.style.setProperty("--mouse-y", `${y}px`);
    });
}

/* 12. SCROLL REVEAL */

if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("active");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    $$(".reveal").forEach(element => observer.observe(element));
} else {
    $$(".reveal").forEach(element => element.classList.add("active"));
}

/* 13. MOBILE MENU */

const nav = $(".navbar .nav-links") || $(".navbar nav");
const navContent = $(".navbar .nav-content");

if (nav && navContent && !$(".mobile-menu-btn")) {
    const button = document.createElement("button");

    button.className = "mobile-menu-btn";
    button.type = "button";
    button.textContent = "☰";
    button.setAttribute("aria-label", "باز کردن منو");
    button.setAttribute("aria-expanded", "false");

    navContent.appendChild(button);

    button.addEventListener("click", () => {
        const opened = nav.classList.toggle("mobile-open");

        button.textContent = opened ? "✕" : "☰";
        button.setAttribute("aria-expanded", String(opened));
    });

    $$("a", nav).forEach(link => {
        link.addEventListener("click", () => {
            nav.classList.remove("mobile-open");
            button.textContent = "☰";
            button.setAttribute("aria-expanded", "false");
        });
    });
}

/* 14. ACTIVE PAGE */

const currentPage =
    location.pathname.split("/").pop() || "index.html";

$$("nav a, .nav-links a").forEach(link => {
    if (link.getAttribute("href") === currentPage) {
        link.classList.add("active");
    }
});

/* 15. BACK TO TOP */

if (!$(".back-to-top")) {
    const button = document.createElement("button");

    button.className = "back-to-top";
    button.type = "button";
    button.textContent = "↑";
    button.setAttribute("aria-label", "بازگشت به بالا");

    document.body.appendChild(button);

    window.addEventListener("scroll", () => {
        button.classList.toggle("show", scrollY > 400);
    });

    button.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
}

console.log("SanaDemo Ultimate 5.0 is ready!");

}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initSanaDemo, {
        once: true
    });
} else {
    initSanaDemo();
}

})();
