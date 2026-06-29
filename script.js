(function () {
  "use strict";

  const navToggle = document.querySelector(".nav-toggle");
  const navMenu = document.querySelector(".nav-menu");
  const navLinks = document.querySelectorAll(".nav-menu a");
  const revealElements = document.querySelectorAll(".reveal");
  const contactForm = document.getElementById("contact-form");
  const formNote = document.getElementById("form-note");
  const yearEl = document.getElementById("year");
  const heroTyped = document.getElementById("hero-typed");
  const heroCursor = document.getElementById("hero-cursor");
  const sections = document.querySelectorAll("section[id]");
  const header = document.querySelector(".site-header");
  const scrollTopBtn = document.getElementById("scroll-top");
  const themeToggle = document.getElementById("theme-toggle");
  const heroVisual = document.getElementById("hero-visual");
  const canvas = document.getElementById("particles");
  const pageLoader = document.getElementById("page-loader");
  const scrollProgress = document.getElementById("scroll-progress");
  const cursorGlow = document.getElementById("cursor-glow");
  const cursorRing = document.getElementById("cursor-ring");
  const tiltCards = document.querySelectorAll(".tilt-card");
  const magneticBtns = document.querySelectorAll(".magnetic-btn");

  const bottomThreshold = 320;
  const headerOffset = 120;
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const hasFinePointer = window.matchMedia("(pointer: fine)").matches;
  const enableFancyCursor = hasFinePointer && !prefersReducedMotion;

  const typedPhrases = [
    "scaling products that millions use.",
    "cloud-native systems on AWS.",
    "cross-platform mobile with React Native.",
    "AI-powered features with LLMs.",
  ];

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;

  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  window.addEventListener("load", function () {
    document.body.classList.add("is-loaded");
    if (pageLoader) {
      setTimeout(function () {
        pageLoader.style.display = "none";
      }, 700);
    }
  });

  if (!enableFancyCursor) {
    document.body.style.cursor = "auto";
    if (cursorGlow) cursorGlow.style.display = "none";
    if (cursorRing) cursorRing.style.display = "none";
  }

  function closeMenu() {
    if (!navToggle || !navMenu) return;
    navToggle.setAttribute("aria-expanded", "false");
    navMenu.classList.remove("open");
  }

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", function () {
      const isOpen = navMenu.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });
  }

  navLinks.forEach(function (link) {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("click", function (event) {
    if (!navMenu || !navToggle) return;
    const target = event.target;
    if (!(target instanceof Element)) return;
    if (!navMenu.contains(target) && !navToggle.contains(target)) {
      closeMenu();
    }
  });

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
  );

  revealElements.forEach(function (el, index) {
    el.style.setProperty("--reveal-delay", (index % 6) * 0.08 + "s");
    observer.observe(el);
  });

  if (contactForm && formNote) {
    contactForm.addEventListener("submit", function (event) {
      event.preventDefault();

      const formData = new FormData(contactForm);
      const name = String(formData.get("name") || "").trim();
      const email = String(formData.get("email") || "").trim();
      const message = String(formData.get("message") || "").trim();

      if (!name || !email || !message) {
        formNote.textContent = "Please fill in all fields.";
        return;
      }

      const subject = encodeURIComponent("Portfolio contact from " + name);
      const body = encodeURIComponent(
        "Name: " + name + "\nEmail: " + email + "\n\n" + message
      );

      window.location.href =
        "mailto:markc9821@outlook.com?subject=" + subject + "&body=" + body;

      formNote.textContent = "Opening your email client…";
      contactForm.reset();
    });
  }

  function updateActiveNav() {
    let currentId = "";

    sections.forEach(function (section) {
      if (section.offsetTop - headerOffset <= window.scrollY) {
        currentId = section.getAttribute("id") || "";
      }
    });

    navLinks.forEach(function (link) {
      const href = link.getAttribute("href") || "";
      link.classList.toggle("active", href === "#" + currentId);
    });
  }

  function setTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("mc-theme", theme);

    if (themeToggle) {
      themeToggle.setAttribute(
        "aria-label",
        theme === "dark" ? "Switch to light theme" : "Switch to dark theme"
      );
    }
  }

  if (themeToggle) {
    const currentTheme = document.documentElement.getAttribute("data-theme") || "dark";
    setTheme(currentTheme);

    themeToggle.addEventListener("click", function () {
      const theme =
        document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
      setTheme(theme);
    });
  }

  function onScroll() {
    if (header) {
      header.classList.toggle("scrolled", window.scrollY > 24);
    }

    updateActiveNav();

    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollHeight > 0 ? (window.scrollY / scrollHeight) * 100 : 0;

    if (scrollProgress) {
      scrollProgress.style.width = progress + "%";
    }

    if (scrollTopBtn) {
      const scrollBottom = window.scrollY + window.innerHeight;
      const pageBottom = document.documentElement.scrollHeight;
      const nearBottom = scrollBottom >= pageBottom - bottomThreshold;

      scrollTopBtn.classList.toggle("visible", nearBottom);
      scrollTopBtn.hidden = !nearBottom;
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if (scrollTopBtn) {
    scrollTopBtn.addEventListener("click", function () {
      window.scrollTo({
        top: 0,
        behavior: prefersReducedMotion ? "auto" : "smooth",
      });
    });
  }

  if (heroVisual && !prefersReducedMotion && hasFinePointer) {
    document.addEventListener(
      "mousemove",
      function (event) {
        const x = (event.clientX / window.innerWidth - 0.5) * 22;
        const y = (event.clientY / window.innerHeight - 0.5) * 22;
        heroVisual.style.transform = "translate(" + x + "px, " + y + "px)";
      },
      { passive: true }
    );
  }

  if (enableFancyCursor) {
    document.addEventListener(
      "mousemove",
      function (event) {
        mouseX = event.clientX;
        mouseY = event.clientY;

        if (cursorGlow) {
          cursorGlow.style.left = mouseX + "px";
          cursorGlow.style.top = mouseY + "px";
        }
      },
      { passive: true }
    );

    function animateRing() {
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;

      if (cursorRing) {
        cursorRing.style.left = ringX + "px";
        cursorRing.style.top = ringY + "px";
      }

      requestAnimationFrame(animateRing);
    }

    animateRing();

    const hoverTargets = document.querySelectorAll(
      "a, button, .tilt-card, input, textarea, .btn"
    );

    hoverTargets.forEach(function (el) {
      el.addEventListener("mouseenter", function () {
        if (cursorRing) cursorRing.classList.add("is-hover");
      });
      el.addEventListener("mouseleave", function () {
        if (cursorRing) cursorRing.classList.remove("is-hover");
      });
    });
  }

  tiltCards.forEach(function (card) {
    if (prefersReducedMotion || !hasFinePointer) return;

    card.addEventListener("mousemove", function (event) {
      const rect = card.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -6;
      const rotateY = ((x - centerX) / centerX) * 6;

      card.style.transform =
        "perspective(800px) rotateX(" + rotateX + "deg) rotateY(" + rotateY + "deg) translateY(-4px)";
    });

    card.addEventListener("mouseleave", function () {
      card.style.transform = "";
    });
  });

  magneticBtns.forEach(function (btn) {
    if (prefersReducedMotion || !hasFinePointer) return;

    btn.addEventListener("mousemove", function (event) {
      const rect = btn.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;
      btn.style.transform = "translate(" + x * 0.2 + "px, " + y * 0.2 + "px)";
    });

    btn.addEventListener("mouseleave", function () {
      btn.style.transform = "";
    });
  });

  function animateCounter(el) {
    const target = parseInt(el.getAttribute("data-target") || "0", 10);
    const suffix = el.getAttribute("data-suffix") || "";
    const duration = 1800;
    const start = performance.now();

    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = String(Math.round(target * eased)) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  const counterEls = document.querySelectorAll(".counter");
  if (counterEls.length) {
    const counterObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    counterEls.forEach(function (el) {
      counterObserver.observe(el);
    });
  }

  if (heroTyped && !prefersReducedMotion) {
    let phraseIndex = 0;
    let charIndex = 0;
    let deleting = false;

    function typeLoop() {
      const phrase = typedPhrases[phraseIndex];

      if (!deleting) {
        heroTyped.textContent = phrase.slice(0, charIndex + 1);
        charIndex++;

        if (charIndex === phrase.length) {
          deleting = true;
          setTimeout(typeLoop, 2200);
          return;
        }
      } else {
        heroTyped.textContent = phrase.slice(0, charIndex - 1);
        charIndex--;

        if (charIndex === 0) {
          deleting = false;
          phraseIndex = (phraseIndex + 1) % typedPhrases.length;
        }
      }

      setTimeout(typeLoop, deleting ? 35 : 55);
    }

    setTimeout(typeLoop, 1000);
  } else if (heroCursor) {
    heroCursor.style.display = "none";
  }

  if (canvas && !prefersReducedMotion) {
    const ctx = canvas.getContext("2d");
    if (ctx) {
      let particles = [];
      let width = 0;
      let height = 0;
      let animationId = 0;

      function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
      }

      function createParticles() {
        const count = Math.min(100, Math.floor((width * height) / 14000));
        particles = [];

        for (let i = 0; i < count; i++) {
          particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.4,
            vy: (Math.random() - 0.5) * 0.4,
            r: Math.random() * 2 + 0.5,
          });
        }
      }

      function draw() {
        ctx.clearRect(0, 0, width, height);
        const isDark = document.documentElement.getAttribute("data-theme") !== "light";
        const dotColor = isDark ? "rgba(56, 189, 248, 0.55)" : "rgba(2, 132, 199, 0.4)";
        const lineColor = isDark ? "rgba(167, 139, 250, 0.1)" : "rgba(124, 58, 237, 0.08)";

        particles.forEach(function (p, i) {
          if (hasFinePointer) {
            const dx = mouseX - p.x;
            const dy = mouseY - p.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 140) {
              p.vx += (dx / dist) * 0.02;
              p.vy += (dy / dist) * 0.02;
            }
          }

          p.vx *= 0.99;
          p.vy *= 0.99;
          p.x += p.vx;
          p.y += p.vy;

          if (p.x < 0) p.x = width;
          if (p.x > width) p.x = 0;
          if (p.y < 0) p.y = height;
          if (p.y > height) p.y = 0;

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fillStyle = dotColor;
          ctx.fill();

          for (let j = i + 1; j < particles.length; j++) {
            const q = particles[j];
            const pdx = p.x - q.x;
            const pdy = p.y - q.y;
            const pdist = Math.sqrt(pdx * pdx + pdy * pdy);

            if (pdist < 130) {
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(q.x, q.y);
              ctx.strokeStyle = lineColor;
              ctx.lineWidth = 1 - pdist / 130;
              ctx.stroke();
            }
          }
        });

        animationId = requestAnimationFrame(draw);
      }

      resize();
      createParticles();
      draw();

      window.addEventListener("resize", function () {
        resize();
        createParticles();
      });

      if (themeToggle) {
        themeToggle.addEventListener("click", function () {
          cancelAnimationFrame(animationId);
          draw();
        });
      }
    }
  }
})();
