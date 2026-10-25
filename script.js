/* =========================================================
   LITTLE BIG HELP — WEBSITE INTERACTIONS
   Responsive • Accessible • Lightweight
   Works with index.html and style.css
   ========================================================= */

"use strict";

document.addEventListener("DOMContentLoaded", () => {
  // -------------------------------------------------------
  // 1. SELECT ELEMENTS
  // -------------------------------------------------------

  const menuToggle = document.querySelector(".menu-toggle");
  const navMenu = document.querySelector("#primary-navigation");
  const navLinks = document.querySelectorAll(
    '.nav-menu a[href^="#"]'
  );

  const sections = document.querySelectorAll(
    "main section[id]"
  );

  const animatedElements = document.querySelectorAll(
    [
      ".hero-content",
      ".hero-visual",
      ".section-heading",
      ".service-card",
      ".process-step",
      ".about-content",
      ".about-visual",
      ".contact-content",
      ".contact-socials"
    ].join(",")
  );

  // -------------------------------------------------------
  // 2. MOBILE NAVIGATION
  // -------------------------------------------------------

  function openMenu() {
    if (!menuToggle || !navMenu) return;

    navMenu.classList.add("is-open");
    menuToggle.classList.add("is-active");
    menuToggle.setAttribute("aria-expanded", "true");
    menuToggle.setAttribute("aria-label", "Close navigation menu");

    document.body.classList.add("menu-open");
  }

  function closeMenu() {
    if (!menuToggle || !navMenu) return;

    navMenu.classList.remove("is-open");
    menuToggle.classList.remove("is-active");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation menu");

    document.body.classList.remove("menu-open");
  }

  function toggleMenu() {
    if (!navMenu) return;

    const isOpen = navMenu.classList.contains("is-open");

    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  if (menuToggle && navMenu) {
    menuToggle.addEventListener("click", toggleMenu);

    // Close after selecting a navigation link.
    navLinks.forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    // Close when Escape is pressed.
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    });

    // Close when the user taps outside the mobile menu.
    document.addEventListener("click", (event) => {
      const clickedInsideMenu = navMenu.contains(event.target);
      const clickedToggle = menuToggle.contains(event.target);

      if (!clickedInsideMenu && !clickedToggle) {
        closeMenu();
      }
    });

    // Reset mobile menu state when switching to desktop layout.
    window.addEventListener("resize", () => {
      if (window.innerWidth > 900) {
        closeMenu();
      }
    });
  }

  // -------------------------------------------------------
  // 3. SMOOTH IN-PAGE NAVIGATION
  // -------------------------------------------------------

  // CSS should define scroll-behavior: smooth.
  // This helper keeps anchor navigation consistent and
  // accounts for a sticky header when present.

  function scrollToTarget(target) {
    if (!target) return;

    const header = document.querySelector(".site-header");
    const headerHeight = header
      ? header.getBoundingClientRect().height
      : 0;

    const targetPosition =
      target.getBoundingClientRect().top +
      window.scrollY -
      headerHeight;

    window.scrollTo({
      top: Math.max(0, targetPosition),
      behavior: window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches
        ? "auto"
        : "smooth"
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const href = link.getAttribute("href");

      if (!href || href === "#") return;

      const target = document.querySelector(href);

      if (!target) return;

      event.preventDefault();
      closeMenu();
      scrollToTarget(target);

      // Keep the URL useful without forcing a page reload.
      if (history.replaceState) {
        history.replaceState(null, "", href);
      }
    });
  });

  // -------------------------------------------------------
  // 4. SCROLL-REVEAL ANIMATIONS
  // -------------------------------------------------------

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if ("IntersectionObserver" in window && !reduceMotion) {
    // Add the class only when JavaScript is active.
    // CSS can animate elements with .reveal-on-scroll.
    animatedElements.forEach((element) => {
      element.classList.add("reveal-on-scroll");
    });

    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -35px 0px"
      }
    );

    animatedElements.forEach((element) => {
      revealObserver.observe(element);
    });
  } else {
    // Keep content visible on older browsers and when the
    // visitor has requested reduced motion.
    animatedElements.forEach((element) => {
      element.classList.add("is-visible");
    });
  }

  // -------------------------------------------------------
  // 5. ACTIVE NAVIGATION LINK
  // -------------------------------------------------------

  if ("IntersectionObserver" in window && sections.length) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const currentId = entry.target.id;

          navLinks.forEach((link) => {
            const isActive =
              link.getAttribute("href") === `#${currentId}`;

            link.classList.toggle("active", isActive);

            if (isActive) {
              link.setAttribute("aria-current", "location");
            } else {
              link.removeAttribute("aria-current");
            }
          });
        });
      },
      {
        rootMargin: "-25% 0px -60% 0px",
        threshold: 0
      }
    );

    sections.forEach((section) => {
      sectionObserver.observe(section);
    });
  }

  // -------------------------------------------------------
  // 6. HEADER SCROLL STATE
  // -------------------------------------------------------

  const header = document.querySelector(".site-header");

  if (header) {
    let ticking = false;

    function updateHeader() {
      header.classList.toggle(
        "is-scrolled",
        window.scrollY > 20
      );

      ticking = false;
    }

    window.addEventListener(
      "scroll",
      () => {
        if (!ticking) {
          window.requestAnimationFrame(updateHeader);
          ticking = true;
        }
      },
      { passive: true }
    );

    updateHeader();
  }

  // -------------------------------------------------------
  // 7. STAGGERED CARD ANIMATIONS
  // -------------------------------------------------------

  // CSS uses --reveal-delay to stagger cards gently.
  // Keep the delay short so the website remains responsive.

  document
    .querySelectorAll(".services-grid .service-card")
    .forEach((card, index) => {
      card.style.setProperty(
        "--reveal-delay",
        `${index * 100}ms`
      );
    });

  document
    .querySelectorAll(".process-grid .process-step")
    .forEach((step, index) => {
      step.style.setProperty(
        "--reveal-delay",
        `${index * 120}ms`
      );
    });

  // -------------------------------------------------------
  // 8. ORBIT MOTION ACCESSIBILITY
  // -------------------------------------------------------

  // The orbital paths rotate in CSS for better performance.
  // Pause their motion when the visitor requests reduced
  // motion. No JavaScript animation loop is needed.

  function syncMotionPreference() {
    document.documentElement.classList.toggle(
      "reduce-motion",
      reduceMotion
    );
  }

  syncMotionPreference();

  // -------------------------------------------------------
  // 9. CURRENT YEAR IN FOOTER
  // -------------------------------------------------------

  const yearElement = document.querySelector("#current-year");

  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // -------------------------------------------------------
  // 10. EXTERNAL LINKS SAFETY
  // -------------------------------------------------------

  document
    .querySelectorAll('a[target="_blank"]')
    .forEach((link) => {
      link.setAttribute("rel", "noopener noreferrer");
    });

  // -------------------------------------------------------
  // 11. IMAGE FALLBACK
  // -------------------------------------------------------

  document.querySelectorAll("img").forEach((img) => {
    img.addEventListener("error", () => {
      img.classList.add("image-load-error");
    });
  });

});