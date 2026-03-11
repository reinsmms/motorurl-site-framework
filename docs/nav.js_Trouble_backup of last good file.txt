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

if (currentLink) {
currentLink.classList.remove("active");
}

if (linkElement) {
linkElement.classList.add("active");
currentLink = linkElement;
}

updateBreadcrumb(pathArray);

}

function buildNavItem(item, container, parentPath = []) {

const li = document.createElement("li");
const pathArray = [...parentPath, item.title];
const hasChildren = item.children && item.children.length > 0;

if (hasChildren) {

li.classList.add("branch");

const row = document.createElement("div");
row.classList.add("branch__row");

const toggle = document.createElement("button");
toggle.type = "button";
toggle.classList.add("branch__toggle");
toggle.setAttribute("aria-expanded", "false");
toggle.textContent = "?";

const label = document.createElement("span");
label.classList.add("branch__label");
label.textContent = item.title;

const subList = document.createElement("ul");
subList.classList.add("nav-sub");
subList.style.display = "none";

toggle.addEventListener("click", function () {

const expanded = toggle.getAttribute("aria-expanded") === "true";

toggle.setAttribute("aria-expanded", expanded ? "false" : "true");
toggle.textContent = expanded ? "?" : "?";
subList.style.display = expanded ? "none" : "block";

});

label.addEventListener("click", function () {

const expanded = toggle.getAttribute("aria-expanded") === "true";

toggle.setAttribute("aria-expanded", expanded ? "false" : "true");
toggle.textContent = expanded ? "?" : "?";
subList.style.display = expanded ? "none" : "block";

});

row.appendChild(toggle);
row.appendChild(label);
li.appendChild(row);

item.children.forEach(child => {
buildNavItem(child, subList, pathArray);
});

li.appendChild(subList);

} else {

const link = document.createElement("a");
link.classList.add("navItem");
link.textContent = item.title;
link.href = "#";
link.dataset.url = item.url || "";

link.addEventListener("click", function (e) {

e.preventDefault();

if (!item.url) return;

loadPage(item.url, link, pathArray);

});

li.appendChild(link);

}

container.appendChild(li);

}

function buildNavigation() {

const navContainer = document.getElementById("treeNav");

if (!navContainer || !NAV_DATA) return;

navContainer.innerHTML = "";

const list = document.createElement("ul");

NAV_DATA.forEach(item => {
buildNavItem(item, list);
});

navContainer.appendChild(list);

}

document.addEventListener("DOMContentLoaded", buildNavigation);

})();

const list = document.createElement("ul");

NAV_DATA.forEach(item => {

buildNavItem(item, list);

});

navContainer.appendChild(list);

}

document.addEventListener("DOMContentLoaded", buildNavigation);

})();
