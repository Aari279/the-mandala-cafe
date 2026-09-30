/* =========================================================
   THE MANDALA CAFE
   Interactive JavaScript
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* ================= HEADER ================= */

    const header = document.getElementById("siteHeader");

    const updateHeader = () => {
        if (window.scrollY > 40) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }
    };

    updateHeader();

    window.addEventListener("scroll", updateHeader, {
        passive: true
    });


    /* ================= MOBILE NAV ================= */

    const mobileMenuBtn =
        document.getElementById("mobileMenuBtn");

    const mobileNav =
        document.getElementById("mobileNav");

    if (mobileMenuBtn && mobileNav) {

        const mobileLinks =
            mobileNav.querySelectorAll("a");

        const closeMobileMenu = () => {

            mobileNav.classList.remove("active");

            mobileMenuBtn.setAttribute(
                "aria-expanded",
                "false"
            );

            document.body.classList.remove("no-scroll");
        };

        mobileMenuBtn.addEventListener("click", () => {

            const isOpen =
                mobileNav.classList.toggle("active");

            mobileMenuBtn.setAttribute(
                "aria-expanded",
                String(isOpen)
            );

            document.body.classList.toggle(
                "no-scroll",
                isOpen
            );
        });

        mobileLinks.forEach(link => {

            link.addEventListener(
                "click",
                closeMobileMenu
            );

        });

        window.addEventListener("resize", () => {

            if (window.innerWidth > 800) {
                closeMobileMenu();
            }

        });
    }


    /* ================= OPENING STATUS ================= */

    const openStatus =
        document.getElementById("openStatus");

    const updateOpeningStatus = () => {

        if (!openStatus) return;

        const now = new Date();

        const formatter =
            new Intl.DateTimeFormat(
                "en-US",
                {
                    timeZone: "Asia/Kathmandu",
                    hour: "numeric",
                    minute: "numeric",
                    hour12: false
                }
            );

        const parts =
            formatter.formatToParts(now);

        const hour =
            Number(
                parts.find(
                    part => part.type === "hour"
                )?.value || 0
            );

        const minute =
            Number(
                parts.find(
                    part => part.type === "minute"
                )?.value || 0
            );

        const currentMinutes =
            (hour * 60) + minute;

        const openingMinutes =
            8 * 60;

        const closingMinutes =
            21 * 60;

        if (
            currentMinutes >= openingMinutes &&
            currentMinutes < closingMinutes
        ) {

            openStatus.textContent =
                "Open now";

            openStatus.style.color =
                "#91b77a";

        } else {

            openStatus.textContent =
                "Currently closed";

            openStatus.style.color =
                "#d69a77";
        }
    };

    updateOpeningStatus();

    setInterval(
        updateOpeningStatus,
        60000
    );


    /* ================= CURRENT YEAR ================= */

    const currentYear =
        document.getElementById("currentYear");

    if (currentYear) {
        currentYear.textContent =
            new Date().getFullYear();
    }


    /* ================= GALLERY LIGHTBOX ================= */

    const galleryItems =
        document.querySelectorAll(".gallery-item");

    const lightbox =
        document.getElementById("lightbox");

    const lightboxImage =
        document.getElementById("lightboxImage");

    const lightboxCaption =
        document.getElementById("lightboxCaption");

    const lightboxClose =
        document.getElementById("lightboxClose");

    const lightboxPrev =
        document.getElementById("lightboxPrev");

    const lightboxNext =
        document.getElementById("lightboxNext");


    let currentGalleryIndex = 0;


    /*
       IMPORTANT:
       Use the actual image shown inside each
       gallery item instead of the old data-image URL.
    */

    const galleryData =
        Array.from(galleryItems).map(item => {

            const image =
                item.querySelector("img");

            return {
                image: image
                    ? image.getAttribute("src")
                    : "",
                caption:
                    item.dataset.caption ||
                    (image
                        ? image.getAttribute("alt")
                        : "The Mandala Cafe")
            };
        });


    const showGalleryImage = index => {

        if (!galleryData.length) return;

        currentGalleryIndex =
            (index + galleryData.length) %
            galleryData.length;

        const item =
            galleryData[currentGalleryIndex];

        lightboxImage.src =
            item.image;

        lightboxImage.alt =
            item.caption;

        lightboxCaption.textContent =
            item.caption;
    };


    const openLightbox = index => {

        showGalleryImage(index);

        lightbox.classList.add("active");

        lightbox.setAttribute(
            "aria-hidden",
            "false"
        );

        document.body.classList.add(
            "no-scroll"
        );
    };


    const closeLightbox = () => {

        lightbox.classList.remove("active");

        lightbox.setAttribute(
            "aria-hidden",
            "true"
        );

        document.body.classList.remove(
            "no-scroll"
        );

        setTimeout(() => {

            lightboxImage.src = "";

        }, 300);
    };


    galleryItems.forEach((item, index) => {

        item.addEventListener(
            "click",
            () => openLightbox(index)
        );

    });


    if (lightboxClose) {
        lightboxClose.addEventListener(
            "click",
            closeLightbox
        );
    }


    if (lightboxPrev) {
        lightboxPrev.addEventListener(
            "click",
            () => {

                showGalleryImage(
                    currentGalleryIndex - 1
                );

            }
        );
    }


    if (lightboxNext) {
        lightboxNext.addEventListener(
            "click",
            () => {

                showGalleryImage(
                    currentGalleryIndex + 1
                );

            }
        );
    }


    if (lightbox) {

        lightbox.addEventListener(
            "click",
            event => {

                if (event.target === lightbox) {
                    closeLightbox();
                }

            }
        );
    }


    document.addEventListener(
        "keydown",
        event => {

            if (
                !lightbox ||
                !lightbox.classList.contains("active")
            ) {
                return;
            }

            if (event.key === "Escape") {
                closeLightbox();
            }

            if (event.key === "ArrowLeft") {

                showGalleryImage(
                    currentGalleryIndex - 1
                );

            }

            if (event.key === "ArrowRight") {

                showGalleryImage(
                    currentGalleryIndex + 1
                );

            }
        }
    );


    /* ================= TOUCH SWIPE ================= */

    let touchStartX = 0;
    let touchEndX = 0;


    if (lightbox) {

        lightbox.addEventListener(
            "touchstart",
            event => {

                touchStartX =
                    event.changedTouches[0].screenX;

            },
            { passive: true }
        );


        lightbox.addEventListener(
            "touchend",
            event => {

                touchEndX =
                    event.changedTouches[0].screenX;

                const distance =
                    touchEndX - touchStartX;

                if (Math.abs(distance) < 50) {
                    return;
                }

                if (distance > 0) {

                    showGalleryImage(
                        currentGalleryIndex - 1
                    );

                } else {

                    showGalleryImage(
                        currentGalleryIndex + 1
                    );

                }
            },
            { passive: true }
        );
    }


    /* ================= SMOOTH ANCHOR FALLBACK ================= */

    document
        .querySelectorAll('a[href^="#"]')
        .forEach(link => {

            link.addEventListener(
                "click",
                event => {

                    const targetId =
                        link.getAttribute("href");

                    if (
                        !targetId ||
                        targetId === "#"
                    ) {
                        return;
                    }

                    const target =
                        document.querySelector(
                            targetId
                        );

                    if (!target) return;

                    event.preventDefault();

                    const headerHeight =
                        header
                            ? header.offsetHeight
                            : 0;

                    const targetPosition =
                        target.getBoundingClientRect()
                            .top
                        + window.scrollY
                        - headerHeight;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: "smooth"
                    });

                }
            );
        });


    console.log(
        "The Mandala Cafe demo loaded successfully."
    );

});