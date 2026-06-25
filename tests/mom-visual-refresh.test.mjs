import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";
import { SCENES, getScene } from "../src/scenes.js";
import { renderDashboard } from "../src/renderers.js";

test("mom top care cards put elder care before pet care", () => {
  const ids = SCENES.mom.sections.map((section) => section.id);

  assert.ok(ids.indexOf("elder-care") < ids.indexOf("pet"));
});

test("mom visual panels include preview data", () => {
  const camera = SCENES.mom.sections.find((section) => section.id === "camera");
  const energy = SCENES.mom.sections.find((section) => section.id === "energy");
  const suggestions = SCENES.mom.sections.find((section) => section.id === "suggestions");

  assert.equal(camera.preview.title, "Living Room Camera");
  assert.equal(camera.preview.image, "assets/camera-clips/baby-first-steps.png");
  assert.equal(energy.state.label, "Current Load");
  assert.equal(suggestions.visual.label, "Estimated Savings");
});

test("mom dashboard renders elder care before pet care and keeps family status", () => {
  const html = renderDashboard(getScene("mom"));

  assert.ok(html.indexOf("elder-care-panel") < html.indexOf("pet-panel"));
  assert.ok(html.includes("family-panel"));
});

test("mom elder care card renders richer activity summary", () => {
  const elderCare = SCENES.mom.sections.find((section) => section.id === "elder-care");
  const html = renderDashboard(getScene("mom"));

  assert.equal(elderCare.summary, "Normal rhythm with a slightly shorter afternoon walk.");
  assert.ok(html.includes("elder-care-summary"));
  assert.ok(html.includes("elder-metric-grid"));
  assert.ok(html.includes("activity-timeline"));
  assert.ok(html.includes("Steps"));
  assert.ok(html.includes("2,860"));
  assert.ok(html.includes("Afternoon walk"));
});

test("mom dashboard renders camera and energy visual previews", () => {
  const html = renderDashboard(getScene("mom"));

  assert.ok(html.includes("camera-player"));
  assert.ok(html.includes('class="clip-preview-image"'));
  assert.ok(html.includes('src="assets/camera-clips/baby-first-steps.png"'));
  assert.ok(html.includes("energy-state"));
  assert.ok(html.includes("saving-visual"));
  assert.ok(html.includes('style="--energy-a:42%;--energy-b:60%;--energy-c:72%"'));
});

test("css styles mom visual refresh elements", () => {
  const css = readFileSync("styles.css", "utf8");

  for (const selector of [".camera-player", ".clip-preview-image", ".energy-state", ".saving-visual"]) {
    assert.ok(css.includes(selector), `${selector} should be styled`);
  }
});

test("baby first steps clip asset exists", () => {
  assert.ok(existsSync("assets/camera-clips/baby-first-steps.png"));
});

test("css compacts the dashboard for narrow embedded browsers", () => {
  const css = readFileSync("styles.css", "utf8");

  assert.match(css, /@media\s*\(max-width:\s*1100px\)/);
  assert.match(css, /body\[data-scene="mom"\]\s+\.theme-evening-dark\s*{[\s\S]*grid-template-rows:\s*70px\s+128px\s+74px\s+minmax\(0,\s*1fr\)/);
  assert.match(css, /@media\s*\(max-width:\s*1100px\)[\s\S]*\.app-shell\s*{[\s\S]*grid-template-columns:\s*190px\s+minmax\(0,\s*1fr\)/);
});

test("css lets bottom mom cards fill their frames with a wide camera player", () => {
  const css = readFileSync("styles.css", "utf8");

  assert.match(css, /@media\s*\(max-width:\s*1100px\)[\s\S]*\.mom-bottom-grid > \.panel\s*{[\s\S]*display:\s*flex/);
  assert.match(css, /@media\s*\(max-width:\s*1100px\)[\s\S]*\.camera-panel\s*{[\s\S]*display:\s*flex[\s\S]*flex-direction:\s*column/);
  assert.match(css, /@media\s*\(max-width:\s*1100px\)[\s\S]*\.player-frame\s*{[\s\S]*min-height:\s*78px/);
});

test("css turns narrow browser preview into a filled camera-first layout", () => {
  const css = readFileSync("styles.css", "utf8");

  assert.match(css, /@media\s*\(max-width:\s*700px\)[\s\S]*\.app-shell\s*{[\s\S]*width:\s*100vw[\s\S]*height:\s*100vh/);
  assert.match(css, /@media\s*\(max-width:\s*700px\)[\s\S]*\.mom-bottom-grid\s*{[\s\S]*grid-template-columns:\s*repeat\(2,\s*minmax\(0,\s*1fr\)\)/);
  assert.match(css, /@media\s*\(max-width:\s*700px\)[\s\S]*\.camera-panel\s*{[\s\S]*grid-column:\s*1 \/ 3/);
  assert.match(css, /@media\s*\(max-width:\s*700px\)[\s\S]*\.player-frame::before\s*{[\s\S]*content:\s*"REC/);
});

test("css makes the default camera panel look like a live camera feed", () => {
  const css = readFileSync("styles.css", "utf8");

  assert.doesNotMatch(css, /body\[data-scene="mom"\]\s+\.sidebar\s*{[^}]*display:\s*none/);
  assert.match(css, /\.mom-bottom-grid > \.panel\s*{[\s\S]*display:\s*flex/);
  assert.match(css, /\.camera-panel\s*{[\s\S]*display:\s*flex[\s\S]*flex-direction:\s*column/);
  assert.match(css, /\.camera-panel \.event-list\s*{[\s\S]*overflow:\s*visible/);
  assert.match(css, /\.camera-player\s*{[\s\S]*flex:\s*1 1 auto/);
  assert.match(css, /\.player-frame::before\s*{[\s\S]*content:\s*"REC/);
  assert.match(css, /\.player-frame::after\s*{[\s\S]*inset:\s*0[\s\S]*border-radius:\s*inherit/);
  assert.doesNotMatch(css, /\.player-frame::after\s*{[\s\S]*inset:\s*(32px 18px 14px|24px 12px 10px)/);
});

test("css spreads energy and saving content through their cards", () => {
  const css = readFileSync("styles.css", "utf8");

  assert.match(css, /\.energy-panel,\s*\n\.suggestions-panel\s*{[\s\S]*display:\s*flex[\s\S]*flex-direction:\s*column[\s\S]*gap:\s*14px/);
  assert.match(css, /\.energy-panel \.energy-bar\s*{[\s\S]*margin-top:\s*0/);
  assert.match(css, /\.suggestions-panel \.copy-list\s*{[\s\S]*flex:\s*1[\s\S]*display:\s*grid[\s\S]*gap:\s*12px/);
});

test("css keeps energy bar labels and percentages on one line", () => {
  const css = readFileSync("styles.css", "utf8");

  assert.match(css, /\.energy-bar span\s*{[\s\S]*min-width:\s*0[\s\S]*white-space:\s*nowrap[\s\S]*text-overflow:\s*ellipsis/);
  assert.match(css, /\.energy-bar strong\s*{[\s\S]*white-space:\s*nowrap[\s\S]*text-align:\s*right/);
});

test("css makes energy and saving state visuals prominent", () => {
  const css = readFileSync("styles.css", "utf8");

  assert.match(css, /\.energy-state\s*{[\s\S]*min-height:\s*220px[\s\S]*grid-template-columns:\s*minmax\(0,\s*1fr\)[\s\S]*justify-items:\s*center/);
  assert.match(css, /\.energy-ring\s*{[\s\S]*width:\s*160px[\s\S]*height:\s*160px/);
  assert.match(css, /\.energy-state > div:last-child\s*{[\s\S]*display:\s*flex[\s\S]*justify-content:\s*center/);
  assert.match(css, /\.saving-visual\s*{[\s\S]*min-height:\s*150px/);
  assert.match(css, /\.saving-visual strong\s*{[\s\S]*font-size:\s*40px/);
});
