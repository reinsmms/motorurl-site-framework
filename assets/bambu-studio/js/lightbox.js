// Simple image lightbox for Bambu Studio Manual
// Usage: add class="lightbox-thumb" and data-full="path/to/image.png" to <img>

(function () {
  // Create lightbox container once
  const lightbox = document.createElement("div");
  lightbox.id = "lightbox-overlay";
  lightbox.innerHTML = '<img alt="Expanded image">';
  document.body.appendChild(lightbox);

  const lightboxImg = lightbox.querySelector("img");

  // Click handler
  document.addEventListener("click", function (e) {
    const target = e.target;

    // Open lightbox
    if (target.classList.contains("lightbox-thumb")) {
      const fullSrc = target.dataset.full || target.src;
      lightboxImg.src = fullSrc;
      lightbox.style.display = "flex";
      document.body.style.overflow = "hidden";
    }

    // Close lightbox (click outside image)
    if (target.id === "lightbox-overlay") {
      closeLightbox();
    }
  });

  // Close on ESC key
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      closeLightbox();
    }
  });

  function closeLightbox() {
    lightbox.style.display = "none";
    lightboxImg.src = "";
    document.body.style.overflow = "";
  }
})();
