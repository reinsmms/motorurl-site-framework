// scripts/ui.js
(function () {
  const btn = document.getElementById("hamburgerBtn");
  const sidebar = document.getElementById("sidebar");
  if (!btn || !sidebar) return;

  const backdrop = document.createElement("div");
  backdrop.className = "backdrop";
  document.body.appendChild(backdrop);

  function setOpen(open) {
    document.body.classList.toggle("menu-open", open);
    btn.setAttribute("aria-expanded", open ? "true" : "false");
  }

  btn.addEventListener("click", () => setOpen(!document.body.classList.contains("menu-open")));
  backdrop.addEventListener("click", () => setOpen(false));
  window.addEventListener("motorurl:navigate", () => setOpen(false));
  window.addEventListener("keydown", (e) => { if (e.key === "Escape") setOpen(false); });
})();
