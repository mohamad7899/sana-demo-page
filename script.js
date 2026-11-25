
/* ==========================================
   SanaDemo ULTIMATE 3D ENGINE
   Neon + Glass + Interactive Motion
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    const body = document.body;
    const root = document.documentElement;

    const isMobile = window.matchMedia("(max-width: 700px)").matches;
    const hasFinePointer = window.matchMedia(
        "(hover: hover) and (pointer: fine)"
    ).matches;

    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;


    // ======================================
    // 1. 3D CARD TILT
    // ======================================

    const cards = document.querySelectorAll(".card");

    if (!reducedMotion && hasFinePointer) {

        cards.forEach(card => {

            card.addEventListener("pointermove", event => {

                const rect = card.getBoundingClientRect();

                const x = event.clientX - rect.left;
                const y = event.clientY - rect.top;

                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const rotateX = ((y - centerY) / centerY) * -12;
                const rotateY = ((x - centerX) / centerX) * 12;

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

    }


    // ======================================
    // 2. GLOBAL NEON POINTER
    // ======================================

    if (!reducedMotion && hasFinePointer) {

        document.addEventListener("pointermove", event => {

            root.style.setProperty(
                "--pointer-x",
                `${event.clientX}px`
            );

            root.style.setProperty(
                "--pointer-y",
                `${event.clientY}px`
            );

        }, { passive: true });

    }


    // ======================================
    // 3. HERO PARALLAX
    // ======================================

    const heroVisual = document.querySelector(".hero-visual");

    if (heroVisual && !reducedMotion && hasFinePointer) {

        heroVisual.addEventListener("pointermove", event => {

            const rect = heroVisual.getBoundingClientRect();

            const x = (event.clientX - rect.left) / rect.width - 0.5;
            const y = (event.clientY - rect.top) / rect.height - 0.5;

            heroVisual.style.setProperty(
                "--hero-rotate-x",
                `${y * -18}deg`
            );

            heroVisual.style.setProperty(
                "--hero-rotate-y",
                `${x * 18}deg`
            );

        });

        heroVisual.addEventListener("pointerleave", () => {

            heroVisual.style.setProperty("--hero-rotate-x", "0deg");
            heroVisual.style.setProperty("--hero-rotate-y", "0deg");

        });

    }


    // ======================================
    // 4. FLOATING ELEMENTS
    // ======================================

    const floatingElements = document.querySelectorAll(
        ".float-3d, .hero-orb"
    );

    floatingElements.forEach((element, index) => {

        element.style.setProperty(
            "--float-delay",
            `${index * -0.7}s`
        );

    });


    // ======================================
    // 5. SCROLL REVEAL
    // ======================================

    const revealElements = document.querySelectorAll(
        ".card, .section-title, .info-box, .page-header, .hero-content"
    );

    if (!reducedMotion && "IntersectionObserver" in window) {

        const observer = new IntersectionObserver(entries => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    entry.target.classList.add("revealed");

                    observer.unobserve(entry.target);

                }

            });

        }, {
            threshold: 0.12
        });

        revealElements.forEach((element, index) => {

            element.classList.add("reveal");

            element.style.setProperty(
                "--reveal-delay",
                `${(index % 3) * 120}ms`
            );

            observer.observe(element);

        });

    } else {

        revealElements.forEach(element => {
            element.classList.add("revealed");
        });

    }


    // ======================================
    // 6. BACK TO TOP
    // ======================================

    const topButton = document.createElement("button");

    topButton.type = "button";
    topButton.className = "back-to-top";
    topButton.textContent = "↑";

    topButton.setAttribute(
        "aria-label",
        "بازگشت به بالای صفحه"
    );

    body.appendChild(topButton);

    window.addEventListener("scroll", () => {

        topButton.classList.toggle(
            "show",
            window.scrollY > 350
        );

    }, { passive: true });

    topButton.addEventListener("click", () => {

        window.scrollTo({
            top: 0,
            behavior: reducedMotion ? "auto" : "smooth"
        });

    });


    // ======================================
    // 7. MOBILE NAVIGATION
    // ======================================

    const nav = document.querySelector(
        ".navbar .nav-links, .navbar nav"
    );

    const navContainer = document.querySelector(
        ".navbar .nav-content"
    );

    if (nav && navContainer) {

        const menuButton = document.createElement("button");

        menuButton.type = "button";
        menuButton.className = "mobile-menu-button";
        menuButton.textContent = "☰";

        menuButton.setAttribute("aria-label", "باز کردن منو");
        menuButton.setAttribute("aria-expanded", "false");

        navContainer.appendChild(menuButton);

        menuButton.addEventListener("click", () => {

            const isOpen = nav.classList.toggle("mobile-open");

            menuButton.textContent = isOpen ? "✕" : "☰";

            menuButton.setAttribute(
                "aria-expanded",
                String(isOpen)
            );

            menuButton.setAttribute(
                "aria-label",
                isOpen ? "بستن منو" : "باز کردن منو"
            );

        });

        nav.querySelectorAll("a").forEach(link => {

            link.addEventListener("click", () => {

                nav.classList.remove("mobile-open");

                menuButton.textContent = "☰";

                menuButton.setAttribute("aria-expanded", "false");
                menuButton.setAttribute("aria-label", "باز کردن منو");

            });

        });

    }


    // ======================================
    // 8. ACTIVE PAGE LINK
    // ======================================

    const currentPage = window.location.pathname.split("/").pop() || "index.html";

    document.querySelectorAll(".nav-links a, .navbar nav a").forEach(link => {

        const linkPage = link.getAttribute("href");

        if (linkPage === currentPage) {
            link.classList.add("active");
            link.setAttribute("aria-current", "page");
        }

    });


    // ======================================
    // 9. PAGE READY
    // ======================================

    body.classList.add("sana-ready");

    console.log("SanaDemo Ultimate 3D Engine Loaded!");

});
