import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
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

test("required sidebar icons exist", () => {
  for (const icon of ["home", "devices", "routine", "wellbeing", "ops", "package", "settings", "spark"]) {
    assert.ok(existsSync(`assets/icons-ai/${icon}.png`), icon);
  }
});
