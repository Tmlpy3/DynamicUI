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
  assert.ok(html.includes("早上好"));
  assert.ok(html.includes("服药提醒"));
  assert.ok(html.includes("我知道了"));
  assert.ok(html.includes("已吃药"));
  assert.doesNotMatch(html, /长者 · 早晨页面|Zone 1|visible role=elder|role=elder/);
});

test("dashboard renders dad scene required one-click actions and kitchen light content", () => {
  const html = renderDashboard(getScene("dad"));

  assert.ok(html.includes('class="dashboard-stage theme-morning-blue"'));
  assert.ok(html.includes('data-scene="dad"'));
  assert.ok(html.includes("一键购买耗材"));
  assert.ok(html.includes("一键出门模式：全部执行"));
  assert.ok(html.includes("厨房灯"));
});

test("dashboard renders dad sections by id or type when scene sections are reordered", () => {
  const scene = getScene("dad");
  const departure = scene.sections.find((section) => section.id === "departure");
  const security = scene.sections.find((section) => section.id === "security");
  const html = renderDashboard(withReversedSections(scene));

  assert.ok(html.includes(departure.actions[0]));
  assert.ok(html.includes(security.status));
  assert.ok(html.includes(security.events[0]));
  assert.ok(html.includes("厨房灯"));
});

test("dashboard renders mom evening content and camera action", () => {
  const html = renderDashboard(getScene("mom"));

  assert.ok(html.includes("晚上好！该准备晚餐啦"));
  assert.ok(html.includes("活动量比平时少 20%"));
  assert.ok(html.includes("一键执行节能建议"));
  assert.ok(html.includes("搜索事件"));
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
  assert.ok(html.includes("搜索事件"));
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
  assert.ok(!html.includes("color:red"));
  assert.ok(!html.includes("--owned"));
});
