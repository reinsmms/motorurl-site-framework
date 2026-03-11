(function () {

let currentLink = null;

function updateBreadcrumb(pathArray) {

const crumb = document.getElementById("crumbs");

if (!crumb) return;

const parts = ["3D Printing", ...pathArray];

crumb.textContent = parts.join(" / ");

}

function loadPage(url, linkElement, pathArray) {

const frame = document.getElementById("contentFrame");

if (!frame) return;

frame.src = url;

/* highlight active link */

if (currentLink) {
currentLink.classList.remove("active");
}

linkElement.classList.add("active");

currentLink = linkElement;

/* update breadcrumb */

updateBreadcrumb(pathArray);

}

function buildNavItem(item, container, parentPath = []) {

const li = document.createElement("li");

const link = document.createElement("a");

link.textContent = item.title;

const pathArray = [...parentPath, item.title];

if (item.url) {

link.href = "#";

link.dataset.url = item.url;

link.addEventListener("click", function (e) {

e.preventDefault();

loadPage(item.url, link, pathArray);

});

}

li.appendChild(link);

/* children */

if (item.children && item.children.length > 0) {

const subList = document.createElement("ul");

subList.classList.add("nav-sub");

item.children.forEach(child => {

buildNavItem(child, subList, pathArray);

});

li.appendChild(subList);

}

container.appendChild(li);

}

function buildNavigation() {

const navContainer = document.getElementById("treeNav");

if (!navContainer || !NAV_DATA) return;

const list = document.createElement("ul");

NAV_DATA.forEach(item => {

buildNavItem(item, list);

});

navContainer.appendChild(list);

}

document.addEventListener("DOMContentLoaded", buildNavigation);

})();
