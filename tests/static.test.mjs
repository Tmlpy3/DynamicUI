import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

test("index wires the stylesheet, app module, favicon, and shell", () => {
  const html = readFileSync("index.html", "utf8");

  assert.ok(html.includes('href="styles.css"'));
  assert.ok(html.includes('type="module" src="src/app.js"'));
  assert.ok(html.includes('href="assets/icons-ai/home.png"'));
  assert.ok(html.includes('id="appShell"'));
});

test("server supports html css js and png content types", () => {
  const server = readFileSync("server.mjs", "utf8");

  for (const ext of ['".html"', '".css"', '".js"', '".png"']) {
    assert.ok(server.includes(ext), ext);
  }
});

test("server maps root requests to index and resolves static content types", async () => {
  const { contentTypeFor, resolveRequestPath } = await import("../server.mjs");

  assert.equal(resolveRequestPath("/"), join(process.cwd(), "index.html"));
  assert.equal(resolveRequestPath("/src/app.js"), join(process.cwd(), "src", "app.js"));
  assert.equal(resolveRequestPath("/../package.json"), null);
  assert.equal(contentTypeFor("index.html"), "text/html; charset=utf-8");
  assert.equal(contentTypeFor("styles.css"), "text/css; charset=utf-8");
  assert.equal(contentTypeFor("src/app.js"), "text/javascript; charset=utf-8");
  assert.equal(contentTypeFor("assets/icons-ai/home.png"), "image/png");
  assert.equal(contentTypeFor("README.md"), "application/octet-stream");
});

test("app mounts sidebar and dashboard from scene data", () => {
  const app = readFileSync("src/app.js", "utf8");

  for (const expected of [
    "getScene",
    "NAV_ITEMS",
    "parseRole",
    "SUPPORTED_ROLES",
    "renderSidebar",
    "renderDashboard",
    "popstate",
    "data-role-target",
    "keydown",
  ]) {
    assert.ok(app.includes(expected), expected);
  }
});

test("app reads URL roles and wires history, keyboard, and click navigation", () => {
  const app = readFileSync("src/app.js", "utf8");

  assert.ok(app.includes("parseRole(window.location.search)"));
  assert.match(app, /addEventListener\("popstate"/);
  assert.match(app, /event\.key === "1"[\s\S]*switchRole\("elder"\)/);
  assert.match(app, /event\.key === "2"[\s\S]*switchRole\("dad"\)/);
  assert.match(app, /event\.key === "3"[\s\S]*switchRole\("mom"\)/);
  assert.ok(app.includes('closest("[data-role-target]")'));
  assert.ok(app.includes("target.dataset.roleTarget"));
  assert.ok(app.includes("event.preventDefault()"));
});

test("required sidebar icons exist", () => {
  for (const icon of ["home", "devices", "routine", "wellbeing", "ops", "package", "settings", "spark"]) {
    assert.ok(existsSync(`assets/icons-ai/${icon}.png`), icon);
  }
});
