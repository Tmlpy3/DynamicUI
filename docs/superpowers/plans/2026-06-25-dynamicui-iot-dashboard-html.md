# DynamicUI IoT Dashboard HTML Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a served, one-screen SmartThings-style HTML dashboard with three role scenes from `IoT_Dashboard_Pages_Design.md`.

**Architecture:** Use static HTML/CSS plus small ES modules. Scene data lives in `src/scenes.js`, rendering helpers live in `src/renderers.js`, app wiring lives in `src/app.js`, and `server.mjs` serves the app. The dashboard uses a fixed `1920x1080` stage scaled into the viewport so every role scene stays one screen with no scroll.

**Tech Stack:** Native HTML, CSS, ES modules, Node.js `node:test`, a minimal Node static server, copied PNG icon assets from `AI-Home-UI`.

---

## File Structure

- Create `index.html`: shell markup with sidebar, 16:9 stage container, and app mount points.
- Create `styles.css`: sidebar, theme variables, fixed stage layout, scene grids, cards, buttons, and responsive scaling.
- Create `server.mjs`: minimal static file server copied in spirit from `AI-Home-UI/server.mjs`.
- Create `src/scenes.js`: role scene data, supported role parsing, navigation metadata, and content payloads.
- Create `src/renderers.js`: pure HTML render functions for sidebar, status, each scene layout, and shared cards.
- Create `src/app.js`: DOM mounting, URL role parsing, icon hydration, scene switching, and keyboard shortcuts.
- Create `tests/scenes.test.mjs`: scene data coverage and role parsing tests.
- Create `tests/renderers.test.mjs`: renderer output coverage and forbidden label checks.
- Create `tests/static.test.mjs`: static file references, copied icon existence, and no-scroll CSS contract checks.
- Copy selected files from `C:\Users\yechao.xie\Documents\GitHub\AI-Home-UI\assets\icons-ai` into `assets/icons-ai`.

---

### Task 1: Scene Data and Role Parsing

**Files:**
- Create: `src/scenes.js`
- Test: `tests/scenes.test.mjs`

- [ ] **Step 1: Write the failing scene data tests**

Create `tests/scenes.test.mjs`:

```js
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

test("required mom evening content is present", () => {
  const text = JSON.stringify(SCENES.mom);
  for (const phrase of ["晚上好！该准备晚餐啦", "活动量比平时少 20%", "叫小明吃饭", "今日精彩回放", "一键执行节能建议"]) {
    assert.ok(text.includes(phrase), phrase);
  }
});
```

- [ ] **Step 2: Run the failing test**

Run: `node --test tests/scenes.test.mjs`

Expected: FAIL with `Cannot find module '../src/scenes.js'`.

- [ ] **Step 3: Implement `src/scenes.js`**

Create `src/scenes.js`:

```js
export const SUPPORTED_ROLES = ["elder", "dad", "mom"];
export const DEFAULT_ROLE = "elder";

export const NAV_ITEMS = [
  { label: "Home", icon: "home", href: "?role=elder", primary: true },
  { label: "Devices", icon: "devices", href: "#" },
  { label: "Routines", icon: "routine", href: "#" },
  { label: "Life", icon: "wellbeing", href: "#" },
  { label: "Automations", icon: "ops", href: "#" },
  { label: "Store", icon: "package", href: "#" },
  { label: "Settings", icon: "settings", href: "#", bottom: true },
  { label: "Help", icon: "spark", href: "#", bottom: true },
];

export const SCENES = {
  elder: {
    id: "elder",
    theme: "morning-warm",
    greeting: "👋 王奶奶，早上好！",
    weather: "🌤 24°C 晴",
    time: "上午 7:30",
    primaryAction: "语音播报",
    sections: [
      {
        id: "brief",
        type: "elder-brief",
        title: "家里一切正常",
        cards: [
          { icon: "☀️", title: "天气晴", detail: "适合上午散步" },
          { icon: "💊", title: "降压药", detail: "7:30 该吃了", tone: "warn" },
          { icon: "🔒", title: "门锁已锁好", detail: "放心", tone: "good" },
        ],
        actions: ["我知道了", "已吃药"],
      },
      {
        id: "medicine",
        type: "medicine",
        title: "今天的药",
        items: [
          { title: "降压药", detail: "7:30 当前", tone: "alert" },
          { title: "钙片", detail: "12:00" },
          { title: "降糖药", detail: "18:00" },
        ],
      },
      {
        id: "health",
        type: "metrics",
        title: "健康速览",
        items: [
          { value: "128/82", label: "血压正常" },
          { value: "350", label: "今日步数" },
          { value: "24°C", label: "室温舒适" },
          { value: "62kg", label: "体重稳定" },
        ],
      },
      {
        id: "quick-actions",
        type: "quick-actions",
        title: "一键操作",
        items: [
          { icon: "💡", title: "灯光", detail: "关" },
          { icon: "❄️", title: "空调", detail: "25°C" },
          { icon: "🔐", title: "门锁", detail: "已锁", tone: "good" },
          { icon: "📞", title: "家人", detail: "呼叫" },
          { icon: "🆘", title: "求助", detail: "紧急", tone: "danger" },
        ],
      },
    ],
  },
  dad: {
    id: "dad",
    theme: "morning-blue",
    greeting: "👋 早上好！今天工作顺利",
    weather: "🌤 22°C 多云",
    time: "上午 7:45",
    primaryAction: "出门模式",
    sections: [
      {
        id: "departure",
        type: "dad-brief",
        title: "准备出发吧",
        lines: ["家里一切正常", "今日用电 3.2 kWh", "今天有 2 个快递待收"],
        actions: ["一键出门", "我知道了"],
      },
      {
        id: "security",
        type: "security-report",
        title: "夜间安防巡逻报告",
        status: "全夜无异常",
        events: ["22:00 安防模式启动 ✅", "23:15 后院移动侦测（猫）🟡", "01:30 门口移动侦测（风）🟡", "06:30 安防模式解除 ✅"],
        trend: "异常事件较上周 ↓30%",
      },
      {
        id: "sensors",
        type: "compact-list",
        title: "传感器状态",
        items: ["🟢 全部传感器正常", "烟雾传感器 ✅", "漏水传感器 ✅", "门窗传感器 ✅", "温度传感器 ✅"],
      },
      {
        id: "maintenance",
        type: "maintenance",
        title: "设备维护",
        items: ["🔴 净水器滤网 需更换", "🟡 门锁电池 78%", "🟢 扫地机器人滤网 正常", "🟢 空气净化器滤网 正常"],
        action: "一键购买耗材",
      },
      {
        id: "schedule",
        type: "schedule",
        title: "今天家里的安排",
        items: ["👦 小明 8:00 上学 → 3:00 放学", "👩 妈妈 4:00 瑜伽课", "👴 爷爷 10:00 体检", "📦 快递 14:00-16:00"],
      },
      {
        id: "leaving",
        type: "leaving-check",
        title: "离家检查",
        action: "一键出门模式：全部执行",
        items: ["✅ 卧室灯 → 关闭", "✅ 客厅空调 → 关闭", "❌ 厨房灯 → 还开着", "✅ 卧室窗户 → 已关", "✅ 门锁 → 已锁", "✅ 安防模式 → 启动"],
      },
    ],
  },
  mom: {
    id: "mom",
    theme: "evening-dark",
    greeting: "👋 晚上好！该准备晚餐啦",
    weather: "🌙 20°C 多云",
    time: "晚上 19:30",
    primaryAction: "叫小明吃饭",
    sections: [
      {
        id: "pet",
        type: "pet-care",
        title: "咪咪的一天",
        events: ["7:00 早餐喂食 ✅", "10:30 午睡 😴", "14:00 后院活跃 🏃", "16:00 室内休息 🐱"],
        water: "饮水机 75%",
        next: "下次喂食 18:00 ✅",
        insight: "活动量比平时少 20%，晚饭后多陪它玩一会儿。",
      },
      {
        id: "elder-care",
        type: "elder-care",
        title: "爷爷今日活动规律",
        items: ["起床 7:00", "早餐 7:30", "看电视 9:00-11:00", "午餐 12:00", "午休 13:00-14:00", "散步 16:00"],
        status: "今日规律正常",
      },
      {
        id: "family",
        type: "family-status",
        title: "家里现在的状态",
        items: ["👦 小明｜卧室｜写作业", "👨 爸爸｜不在家｜加班", "👩 妈妈｜厨房｜做饭", "👴 爷爷｜客厅｜看电视"],
      },
      {
        id: "camera",
        type: "camera-events",
        title: "今天的摄像头事件",
        events: ["07:15 📦 快递员送件", "09:30 👤 识别到爷爷", "14:22 🎉 精彩瞬间", "16:00 🐾 宠物活动"],
        actions: ["今日精彩回放", "搜索事件"],
      },
      {
        id: "energy",
        type: "energy",
        title: "能源消耗",
        usage: "15.2 kWh",
        cost: "本月预估 ¥185",
        split: [
          ["空调", 42],
          ["热水器", 18],
          ["冰箱", 12],
          ["其他", 28],
        ],
      },
      {
        id: "suggestions",
        type: "suggestions",
        title: "节能建议",
        items: ["空调调至 26°C，省约 ¥30/月", "18:00-21:00 错峰洗衣", "关闭待机设备 0.8 kWh/天"],
        action: "一键执行节能建议",
      },
    ],
  },
};

export function parseRole(search = "") {
  const params = new URLSearchParams(search.startsWith("?") ? search.slice(1) : search);
  const role = params.get("role");
  return SUPPORTED_ROLES.includes(role) ? role : DEFAULT_ROLE;
}

export function getScene(role = DEFAULT_ROLE) {
  return SCENES[SUPPORTED_ROLES.includes(role) ? role : DEFAULT_ROLE];
}
```

- [ ] **Step 4: Run scene tests**

Run: `node --test tests/scenes.test.mjs`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/scenes.js tests/scenes.test.mjs
git commit -m "feat: add dashboard scene data"
```

---

### Task 2: Pure Renderers

**Files:**
- Create: `src/renderers.js`
- Test: `tests/renderers.test.mjs`

- [ ] **Step 1: Write failing renderer tests**

Create `tests/renderers.test.mjs`:

```js
import assert from "node:assert/strict";
import test from "node:test";
import { getScene, NAV_ITEMS } from "../src/scenes.js";
import { renderDashboard, renderSidebar } from "../src/renderers.js";

test("sidebar renders AI-Home-UI navigation labels and icon images", () => {
  const html = renderSidebar(NAV_ITEMS);
  for (const label of ["SmartThings", "SAMSUNG", "Home", "Devices", "Routines", "Life", "Automations", "Store", "Settings", "Help"]) {
    assert.ok(html.includes(label), label);
  }
  for (const icon of ["home", "devices", "routine", "wellbeing", "ops", "package", "settings", "spark"]) {
    assert.ok(html.includes(`assets/icons-ai/${icon}.png`), icon);
  }
});

test("dashboard renders elder scene without explicit page labels", () => {
  const html = renderDashboard(getScene("elder"));
  assert.ok(html.includes("王奶奶，早上好"));
  assert.ok(html.includes("家里一切正常"));
  assert.ok(html.includes("求助"));
  assert.doesNotMatch(html, /长者 · 早晨页面|Zone 1|role=elder/);
});

test("dashboard renders dad required one-click actions", () => {
  const html = renderDashboard(getScene("dad"));
  assert.ok(html.includes("一键购买耗材"));
  assert.ok(html.includes("一键出门模式：全部执行"));
  assert.ok(html.includes("厨房灯"));
});

test("dashboard renders mom evening dark scene content", () => {
  const html = renderDashboard(getScene("mom"));
  assert.ok(html.includes("晚上好！该准备晚餐啦"));
  assert.ok(html.includes("活动量比平时少 20%"));
  assert.ok(html.includes("一键执行节能建议"));
});
```

- [ ] **Step 2: Run the failing test**

Run: `node --test tests/renderers.test.mjs`

Expected: FAIL with `Cannot find module '../src/renderers.js'`.

- [ ] **Step 3: Implement `src/renderers.js`**

Create `src/renderers.js`:

```js
function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function button(label, variant = "") {
  return `<button class="action-button ${variant}">${escapeHtml(label)}</button>`;
}

function miniCard(item) {
  const title = item.title || item.value || "";
  const detail = item.detail || item.label || "";
  return `<div class="mini-card ${item.tone || ""}"><strong>${escapeHtml(title)}</strong><span>${escapeHtml(detail)}</span></div>`;
}

export function renderSidebar(items) {
  const primary = items.filter((item) => !item.bottom);
  const bottom = items.filter((item) => item.bottom);
  const renderItem = (item, active = false) => `
    <a class="nav-item ${active ? "active" : ""}" href="${escapeHtml(item.href)}">
      <span class="nav-icon"><img src="assets/icons-ai/${escapeHtml(item.icon)}.png" alt="" /></span>
      <span>${escapeHtml(item.label)}</span>
    </a>`;

  return `
    <aside class="sidebar" aria-label="Primary navigation">
      <div class="brand">
        <strong>SmartThings</strong>
        <span>SAMSUNG</span>
      </div>
      <nav class="nav-list">${primary.map((item, index) => renderItem(item, index === 0)).join("")}</nav>
      <nav class="nav-list sidebar-bottom">${bottom.map((item) => renderItem(item)).join("")}</nav>
    </aside>`;
}

function renderStatus(scene) {
  return `
    <header class="scene-topbar">
      <div>
        <div class="scene-greeting">${escapeHtml(scene.greeting)}</div>
        <div class="status-pills">
          <span class="status-pill">${escapeHtml(scene.weather)}</span>
          <span class="status-pill">${escapeHtml(scene.time)}</span>
        </div>
      </div>
      <button class="primary-scene-action">${escapeHtml(scene.primaryAction)}</button>
    </header>`;
}

function renderElder(scene) {
  const [brief, medicine, health, quickActions] = scene.sections;
  return `
    ${renderStatus(scene)}
    <section class="panel elder-brief">
      <h2>${escapeHtml(brief.title)}</h2>
      <div class="brief-card-grid">${brief.cards.map((card) => `
        <div class="brief-card ${card.tone || ""}">
          <span class="brief-icon">${escapeHtml(card.icon)}</span>
          <strong>${escapeHtml(card.title)}</strong>
          <span>${escapeHtml(card.detail)}</span>
        </div>`).join("")}</div>
      <div class="button-row">${brief.actions.map((label, index) => button(label, index === 0 ? "primary" : "warm")).join("")}</div>
    </section>
    <div class="elder-middle">
      <section class="panel"><h2>${escapeHtml(medicine.title)}</h2><div class="mini-grid medicine-grid">${medicine.items.map(miniCard).join("")}</div></section>
      <section class="panel"><h2>${escapeHtml(health.title)}</h2><div class="mini-grid metric-grid">${health.items.map(miniCard).join("")}</div></section>
    </div>
    <section class="quick-action-grid">${quickActions.items.map((item) => `
      <button class="quick-action ${item.tone || ""}">
        <span>${escapeHtml(item.icon)}</span>
        <strong>${escapeHtml(item.title)}</strong>
        <em>${escapeHtml(item.detail)}</em>
      </button>`).join("")}</section>`;
}

function renderDad(scene) {
  const [departure, security, sensors, maintenance, schedule, leaving] = scene.sections;
  return `
    ${renderStatus(scene)}
    <div class="dad-grid">
      <section class="panel dad-brief">
        <h2>${escapeHtml(departure.title)}</h2>
        ${departure.lines.map((line) => `<p>${escapeHtml(line)}</p>`).join("")}
        <div class="button-row">${departure.actions.map((label, index) => button(label, index === 0 ? "primary" : "")).join("")}</div>
      </section>
      <section class="panel security-report">
        <div class="panel-heading"><h2>${escapeHtml(security.title)}</h2><strong>${escapeHtml(security.status)}</strong></div>
        <div class="security-body"><div>${security.events.map((event) => `<p>${escapeHtml(event)}</p>`).join("")}</div><div class="trend">${escapeHtml(security.trend)}</div></div>
      </section>
      <section class="panel compact-panel"><h2>${escapeHtml(sensors.title)}</h2>${sensors.items.map((item) => `<p>${escapeHtml(item)}</p>`).join("")}</section>
      <section class="panel compact-panel"><div class="panel-heading"><h2>${escapeHtml(maintenance.title)}</h2>${button(maintenance.action, "teal")}</div>${maintenance.items.map((item) => `<p>${escapeHtml(item)}</p>`).join("")}</section>
      <section class="panel compact-panel"><h2>${escapeHtml(schedule.title)}</h2>${schedule.items.map((item) => `<p>${escapeHtml(item)}</p>`).join("")}</section>
      <section class="panel leaving-panel"><div class="panel-heading"><h2>${escapeHtml(leaving.title)}</h2>${button(leaving.action, "primary")}</div><div class="leaving-grid">${leaving.items.map((item) => `<div>${escapeHtml(item)}</div>`).join("")}</div></section>
    </div>`;
}

function renderMom(scene) {
  const [pet, elderCare, family, camera, energy, suggestions] = scene.sections;
  return `
    ${renderStatus(scene)}
    <div class="mom-top-grid">
      <section class="panel pet-panel">
        <h2>${escapeHtml(pet.title)}</h2>
        <div class="pet-layout">
          <div>${pet.events.map((event) => `<p>${escapeHtml(event)}</p>`).join("")}</div>
          <div class="pet-insight"><strong>${escapeHtml(pet.water)}</strong><span>${escapeHtml(pet.next)}</span><span>${escapeHtml(pet.insight)}</span></div>
        </div>
      </section>
      <section class="panel elder-care-panel">
        <h2>${escapeHtml(elderCare.title)}</h2>
        <div class="routine-grid">${elderCare.items.map((item) => `<p>${escapeHtml(item)}</p>`).join("")}</div>
        <strong class="good-note">${escapeHtml(elderCare.status)}</strong>
      </section>
    </div>
    <section class="panel family-panel"><h2>${escapeHtml(family.title)}</h2><div class="family-grid">${family.items.map((item) => `<div>${escapeHtml(item)}</div>`).join("")}</div></section>
    <div class="mom-bottom-grid">
      <section class="panel camera-panel"><h2>${escapeHtml(camera.title)}</h2>${camera.events.map((event) => `<p>${escapeHtml(event)}</p>`).join("")}<div class="button-row">${camera.actions.map((label, index) => button(label, index === 0 ? "primary" : "")).join("")}</div></section>
      <section class="panel energy-panel"><h2>${escapeHtml(energy.title)}</h2><strong class="energy-value">${escapeHtml(energy.usage)}</strong><span>${escapeHtml(energy.cost)}</span>${energy.split.map(([label, value]) => `<div class="energy-bar"><span>${escapeHtml(label)}</span><b style="--value:${value}%"></b><strong>${value}%</strong></div>`).join("")}</section>
      <section class="panel suggestions-panel"><h2>${escapeHtml(suggestions.title)}</h2>${suggestions.items.map((item) => `<p>${escapeHtml(item)}</p>`).join("")}<div class="button-row">${button(suggestions.action, "primary")}</div></section>
    </div>`;
}

export function renderDashboard(scene) {
  const body = scene.id === "elder" ? renderElder(scene) : scene.id === "dad" ? renderDad(scene) : renderMom(scene);
  return `<section class="dashboard-stage theme-${scene.theme}" data-scene="${scene.id}">${body}</section>`;
}
```

- [ ] **Step 4: Run renderer tests**

Run: `node --test tests/renderers.test.mjs`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/renderers.js tests/renderers.test.mjs
git commit -m "feat: add dashboard renderers"
```

---

### Task 3: HTML Shell, App Wiring, and Static Server

**Files:**
- Create: `index.html`
- Create: `src/app.js`
- Create: `server.mjs`
- Test: `tests/static.test.mjs`

- [ ] **Step 1: Write failing static tests**

Create `tests/static.test.mjs`:

```js
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

test("index wires the stylesheet and app module", () => {
  const html = readFileSync("index.html", "utf8");
  assert.ok(html.includes('href="styles.css"'));
  assert.ok(html.includes('type="module" src="src/app.js"'));
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
  assert.ok(app.includes("renderSidebar"));
  assert.ok(app.includes("renderDashboard"));
  assert.ok(app.includes("parseRole"));
  assert.ok(app.includes("popstate"));
});

test("required sidebar icons exist", () => {
  for (const icon of ["home", "devices", "routine", "wellbeing", "ops", "package", "settings", "spark"]) {
    assert.ok(existsSync(`assets/icons-ai/${icon}.png`), icon);
  }
});
```

- [ ] **Step 2: Run the failing static tests**

Run: `node --test tests/static.test.mjs`

Expected: FAIL because `index.html`, `server.mjs`, `src/app.js`, or copied icons do not exist yet.

- [ ] **Step 3: Copy required sidebar icon assets**

Run:

```powershell
New-Item -ItemType Directory -Force -Path 'assets\icons-ai' | Out-Null
Copy-Item 'C:\Users\yechao.xie\Documents\GitHub\AI-Home-UI\assets\icons-ai\home.png' 'assets\icons-ai\home.png'
Copy-Item 'C:\Users\yechao.xie\Documents\GitHub\AI-Home-UI\assets\icons-ai\devices.png' 'assets\icons-ai\devices.png'
Copy-Item 'C:\Users\yechao.xie\Documents\GitHub\AI-Home-UI\assets\icons-ai\routine.png' 'assets\icons-ai\routine.png'
Copy-Item 'C:\Users\yechao.xie\Documents\GitHub\AI-Home-UI\assets\icons-ai\wellbeing.png' 'assets\icons-ai\wellbeing.png'
Copy-Item 'C:\Users\yechao.xie\Documents\GitHub\AI-Home-UI\assets\icons-ai\ops.png' 'assets\icons-ai\ops.png'
Copy-Item 'C:\Users\yechao.xie\Documents\GitHub\AI-Home-UI\assets\icons-ai\package.png' 'assets\icons-ai\package.png'
Copy-Item 'C:\Users\yechao.xie\Documents\GitHub\AI-Home-UI\assets\icons-ai\settings.png' 'assets\icons-ai\settings.png'
Copy-Item 'C:\Users\yechao.xie\Documents\GitHub\AI-Home-UI\assets\icons-ai\spark.png' 'assets\icons-ai\spark.png'
```

Expected: eight PNG files exist under `assets/icons-ai`.

- [ ] **Step 4: Create `index.html`**

Create `index.html`:

```html
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>SmartThings AIOS Home</title>
    <link rel="icon" href="assets/icons-ai/home.png" />
    <link rel="stylesheet" href="styles.css" />
  </head>
  <body>
    <main id="appShell" class="app-shell" aria-label="SmartThings AIOS dashboard"></main>
    <script type="module" src="src/app.js"></script>
  </body>
</html>
```

- [ ] **Step 5: Create `server.mjs`**

Create `server.mjs`:

```js
import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize } from "node:path";

const root = process.cwd();
const port = Number(process.env.PORT || 4173);

const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".png": "image/png",
};

createServer((request, response) => {
  const urlPath = decodeURIComponent(new URL(request.url, `http://localhost:${port}`).pathname);
  const relativePath = urlPath === "/" ? "index.html" : urlPath.replace(/^[/\\]+/, "");
  const safePath = normalize(relativePath).replace(/^(\.\.[/\\])+/, "");
  const filePath = join(root, safePath);

  if (!existsSync(filePath) || statSync(filePath).isDirectory()) {
    response.writeHead(404);
    response.end("Not found");
    return;
  }

  response.writeHead(200, {
    "Content-Type": types[extname(filePath)] || "application/octet-stream",
  });
  createReadStream(filePath).pipe(response);
}).listen(port, () => {
  console.log(`DynamicUI dashboard running at http://localhost:${port}`);
});
```

- [ ] **Step 6: Create `src/app.js`**

Create `src/app.js`:

```js
import { getScene, NAV_ITEMS, parseRole, SUPPORTED_ROLES } from "./scenes.js";
import { renderDashboard, renderSidebar } from "./renderers.js";

function mount(role = parseRole(window.location.search)) {
  const shell = document.querySelector("#appShell");
  const scene = getScene(role);
  document.body.dataset.scene = scene.id;
  shell.innerHTML = `${renderSidebar(NAV_ITEMS)}${renderDashboard(scene)}`;
}

function switchRole(role) {
  const nextRole = SUPPORTED_ROLES.includes(role) ? role : "elder";
  const url = new URL(window.location.href);
  url.searchParams.set("role", nextRole);
  window.history.pushState({ role: nextRole }, "", url);
  mount(nextRole);
}

document.addEventListener("click", (event) => {
  const target = event.target.closest("[data-role-target]");
  if (!target) return;
  event.preventDefault();
  switchRole(target.dataset.roleTarget);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "1") switchRole("elder");
  if (event.key === "2") switchRole("dad");
  if (event.key === "3") switchRole("mom");
});

window.addEventListener("popstate", () => mount());

document.addEventListener("DOMContentLoaded", () => mount());
```

- [ ] **Step 7: Run static tests**

Run: `node --test tests/static.test.mjs`

Expected: PASS.

- [ ] **Step 8: Commit**

```bash
git add index.html server.mjs src/app.js assets/icons-ai tests/static.test.mjs
git commit -m "feat: add app shell and static server"
```

---

### Task 4: One-Screen CSS Layout and Themes

**Files:**
- Create: `styles.css`
- Modify: `tests/static.test.mjs`

- [ ] **Step 1: Extend static tests for layout contract**

Append these tests to `tests/static.test.mjs`:

```js
test("css defines fixed 16:9 stage and no-scroll dashboard contract", () => {
  const css = readFileSync("styles.css", "utf8");
  assert.ok(css.includes("aspect-ratio: 16 / 9"));
  assert.ok(css.includes("overflow: hidden"));
  assert.ok(css.includes("grid-template-columns: 300px minmax(0, 1fr)"));
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
```

- [ ] **Step 2: Run the failing CSS tests**

Run: `node --test tests/static.test.mjs`

Expected: FAIL because `styles.css` does not exist or lacks required selectors.

- [ ] **Step 3: Create `styles.css`**

Create `styles.css`:

```css
* {
  box-sizing: border-box;
}

html,
body {
  width: 100%;
  height: 100%;
  margin: 0;
  overflow: hidden;
  font-family: Inter, Arial, "Microsoft YaHei", sans-serif;
  background: #0f172a;
}

button,
a {
  font: inherit;
}

.app-shell {
  width: 100vw;
  height: 100vh;
  display: grid;
  place-items: center;
  overflow: hidden;
}

.app-shell::before {
  content: "";
  position: fixed;
  inset: 0;
  background: #0f172a;
}

.sidebar,
.dashboard-stage {
  position: relative;
  z-index: 1;
}

.app-shell {
  grid-template-columns: 300px minmax(0, 1fr);
  aspect-ratio: 16 / 9;
}

.sidebar {
  width: 300px;
  height: min(100vh, 56.25vw);
  min-height: 720px;
  padding: 44px 22px 34px;
  display: flex;
  flex-direction: column;
  border-right: 1px solid rgba(170, 190, 255, 0.2);
  background: rgba(2, 6, 16, 0.84);
}

.brand {
  min-height: 98px;
  padding: 0 24px;
}

.brand strong {
  display: block;
  font-size: 38px;
  line-height: 1;
}

.brand span {
  display: block;
  margin-top: 10px;
  font-size: 15px;
  letter-spacing: 0.14em;
}

.nav-list {
  display: grid;
  gap: 18px;
  margin-top: 22px;
}

.sidebar-bottom {
  margin-top: auto;
  padding-top: 18px;
  border-top: 1px solid rgba(170, 190, 255, 0.16);
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 18px;
  min-height: 70px;
  padding: 0 22px;
  border-radius: 14px;
  color: inherit;
  text-decoration: none;
}

.nav-item.active {
  color: #fff;
}

.nav-icon,
.nav-icon img {
  width: 32px;
  height: 32px;
}

.nav-icon {
  display: grid;
  place-items: center;
}

.nav-icon img {
  object-fit: contain;
}

.dashboard-stage {
  width: calc(min(100vw, 177.7778vh) - 300px);
  height: min(100vh, 56.25vw);
  min-width: 0;
  min-height: 720px;
  padding: 38px 44px;
  overflow: hidden;
  display: grid;
  gap: 24px;
}

.scene-topbar {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 32px;
}

.scene-greeting {
  font-size: 48px;
  line-height: 1.08;
  font-weight: 850;
}

.status-pills,
.button-row {
  display: flex;
  gap: 14px;
}

.status-pills {
  margin-top: 14px;
}

.status-pill {
  padding: 12px 17px;
  border-radius: 999px;
  font-size: 21px;
}

.primary-scene-action,
.action-button {
  border: 0;
  border-radius: 999px;
  padding: 17px 28px;
  font-size: 21px;
  font-weight: 850;
}

.panel {
  min-width: 0;
  min-height: 0;
  padding: 21px;
  border-radius: 22px;
  overflow: hidden;
}

.panel h2 {
  margin: 0;
  font-size: 29px;
  line-height: 1.1;
}

.theme-morning-warm {
  grid-template-rows: 120px 330px 250px 250px;
  background: linear-gradient(180deg, #fff8e7, #f6fbff);
  color: #172033;
}

body[data-scene="elder"] .sidebar {
  background: linear-gradient(180deg, #fffdf6, #eef6ff);
  color: #172033;
}

body[data-scene="elder"] .nav-item {
  background: rgba(255, 255, 255, 0.54);
  color: #475569;
}

body[data-scene="elder"] .nav-item.active {
  background: linear-gradient(96deg, #2563eb, #1d4ed8);
  color: #fff;
}

.elder-brief {
  background: linear-gradient(135deg, #fff3c4, #fff);
  border: 1px solid #f1d27b;
}

.brief-card-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
  margin-top: 22px;
}

.brief-card,
.mini-card {
  border-radius: 18px;
  background: #fff;
  padding: 18px;
}

.brief-card {
  min-height: 126px;
  font-size: 24px;
}

.brief-card span,
.mini-card span {
  display: block;
  margin-top: 8px;
  color: #64748b;
}

.brief-icon {
  font-size: 32px;
}

.elder-middle {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.mini-grid {
  display: grid;
  gap: 14px;
  margin-top: 18px;
}

.medicine-grid {
  grid-template-columns: repeat(3, 1fr);
}

.metric-grid {
  grid-template-columns: repeat(4, 1fr);
}

.quick-action-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 18px;
}

.quick-action {
  border: 1px solid #e2e8f0;
  border-radius: 22px;
  background: #fff;
  color: #172033;
  padding: 22px 14px;
  font-size: 25px;
}

.quick-action span {
  display: block;
  font-size: 42px;
}

.quick-action em {
  display: block;
  margin-top: 8px;
  color: #64748b;
  font-style: normal;
}

.theme-morning-blue {
  grid-template-rows: 110px 1fr;
  background: linear-gradient(180deg, #edf6ff, #f8fbff);
  color: #102033;
}

body[data-scene="dad"] .sidebar {
  background: linear-gradient(180deg, #f8fbff, #e8f1ff);
  color: #132033;
}

body[data-scene="dad"] .nav-item {
  background: rgba(255, 255, 255, 0.58);
  color: #475569;
}

body[data-scene="dad"] .nav-item.active {
  background: linear-gradient(96deg, #2563eb, #0f4cb8);
  color: #fff;
}

.dad-grid {
  display: grid;
  grid-template-columns: 1.1fr 0.9fr 0.9fr;
  grid-template-rows: 1fr 0.95fr 0.95fr;
  gap: 18px;
}

.dad-grid .panel,
.theme-morning-blue .panel {
  background: #fff;
  border: 1px solid #dbe7f6;
}

.dad-brief {
  grid-column: 1;
}

.security-report {
  grid-column: 2 / 4;
}

.leaving-panel {
  grid-column: 1 / 4;
}

.panel-heading,
.security-body {
  display: flex;
  justify-content: space-between;
  gap: 18px;
}

.leaving-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 10px;
  margin-top: 14px;
}

.leaving-grid div {
  border-radius: 12px;
  background: #f8fafc;
  padding: 12px;
}

.theme-evening-dark {
  grid-template-rows: 110px 270px 210px 266px;
  background: linear-gradient(180deg, rgba(17, 24, 39, 0.96), rgba(15, 23, 42, 0.96));
  color: #eef2ff;
}

body[data-scene="mom"] .sidebar {
  background: linear-gradient(180deg, #111827, #151022);
  color: #eef2ff;
}

body[data-scene="mom"] .nav-item {
  background: rgba(255, 255, 255, 0.06);
  color: #cbd5e1;
}

body[data-scene="mom"] .nav-item.active {
  background: linear-gradient(96deg, #7c3aed, #be185d);
  color: #fff;
}

.theme-evening-dark .panel {
  background: rgba(30, 41, 59, 0.78);
  border: 1px solid rgba(203, 213, 225, 0.14);
}

.mom-top-grid,
.mom-bottom-grid {
  display: grid;
  gap: 22px;
}

.mom-top-grid {
  grid-template-columns: 1fr 1fr;
}

.mom-bottom-grid {
  grid-template-columns: 1fr 1.08fr 0.92fr;
}

.pet-layout {
  display: grid;
  grid-template-columns: 1.15fr 0.85fr;
  gap: 14px;
  margin-top: 14px;
}

.pet-layout p,
.camera-panel p,
.suggestions-panel p,
.compact-panel p,
.dad-brief p {
  margin: 8px 0;
}

.pet-insight {
  border-radius: 16px;
  background: rgba(124, 58, 237, 0.18);
  border: 1px solid rgba(167, 139, 250, 0.28);
  padding: 16px;
}

.pet-insight span {
  display: block;
  margin-top: 10px;
}

.routine-grid,
.family-grid {
  display: grid;
  gap: 14px;
  margin-top: 15px;
}

.routine-grid {
  grid-template-columns: 1fr 1fr;
}

.family-grid {
  grid-template-columns: repeat(4, 1fr);
}

.family-grid div,
.routine-grid p,
.energy-bar,
.camera-panel p {
  border-radius: 14px;
  background: rgba(15, 23, 42, 0.35);
  padding: 10px 12px;
}

.energy-value {
  display: block;
  font-size: 36px;
  margin: 12px 0;
}

.energy-bar {
  display: grid;
  grid-template-columns: 82px 1fr 42px;
  gap: 9px;
  align-items: center;
}

.energy-bar b {
  display: block;
  height: 16px;
  width: var(--value);
  border-radius: 999px;
  background: linear-gradient(90deg, #f59e0b, #ec4899);
}
```

- [ ] **Step 4: Run CSS/static tests**

Run: `node --test tests/static.test.mjs`

Expected: PASS.

- [ ] **Step 5: Run all unit tests**

Run: `node --test tests/*.test.mjs`

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add styles.css tests/static.test.mjs
git commit -m "feat: add one-screen dashboard styles"
```

---

### Task 5: Browser Verification and Layout QA

**Files:**
- No code files expected unless verification finds a defect.

- [ ] **Step 1: Start the local service**

Run:

```powershell
$env:PORT='4173'; node server.mjs
```

Expected output includes `DynamicUI dashboard running at http://localhost:4173`.

- [ ] **Step 2: Open and inspect each role**

Use the Browser plugin or Playwright to visit:

```text
http://localhost:4173/?role=elder
http://localhost:4173/?role=dad
http://localhost:4173/?role=mom
```

Expected:

- Elder uses bright morning theme.
- Dad uses bright blue morning theme.
- Mom uses dark evening theme.
- Sidebar labels and icon images match the `AI-Home-UI` structure.

- [ ] **Step 3: Check no-scroll contract in browser**

Run in the browser console or Playwright page evaluation:

```js
({
  scrollW: document.documentElement.scrollWidth,
  scrollH: document.documentElement.scrollHeight,
  viewportW: window.innerWidth,
  viewportH: window.innerHeight,
  bodyOverflow: getComputedStyle(document.body).overflow,
})
```

Expected:

- `bodyOverflow` is `"hidden"`.
- The dashboard is visible without main-page scrolling.

- [ ] **Step 4: Check overlap risk with bounding boxes**

Run this browser evaluation for each role:

```js
const boxes = [...document.querySelectorAll(".panel, .quick-action, .scene-topbar, .sidebar")]
  .map((el) => {
    const r = el.getBoundingClientRect();
    return {
      label: el.className,
      left: Math.round(r.left),
      top: Math.round(r.top),
      right: Math.round(r.right),
      bottom: Math.round(r.bottom),
      width: Math.round(r.width),
      height: Math.round(r.height),
    };
  });
boxes;
```

Expected:

- Panels have positive width and height.
- Mom pet activity note is inside `.pet-insight` and not visually clipped.
- Dad bottom leaving checklist and buttons are visible.
- Elder bottom one-tap actions are visible.

- [ ] **Step 5: Fix any verified layout defect**

If browser verification shows overlap or clipping, adjust only `styles.css` grid row sizes, gaps, font sizes, or the specific renderer markup causing the issue. Then rerun:

```powershell
node --test tests/*.test.mjs
```

Expected: PASS.

- [ ] **Step 6: Final commit**

```bash
git add index.html server.mjs src tests styles.css assets/icons-ai
git commit -m "feat: build DynamicUI role dashboard"
```

---

## Completion Criteria

- `node --test tests/*.test.mjs` passes.
- Local service runs at `http://localhost:4173`.
- `?role=elder`, `?role=dad`, and `?role=mom` render distinct complete scenes.
- No scene requires scrolling.
- No visible overlap or clipping remains.
- Sidebar uses copied `AI-Home-UI` icon assets and matching navigation labels.
- The main UI does not display design-document labels such as `Zone 1`, `role=elder`, or `长者 · 早晨页面`.
