(() => {
  "use strict";

  // ---------- Custom cursor ----------
  const dot = document.querySelector(".cursor-dot");
  const ring = document.querySelector(".cursor-ring");
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;

  window.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (dot) {
      dot.style.left = mouseX + "px";
      dot.style.top = mouseY + "px";
    }
  });

  function cursorLoop() {
    ringX += (mouseX - ringX) * 0.16;
    ringY += (mouseY - ringY) * 0.16;
    if (ring) {
      ring.style.left = ringX + "px";
      ring.style.top = ringY + "px";
    }
    requestAnimationFrame(cursorLoop);
  }
  cursorLoop();

  document.querySelectorAll("[data-cursor]").forEach((el) => {
    el.addEventListener("mouseenter", () => ring?.classList.add("active"));
    el.addEventListener("mouseleave", () => ring?.classList.remove("active"));
  });

  // ---------- Magnetic buttons ----------
  if (window.matchMedia("(pointer: fine)").matches) {
    document.querySelectorAll(".magnetic").forEach((el) => {
      el.addEventListener("mousemove", (e) => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - (r.left + r.width / 2)) * 0.14;
        const y = (e.clientY - (r.top + r.height / 2)) * 0.14;
        el.style.transform = `translate(${x}px, ${y}px)`;
      });
      el.addEventListener("mouseleave", () => {
        el.style.transform = "";
      });
    });
  }

  // ---------- Product 3D tilt ----------
  const tilt = document.querySelector("[data-tilt]");
  if (tilt && window.matchMedia("(pointer: fine)").matches) {
    tilt.addEventListener("mousemove", (e) => {
      const r = tilt.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      tilt.style.transform =
        `perspective(900px) rotateY(${x * 7}deg) rotateX(${-y * 7}deg) translateZ(8px)`;
    });
    tilt.addEventListener("mouseleave", () => {
      tilt.style.transform = "";
    });
  }

  // ---------- Scroll reveal ----------
  const revealItems = document.querySelectorAll(".reveal");
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealItems.forEach((item, index) => {
    item.style.transitionDelay = `${Math.min(index % 5, 4) * 70}ms`;
    observer.observe(item);
  });

  // ---------- Lightweight scroll parallax ----------
  const parallaxItems = document.querySelectorAll("[data-parallax]");
  let ticking = false;

  function updateParallax() {
    const scrollY = window.scrollY;
    parallaxItems.forEach((el) => {
      const speed = Number(el.dataset.parallax) || 0.02;
      const rect = el.getBoundingClientRect();
      const center = rect.top + rect.height / 2 - window.innerHeight / 2;
      const shift = -center * speed;
      el.style.transform = `translate3d(0, ${shift}px, 0)`;
    });
    ticking = false;
  }

  window.addEventListener("scroll", () => {
    if (!ticking) {
      requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }, { passive: true });

  updateParallax();

  // ---------- Mobile menu ----------
  const menu = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav");

  menu?.addEventListener("click", () => {
    const open = menu.getAttribute("aria-expanded") === "true";
    menu.setAttribute("aria-expanded", String(!open));

    if (window.innerWidth <= 900) {
      nav.style.display = open ? "" : "flex";
      nav.style.position = "absolute";
      nav.style.top = "72px";
      nav.style.left = "0";
      nav.style.right = "0";
      nav.style.padding = "25px 24px 30px";
      nav.style.margin = "0";
      nav.style.flexDirection = "column";
      nav.style.background = "rgba(7,7,7,.96)";
      nav.style.backdropFilter = "blur(18px)";
      nav.style.borderBottom = "1px solid rgba(255,255,255,.1)";
      nav.style.gap = "20px";
    }
  });

  nav?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      if (window.innerWidth <= 900) {
        nav.style.display = "";
        menu?.setAttribute("aria-expanded", "false");
      }
    });
  });

  // ---------- Subtle hero mouse light ----------
  const hero = document.querySelector(".hero");
  if (hero && window.matchMedia("(pointer: fine)").matches) {
    hero.addEventListener("mousemove", (e) => {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      hero.style.setProperty("--mx", `${x}%`);
      hero.style.setProperty("--my", `${y}%`);
    });
  }
})();
