
document.addEventListener("DOMContentLoaded", () => {

    // =========================================
    // 1. GLOBAL NEON POINTER
    // =========================================

    document.addEventListener("pointermove", (event) => {
        document.documentElement.style.setProperty(
            "--pointer-x",
            `${event.clientX}px`
        );

        document.documentElement.style.setProperty(
            "--pointer-y",
            `${event.clientY}px`
        );
    });


    // =========================================
    // 2. 3D CARD TILT
    // =========================================

    const cards = document.querySelectorAll(".card");

    cards.forEach((card) => {

        card.addEventListener("pointermove", (event) => {

            if (event.pointerType === "touch") return;

            const rect = card.getBoundingClientRect();

            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateY = ((x - centerX) / centerX) * 10;
            const rotateX = ((centerY - y) / centerY) * 10;

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

            const rotateY = (x - 0.5) * 20;
            const rotateX = (0.5 - y) * 20;

            heroVisual.style.setProperty(
                "--hero-rotate-x",
                `${rotateX}deg`
            );

            heroVisual.style.setProperty(
                "--hero-rotate-y",
                `${rotateY}deg`
            );

        });

        heroVisual.addEventListener("pointerleave", () => {

            heroVisual.style.setProperty("--hero-rotate-x", "0deg");
            heroVisual.style.setProperty("--hero-rotate-y", "0deg");

        });

    }


    // =========================================
    // 4. FLOATING ELEMENTS
    // =========================================

    const floatingElements = document.querySelectorAll(
        ".float-3d, .hero-orb"
    );

    floatingElements.forEach((element, index) => {

        element.style.setProperty(
            "--float-delay",
            `${index * 0.4}s`
        );

    });


    // =========================================
    // 5. SCROLL REVEAL ANIMATION
    // =========================================

    const revealElements = document.querySelectorAll(
        ".card, .section-title, .info-box, .page-header, .hero-content"
    );

    if ("IntersectionObserver" in window) {

        const revealObserver = new IntersectionObserver(
            (entries, observer) => {

                entries.forEach((entry) => {

                    if (entry.isIntersecting) {

                        entry.target.classList.add("revealed");

                        observer.unobserve(entry.target);

                    }

                });

            },
            {
                threshold: 0.12
            }
        );

        revealElements.forEach((element, index) => {

            element.classList.add("reveal");

            element.style.setProperty(
                "--reveal-delay",
                `${(index % 4) * 0.12}s`
            );

            revealObserver.observe(element);

        });

    } else {

        revealElements.forEach((element) => {
            element.classList.add("revealed");
        });

    }


    // =========================================
    // 6. BACK TO TOP BUTTON
    // =========================================

    const backToTop = document.createElement("button");

    backToTop.className = "back-to-top";
    backToTop.type = "button";
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


    // =========================================
    // 7. MOBILE NAVIGATION
    // =========================================

    const nav = document.querySelector(
        ".navbar .nav-links, .navbar nav"
    );

    const navContainer = document.querySelector(
        ".navbar .nav-content"
    );

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
            menuButton.setAttribute(
                "aria-label",
                isOpen ? "بستن منو" : "باز کردن منو"
            );

        });

        nav.querySelectorAll("a").forEach((link) => {

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

    const currentPage =
        window.location.pathname.split("/").pop() || "index.html";

    document.querySelectorAll(".nav-links a, .navbar nav a")
        .forEach((link) => {

            const linkPage = link.getAttribute("href");

            if (linkPage === currentPage) {
                link.classList.add("active");
                link.setAttribute("aria-current", "page");
            }

        });


    // =========================================
    // 9. DEVICE DETECTOR
    // =========================================

    const deviceSection = document.createElement("section");

    deviceSection.className = "device-section";

    deviceSection.innerHTML = `
        <div class="container">

            <div class="device-panel">

                <h2>📱 اطلاعات دستگاه شما</h2>

                <p>
                    مشخصات دستگاهی که با آن وارد سایت شده‌اید
                </p>

                <div class="device-grid">

                    <div class="device-item">
                        <span>نوع دستگاه</span>
                        <strong id="device-type">در حال بررسی...</strong>
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
                        <span>مدل دستگاه</span>
                        <strong id="device-model">در حال بررسی...</strong>
                    </div>

                    <div class="device-item">
                        <span>اندازه صفحه</span>
                        <strong id="device-screen">در حال بررسی...</strong>
                    </div>

                    <div class="device-item">
                        <span>تعداد هسته پردازنده</span>
                        <strong id="device-cores">نامشخص</strong>
                    </div>

                </div>

                <small>
                    اطلاعات فقط در مرورگر شما بررسی می‌شوند.
                    این سایت آن‌ها را ذخیره یا ارسال نمی‌کند.
                </small>

            </div>

        </div>
    `;

    // قرار دادن بخش اطلاعات دستگاه قبل از فوتر
    const footer = document.querySelector("footer");

    if (footer) {
        document.body.insertBefore(deviceSection, footer);
    } else {
        document.body.appendChild(deviceSection);
    }


    // =========================================
    // 10. DEVICE INFORMATION
    // =========================================

    const userAgent = navigator.userAgent;

    // Device Type
    let deviceType = "کامپیوتر";

    if (/iPad|Tablet/i.test(userAgent)) {
        deviceType = "تبلت";
    } else if (/Mobile|Android|iPhone|iPod/i.test(userAgent)) {
        deviceType = "موبایل";
    }


    // Operating System
    let operatingSystem = "نامشخص";

    if (/Android/i.test(userAgent)) {
        operatingSystem = "Android";
    } else if (/iPhone|iPad|iPod/i.test(userAgent)) {
        operatingSystem = "iOS / iPadOS";
    } else if (/Windows/i.test(userAgent)) {
        operatingSystem = "Windows";
    } else if (/Mac OS|Macintosh/i.test(userAgent)) {
        operatingSystem = "macOS";
    } else if (/Linux/i.test(userAgent)) {
        operatingSystem = "Linux";
    }


    // Browser
    let browser = "نامشخص";

    if (/Edg/i.test(userAgent)) {
        browser = "Microsoft Edge";
    } else if (/OPR|Opera/i.test(userAgent)) {
        browser = "Opera";
    } else if (/SamsungBrowser/i.test(userAgent)) {
        browser = "Samsung Internet";
    } else if (/Firefox/i.test(userAgent)) {
        browser = "Mozilla Firefox";
    } else if (/CriOS|Chrome/i.test(userAgent)) {
        browser = "Google Chrome";
    } else if (/Safari/i.test(userAgent)) {
        browser = "Safari";
    }


    // Device Model (best effort)
    let deviceModel = "قابل تشخیص نیست";

    const androidMatch = userAgent.match(
        /Android[^;]*;\s*([^;)]+)/i
    );

    if (androidMatch && androidMatch[1]) {

        deviceModel = androidMatch[1]
            .replace(/Build\/.*/i, "")
            .trim();

    } else if (/iPhone/i.test(userAgent)) {

        deviceModel = "Apple iPhone";

    } else if (/iPad/i.test(userAgent)) {

        deviceModel = "Apple iPad";

    }


    // Screen Size
    const screenSize = `${window.screen.width} × ${window.screen.height} پیکسل`;


    // CPU Cores
    const cpuCores = navigator.hardwareConcurrency
        ? `${navigator.hardwareConcurrency} هسته`
        : "نامشخص";


    // Display Information
    document.getElementById("device-type").textContent = deviceType;
    document.getElementById("device-os").textContent = operatingSystem;
    document.getElementById("device-browser").textContent = browser;
    document.getElementById("device-model").textContent = deviceModel;
    document.getElementById("device-screen").textContent = screenSize;
    document.getElementById("device-cores").textContent = cpuCores;


    // =========================================
    // 11. MODERN DEVICE MODEL DETECTION
    // =========================================

    // بعضی مرورگرها اطلاعات دقیق‌تری ارائه می‌کنند.
    // این قابلیت اختیاری است و ممکن است پشتیبانی نشود.

    if (navigator.userAgentData &&
        typeof navigator.userAgentData.getHighEntropyValues === "function") {

        navigator.userAgentData.getHighEntropyValues([
            "model",
            "platform",
            "platformVersion"
        ])
        .then((data) => {

            if (data.model && data.model.trim() !== "") {

                document.getElementById("device-model").textContent =
                    data.model;

            }

            if (data.platform) {

                document.getElementById("device-os").textContent =
                    data.platform +
                    (data.platformVersion
                        ? " " + data.platformVersion
                        : "");

            }

        })
        .catch(() => {
            // در صورت عدم دسترسی، اطلاعات قبلی حفظ می‌شوند.
        });

    }


    // =========================================
    // 12. PAGE READY
    // =========================================

    document.body.classList.add("sana-ready");

    console.log("SanaDemo Ultimate 3D is ready!");
    console.log("Device Detector is active!");

});
