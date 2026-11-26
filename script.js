/* =========================================
   SanaDemo Ultimate 4.0
   Dashboard + 3D + Device Information
========================================= */

document.addEventListener("DOMContentLoaded", () => {
    const $ = (selector, parent = document) =>
        parent.querySelector(selector);

    const $$ = (selector, parent = document) =>
        [...parent.querySelectorAll(selector)];

    /* 1. Site status */
    const siteStatus = $("#site-status");

    if (siteStatus) {
        siteStatus.textContent = "فعال";
    }

    /* 2. Live clock and date */
    const clock = $("#live-clock");
    const date = $("#live-date");

    function updateDateTime() {
        const now = new Date();

        if (clock) {
            clock.textContent = now.toLocaleTimeString("fa-IR");
        }

        if (date) {
            date.textContent = now.toLocaleDateString("fa-IR", {
                year: "numeric",
                month: "long",
                day: "numeric"
            });
        }
    }

    updateDateTime();
    setInterval(updateDateTime, 1000);

    /* 3. Network status */
    const networkStatus = $("#network-status");
    const connectionType = $("#connection-type");

    function updateNetwork() {
        if (networkStatus) {
            networkStatus.textContent =
                navigator.onLine ? "متصل" : "آفلاین";
        }

        if (connectionType) {
            const connection =
                navigator.connection ||
                navigator.mozConnection ||
                navigator.webkitConnection;

            connectionType.textContent =
                connection?.effectiveType || "نامشخص";
        }
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

    /* 4. Browser information */
    const browserLanguage = $("#browser-language");

    if (browserLanguage) {
        browserLanguage.textContent =
            navigator.language || "نامشخص";
    }

    /* 5. Page loading time */
    const pageLoadTime = $("#page-load-time");

    if (pageLoadTime) {
        window.addEventListener("load", () => {
            const timing = performance.getEntriesByType("navigation")[0];

            const duration = timing
                ? Math.round(timing.loadEventEnd - timing.startTime)
                : Math.round(performance.now());

            pageLoadTime.textContent =
                `${Math.max(0, duration)} میلی‌ثانیه`;
        });
    }

    /* 6. Device detection */
    function detectDevice() {
        const ua = navigator.userAgent;

        if (/iPad|Tablet/i.test(ua)) {
            return "تبلت";
        }

        if (/Android|iPhone|iPod|Mobile/i.test(ua)) {
            return "موبایل";
        }

        return "کامپیوتر";
    }

    function detectOS() {
        const ua = navigator.userAgent;

        if (/Windows/i.test(ua)) return "Windows";
        if (/Android/i.test(ua)) return "Android";
        if (/iPhone|iPad|iPod/i.test(ua)) return "iOS";
        if (/Mac OS/i.test(ua)) return "macOS";
        if (/Linux/i.test(ua)) return "Linux";

        return "نامشخص";
    }

    function detectBrowser() {
        const ua = navigator.userAgent;

        if (/Edg/i.test(ua)) return "Microsoft Edge";
        if (/OPR|Opera/i.test(ua)) return "Opera";
        if (/Chrome/i.test(ua) && !/Edg/i.test(ua)) return "Chrome";
        if (/Firefox/i.test(ua)) return "Firefox";
        if (/Safari/i.test(ua) && !/Chrome/i.test(ua)) return "Safari";

        return "نامشخص";
    }

    const deviceType = detectDevice();

    const dashboardDevice = $("#dashboard-device");

    if (dashboardDevice) {
        dashboardDevice.textContent = deviceType;
    }

    /* 7. Optional device model information */
    async function getDeviceModel() {
        if (!navigator.userAgentData?.getHighEntropyValues) {
            return "در دسترس نیست";
        }

        try {
            const info =
                await navigator.userAgentData.getHighEntropyValues([
                    "model"
                ]);

            return info.model || "اعلام نشده";
        } catch {
            return "در دسترس نیست";
        }
    }

    /* 8. Device information panel */
    function createDevicePanel() {
        if ($(".device-section")) return;

        const panel = document.createElement("section");

        panel.className = "device-section reveal";

        panel.innerHTML = `
            <div class="container">
                <div class="section-heading">
                    <span class="section-tag">DEVICE MONITOR</span>
                    <h2>اطلاعات دستگاه شما</h2>
                    <p>اطلاعاتی که مرورگر اجازه نمایش آن‌ها را می‌دهد</p>
                </div>

                <div class="device-grid">

                    <div class="device-card">
                        <span>نوع دستگاه</span>
                        <strong id="device-type">در حال بررسی...</strong>
                    </div>

                    <div class="device-card">
                        <span>سیستم‌عامل</span>
                        <strong id="device-os">در حال بررسی...</strong>
                    </div>

                    <div class="device-card">
                        <span>مرورگر</span>
                        <strong id="device-browser">در حال بررسی...</strong>
                    </div>

                    <div class="device-card">
                        <span>مدل دستگاه</span>
                        <strong id="device-model">در حال بررسی...</strong>
                    </div>

                    <div class="device-card">
                        <span>اندازه صفحه</span>
                        <strong id="device-screen">در حال بررسی...</strong>
                    </div>

                    <div class="device-card">
                        <span>تعداد پردازنده‌های منطقی</span>
                        <strong id="device-cores">در حال بررسی...</strong>
                    </div>

                    <div class="device-card">
                        <span>IP عمومی</span>
                        <strong id="device-public-ip">در حال بررسی...</strong>
                    </div>

                    <div class="device-card">
                        <span>IP محلی</span>
                        <strong>مستقیماً در دسترس نیست</strong>
                    </div>

                </div>

                <p class="device-note">
                    نکته حریم خصوصی: برای نمایش IP عمومی، درخواست به سرویس
                    خارجی ipify ارسال می‌شود. این سرویس ممکن است IP درخواست
                    را دریافت و ثبت کند. این سایت IP را در پایگاه داده خود
                    ذخیره نمی‌کند. مدل دستگاه نیز فقط در صورت پشتیبانی مرورگر
                    نمایش داده می‌شود.
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
        $("#device-os").textContent = detectOS();
        $("#device-browser").textContent = detectBrowser();

        $("#device-screen").textContent =
            `${screen.width} × ${screen.height}`;

        $("#device-cores").textContent =
            navigator.hardwareConcurrency || "نامشخص";

        getDeviceModel().then(model => {
            const element = $("#device-model");
            if (element) element.textContent = model;
        });

        /* Public IP through an external service */
        const ipElement = $("#device-public-ip");

        fetch("https://api.ipify.org?format=json", {
            cache: "no-store"
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error("IP request failed");
                }

                return response.json();
            })
            .then(data => {
                if (ipElement) {
                    ipElement.textContent = data.ip || "نامشخص";
                }
            })
            .catch(() => {
                if (ipElement) {
                    ipElement.textContent = "قابل دریافت نیست";
                }
            });
    }

    createDevicePanel();

    /* 9. 3D card tilt */
    const cards = $$(".feature-card, .dashboard-card, .monitor-card");

    cards.forEach(card => {
        card.addEventListener("mousemove", event => {
            if (window.matchMedia("(max-width: 760px)").matches) {
                return;
            }

            const rect = card.getBoundingClientRect();

            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -7;
            const rotateY = ((x - centerX) / centerX) * 7;

            card.style.transform =
                `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
        });

        card.addEventListener("mouseleave", () => {
            card.style.transform = "";
        });
    });

    /* 10. Mouse neon effect */
    const pointer = document.createElement("div");

    pointer.className = "neon-pointer";

    Object.assign(pointer.style, {
        position: "fixed",
        width: "260px",
        height: "260px",
        borderRadius: "50%",
        pointerEvents: "none",
        zIndex: "0",
        background: "radial-gradient(circle, rgba(0,220,255,.09), transparent 70%)",
        transform: "translate(-50%, -50%)",
        left: "-500px",
        top: "-500px"
    });

    document.body.appendChild(pointer);

    window.addEventListener("mousemove", event => {
        pointer.style.left = `${event.clientX}px`;
        pointer.style.top = `${event.clientY}px`;
    });

    /* 11. Hero parallax */
    const heroVisual = $(".hero-visual");

    if (heroVisual) {
        window.addEventListener("mousemove", event => {
            if (window.matchMedia("(max-width: 760px)").matches) {
                return;
            }

            const x = (event.clientX / window.innerWidth - 0.5) * 12;
            const y = (event.clientY / window.innerHeight - 0.5) * 12;

            heroVisual.style.setProperty("--mouse-x", `${x}px`);
            heroVisual.style.setProperty("--mouse-y", `${y}px`);
        });
    }

    /* 12. Scroll reveal */
    const revealElements = $$(".reveal");

    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("active");
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.12
        });

        revealElements.forEach(element => {
            observer.observe(element);
        });
    } else {
        revealElements.forEach(element => {
            element.classList.add("active");
        });
    }

    /* 13. Mobile navigation */
    const nav = $(".navbar .nav-links, .navbar nav");
    const navContent = $(".navbar .nav-content");

    if (nav && navContent && !$(".mobile-menu-btn")) {
        const menuButton = document.createElement("button");

        menuButton.className = "mobile-menu-btn";
        menuButton.type = "button";
        menuButton.setAttribute("aria-label", "باز کردن منو");
        menuButton.setAttribute("aria-expanded", "false");
        menuButton.textContent = "☰";

        navContent.appendChild(menuButton);

        menuButton.addEventListener("click", () => {
            const isOpen = nav.classList.toggle("mobile-open");

            menuButton.textContent = isOpen ? "✕" : "☰";
            menuButton.setAttribute("aria-expanded", String(isOpen));
        });

        $$(".nav-links a, nav a").forEach(link => {
            link.addEventListener("click", () => {
                nav.classList.remove("mobile-open");
                menuButton.textContent = "☰";
                menuButton.setAttribute("aria-expanded", "false");
            });
        });
    }

    /* 14. Active navigation link */
    const currentPage =
        location.pathname.split("/").pop() || "index.html";

    $$(".nav-links a, nav a").forEach(link => {
        const href = link.getAttribute("href");

        if (href === currentPage) {
            link.classList.add("active");
        }
    });

    /* 15. Back to top */
    const topButton = document.createElement("button");

    topButton.className = "back-to-top";
    topButton.type = "button";
    topButton.textContent = "↑";
    topButton.setAttribute("aria-label", "بازگشت به بالای صفحه");

    document.body.appendChild(topButton);

    window.addEventListener("scroll", () => {
        topButton.classList.toggle("show", window.scrollY > 400);
    });

    topButton.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });

    console.log("SanaDemo Ultimate 4.0 is ready!");
});
