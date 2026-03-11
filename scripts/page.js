// scripts/page.js
// Iframe pages: Gallery link + Top smooth scroll
(function () {
  const galleryLink = document.getElementById("galleryLink");
  const topLink = document.getElementById("topLink");
  const topAnchor = document.getElementById("top");

  function setGalleryLink(path, enabled) {
    if (!galleryLink) return;
    const on = enabled !== false && !!path;
    galleryLink.style.display = on ? "inline-flex" : "none";
    if (on) galleryLink.setAttribute("href", `gallery.html#g=${encodeURIComponent(path)}`);
  }

  topLink?.addEventListener("click", (e) => {
    e.preventDefault();
    (topAnchor || document.body).scrollIntoView({ behavior: "smooth", block: "start" });
  });

  const body = document.body;
  const localPath = body?.dataset?.galleryPath || "";
  const localEnabledRaw = body?.dataset?.galleryEnabled;
  const localEnabled = localEnabledRaw === undefined ? undefined : (localEnabledRaw !== "false");

  setGalleryLink(localPath, localEnabled);

  window.addEventListener("message", (event) => {
    const data = event.data || {};
    if (data.type !== "motorurl:pageMeta") return;
    const meta = data.meta || {};
    const path = meta.galleryPath ?? localPath;
    const enabled = (meta.showGalleryLink === undefined) ? localEnabled : meta.showGalleryLink;
    setGalleryLink(path, enabled);
  });
})();
