document.addEventListener("DOMContentLoaded", () => {

    /* =========================
       HEADER
    ========================= */

    const header = document.querySelector(".site-header");

    function updateHeader() {

        if (!header) return;

        if (window.scrollY > 30) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }

    }

    updateHeader();

    window.addEventListener(
        "scroll",
        updateHeader
    );


    /* =========================
       MOBILE MENU
    ========================= */

    const navToggle =
        document.querySelector(".nav-toggle");

    const nav =
        document.querySelector(".site-nav");


    if (navToggle && nav) {

        navToggle.addEventListener(
            "click",
            () => {

                nav.classList.toggle("open");

            }
        );


        nav.querySelectorAll("a").forEach(link => {

            link.addEventListener(
                "click",
                () => {

                    nav.classList.remove("open");

                }
            );

        });


        document.addEventListener(
            "keydown",
            event => {

                if (event.key === "Escape") {

                    nav.classList.remove("open");

                }

            }
        );


        window.addEventListener(
            "resize",
            () => {

                if (window.innerWidth > 800) {

                    nav.classList.remove("open");

                }

            }
        );

    }


    /* =========================
       SMOOTH SCROLL
    ========================= */

    const headerHeight = () => {

        return header
            ? header.offsetHeight
            : 0;

    };


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


                    const targetPosition =
                        target.getBoundingClientRect().top +
                        window.scrollY -
                        headerHeight();


                    window.scrollTo({

                        top: targetPosition,

                        behavior: "smooth"

                    });

                }
            );

        });


    /* =========================
       ACTIVE NAVIGATION
    ========================= */

    const sections =
        document.querySelectorAll(
            "main section[id]"
        );


    const navLinks =
        document.querySelectorAll(
            ".site-nav a"
        );


    function updateActiveNavigation() {

        if (
            !sections.length ||
            !navLinks.length
        ) {
            return;
        }


        const currentPosition =
            window.scrollY +
            headerHeight() +
            120;


        let currentSection = "";


        sections.forEach(section => {

            const sectionTop =
                section.offsetTop;


            const sectionBottom =
                sectionTop +
                section.offsetHeight;


            if (
                currentPosition >= sectionTop &&
                currentPosition < sectionBottom
            ) {

                currentSection =
                    section.id;

            }

        });


        navLinks.forEach(link => {

            const href =
                link.getAttribute("href");


            link.classList.toggle(
                "active",
                href === `#${currentSection}`
            );

        });

    }


    updateActiveNavigation();


    window.addEventListener(
        "scroll",
        updateActiveNavigation
    );


    /* =========================
       FOTO SLIDER
    ========================= */

    const slides =
        document.querySelectorAll(
            ".studio-slide"
        );


    const prevButton =
        document.querySelector(
            ".slider-prev"
        );


    const nextButton =
        document.querySelector(
            ".slider-next"
        );


    const currentCounter =
        document.querySelector(
            ".slider-current"
        );


    let currentSlide = 0;

    let sliderTimer = null;

    let isAnimating = false;


    const slideDuration = 900;

    const autoSlideDelay = 3500;


    function updateCounter() {

        if (!currentCounter) return;


        currentCounter.textContent =
            String(
                currentSlide + 1
            ).padStart(2, "0");

    }


    function showSlide(newIndex) {

        if (!slides.length) return;

        if (isAnimating) return;


        newIndex =
            (
                newIndex +
                slides.length
            ) %
            slides.length;


        if (
            newIndex === currentSlide
        ) {
            return;
        }


        isAnimating = true;


        const oldSlide =
            slides[currentSlide];


        const newSlide =
            slides[newIndex];


        /*
         * La nuova foto entra sempre da destra.
         * La foto precedente esce verso sinistra.
         */

        newSlide.style.transition =
            "none";


        newSlide.style.transform =
            "translateX(100%)";


        newSlide.classList.add(
            "active"
        );


        /*
         * Forza il browser a registrare
         * la posizione iniziale.
         */

        newSlide.offsetHeight;


        oldSlide.style.transition =
            `transform ${slideDuration}ms cubic-bezier(0.77, 0, 0.175, 1)`;


        newSlide.style.transition =
            `transform ${slideDuration}ms cubic-bezier(0.77, 0, 0.175, 1)`;


        oldSlide.style.transform =
            "translateX(-100%)";


        newSlide.style.transform =
            "translateX(0)";


        currentSlide =
            newIndex;


        updateCounter();


        setTimeout(
            () => {

                oldSlide.classList.remove(
                    "active"
                );


                oldSlide.style.transition =
                    "";


                oldSlide.style.transform =
                    "";


                newSlide.style.transition =
                    "";


                isAnimating = false;

            },
            slideDuration
        );

    }


    function nextSlide() {

        showSlide(
            currentSlide + 1
        );

    }


    function previousSlide() {

        showSlide(
            currentSlide - 1
        );

    }


    function startSlider() {

        if (!slides.length) return;


        stopSlider();


        sliderTimer =
            setInterval(
                () => {

                    nextSlide();

                },
                autoSlideDelay
            );

    }


    function stopSlider() {

        if (sliderTimer) {

            clearInterval(
                sliderTimer
            );

            sliderTimer = null;

        }

    }


    if (slides.length) {


        /* STATO INIZIALE */

        slides.forEach(
            (slide, index) => {

                slide.classList.remove(
                    "active"
                );


                slide.style.transition =
                    "none";


                slide.style.transform =
                    index === 0
                        ? "translateX(0)"
                        : "translateX(100%)";

            }
        );


        slides[0].classList.add(
            "active"
        );


        currentSlide = 0;


        updateCounter();


        /* FRECCIA DESTRA */

        if (nextButton) {

            nextButton.addEventListener(
                "click",
                () => {

                    nextSlide();

                    startSlider();

                }
            );

        }


        /* FRECCIA SINISTRA */

        if (prevButton) {

            prevButton.addEventListener(
                "click",
                () => {

                    previousSlide();

                    startSlider();

                }
            );

        }


        /* AUTOPLAY */

        startSlider();


        /* =========================
           PAUSA SULLA FOTO
        ========================= */

        const slider =
            document.querySelector(
                ".studio-slider"
            );


        if (slider) {

            slider.addEventListener(
                "mouseenter",
                () => {

                    stopSlider();

                }
            );


            slider.addEventListener(
                "mouseleave",
                () => {

                    startSlider();

                }
            );


            /* =========================
               SWIPE MOBILE
            ========================= */

            let touchStartX = 0;

            let touchEndX = 0;


            slider.addEventListener(
                "touchstart",
                event => {

                    touchStartX =
                        event.changedTouches[0]
                            .screenX;

                },
                {
                    passive: true
                }
            );


            slider.addEventListener(
                "touchend",
                event => {

                    touchEndX =
                        event.changedTouches[0]
                            .screenX;


                    const distance =
                        touchEndX -
                        touchStartX;


                    /* Swipe verso sinistra */

                    if (distance < -50) {

                        nextSlide();

                        startSlider();

                    }


                    /* Swipe verso destra */

                    if (distance > 50) {

                        previousSlide();

                        startSlider();

                    }

                },
                {
                    passive: true
                }
            );

        }

    }


    /* =========================
       FOOTER YEAR
    ========================= */

    const year =
        document.querySelector(
            "#year"
        );


    if (year) {

        year.textContent =
            new Date().getFullYear();

    }

});