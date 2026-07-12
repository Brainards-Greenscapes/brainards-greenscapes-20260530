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

  // Desktop mega menus (Services, Service Areas, etc.)
  // Each toggle button references its panel via aria-controls, and
  // carries its own chevron icon as a child, so any number of
  // independent dropdowns can share this same behavior.
  const megaToggles = Array.from(document.querySelectorAll("[data-mega-menu-toggle]"));

  const closeAllMega = (except) => {
    megaToggles.forEach((t) => {
      if (t === except) return;
      const panel = document.getElementById(t.getAttribute("aria-controls"));
      const icon = t.querySelector("[data-mega-menu-icon]");
      if (panel) panel.classList.add("hidden");
      t.setAttribute("aria-expanded", "false");
      if (icon) icon.classList.remove("rotate-180");
    });
  };

  megaToggles.forEach((t) => {
    const panel = document.getElementById(t.getAttribute("aria-controls"));
    const icon = t.querySelector("[data-mega-menu-icon]");
    if (!panel) return;

    t.addEventListener("click", (e) => {
      e.stopPropagation();
      const isOpen = t.getAttribute("aria-expanded") === "true";
      closeAllMega();
      if (!isOpen) {
        panel.classList.remove("hidden");
        t.setAttribute("aria-expanded", "true");
        if (icon) icon.classList.add("rotate-180");
      }
    });
  });

  if (megaToggles.length) {
    document.addEventListener("click", (e) => {
      const panels = Array.from(document.querySelectorAll("[data-mega-menu-panel]"));
      const clickedInsidePanel = panels.some((p) => p.contains(e.target));
      const clickedToggle = megaToggles.some((t) => t.contains(e.target));
      if (!clickedInsidePanel && !clickedToggle) closeAllMega();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeAllMega();
    });
  }

  // Mobile accordions (Services, Service Areas, etc.)
  const accToggles = document.querySelectorAll("[data-mobile-accordion-toggle]");
  accToggles.forEach((t) => {
    const panel = document.getElementById(t.getAttribute("aria-controls"));
    const icon = t.querySelector("[data-mobile-accordion-icon]");
    if (!panel) return;

    t.addEventListener("click", () => {
      const isOpen = t.getAttribute("aria-expanded") === "true";
      panel.classList.toggle("hidden");
      t.setAttribute("aria-expanded", String(!isOpen));
      if (icon) icon.classList.toggle("rotate-180");
    });
  });
});
