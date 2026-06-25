import assert from "node:assert/strict";
import test from "node:test";
import {
  DEFAULT_ROLE,
  NAV_ITEMS,
  SCENES,
  getScene,
  parseRole,
  SUPPORTED_ROLES,
} from "../src/scenes.js";

test("supports exactly the three dashboard roles", () => {
  assert.deepEqual(SUPPORTED_ROLES, ["elder", "dad", "mom"]);
  assert.equal(DEFAULT_ROLE, "elder");
});

test("parses known roles and falls back to elder", () => {
  assert.equal(parseRole("?role=elder"), "elder");
  assert.equal(parseRole("?role=dad"), "dad");
  assert.equal(parseRole("?role=mom"), "mom");
  assert.equal(parseRole("?role=unknown"), "elder");
  assert.equal(parseRole(""), "elder");
});

test("navigation matches AI-Home-UI labels and icon names", () => {
  assert.deepEqual(
    NAV_ITEMS.map((item) => [item.label, item.icon]),
    [
      ["Home", "home"],
      ["Devices", "devices"],
      ["Routines", "routine"],
      ["Life", "wellbeing"],
      ["Automations", "ops"],
      ["Store", "package"],
      ["Settings", "settings"],
      ["Help", "spark"],
    ],
  );
});

test("each scene has a complete status, theme, and layout payload", () => {
  for (const role of SUPPORTED_ROLES) {
    const scene = getScene(role);
    assert.equal(scene.id, role);
    assert.ok(scene.theme);
    assert.ok(scene.greeting);
    assert.ok(scene.weather);
    assert.ok(scene.time);
    assert.ok(Array.isArray(scene.sections));
    assert.ok(scene.sections.length >= 3);
  }
});

test("required elder content is present", () => {
  const text = JSON.stringify(SCENES.elder);
  for (const phrase of ["Good morning, Grandma Wang", "Blood pressure medicine", "Calcium tablet", "Diabetes medicine", "128/82", "Lights", "Air conditioner", "Door lock", "Family", "Help"]) {
    assert.ok(text.includes(phrase), phrase);
  }
});

test("elder home brief actions match the spec", () => {
  const brief = SCENES.elder.sections.find((section) => section.id === "brief");

  assert.deepEqual(brief.actions, ["Got it", "Medicine taken"]);
});

test("required dad actions are present", () => {
  const text = JSON.stringify(SCENES.dad);
  for (const phrase of ["Buy Supplies", "Run Full Leave-Home Mode", "Kitchen light", "No issues overnight", "productive workday"]) {
    assert.ok(text.includes(phrase), phrase);
  }
});

test("dad departure and leaving actions match the spec", () => {
  const departure = SCENES.dad.sections.find((section) => section.id === "departure");
  const leaving = SCENES.dad.sections.find((section) => section.id === "leaving");

  assert.deepEqual(departure.actions, ["Leave Home", "Got it"]);
  assert.equal(leaving.action, "Run Full Leave-Home Mode");
});

test("required mom evening content is present", () => {
  const text = JSON.stringify(SCENES.mom);
  for (const phrase of ["Good evening, time to get dinner ready", "Activity is 20% lower than usual", "Call Xiaoming to Dinner", "Today Highlights", "Run Energy-Saving Suggestions"]) {
    assert.ok(text.includes(phrase), phrase);
  }
});

test("mom elder-care status and camera action match the spec", () => {
  const elderCare = SCENES.mom.sections.find((section) => section.id === "elder-care");
  const camera = SCENES.mom.sections.find((section) => section.id === "camera");

  assert.equal(elderCare.status, "Routine normal today");
  assert.ok(camera.actions.includes("Today Highlights"));
  assert.ok(camera.actions.includes("Search Events"));
});
