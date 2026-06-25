import assert from "node:assert/strict";
import test from "node:test";
import { getScene, NAV_ITEMS } from "../src/scenes.js";
import { renderDashboard, renderSidebar } from "../src/renderers.js";

function withReversedSections(scene) {
  return {
    ...scene,
    sections: [...scene.sections].reverse(),
  };
}

function withSection(scene, sectionId, patch) {
  return {
    ...scene,
    sections: scene.sections.map((section) => (section.id === sectionId ? { ...section, ...patch } : section)),
  };
}

test("sidebar renders SmartThings brand, AI-Home-UI navigation labels, and icon images", () => {
  const html = renderSidebar(NAV_ITEMS);

  for (const label of ["SmartThings", "SAMSUNG", "Home", "Devices", "Routines", "Life", "Automations", "Store", "Settings", "Help"]) {
    assert.ok(html.includes(label), label);
  }

  for (const icon of ["home", "devices", "routine", "wellbeing", "ops", "package", "settings", "spark"]) {
    assert.ok(html.includes(`assets/icons-ai/${icon}.png`), icon);
  }
});

test("dashboard renders elder scene content without explicit design labels", () => {
  const html = renderDashboard(getScene("elder"));

  assert.ok(html.includes('class="dashboard-stage theme-morning-warm"'));
  assert.ok(html.includes('data-scene="elder"'));
  assert.ok(html.includes("Good morning, Grandma Wang"));
  assert.ok(html.includes("Medicine Reminders"));
  assert.ok(html.includes("Got it"));
  assert.ok(html.includes("Medicine taken"));
  assert.doesNotMatch(html, /Elder Morning Page|Zone 1|visible role=elder|role=elder/);
});

test("dashboard renders elder quick actions from scene data", () => {
  const html = renderDashboard(getScene("elder"));

  for (const label of ["Lights", "Air conditioner", "Door lock", "Family", "Help"]) {
    assert.ok(html.includes(label), label);
  }

  for (const hardcodedLabel of ["Turn on lights", "Adjust AC", "Take medicine", "Turn on TV", "Call family"]) {
    assert.ok(!html.includes(hardcodedLabel), hardcodedLabel);
  }
});

test("dashboard renders elder brief title from scene data", () => {
  const scene = withSection(getScene("elder"), "brief", { title: "Home status is normal" });
  const html = renderDashboard(scene);

  assert.ok(html.includes("Home status is normal"));
  assert.ok(!html.includes("Everything at home looks normal today"));
});

test("dashboard renders dad scene required one-click actions and kitchen light content", () => {
  const html = renderDashboard(getScene("dad"));

  assert.ok(html.includes('class="dashboard-stage theme-morning-blue"'));
  assert.ok(html.includes('data-scene="dad"'));
  assert.ok(html.includes("Buy Supplies"));
  assert.ok(html.includes("Run Full Leave-Home Mode"));
  assert.ok(html.includes("Kitchen light"));
});

test("dashboard renders dad maintenance and leaving actions from scene data", () => {
  const baseScene = getScene("dad");
  const requiredHtml = renderDashboard(baseScene);
  const customScene = withSection(withSection(baseScene, "maintenance", { action: "Check Filter Purchase" }), "leaving", {
    action: "Run All Leaving Safety Steps",
  });
  const customHtml = renderDashboard(customScene);

  assert.ok(requiredHtml.includes("Buy Supplies"));
  assert.ok(requiredHtml.includes("Run Full Leave-Home Mode"));
  assert.ok(customHtml.includes("Check Filter Purchase"));
  assert.ok(customHtml.includes("Run All Leaving Safety Steps"));
  assert.ok(!customHtml.includes("Buy Supplies"));
  assert.ok(!customHtml.includes("Run Full Leave-Home Mode"));
});

test("dashboard renders dad sections by id or type when scene sections are reordered", () => {
  const scene = getScene("dad");
  const departure = scene.sections.find((section) => section.id === "departure");
  const security = scene.sections.find((section) => section.id === "security");
  const html = renderDashboard(withReversedSections(scene));

  assert.ok(html.includes(departure.actions[0]));
  assert.ok(html.includes(security.status));
  assert.ok(html.includes(security.events[0]));
  assert.ok(html.includes("Kitchen light"));
});

test("dashboard renders dad scene icons from the mockup direction", () => {
  const html = renderDashboard(getScene("dad"));

  for (const icon of ["☀", "✅", "⚡", "🔒", "🎥", "💧", "🧃", "👦", "⚠", "🛡"]) {
    assert.ok(html.includes(icon), icon);
  }
});

test("dashboard renders mom evening content and camera action", () => {
  const html = renderDashboard(getScene("mom"));

  assert.ok(html.includes("Good evening, time to get dinner ready"));
  assert.ok(html.includes("Activity is 20% lower than usual. Play together for 15 minutes after dinner."));
  assert.ok(html.includes("Run Energy-Saving Suggestions"));
  assert.ok(html.includes("Search Events"));
});

test("dashboard renders mom pet insight and actions from scene data", () => {
  const scene = getScene("mom");
  const pet = scene.sections.find((section) => section.id === "pet");
  const camera = scene.sections.find((section) => section.id === "camera");
  const suggestions = scene.sections.find((section) => section.id === "suggestions");
  const html = renderDashboard(scene);

  assert.ok(html.includes(pet.insight));

  for (const label of camera.actions) {
    assert.ok(html.includes(label), label);
  }

  assert.ok(html.includes(suggestions.action));
});

test("dashboard renders mom scene icons from the mockup direction", () => {
  const html = renderDashboard(getScene("mom"));

  for (const icon of ["🌙", "✅", "🐱", "👦", "📦", "🎉", "❄️", "🔌"]) {
    assert.ok(html.includes(icon), icon);
  }
});

test("dashboard renders mom family action only inside the family panel", () => {
  const scene = getScene("mom");
  const family = scene.sections.find((section) => section.id === "family");
  const html = renderDashboard(scene);

  assert.equal(html.split(family.action).length - 1, 1);
});

test("dashboard renders mom sections by id or type when scene sections are reordered", () => {
  const scene = getScene("mom");
  const pet = scene.sections.find((section) => section.id === "pet");
  const elderCare = scene.sections.find((section) => section.id === "elder-care");
  const camera = scene.sections.find((section) => section.id === "camera");
  const energy = scene.sections.find((section) => section.id === "energy");
  const html = renderDashboard(withReversedSections(scene));

  assert.ok(html.includes(pet.water));
  assert.ok(html.includes(elderCare.status));
  assert.ok(html.includes(camera.actions[0]));
  assert.ok(html.includes(energy.usage));
});

test("mom dashboard includes dark theme class and search camera action", () => {
  const html = renderDashboard(getScene("mom"));

  assert.ok(html.includes('class="dashboard-stage theme-evening-dark"'));
  assert.ok(html.includes('data-scene="mom"'));
  assert.ok(html.includes("Search Events"));
});

test("dashboard escapes user-visible scene text", () => {
  const scene = {
    id: "dad",
    theme: "morning-blue",
    greeting: "<script>alert(1)</script>",
    weather: "A&B",
    time: '"quoted"',
    primaryAction: "<Start>",
    sections: [
      { id: "departure", type: "dad-brief", title: "<Departure>", lines: ["<line>"], actions: ["<Go>"] },
      { id: "security", type: "security-report", title: "Security", status: "<safe>", events: ["A&B"], trend: "ok" },
      { id: "sensors", type: "compact-list", title: "Sensors", items: [] },
      { id: "maintenance", type: "maintenance", title: "Maintenance", items: [] },
      { id: "schedule", type: "schedule", title: "Schedule", items: [] },
      { id: "leaving", type: "leaving-check", title: "Leaving", items: [] },
    ],
  };
  const html = renderDashboard(scene);

  assert.ok(!html.includes("<script>alert(1)</script>"));
  assert.ok(!html.includes("<Departure>"));
  assert.ok(!html.includes("<line>"));
  assert.ok(html.includes("&lt;script&gt;alert(1)&lt;/script&gt;"));
  assert.ok(html.includes("A&amp;B"));
  assert.ok(html.includes("&lt;Departure&gt;"));
});

test("dashboard clamps energy split percentages before writing inline style values", () => {
  const scene = getScene("mom");
  const energy = scene.sections.find((section) => section.id === "energy");
  const hostileScene = {
    ...scene,
    sections: scene.sections.map((section) =>
      section === energy
        ? {
            ...section,
            split: [
              ["too-high", 140],
              ["too-low", -20],
              ["inject", '45;color:red;--owned:1'],
              ["nan", "not-a-number"],
            ],
          }
        : section,
    ),
  };
  const html = renderDashboard(hostileScene);

  assert.ok(html.includes('style="--value:100%"'));
  assert.ok(html.includes('style="--value:0%"'));
  assert.ok(html.includes('style="--value:45%"'));
  assert.ok(html.includes('style="--energy-a:100%;--energy-b:100%;--energy-c:100%"'));
  assert.ok(!html.includes("color:red"));
  assert.ok(!html.includes("--owned"));
});
