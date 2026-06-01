document.addEventListener("DOMContentLoaded", () => {
  const tabs = document.querySelectorAll("[data-filter]");
  const items = document.querySelectorAll(".gallery-item");
  if (!tabs.length || !items.length) return;

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const filter = tab.dataset.filter;

      // Update active tab styling
      tabs.forEach((t) => {
        t.classList.remove("bg-green-700", "text-white");
        t.classList.add("bg-gray-100", "text-gray-700");
        t.setAttribute("aria-selected", "false");
      });
      tab.classList.remove("bg-gray-100", "text-gray-700");
      tab.classList.add("bg-green-700", "text-white");
      tab.setAttribute("aria-selected", "true");

      // Filter items
      items.forEach((item) => {
        if (filter === "all" || item.dataset.category === filter) {
          item.style.display = "";
        } else {
          item.style.display = "none";
        }
      });
    });
  });
});
