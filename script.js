/* =============== START: script.js =============== */
document.addEventListener("DOMContentLoaded", () => {
    console.log("Initializing Quantum Interface Script... (April 2025)");

    const IS_REDUCED_MOTION = window.matchMedia(`(prefers-reduced-motion: reduce)`).matches === true;

    // --- Helper Function ---
    const select = (el, all = false) => {
        el = el.trim();
        return all ? [...document.querySelectorAll(el)] : document.querySelector(el);
    };

    // --- 1. Lenis Smooth Scrolling ---
    let lenis;
    try {
        lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Custom ease
            smoothWheel: true,
        });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);

        // Integrate with GSAP ScrollTrigger
        lenis.on("scroll", ScrollTrigger.update);
        gsap.ticker.add((time) => {
            lenis.raf(time * 1000); // Convert seconds to milliseconds
        });
        gsap.ticker.lagSmoothing(0);

        console.log("Lenis Smooth Scroll Initialized.");

        // Anchor link smooth scroll handling
        select('a[href*="#"]', true).forEach((link) => {
            link.addEventListener("click", (e) => {
                const targetId = link.getAttribute("href");
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    // e.preventDefault(); // Prevent default jump only if Lenis targets it
                    lenis.scrollTo(targetElement);
                }
            });
        });
    } catch (error) {
        console.error("Failed to initialize Lenis:", error);
        // Fallback or do nothing if Lenis fails
    }

    // --- 2. tsParticles Background ---
    const particlesContainer = select("#particles-background");
    if (particlesContainer && typeof tsParticles !== "undefined") {
        tsParticles
            .load("particles-background", {
                fpsLimit: 60,
                particles: {
                    number: { value: 50, density: { enable: true, value_area: 800 } },
                    color: { value: ["#00F0FF", "#F000FF", "#00FF80"] }, // Neon colors
                    shape: { type: "circle" },
                    opacity: { value: { min: 0.1, max: 0.5 }, anim: { enable: true, speed: 0.5, sync: false } },
                    size: { value: { min: 1, max: 3 } },
                    links: { enable: true, distance: 120, color: "rgba(255, 255, 255, 0.1)", opacity: 0.1, width: 1 },
                    move: {
                        enable: true,
                        speed: 1.5,
                        direction: "none",
                        random: true,
                        straight: false,
                        outModes: "out", // Particles disappear when out
                    },
                },
                interactivity: {
                    events: { onHover: { enable: !IS_REDUCED_MOTION, mode: "grab" }, onClick: { enable: true, mode: "push" } },
                    modes: { grab: { distance: 140, links: { opacity: 0.3 } }, push: { quantity: 3 } },
                },
                detectRetina: true,
                background: {
                    // Transparent background, color from CSS body
                },
            })
            .then(() => console.log("tsParticles Initialized."))
            .catch((err) => console.error("tsParticles Error:", err));
    } else {
        console.warn("#particles-background element not found or tsParticles library missing.");
    }

    // --- 3. Typed.js Effect ---
    const typedTarget = select("#typed-output");
    if (typedTarget && typeof Typed !== "undefined") {
        const typedStrings = [
            // Ganti dengan keahlian Anda
            "UI/UX yang intuitif.",
            "backend yang tangguh.",
            "animasi web yang halus.",
            "solusi digital inovatif.",
        ];
        try {
            new Typed("#typed-output", {
                strings: typedStrings,
                typeSpeed: 50,
                backSpeed: 30,
                backDelay: 1500,
                loop: true,
                smartBackspace: true,
                cursorChar: "", // Hapus cursor default, gunakan span custom
            });
            console.log("Typed.js Initialized.");
        } catch (error) {
            console.error("Failed to initialize Typed.js:", error);
            typedTarget.textContent = typedStrings[0]; // Fallback text
        }
    } else {
        console.warn("#typed-output element not found or Typed library missing.");
    }

    // --- 4. Splitting.js Text Activation ---
    try {
        Splitting(); // Activate Splitting on elements with data-splitting attribute
        console.log("Splitting.js Activated.");
    } catch (error) {
        console.error("Failed to activate Splitting.js:", error);
    }

    // --- 5. Vanilla-Tilt.js ---
    const tiltElements = select(".tilt-element", true);
    if (tiltElements.length > 0 && typeof VanillaTilt !== "undefined") {
        if (!IS_REDUCED_MOTION) {
            VanillaTilt.init(tiltElements, {
                max: 8, // Max tilt rotation (degrees)
                perspective: 1000, // Transform perspective, the lower the more extreme the tilt gets.
                scale: 1.02, // Slightly scale up on hover
                speed: 400, // Speed of the enter/exit transition
                glare: true, // If it should have a "glare" effect
                "max-glare": 0.1, // Glare opacity (0 - 1)
            });
            console.log("Vanilla-Tilt Initialized.");
        } else {
            console.log("Vanilla-Tilt skipped due to reduced motion preference.");
        }
    } else {
        console.warn(".tilt-element elements not found or VanillaTilt library missing.");
    }

    // --- 6. GSAP Animations ---
    try {
        gsap.registerPlugin(ScrollTrigger);
        console.log("GSAP & ScrollTrigger Ready.");

        // GSAP Defaults (optional)
        // gsap.defaults({ ease: "power3.out", duration: 0.8 });

        // -- Hero Intro Animation --
        // Menggunakan class unik untuk target yang lebih aman
        const heroElements = select(".hero-element", true);
        if (heroElements.length > 0) {
            gsap.set(heroElements, { opacity: 0, y: 30 }); // Set initial state

            // Animate text split by Splitting.js
            const heroTitleChars = select(".hero-title .char", true); // Target karakter hasil Splitting.js
            if (heroTitleChars.length > 0) {
                gsap.set(heroTitleChars, { opacity: 0, y: 20, rotationX: -90, transformOrigin: "center 50% -20px" });
                gsap.to(heroTitleChars, {
                    opacity: 1,
                    y: 0,
                    rotationX: 0,
                    stagger: 0.03,
                    duration: 0.8,
                    ease: "back.out(1.2)",
                    delay: 0.5, // Delay setelah elemen lain mulai
                });
            } else {
                // Fallback if Splitting failed or no chars
                gsap.to(".hero-title", { opacity: 1, y: 0, duration: 1, ease: "power3.out", delay: 0.5 });
            }

            // Animate other hero elements with delay based on data attribute or index
            heroElements.forEach((el, index) => {
                // Jangan animasikan title lagi jika sudah dihandle oleh split animation
                if (!el.classList.contains("hero-title")) {
                    const delay = parseFloat(el.dataset.revealDelay) || index * 0.1 + 0.2; // Default delay
                    gsap.to(el, {
                        opacity: 1,
                        y: 0,
                        duration: 1,
                        delay: delay,
                        ease: "power3.out",
                    });
                }
            });
            console.log("GSAP Hero Animation Sequence Triggered.");
        }

        // -- Section Title Line Animation --
        select(".section-title", true).forEach((title) => {
            const line = select(".title-line", false); // Harusnya hanya ada 1 per title
            if (line) {
                gsap.to(line, {
                    scaleX: 1, // Animasikan lebar dari 0 ke 1
                    duration: 1,
                    ease: "power3.inOut",
                    scrollTrigger: {
                        trigger: title,
                        start: "top 85%", // Trigger saat judul masuk viewport
                        toggleActions: "play none none none", // Hanya sekali
                        // markers: true
                    },
                });
            }
        });

        // -- General Scroll Reveal Animation --
        // Menggunakan data attribute `data-reveal` sebagai target
        select("[data-reveal]", true).forEach((el) => {
            const delay = parseFloat(el.dataset.revealDelay) || 0;
            gsap.fromTo(
                el,
                { opacity: 0, y: 50 }, // From state
                {
                    // To state
                    opacity: 1,
                    y: 0,
                    delay: delay,
                    duration: 1,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: el,
                        start: "top 90%", // Trigger lebih awal
                        toggleActions: "play none none none",
                        // markers: true,
                    },
                }
            );
        });
        console.log("GSAP General Scroll Reveals Initialized.");

        // -- Parallax Effect Example (Optional) --
        // Berikan class 'parallax-bg' pada elemen yang ingin diberi efek
        if (!IS_REDUCED_MOTION) {
            gsap.utils.toArray(".parallax-bg").forEach((layer) => {
                gsap.to(layer, {
                    yPercent: -30, // Bergerak ke atas 30% saat scroll
                    ease: "none",
                    scrollTrigger: {
                        trigger: layer,
                        start: "top bottom", // Mulai saat elemen masuk dari bawah
                        end: "bottom top", // Selesai saat elemen keluar ke atas
                        scrub: true, // Ikat ke posisi scroll
                    },
                });
            });
            console.log("GSAP Parallax Effect Initialized (if elements exist).");
        }

        // script.js - TAMBAHAN ANIMASI GSAP UNTUK SHAPES

        // -- Hero Visuals Animation --
        const shapes = select(".shape", true);
        if (shapes.length > 0 && !IS_REDUCED_MOTION) {
            shapes.forEach((shape, index) => {
                gsap.set(shape, {
                    // Posisi awal acak sedikit (opsional)
                    xPercent: gsap.utils.random(-10, 10),
                    yPercent: gsap.utils.random(-10, 10),
                    rotation: gsap.utils.random(-30, 30),
                });

                // Animasi loop mengambang/berputar
                gsap.to(shape, {
                    xPercent: `+=${gsap.utils.random(-30, 30)}`, // Gerak horizontal
                    yPercent: `+=${gsap.utils.random(-40, 40)}`, // Gerak vertikal
                    rotation: `+=${gsap.utils.random(-90, 90)}`, // Putaran
                    scale: gsap.utils.random(0.9, 1.1), // Sedikit zoom in/out
                    duration: gsap.utils.random(8, 15), // Durasi berbeda tiap shape
                    repeat: -1, // Loop tak terbatas
                    yoyo: true, // Kembali ke state awal
                    ease: "sine.inOut", // Gerakan halus
                    delay: index * 0.5, // Mulai dengan jeda
                });
            });
            console.log("GSAP Hero Visual Shapes Animation Initialized.");
        } else if (IS_REDUCED_MOTION) {
            console.log("Hero Visual Shapes Animation skipped due to reduced motion.");
        }

        // --- Akhir dari Inisialisasi GSAP ---

        // --- Akhir Inisialisasi GSAP ---
    } catch (error) {
        console.error("Error during GSAP initialization:", error);
    }

    // --- 7. Update Footer Year ---
    const yearSpan = select("#current-year");
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    console.log("Quantum Interface Script Fully Executed.");
});
/* =============== END: script.js =============== */
