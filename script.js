
/* =====================================
   SanaDemo - Advanced 3D Motion Engine
   Neon + Glassmorphism
===================================== */

document.addEventListener("DOMContentLoaded", () => {

    // 1. 3D CARD TILT

    const cards = document.querySelectorAll(".card");

    cards.forEach(card => {

        card.addEventListener("mousemove", event => {

            if (window.matchMedia("(max-width: 700px)").matches) {
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
                `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;

        });

        card.addEventListener("mouseleave", () => {
            card.style.transform = "";
        });

    });


    // 2. FLOATING 3D ELEMENTS

    const floatingElements =
        document.querySelectorAll(".float-3d");

    floatingElements.forEach((element, index) => {
        element.style.animationDelay = `${index * 0.5}s`;
    });


    // 3. SCROLL REVEAL

    const revealElements = document.querySelectorAll(
        ".card, .section-title, .info-box, .page-header"
    );

    if ("IntersectionObserver" in window) {

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

        revealElements.forEach(element => {
            element.classList.add("reveal");
            observer.observe(element);
        });

    } else {

        revealElements.forEach(element => {
            element.classList.add("revealed");
        });

    }


    // 4. BACK TO TOP BUTTON

    const topButton = document.createElement("button");

    topButton.type = "button";
    topButton.className = "back-to-top";
    topButton.textContent = "↑";
    topButton.setAttribute(
        "aria-label",
        "بازگشت به بالای صفحه"
    );

    document.body.appendChild(topButton);

    window.addEventListener("scroll", () => {

        topButton.classList.toggle(
            "show",
            window.scrollY > 350
        );

    }, { passive: true });

    topButton.addEventListener("click", () => {

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    });


    // 5. MOBILE MENU

    const nav = document.querySelector(".navbar nav");
    const header = document.querySelector(".navbar");

    if (nav && header) {

        const menuButton = document.createElement("button");

        menuButton.type = "button";
        menuButton.className = "mobile-menu-button";
        menuButton.textContent = "☰";

        menuButton.setAttribute(
            "aria-label",
            "باز کردن منو"
        );

        menuButton.setAttribute("aria-expanded", "false");

        header.appendChild(menuButton);

        menuButton.addEventListener("click", () => {

            const isOpen = nav.classList.toggle("mobile-open");

            menuButton.textContent = isOpen ? "✕" : "☰";

            menuButton.setAttribute(
                "aria-expanded",
                String(isOpen)
            );

        });

        nav.querySelectorAll("a").forEach(link => {

            link.addEventListener("click", () => {

                nav.classList.remove("mobile-open");

                menuButton.textContent = "☰";

                menuButton.setAttribute(
                    "aria-expanded",
                    "false"
                );

            });

        });

    }


    // 6. NEON POINTER GLOW

    if (window.matchMedia(
        "(hover: hover) and (pointer: fine)"
    ).matches) {

        document.addEventListener("mousemove", event => {

            document.documentElement.style.setProperty(
                "--pointer-x",
                `${event.clientX}px`
            );

            document.documentElement.style.setProperty(
                "--pointer-y",
                `${event.clientY}px`
            );

        }, { passive: true });

    }

});
