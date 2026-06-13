const header = document.querySelector(".site-header");
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelectorAll(".site-nav a");
const counters = document.querySelectorAll("[data-count]");
const fallbackImages = document.querySelectorAll("img[data-fallback]");
const revealTargets = document.querySelectorAll(
  ".quick-links a, .intro-copy, .intro-stats article, .product-tabs, .product-card, .solution-grid article, .factory-visual, .process-list article, .service-grid article, .news-list article, .contact-card"
);

revealTargets.forEach((item) => item.classList.add("reveal"));

fallbackImages.forEach((image) => {
  image.addEventListener(
    "error",
    () => {
      if (image.src.endsWith(image.dataset.fallback || "")) {
        return;
      }

      image.src = image.dataset.fallback;
    },
    { once: true }
  );
});

if (navToggle && header) {
  navToggle.addEventListener("click", () => {
    const open = header.classList.toggle("menu-open");
    navToggle.setAttribute("aria-expanded", String(open));
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      header.classList.remove("menu-open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
}

const animateCounter = (node) => {
  const target = Number(node.dataset.count || "0");
  const duration = 1400;
  const start = performance.now();

  const step = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = Math.floor(target * eased);
    node.textContent = value.toLocaleString("zh-CN") + "+";

    if (progress < 1) {
      requestAnimationFrame(step);
    }
  };

  requestAnimationFrame(step);
};

const onIntersect = (entries, instance) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) {
      return;
    }

    entry.target.classList.add("is-visible");

    if (entry.target.dataset.count && !entry.target.dataset.animated) {
      entry.target.dataset.animated = "true";
      animateCounter(entry.target);
    }

    if (instance) {
      instance.unobserve(entry.target);
    }
  });
};

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries) => onIntersect(entries, observer), {
    threshold: 0.2,
  });

  [...revealTargets, ...counters].forEach((item) => observer.observe(item));
} else {
  revealTargets.forEach((item) => item.classList.add("is-visible"));
  counters.forEach((item) => {
    if (!item.dataset.animated) {
      item.dataset.animated = "true";
      animateCounter(item);
    }
  });
}
