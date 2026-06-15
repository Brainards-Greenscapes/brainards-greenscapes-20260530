document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("[data-before-after]").forEach((container) => {
    const beforeImg = container.querySelector("[data-before-img]");
    const line = container.querySelector("[data-before-line]");
    const knob = container.querySelector("[data-before-knob]");
    if (!beforeImg || !line || !knob) return;

    function update(x) {
      const rect = container.getBoundingClientRect();
      let pct = ((x - rect.left) / rect.width) * 100;
      pct = Math.max(0, Math.min(100, pct));
      beforeImg.style.clipPath = "inset(0 " + (100 - pct) + "% 0 0)";
      line.style.left = pct + "%";
      knob.style.left = pct + "%";
    }

    function setAt(pct) {
      beforeImg.style.clipPath = "inset(0 " + (100 - pct) + "% 0 0)";
      line.style.left = pct + "%";
      knob.style.left = pct + "%";
    }
    setAt(50);
    window.addEventListener("resize", () => setAt(50));

    let dragging = false;

    container.addEventListener("mousedown", (e) => {
      e.preventDefault();
      dragging = true;
      update(e.clientX);
    });
    window.addEventListener("mousemove", (e) => {
      if (dragging) update(e.clientX);
    });
    window.addEventListener("mouseup", () => { dragging = false; });

    container.addEventListener("touchstart", (e) => {
      dragging = true;
      update(e.touches[0].clientX);
    }, { passive: true });
    window.addEventListener("touchmove", (e) => {
      if (dragging) update(e.touches[0].clientX);
    }, { passive: true });
    window.addEventListener("touchend", () => { dragging = false; });
  });
});
