
document.addEventListener("DOMContentLoaded", () => {

    // =========================================
    // 1. GLOBAL NEON POINTER
    // =========================================

    document.addEventListener("pointermove", (event) => {
        document.documentElement.style.setProperty("--pointer-x", `${event.clientX}px`);
        document.documentElement.style.setProperty("--pointer-y", `${event.clientY}px`);
    });


    // =========================================
    // 2. 3D CARD TILT
    // =========================================

    document.querySelectorAll(".card").forEach((card) => {

        card.addEventListener("pointermove", (event) => {
            if (event.pointerType === "touch") return;

            const rect = card.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;

            const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * 10;
            const rotateX = ((rect.height / 2 - y) / (rect.height / 2)) * 10;

            card.style.setProperty("--rotate-x", `${rotateX}deg`);
            card.style.setProperty("--rotate-y", `${rotateY}deg`);
            card.style.setProperty("--mouse-x", `${x}px`);
            card.style.setProperty("--mouse-y", `${y}px`);

            card.classList.add("card-active");
        });

        card.addEventListener("pointerleave", () => {
            card.style.setProperty("--rotate-x", "0deg");
            card.style.setProperty("--rotate-y", "0deg");
            card.classList.remove("card-active");
        });

    });


    // =========================================
    // 3. HERO 3D PARALLAX
    // =========================================

    const heroVisual = document.querySelector(".hero-visual");

    if (heroVisual) {
        heroVisual.addEventListener("pointermove", (event) => {
            if (event.pointerType === "touch") return;

            const rect = heroVisual.getBoundingClientRect();
            const x = (event.clientX - rect.left) / rect.width;
            const y = (event.clientY - rect.top) / rect.height;

            heroVisual.style.setProperty("--hero-rotate-x", `${(0.5 - y) * 20}deg`);
            heroVisual.style.setProperty("--hero-rotate-y", `${(x - 0.5) * 20}deg`);
        });

        heroVisual.addEventListener("pointerleave", () => {
            heroVisual.style.setProperty("--hero-rotate-x", "0deg");
            heroVisual.style.setProperty("--hero-rotate-y", "0deg");
        });
    }


    // =========================================
    // 4. FLOATING ELEMENTS
    // =========================================

    document.querySelectorAll(".float-3d, .hero-orb").forEach((element, index) => {
        element.style.setProperty("--float-delay", `${index * 0.4}s`);
    });


    // =========================================
    // 5. SCROLL REVEAL
    // =========================================

    const revealElements = document.querySelectorAll(
        ".card, .section-title, .info-box, .page-header, .hero-content"
    );

    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("revealed");
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12 });

        revealElements.forEach((element, index) => {
            element.classList.add("reveal");
            element.style.setProperty("--reveal-delay", `${(index % 4) * 0.12}s`);
            observer.observe(element);
        });
    } else {
        revealElements.forEach(element => element.classList.add("revealed"));
    }


    // =========================================
    // 6. BACK TO TOP
    // =========================================

    const backToTop = document.createElement("button");
    backToTop.className = "back-to-top";
    backToTop.type = "button";
    backToTop.textContent = "↑";
    backToTop.setAttribute("aria-label", "بازگشت به بالای صفحه");
    document.body.appendChild(backToTop);

    window.addEventListener("scroll", () => {
        backToTop.classList.toggle("show", window.scrollY > 400);
    });

    backToTop.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });


    // =========================================
    // 7. MOBILE NAVIGATION
    // =========================================

    const nav = document.querySelector(".navbar .nav-links, .navbar nav");
    const navContainer = document.querySelector(".navbar .nav-content");

    if (nav && navContainer) {
        const menuButton = document.createElement("button");
        menuButton.className = "mobile-menu-button";
        menuButton.type = "button";
        menuButton.textContent = "☰";
        menuButton.setAttribute("aria-label", "باز کردن منو");
        menuButton.setAttribute("aria-expanded", "false");

        navContainer.appendChild(menuButton);

        menuButton.addEventListener("click", () => {
            const isOpen = nav.classList.toggle("mobile-open");
            menuButton.textContent = isOpen ? "✕" : "☰";
            menuButton.setAttribute("aria-expanded", String(isOpen));
        });

        nav.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", () => {
                nav.classList.remove("mobile-open");
                menuButton.textContent = "☰";
                menuButton.setAttribute("aria-expanded", "false");
            });
        });
    }


    // =========================================
    // 8. ACTIVE PAGE LINK
    // =========================================

    const currentPage = location.pathname.split("/").pop() || "index.html";

    document.querySelectorAll(".nav-links a, .navbar nav a").forEach(link => {
        if (link.getAttribute("href") === currentPage) {
            link.classList.add("active");
            link.setAttribute("aria-current", "page");
        }
    });


    // =========================================
    // 9. DEVICE INFORMATION PANEL
    // =========================================

    const deviceSection = document.createElement("section");
    deviceSection.className = "device-section";

    deviceSection.innerHTML = `
        <div class="container">
            <div class="device-panel">
                <h2>📱 اطلاعات دستگاه و شبکه</h2>
                <p>اطلاعات قابل‌دسترسی دستگاه فعلی</p>

                <div class="device-grid">

                    <div class="device-item">
                        <span>IP عمومی</span>
                        <strong id="device-public-ip">در حال بررسی...</strong>
                    </div>

                    <div class="device-item">
                        <span>IP محلی</span>
                        <strong id="device-local-ip">در دسترس نیست</strong>
                    </div>

                    <div class="device-item">
                        <span>نوع دستگاه</span>
                        <strong id="device-type">در حال بررسی...</strong>
                    </div>

                    <div class="device-item">
                        <span>مدل دستگاه</span>
                        <strong id="device-model">نامشخص</strong>
                    </div>

                    <div class="device-item">
                        <span>سیستم‌عامل</span>
                        <strong id="device-os">در حال بررسی...</strong>
                    </div>

                    <div class="device-item">
                        <span>مرورگر</span>
                        <strong id="device-browser">در حال بررسی...</strong>
                    </div>

                    <div class="device-item">
                        <span>اندازه صفحه</span>
                        <strong id="device-screen">در حال بررسی...</strong>
                    </div>

                    <div class="device-item">
                        <span>هسته‌های پردازنده</span>
                        <strong id="device-cores">نامشخص</strong>
                    </div>

                </div>

                <small>
                    اطلاعات دستگاه در این صفحه ذخیره نمی‌شود.
                    برای دریافت IP عمومی، درخواست به سرویس خارجی ارسال می‌شود.
                </small>
            </div>
        </div>
    `;

    const footer = document.querySelector("footer");

    if (footer) {
        document.body.insertBefore(deviceSection, footer);
    } else {
        document.body.appendChild(deviceSection);
    }


    // =========================================
    // 10. DEVICE DETECTION
    // =========================================

    const ua = navigator.userAgent;

    let deviceType = "کامپیوتر";

    if (/iPad|Tablet/i.test(ua)) {
        deviceType = "تبلت";
    } else if (/Mobile|Android|iPhone|iPod/i.test(ua)) {
        deviceType = "موبایل";
    }

    let operatingSystem = "نامشخص";

    if (/Android/i.test(ua)) {
        operatingSystem = "Android";
    } else if (/iPhone|iPad|iPod/i.test(ua)) {
        operatingSystem = "iOS / iPadOS";
    } else if (/Windows/i.test(ua)) {
        operatingSystem = "Windows";
    } else if (/Mac OS|Macintosh/i.test(ua)) {
        operatingSystem = "macOS";
    } else if (/Linux/i.test(ua)) {
        operatingSystem = "Linux";
    }

    let browser = "نامشخص";

    if (/Edg/i.test(ua)) {
        browser = "Microsoft Edge";
    } else if (/OPR|Opera/i.test(ua)) {
        browser = "Opera";
    } else if (/SamsungBrowser/i.test(ua)) {
        browser = "Samsung Internet";
    } else if (/Firefox/i.test(ua)) {
        browser = "Mozilla Firefox";
    } else if (/CriOS|Chrome/i.test(ua)) {
        browser = "Google Chrome";
    } else if (/Safari/i.test(ua)) {
        browser = "Safari";
    }

    let model = "قابل تشخیص نیست";

    const androidMatch = ua.match(/Android[^;]*;\s*([^;)]+)/i);

    if (androidMatch && androidMatch[1]) {
        model = androidMatch[1].replace(/Build\/.*/i, "").trim();
    } else if (/iPhone/i.test(ua)) {
        model = "Apple iPhone";
    } else if (/iPad/i.test(ua)) {
        model = "Apple iPad";
    }

    document.getElementById("device-type").textContent = deviceType;
    document.getElementById("device-os").textContent = operatingSystem;
    document.getElementById("device-browser").textContent = browser;
    document.getElementById("device-model").textContent = model;

    document.getElementById("device-screen").textContent =
        `${screen.width} × ${screen.height} پیکسل`;

    document.getElementById("device-cores").textContent =
        navigator.hardwareConcurrency
            ? `${navigator.hardwareConcurrency} هسته`
            : "نامشخص";


    // =========================================
    // 11. OPTIONAL DEVICE MODEL API
    // =========================================

    if (
        navigator.userAgentData &&
        typeof navigator.userAgentData.getHighEntropyValues === "function"
    ) {
        navigator.userAgentData.getHighEntropyValues([
            "model",
            "platform",
            "platformVersion"
        ]).then(data => {

            if (data.model) {
                document.getElementById("device-model").textContent = data.model;
            }

            if (data.platform) {
                document.getElementById("device-os").textContent =
                    data.platform +
                    (data.platformVersion ? " " + data.platformVersion : "");
            }

        }).catch(() => {});
    }


    // =========================================
    // 12. PUBLIC IP
    // =========================================

    const publicIPElement = document.getElementById("device-public-ip");

    fetch("https://api.ipify.org?format=json", {
        method: "GET",
        cache: "no-store"
    })
    .then(response => {
        if (!response.ok) throw new Error("IP service unavailable");
        return response.json();
    })
    .then(data => {
        publicIPElement.textContent = data.ip || "دریافت نشد";
    })
    .catch(() => {
        publicIPElement.textContent = "دریافت نشد";
    });


    // =========================================
    // 13. LOCAL IP
    // =========================================

    // مرورگرهای جدید معمولاً IP محلی را در اختیار سایت نمی‌گذارند.
    // برای حفظ حریم خصوصی، از روش‌های دور زدن محدودیت مرورگر استفاده نمی‌کنیم.

    document.getElementById("device-local-ip").textContent =
        "مرورگر دسترسی مستقیم نمی‌دهد";


    // =========================================
    // 14. READY
    // =========================================

    document.body.classList.add("sana-ready");

    console.log("SanaDemo Ultimate 3D is ready!");
    console.log("Device information panel is active!");

});
