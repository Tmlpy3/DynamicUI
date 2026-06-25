import { getScene, NAV_ITEMS, parseRole, SUPPORTED_ROLES } from "./scenes.js";
import { renderDashboard, renderSidebar } from "./renderers.js";

function normalizedRole(role) {
  return SUPPORTED_ROLES.includes(role) ? role : parseRole("");
}

function mount(role = parseRole(window.location.search)) {
  const shell = document.querySelector("#appShell");
  if (!shell) return;

  const scene = getScene(role);
  document.body.dataset.scene = scene.id;
  shell.innerHTML = `${renderSidebar(NAV_ITEMS)}${renderDashboard(scene)}`;
}

function switchRole(role, { replace = false } = {}) {
  const nextRole = normalizedRole(role);
  const url = new URL(window.location.href);
  url.searchParams.set("role", nextRole);

  if (replace) {
    window.history.replaceState({ role: nextRole }, "", url);
  } else {
    window.history.pushState({ role: nextRole }, "", url);
  }

  mount(nextRole);
}

document.addEventListener("click", (event) => {
  const target = event.target.closest("[data-role-target]");
  if (!target) return;

  event.preventDefault();
  switchRole(target.dataset.roleTarget);
});

document.addEventListener("keydown", (event) => {
  if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey || event.defaultPrevented) return;

  if (event.key === "1") {
    event.preventDefault();
    switchRole("elder");
  }

  if (event.key === "2") {
    event.preventDefault();
    switchRole("dad");
  }

  if (event.key === "3") {
    event.preventDefault();
    switchRole("mom");
  }
});

window.addEventListener("popstate", () => {
  mount(parseRole(window.location.search));
});

document.addEventListener("DOMContentLoaded", () => {
  switchRole(parseRole(window.location.search), { replace: true });
});
