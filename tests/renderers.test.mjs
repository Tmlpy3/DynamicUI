import assert from "node:assert/strict";
import test from "node:test";
import { getScene, NAV_ITEMS } from "../src/scenes.js";
import { renderDashboard, renderSidebar } from "../src/renderers.js";

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
  assert.ok(html.includes("拨打家人"));
  assert.ok(html.includes("打开电视"));
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

test("dashboard renders mom evening content and camera action", () => {
  const html = renderDashboard(getScene("mom"));

  assert.ok(html.includes("晚上好！该准备晚餐啦"));
  assert.ok(html.includes("活动量比平时少 20%"));
  assert.ok(html.includes("一键执行节能建议"));
  assert.ok(html.includes("搜索事件"));
});

test("mom dashboard includes dark theme class and search camera action", () => {
  const html = renderDashboard(getScene("mom"));

  assert.ok(html.includes('class="dashboard-stage theme-evening-dark"'));
  assert.ok(html.includes('data-scene="mom"'));
  assert.ok(html.includes("搜索事件"));
});
