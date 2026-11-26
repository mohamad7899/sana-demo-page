
/* ==========================================
   SanaDemo | Ultimate 4.0
   Advanced 3D Dashboard & Device Monitor
========================================== */

(() => {
"use strict";

function startSanaDemo() {

    const $ = (selector, parent = document) =>
        parent.querySelector(selector);

    const $$ = (selector, parent = document) =>
        [...parent.querySelectorAll(selector)];

    /* 1. DEVICE DETECTION */

    function getDeviceType() {
        const ua = navigator.userAgent;

        if (/iPad|Tablet/i.test(ua)) return "تبلت";
        if (/Android|iPhone|iPod|Mobile/i.test(ua))
            return "گوشی موبایل";

        return "کامپیوتر";
    }

    function getOS() {
        const ua = navigator.userAgent;

        if (/Windows/i.test(ua)) return "Windows";
        if (/Android/i.test(ua)) return "Android";
        if (/iPhone|iPad|iPod/i.test(ua)) return "iOS";
        if (/Mac OS|Macintosh/i.test(ua)) return "macOS";
        if (/Linux/i.test(ua)) return "Linux";

        return "نامشخص";
    }

    function getBrowser() {
        const ua = navigator.userAgent;

        if (/Edg/i.test(ua)) return "Microsoft Edge";
        if (/OPR|Opera/i.test(ua)) return "Opera";
        if (/Firefox/i.test(ua)) return "Firefox";
        if (/Chrome/i.test(ua)) return "Google Chrome";
        if (/Safari/i.test(ua)) return "Safari";

        return "نامشخص";
    }

    const deviceType = getDeviceType();

    if ($("#dashboard-device")) {
        $("#dashboard-device").textContent = deviceType;
    }

    /* 2. LIVE CLOCK */

    function updateClock() {
        const now = new Date();

        const clock = $("#live-clock");
        const date = $("#live-date");

        if (clock) {
            clock.textContent =
                new Intl.DateTimeFormat("fa-IR", {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: false
                }).format(now);
        }

        if (date) {
            date.textContent =
                new Intl.DateTimeFormat("fa-IR", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                }).format(now);
        }
    }

    updateClock();
    setInterval(updateClock, 1000);

    /* 3. MONITORING STATUS */

    function updateNetwork() {
        const online = navigator.onLine;

        const status = $("#network-status");
        const connectionType = $("#connection-type");

        if (status) {
            status.textContent = online ? "متصل" : "آفلاین";
            status.dataset.status = online ? "online" : "offline";
        }

        const connection =
            navigator.connection ||
            navigator.mozConnection ||
            navigator.webkitConnection;

        if (connectionType) {
            connectionType.textContent =
                connection?.effectiveType || "نامشخص";
        }

        const deviceOnline = $("#device-online");
        if (deviceOnline) {
            deviceOnline.textContent =
                online ? "متصل" : "آفلاین";
        }

        const deviceNetwork = $("#device-network");
        if (deviceNetwork) {
            deviceNetwork.textContent =
                connection?.effectiveType || "پشتیبانی نمی‌شود";
        }

        const deviceSpeed = $("#device-speed");
        if (deviceSpeed) {
            deviceSpeed.textContent =
                connection?.downlink
                    ? `حدود ${connection.downlink} Mbps`
                    : "نامشخص";
        }
    }

    updateNetwork();

    window.addEventListener("online", updateNetwork);
    window.addEventListener("offline", updateNetwork);

    const networkConnection =
        navigator.connection ||
        navigator.mozConnection ||
        navigator.webkitConnection;

    networkConnection?.addEventListener("change", updateNetwork);

    /* 4. PAGE LOAD TIME */

    function updateLoadTime() {
        const element = $("#page-load-time");
        if (!element) return;

        const timing =
            performance.getEntriesByType("navigation")[0];

        const duration = timing
            ? timing.loadEventEnd - timing.startTime
            : performance.now();

        element.textContent =
            `${Math.max(0, Math.round(duration))} ms`;
    }

    if (document.readyState === "complete") {
        updateLoadTime();
    } else {
        window.addEventListener("load", updateLoadTime, {
            once: true
        });
    }

    /* 5. BROWSER LANGUAGE */

    if ($("#browser-language")) {
        $("#browser-language").textContent =
            navigator.language || "نامشخص";
    }

    /* 6. DEVICE INFORMATION PANEL */

    function createDevicePanel() {
        if ($(".device-section")) return;

        const panel = document.createElement("section");
        panel.className = "device-section reveal";

        panel.innerHTML = `
            <div class="container">
                <div class="section-heading">
                    <span class="section-tag">DEVICE MONITOR</span>
                    <h2>مرکز اطلاعات دستگاه</h2>
                    <p>مشخصات قابل دسترسی از مرورگر</p>
                </div>

                <div class="device-grid">

                    <div class="device-card">
                        <span>نوع دستگاه</span>
                        <strong id="device-type"></strong>
                    </div>

                    <div class="device-card">
                        <span>سیستم‌عامل</span>
                        <strong id="device-os"></strong>
                    </div>

                    <div class="device-card">
                        <span>مرورگر</span>
                        <strong id="device-browser"></strong>
                    </div>

                    <div class="device-card">
                        <span>مدل دستگاه</span>
                        <strong id="device-model">در حال بررسی...</strong>
                    </div>

                    <div class="device-card">
                        <span>اندازه نمایشگر</span>
                        <strong id="device-screen"></strong>
                    </div>

                    <div class="device-card">
                        <span>پردازنده منطقی</span>
                        <strong id="device-cores"></strong>
                    </div>

                    <div class="device-card">
                        <span>وضعیت اینترنت</span>
                        <strong id="device-online"></strong>
                    </div>

                    <div class="device-card">
                        <span>نوع شبکه</span>
                        <strong id="device-network"></strong>
                    </div>

                    <div class="device-card">
                        <span>سرعت تقریبی شبکه</span>
                        <strong id="device-speed"></strong>
                    </div>

                    <div class="device-card">
                        <span>زبان مرورگر</span>
                        <strong id="device-language"></strong>
                    </div>

                    <div class="device-card">
                        <span>IP عمومی</span>
                        <strong id="device-public-ip">در حال دریافت...</strong>
                    </div>

                    <div class="device-card">
                        <span>IP محلی</span>
                        <strong>مستقیماً در دسترس نیست</strong>
                    </div>

                    <div class="device-card">
                        <span>منطقه زمانی</span>
                        <strong id="device-timezone"></strong>
                    </div>

                </div>

                <p class="device-note">
                    اطلاعات فقط از طریق قابلیت‌های مجاز مرورگر دریافت می‌شوند.
                    برای دریافت IP عمومی، درخواست به سرویس خارجی ipify
                    ارسال می‌شود. این سرویس می‌تواند IP را مشاهده کند.
                    SanaDemo اطلاعات را در پایگاه داده خود ذخیره نمی‌کند.
                </p>
            </div>
        `;

        const footer = $("footer");

        if (footer) {
            footer.before(panel);
        } else {
            document.body.appendChild(panel);
        }

        $("#device-type").textContent = deviceType;
        $("#device-os").textContent = getOS();
        $("#device-browser").textContent = getBrowser();

        $("#device-screen").textContent =
            `${screen.width} × ${screen.height}`;

        $("#device-cores").textContent =
            navigator.hardwareConcurrency || "نامشخص";

        $("#device-language").textContent =
            navigator.language || "نامشخص";

        $("#device-timezone").textContent =
            Intl.DateTimeFormat().resolvedOptions().timeZone ||
            "نامشخص";

        updateNetwork();
        getDeviceModel();
        getPublicIP();
    }

    /* 7. DEVICE MODEL */

    async function getDeviceModel() {
        const element = $("#device-model");
        if (!element) return;

        try {
            if (!navigator.userAgentData?.getHighEntropyValues) {
                element.textContent =
                    "مدل دقیق توسط مرورگر اعلام نمی‌شود";
                return;
            }

            const data =
                await navigator.userAgentData.getHighEntropyValues([
                    "model"
                ]);

            element.textContent =
                data.model || "مدل اعلام نشده";

        } catch {
            element.textContent = "در دسترس نیست";
        }
    }

    /* 8. PUBLIC IP */

    async function getPublicIP() {
        const element = $("#device-public-ip");
        if (!element) return;

        try {
            const response = await fetch(
                "https://api.ipify.org?format=json",
                { cache: "no-store" }
            );

            if (!response.ok) throw new Error("IP unavailable");

            const data = await response.json();

            element.textContent = data.ip || "نامشخص";

        } catch {
            element.textContent = "دریافت ناموفق";
        }
    }

    createDevicePanel();

    /* 9. THREE-DIMENSIONAL MONITORING CARDS */

    const style = document.createElement("style");

    style.textContent = `
        .monitor-card,
        .monitor-grid > *,
        .device-card,
        .dashboard-card,
        .feature-card,
        .time-card {
            position: relative;
            transform-style: preserve-3d;
            transition: transform .18s ease, box-shadow .3s ease;
            will-change: transform;
        }

        .monitor-card::after,
        .monitor-grid > *::after {
            content: "";
            position: absolute;
            inset: 0;
            border-radius: inherit;
            pointer-events: none;
            background: radial-gradient(
                circle at var(--glow-x, 50%) var(--glow-y, 50%),
                rgba(0,234,255,.17),
                transparent 60%
            );
        }

        .monitor-card:hover,
        .monitor-grid > *:hover {
            border-color: #00eaff;
            box-shadow:
                0 18px 45px rgba(0,234,255,.16),
                0 0 20px rgba(155,92,255,.12);
        }

        .device-card:hover,
        .dashboard-card:hover {
            border-color: #00eaff;
            box-shadow: 0 15px 40px rgba(0,234,255,.17);
        }

        .monitor-card strong,
        .monitor-card h3,
        .monitor-card p,
        .device-card strong,
        .dashboard-card strong {
            transform: translateZ(25px);
        }

        @media (max-width:760px) {
            .monitor-card,
            .monitor-grid > *,
            .device-card,
            .dashboard-card,
            .feature-card,
            .time-card {
                transform: none !important;
            }
        }
    `;

    document.head.appendChild(style);

    const tiltCards = $$(
        ".monitor-card, .monitor-grid > *, .device-card, " +
        ".dashboard-card, .feature-card, .time-card"
    );

    tiltCards.forEach(card => {
        card.addEventListener("mousemove", event => {
            if (window.innerWidth <= 760) return;

            const rect = card.getBoundingClientRect();

            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;

            const rotateX =
                ((y / rect.height) - .5) * -12;

            const rotateY =
                ((x / rect.width) - .5) * 12;

            card.style.transform =
                `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;

            card.style.setProperty(
                "--glow-x",
                `${x}px`
            );

            card.style.setProperty(
                "--glow-y",
                `${y}px`
            );
        });

        card.addEventListener("mouseleave", () => {
            card.style.transform = "";
        });
    });

    /* 10. HERO PARALLAX */

    const heroVisual = $(".hero-visual");

    if (heroVisual) {
        window.addEventListener("mousemove", event => {
            if (window.innerWidth <= 760) return;

            const x =
                (event.clientX / window.innerWidth - .5) * 12;

            const y =
                (event.clientY / window.innerHeight - .5) * 12;

            heroVisual.style.setProperty("--mouse-x", `${x}px`);
            heroVisual.style.setProperty("--mouse-y", `${y}px`);
        });
    }

    /* 11. SCROLL REVEAL */

    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("active");
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: .12 });

        $$(".reveal").forEach(element => {
            observer.observe(element);
        });
    } else {
        $$(".reveal").forEach(element => {
            element.classList.add("active");
        });
    }

    /* 12. MOBILE MENU */

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
            button.setAttribute(
                "aria-expanded",
                String(opened)
            );
        });

        $$("a", nav).forEach(link => {
            link.addEventListener("click", () => {
                nav.classList.remove("mobile-open");
                button.textContent = "☰";
                button.setAttribute("aria-expanded", "false");
            });
        });
    }

    /* 13. ACTIVE NAVIGATION */

    const currentPage =
        location.pathname.split("/").pop() || "index.html";

    $$("nav a, .nav-links a").forEach(link => {
        const href = link.getAttribute("href");

        if (href === currentPage) {
            link.classList.add("active");
        }
    });

    /* 14. BACK TO TOP */

    if (!$(".back-to-top")) {
        const button = document.createElement("button");

        button.className = "back-to-top";
        button.type = "button";
        button.textContent = "↑";
        button.setAttribute("aria-label", "بازگشت به بالا");

        document.body.appendChild(button);

        window.addEventListener("scroll", () => {
            button.classList.toggle("show", window.scrollY > 350);
        });

        button.addEventListener("click", () => {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });
    }

    console.log("SanaDemo Ultimate 4.0 is running!");

}

if (document.readyState === "loading") {
    document.addEventListener(
        "DOMContentLoaded",
        startSanaDemo,
        { once: true }
    );
} else {
    startSanaDemo();
}

})();
