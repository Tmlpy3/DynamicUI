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
  for (const phrase of ["王奶奶，早上好", "降压药", "钙片", "降糖药", "128/82", "灯光", "空调", "门锁", "家人", "求助"]) {
    assert.ok(text.includes(phrase), phrase);
  }
});

test("required dad actions are present", () => {
  const text = JSON.stringify(SCENES.dad);
  for (const phrase of ["一键购买耗材", "一键出门模式：全部执行", "厨房灯", "全夜无异常", "今天工作顺利"]) {
    assert.ok(text.includes(phrase), phrase);
  }
});

test("dad departure and leaving actions match the spec", () => {
  const departure = SCENES.dad.sections.find((section) => section.id === "departure");
  const leaving = SCENES.dad.sections.find((section) => section.id === "leaving");

  assert.deepEqual(departure.actions, ["一键出门", "我知道了"]);
  assert.equal(leaving.action, "一键出门模式：全部执行");
});

test("required mom evening content is present", () => {
  const text = JSON.stringify(SCENES.mom);
  for (const phrase of ["晚上好！该准备晚餐啦", "活动量比平时少 20%", "叫小明吃饭", "今日精彩回放", "一键执行节能建议"]) {
    assert.ok(text.includes(phrase), phrase);
  }
});

test("mom elder-care status and camera action match the spec", () => {
  const elderCare = SCENES.mom.sections.find((section) => section.id === "elder-care");
  const camera = SCENES.mom.sections.find((section) => section.id === "camera");

  assert.equal(elderCare.status, "今日规律正常");
  assert.ok(camera.actions.includes("今日精彩回放"));
});
