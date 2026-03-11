// Part 03: TOC controller (parent page)
(function () {
  const frame = document.getElementById('contentFrame');
  const tocPanel = document.getElementById('tocPanel');
  const tocList = document.getElementById('tocList');
  const tocToggle = document.getElementById('tocToggle');

  function clearToc() {
    if (tocList) tocList.innerHTML = '';
  }

  function renderToc(payload) {
    if (!tocList) return;
    clearToc();

    const items = Array.isArray(payload.items) ? payload.items : [];
    if (!items.length) return;

    const frag = document.createDocumentFragment();
    items.forEach(it => {
      const a = document.createElement('a');
      a.href = '#';
      a.textContent = it.text || '';
      a.dataset.tocId = it.id;
      if (it.level === 3) a.classList.add('tocItem--h3');

      a.addEventListener('click', (e) => {
        e.preventDefault();
        if (frame && frame.contentWindow) {
          frame.contentWindow.postMessage({ type: 'motorurl:scrollTo', id: it.id }, '*');
        }
      });

      frag.appendChild(a);
    });

    tocList.appendChild(frag);
  }

  window.addEventListener('message', (e) => {
    if (!e || !e.data) return;
    if (e.data.type === 'motorurl:toc') renderToc(e.data);
  });

  // Request TOC whenever iframe loads a new page
  if (frame) {
    frame.addEventListener('load', () => {
      clearToc();
      try {
        frame.contentWindow.postMessage({ type: 'motorurl:requestToc' }, '*');
      } catch (_) {}
    });
  }

  // Toggle (only really needed on narrow screens; harmless otherwise)
  if (tocToggle && tocPanel) {
    tocToggle.addEventListener('click', () => {
      const isHidden = getComputedStyle(tocPanel).display === 'none';
      tocPanel.style.display = isHidden ? 'block' : 'none';
      tocToggle.setAttribute('aria-expanded', String(isHidden));
    });
  }
})();
