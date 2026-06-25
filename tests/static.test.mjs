import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

test("index wires the stylesheet, app module, favicon, and shell", () => {
  const html = readFileSync("index.html", "utf8");

  assert.ok(html.includes('href="styles.css'));
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
  const { contentTypeFor, requestPathFor, resolveRequestPath } = await import("../server.mjs");

  assert.equal(resolveRequestPath("/"), join(process.cwd(), "index.html"));
  assert.equal(resolveRequestPath("/src/app.js"), join(process.cwd(), "src", "app.js"));
  assert.equal(resolveRequestPath("/../package.json"), null);
  assert.deepEqual(requestPathFor("/"), { status: 200, pathname: "/" });
  assert.equal(contentTypeFor("index.html"), "text/html; charset=utf-8");
  assert.equal(contentTypeFor("styles.css"), "text/css; charset=utf-8");
  assert.equal(contentTypeFor("src/app.js"), "text/javascript; charset=utf-8");
  assert.equal(contentTypeFor("assets/icons-ai/home.png"), "image/png");
  assert.equal(contentTypeFor("README.md"), "application/octet-stream");
});

test("server rejects malformed request paths without throwing", async () => {
  const { requestPathFor } = await import("../server.mjs");

  assert.deepEqual(requestPathFor("/%E0%A4%A"), { status: 400, pathname: null });
  assert.doesNotThrow(() => requestPathFor("/%E0%A4%A"));
});

test("server module can be imported without process argv entrypoint", () => {
  const result = spawnSync(
    process.execPath,
    ["-e", "import('./server.mjs').then(() => console.log('import-ok'))"],
    { cwd: process.cwd(), encoding: "utf8" },
  );

  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /import-ok/);
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

test("css defines fixed 16:9 stage and no-scroll dashboard contract", () => {
  const css = readFileSync("styles.css", "utf8");

  assert.ok(css.includes("aspect-ratio: 16 / 9"));
  assert.ok(css.includes("overflow: hidden"));
  assert.ok(css.includes("grid-template-columns: 300px minmax(0, 1fr)"));
  assert.ok(css.includes("width: min(100vw, calc(100vh * 16 / 9))"));
  assert.ok(css.includes("height: min(100vh, calc(100vw * 9 / 16))"));
  assert.doesNotMatch(css, /min-width:\s*960px/);
  assert.doesNotMatch(css, /min-height:\s*540px/);
  assert.ok(css.includes(".theme-morning-warm"));
  assert.ok(css.includes(".theme-morning-blue"));
  assert.ok(css.includes(".theme-evening-dark"));
});

test("css includes one-screen grids for all three scenes", () => {
  const css = readFileSync("styles.css", "utf8");

  for (const selector of [".theme-morning-warm", ".dad-grid", ".mom-top-grid", ".mom-bottom-grid", ".quick-action-grid"]) {
    assert.ok(css.includes(selector), selector);
  }
});

test("css styles dad morning scene with wide departure overview and non-white information cards", () => {
  const css = readFileSync("styles.css", "utf8");

  assert.match(css, /\.dad-grid\s*{[\s\S]*grid-template-columns:\s*repeat\(2,\s*minmax\(0,\s*1fr\)\)/);
  assert.match(css, /\.dad-brief\s*{[\s\S]*grid-column:\s*1\s*\/\s*3/);
  assert.match(css, /\.leaving-panel\s*{[\s\S]*grid-column:\s*1\s*\/\s*3/);
  assert.ok(css.includes(".dad-info-tile"));
  assert.ok(css.includes(".dad-brief-header"));
  assert.ok(css.includes(".dad-brief-actions"));
  assert.ok(css.includes(".security-report-top"));
  assert.ok(css.includes(".security-timeline"));
  assert.ok(css.includes(".security-trend"));
  assert.ok(css.includes(".sensor-heading-icon"));
  assert.ok(css.includes(".sensor-status-grid"));
  assert.ok(css.includes(".maintenance-heading-icon"));
  assert.ok(css.includes(".maintenance-focus"));
  assert.ok(css.includes(".schedule-stack"));
  assert.match(css, /\.dad-brief-grid\s*{[\s\S]*grid-template-columns:\s*repeat\(3,\s*minmax\(0,\s*1fr\)\)/);
  assert.match(css, /\.dad-brief-header\s*{[\s\S]*grid-template-columns:\s*minmax\(0,\s*1fr\)\s+auto/);
  assert.ok(css.includes('url("assets/backgrounds/dad-morning-departure-wide.png") center / 100% 100% no-repeat'));
  assert.ok(css.includes("--dad-card-bg"));
  assert.doesNotMatch(css, /minmax\(300px,\s*1\.28fr\)/);
  assert.match(css, /\.theme-morning-blue\s*{[\s\S]*#f5ead8[\s\S]*#dbe8f0/);
  assert.match(css, /body\[data-scene="dad"\] \.sidebar\s*{[\s\S]*#f8efe2[\s\S]*#e4edf4/);
  assert.match(css, /\.dad-grid\s*{[\s\S]*grid-template-rows:\s*220px\s+minmax\(0,\s*0\.58fr\)\s+minmax\(0,\s*0\.58fr\)\s+164px/);
  assert.doesNotMatch(css, /body\[data-scene="dad"\] \.app-shell\s*{/);
  assert.match(css, /\.leaving-grid div\s*{[\s\S]*background:\s*rgba\(8,\s*24,\s*43,\s*0\.48\)/);
  assert.match(css, /\.leaving-grid div\s*{[\s\S]*color:\s*#fff/);
  assert.match(css, /\.leaving-grid div\s*{[\s\S]*display:\s*block/);
  assert.match(css, /\.leaving-grid div\s*{[\s\S]*white-space:\s*nowrap/);
  assert.match(css, /\.leaving-grid div\s*{[\s\S]*text-overflow:\s*ellipsis/);
  assert.match(css, /\.security-report\s*{[\s\S]*radial-gradient/);
  assert.match(css, /\.security-report\s*{[\s\S]*grid-template-rows:\s*auto\s+minmax\(0,\s*1fr\)\s+auto/);
  assert.match(css, /\.security-timeline\s*{[\s\S]*overflow:\s*hidden/);
  assert.match(css, /\.security-report\s*{[\s\S]*#d7d1c4/);
  assert.match(css, /\.security-timeline p\s*{[\s\S]*background:\s*rgba\(255,\s*255,\s*255,\s*0\.46\)/);
  assert.match(css, /\.sensor-card\s*{[\s\S]*#c8dce7/);
  assert.match(css, /\.sensor-heading-icon::before\s*{[\s\S]*background:\s*#2d7c9f/);
  assert.match(css, /\.maintenance-card\s*{[\s\S]*#d8ccb3/);
  assert.match(css, /\.maintenance-card\s*{[\s\S]*grid-template-rows:\s*auto\s+auto\s+minmax\(0,\s*1fr\)/);
  assert.match(css, /\.maintenance-list\s*{[\s\S]*grid-template-rows:\s*repeat\(3,\s*minmax\(0,\s*1fr\)\)/);
  assert.match(css, /\.maintenance-heading-icon::after\s*{[\s\S]*border:\s*4px\s+solid\s+#7c5f27/);
  assert.match(css, /\.schedule-card\s*{[\s\S]*#cfd9e6/);
  assert.match(css, /\.schedule-stack\s*{[\s\S]*grid-template-rows:\s*repeat\(4,\s*minmax\(0,\s*1fr\)\)/);
  const dadSidebarBlock = css.match(/body\[data-scene="dad"\] \.sidebar\s*{[^}]*}/)?.[0] || "";
  assert.doesNotMatch(dadSidebarBlock, /display:/);
  const dadPanelBlock = css.match(/\.theme-morning-blue \.panel\s*{[^}]*}/)?.[0] || "";
  assert.doesNotMatch(dadPanelBlock, /background:\s*rgba\(255,\s*255,\s*255/);
});

test("dad morning departure background asset exists", () => {
  const asset = readFileSync("assets/backgrounds/dad-morning-departure-wide.png");

  assert.ok(asset.length > 100_000);
});

test("css reserves enough elder dashboard height for quick actions", () => {
  const css = readFileSync("styles.css", "utf8");

  assert.doesNotMatch(css, /grid-template-rows:\s*104px\s+270px\s+170px\s+minmax\(0,\s*1fr\)/);
  assert.match(css, /\.theme-morning-warm\s*{[\s\S]*grid-template-rows:\s*116px\s+320px\s+205px\s+minmax\(230px,\s*1fr\)/);
  assert.match(css, /\.quick-action-grid\s*{[\s\S]*grid-auto-rows:\s*minmax\(230px,\s*1fr\)/);
  assert.match(css, /\.metric-grid \.mini-card\s*{[\s\S]*min-height:\s*82px/);
  assert.doesNotMatch(css, /\.quick-action\s*{[^}]*overflow:\s*hidden/);
});

test("css gives mom pet care enough height for full evening content", () => {
  const css = readFileSync("styles.css", "utf8");

  assert.doesNotMatch(css, /\.theme-evening-dark\s*{[\s\S]*grid-template-rows:\s*96px\s+240px\s+154px/);
  assert.match(css, /\.theme-evening-dark\s*{[\s\S]*grid-template-rows:\s*110px\s+315px\s+140px\s+minmax\(0,\s*1fr\)/);
});
