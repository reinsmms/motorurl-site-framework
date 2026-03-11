// scripts/gallery.js
(function () {
  const grid = document.getElementById("galleryGrid");
  const title = document.getElementById("galleryTitle");
  const status = document.getElementById("galleryStatus");

  const lightbox = document.getElementById("lightbox");
  const viewer = document.getElementById("lbViewer");
  const lbLabel = document.getElementById("lbLabel");
  const btnPrev = document.getElementById("lbPrev");
  const btnNext = document.getElementById("lbNext");
  const btnClose = document.getElementById("lbClose");

  let items = [];
  let basePath = "";
  let index = 0;

  function parseGalleryPath() {
    const raw = (location.hash || "").replace(/^#/, "");
    const m = raw.match(/(?:^|&)g=([^&]+)/);
    if (!m) return "";
    return decodeURIComponent(m[1]);
  }
  function manifestUrl(path) { return `../${path.replace(/\/+$/,"")}/manifest.json`; }
  function setStatus(msg) { if (status) status.textContent = msg || ""; }
  function clearViewer() { if (viewer) viewer.innerHTML = ""; }

  function openLightbox(i) {
    index = i;
    const item = items[index];
    if (!item) return;

    clearViewer();
    const full = `../${basePath.replace(/\/+$/,"")}/${item.file}`;

    if (item.type === "video") {
      const v = document.createElement("video");
      v.controls = true; // no autoplay
      v.src = full;
      viewer.appendChild(v);
    } else {
      const img = document.createElement("img");
      img.src = full;
      img.alt = item.file;
      viewer.appendChild(img);
    }

    if (lbLabel) lbLabel.textContent = `${index + 1} / ${items.length} — ${item.file}`;
    lightbox?.setAttribute("data-open", "true");
  }

  function closeLightbox() { lightbox?.setAttribute("data-open", "false"); clearViewer(); }
  function prev() { if (!items.length) return; openLightbox((index - 1 + items.length) % items.length); }
  function next() { if (!items.length) return; openLightbox((index + 1) % items.length); }

  async function load() {
    const path = parseGalleryPath();
    if (!path) {
      setStatus("No gallery selected. Use a page's Gallery link or add #g=assets/your-folder.");
      grid.innerHTML = "";
      return;
    }

    basePath = path;
    if (title) title.textContent = path;
    setStatus("Loading…");

    try {
      const res = await fetch(manifestUrl(path), { cache: "no-store" });
      if (!res.ok) throw new Error("manifest missing");
      const manifest = await res.json();
      basePath = manifest.basePath || path;
      items = (manifest.items || []);

      if (!items.length) {
        setStatus("Manifest found, but it has no items yet.");
        grid.innerHTML = "";
        return;
      }

      setStatus("");
      grid.innerHTML = "";

      items.forEach((it, i) => {
        const card = document.createElement("div");
        card.className = "thumb";
        card.tabIndex = 0;
        card.setAttribute("role", "button");
        card.setAttribute("aria-label", it.file);

        const full = `../${basePath.replace(/\/+$/,"")}/${it.file}`;

        if (it.type === "video") {
          const v = document.createElement("video");
          v.src = full;
          v.muted = true;
          v.playsInline = true;
          v.preload = "metadata";
          card.appendChild(v);

          const badge = document.createElement("div");
          badge.className = "thumb__badge";
          badge.textContent = "Video";
          card.appendChild(badge);
        } else {
          const img = document.createElement("img");
          img.src = full;
          img.alt = it.file;
          img.loading = "lazy";
          card.appendChild(img);
        }

        const act = () => openLightbox(i);
        card.addEventListener("click", act);
        card.addEventListener("keydown", (e) => {
          if (e.key === "Enter" || e.key === " ") { e.preventDefault(); act(); }
        });

        grid.appendChild(card);
      });

    } catch (e) {
      setStatus(`Couldn't load manifest for "${path}". Make sure ${path}/manifest.json exists.`);
      grid.innerHTML = "";
    }
  }

  btnPrev?.addEventListener("click", prev);
  btnNext?.addEventListener("click", next);
  btnClose?.addEventListener("click", closeLightbox);
  lightbox?.addEventListener("click", (e) => { if (e.target === lightbox) closeLightbox(); });

  window.addEventListener("keydown", (e) => {
    if (lightbox?.getAttribute("data-open") !== "true") return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") prev();
    if (e.key === "ArrowRight") next();
  });

  window.addEventListener("hashchange", load);
  load();
})();
