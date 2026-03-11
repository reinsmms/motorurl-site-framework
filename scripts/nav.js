(function () {
  let currentLink = null;

  function updateBreadcrumb(pathArray) {
    const crumb = document.getElementById("crumbs");
    if (!crumb) return;

    const parts = ["3D Printing", ...pathArray];
    crumb.textContent = parts.join(" / ");
  }

  function setActiveLink(linkElement) {
    if (currentLink) {
      currentLink.classList.remove("active");
      currentLink.removeAttribute("aria-current");
    }

    if (linkElement) {
      linkElement.classList.add("active");
      linkElement.setAttribute("aria-current", "page");
      currentLink = linkElement;
    }
  }

  function loadPage(url, linkElement, pathArray) {
    const frame = document.getElementById("contentFrame");
    if (!frame || !url) return;

    frame.src = url;
    setActiveLink(linkElement);
    updateBreadcrumb(pathArray);
  }

  function buildNavItem(item, container, parentPath = []) {
    const li = document.createElement("li");
    const pathArray = [...parentPath, item.title];
    const hasChildren = Array.isArray(item.children) && item.children.length > 0;

    if (hasChildren) {
      li.className = "branch";
      li.setAttribute("data-open", "false");

      const header = document.createElement("div");
      header.className = "branchHeader";

      const toggleBtn = document.createElement("button");
      toggleBtn.type = "button";
      toggleBtn.className = "branch__toggleBtn";
      toggleBtn.setAttribute("aria-expanded", "false");
      toggleBtn.setAttribute("aria-label", `Toggle ${item.title}`);

      const chev = document.createElement("span");
      chev.className = "chev";
      toggleBtn.appendChild(chev);

      const title = document.createElement("span");
      title.className = "branch__titleLink";
      title.textContent = item.title;
      title.tabIndex = 0;
      title.setAttribute("role", "button");
      title.setAttribute("aria-expanded", "false");

      const childList = document.createElement("div");
      childList.className = "branch__items";

      function setOpen(isOpen) {
        li.setAttribute("data-open", isOpen ? "true" : "false");
        toggleBtn.setAttribute("aria-expanded", isOpen ? "true" : "false");
        title.setAttribute("aria-expanded", isOpen ? "true" : "false");
      }

      function toggleOpen() {
        const isOpen = li.getAttribute("data-open") === "true";
        setOpen(!isOpen);
      }

      toggleBtn.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        toggleOpen();
      });

      header.addEventListener("click", function (e) {
        if (e.target === toggleBtn || toggleBtn.contains(e.target)) return;
        toggleOpen();
      });

      title.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          toggleOpen();
        }
      });

      header.appendChild(toggleBtn);
      header.appendChild(title);
      li.appendChild(header);

      item.children.forEach(function (child) {
        buildNavItem(child, childList, pathArray);
      });

      li.appendChild(childList);
    } else {
      const link = document.createElement("a");
      link.className = "navItem";
      link.textContent = item.title;
      link.href = "#";
      link.dataset.url = item.url || "";

      link.addEventListener("click", function (e) {
        e.preventDefault();
        loadPage(item.url, link, pathArray);
      });

      li.appendChild(link);
    }

    container.appendChild(li);
  }

  function buildNavigation() {
    const navContainer = document.getElementById("treeNav");
    if (!navContainer || typeof NAV_DATA === "undefined") return;

    navContainer.innerHTML = "";

    const root = document.createElement("div");
    NAV_DATA.forEach(function (item) {
      buildNavItem(item, root);
    });

    navContainer.appendChild(root);
  }

  document.addEventListener("DOMContentLoaded", buildNavigation);
})();