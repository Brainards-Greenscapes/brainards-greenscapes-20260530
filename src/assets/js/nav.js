// Mobile navigation toggle
document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.querySelector("[data-nav-toggle]");
  const menu = document.querySelector("[data-nav-menu]");

  if (toggle && menu) {
    toggle.addEventListener("click", () => {
      const isOpen = !menu.classList.contains("hidden");
      menu.classList.toggle("hidden");
      toggle.setAttribute("aria-expanded", !isOpen);
      toggle.setAttribute("aria-label", isOpen ? "Open menu" : "Close menu");
    });
  }

  // Desktop Services mega menu
  const megaToggle = document.querySelector("[data-mega-menu-toggle]");
  const megaPanel = document.querySelector("[data-mega-menu-panel]");
  const megaIcon = document.querySelector("[data-mega-menu-icon]");

  if (megaToggle && megaPanel) {
    const closeMega = () => {
      megaPanel.classList.add("hidden");
      megaToggle.setAttribute("aria-expanded", "false");
      if (megaIcon) megaIcon.classList.remove("rotate-180");
    };

    const openMega = () => {
      megaPanel.classList.remove("hidden");
      megaToggle.setAttribute("aria-expanded", "true");
      if (megaIcon) megaIcon.classList.add("rotate-180");
    };

    megaToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      const isOpen = megaToggle.getAttribute("aria-expanded") === "true";
      isOpen ? closeMega() : openMega();
    });

    document.addEventListener("click", (e) => {
      if (!megaPanel.contains(e.target) && !megaToggle.contains(e.target)) {
        closeMega();
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeMega();
    });
  }

  // Mobile Services accordion
  const accToggle = document.querySelector("[data-mobile-accordion-toggle]");
  const accPanel = document.querySelector("[data-mobile-accordion-panel]");
  const accIcon = document.querySelector("[data-mobile-accordion-icon]");

  if (accToggle && accPanel) {
    accToggle.addEventListener("click", () => {
      const isOpen = accToggle.getAttribute("aria-expanded") === "true";
      accPanel.classList.toggle("hidden");
      accToggle.setAttribute("aria-expanded", String(!isOpen));
      if (accIcon) accIcon.classList.toggle("rotate-180");
    });
  }
});
