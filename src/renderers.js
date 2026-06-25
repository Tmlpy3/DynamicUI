const SCENE_COPY = {
  elder: {
    greeting: "早上好",
    briefTitle: "今日家中一切正常",
    medicineTitle: "服药提醒",
    quickActions: ["开灯", "调节空调", "服药", "打开电视", "拨打家人"],
  },
  dad: {
    actions: ["一键购买耗材", "一键出门模式：全部执行"],
    kitchenLight: "厨房灯",
  },
  mom: {
    greeting: "晚上好！该准备晚餐啦",
    insight: "活动量比平时少 20%",
    energyAction: "一键执行节能建议",
    cameraAction: "搜索事件",
  },
};

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function attr(value) {
  return escapeHtml(value);
}

function text(value) {
  return escapeHtml(value);
}

function cx(...values) {
  return values.filter(Boolean).map(attr).join(" ");
}

function actionButton(label, variant = "") {
  return `<button class="${cx("action-button", variant)}" type="button">${text(label)}</button>`;
}

function renderList(items = [], className = "copy-list") {
  return `<ul class="${attr(className)}">${items.map((item) => `<li>${text(item)}</li>`).join("")}</ul>`;
}

function findSection(scene, ...keys) {
  return scene.sections.find((section) => keys.includes(section.id) || keys.includes(section.type));
}

function safePercent(value) {
  const numeric = Number.parseFloat(value);

  if (!Number.isFinite(numeric)) return 0;
  return Math.min(100, Math.max(0, numeric));
}

function renderSidebarItem(item, active = false) {
  return `
    <a class="${cx("nav-item", active && "active")}" href="${attr(item.href || "#")}">
      <span class="nav-icon"><img src="assets/icons-ai/${attr(item.icon)}.png" alt="" /></span>
      <span class="nav-label">${text(item.label)}</span>
    </a>`;
}

export function renderSidebar(items) {
  const topItems = items.filter((item) => !item.bottom);
  const bottomItems = items.filter((item) => item.bottom);

  return `
    <aside class="sidebar" aria-label="Primary navigation">
      <div class="brand">
        <strong>SmartThings</strong>
        <span>SAMSUNG</span>
      </div>
      <nav class="nav-list">${topItems.map((item, index) => renderSidebarItem(item, index === 0)).join("")}</nav>
      <nav class="nav-list sidebar-bottom">${bottomItems.map((item) => renderSidebarItem(item)).join("")}</nav>
    </aside>`;
}

function renderTopbar(scene, greeting = scene.greeting) {
  return `
    <header class="scene-topbar">
      <div>
        <h1>${text(greeting)}</h1>
        <div class="status-pills">
          <span>${text(scene.weather)}</span>
          <span>${text(scene.time)}</span>
        </div>
      </div>
      ${actionButton(scene.primaryAction, "primary")}
    </header>`;
}

function renderCard(item, className = "mini-card") {
  const title = item.title ?? item.value ?? "";
  const detail = item.detail ?? item.label ?? "";

  return `
    <article class="${cx(className, item.tone)}">
      ${item.icon ? `<span class="card-icon">${text(item.icon)}</span>` : ""}
      <strong>${text(title)}</strong>
      ${detail ? `<span>${text(detail)}</span>` : ""}
    </article>`;
}

function renderElder(scene) {
  const copy = SCENE_COPY.elder;
  const brief = findSection(scene, "brief", "elder-brief");
  const medicine = findSection(scene, "medicine");
  const health = findSection(scene, "health", "metrics");
  const quickActions = findSection(scene, "quick-actions");
  const quickLabels = copy.quickActions.map((label, index) => ({
    ...(quickActions?.items?.[index] || {}),
    title: label,
  }));

  return `
    ${renderTopbar(scene, copy.greeting)}
    <section class="panel elder-brief">
      <h2>${text(copy.briefTitle)}</h2>
      <div class="brief-card-grid">${(brief?.cards || []).map((card) => renderCard(card, "brief-card")).join("")}</div>
      <div class="button-row">${(brief?.actions || []).map((label, index) => actionButton(label, index === 0 ? "primary" : "warm")).join("")}</div>
    </section>
    <div class="elder-middle">
      <section class="panel medicine-panel">
        <h2>${text(copy.medicineTitle)}</h2>
        <div class="mini-grid medicine-grid">${(medicine?.items || []).map((item) => renderCard(item)).join("")}</div>
      </section>
      <section class="panel health-panel">
        <h2>${text(health?.title)}</h2>
        <div class="mini-grid metric-grid">${(health?.items || []).map((item) => renderCard(item)).join("")}</div>
      </section>
    </div>
    <section class="quick-action-grid" aria-label="${text(quickActions?.title)}">
      ${quickLabels.map((item) => `
        <button class="${cx("quick-action", item.tone)}" type="button">
          ${item.icon ? `<span>${text(item.icon)}</span>` : ""}
          <strong>${text(item.title)}</strong>
          ${item.detail ? `<em>${text(item.detail)}</em>` : ""}
        </button>`).join("")}
    </section>`;
}

function renderDad(scene) {
  const copy = SCENE_COPY.dad;
  const departure = findSection(scene, "departure", "dad-brief");
  const security = findSection(scene, "security", "security-report");
  const sensors = findSection(scene, "sensors", "compact-list");
  const maintenance = findSection(scene, "maintenance");
  const schedule = findSection(scene, "schedule");
  const leaving = findSection(scene, "leaving", "leaving-check");
  const leavingItems = [...(leaving?.items || []), copy.kitchenLight];

  return `
    ${renderTopbar(scene)}
    <div class="dad-grid">
      <section class="panel dad-brief">
        <h2>${text(departure?.title)}</h2>
        ${renderList(departure?.lines)}
        <div class="button-row">${(departure?.actions || []).map((label, index) => actionButton(label, index === 0 ? "primary" : "")).join("")}</div>
      </section>
      <section class="panel security-report">
        <div class="panel-heading">
          <h2>${text(security?.title)}</h2>
          <strong>${text(security?.status)}</strong>
        </div>
        ${renderList(security?.events, "event-list")}
        <p class="trend">${text(security?.trend)}</p>
      </section>
      <section class="panel compact-panel">
        <h2>${text(sensors?.title)}</h2>
        ${renderList(sensors?.items)}
      </section>
      <section class="panel compact-panel">
        <div class="panel-heading">
          <h2>${text(maintenance?.title)}</h2>
          ${actionButton(copy.actions[0], "teal")}
        </div>
        ${renderList(maintenance?.items)}
      </section>
      <section class="panel compact-panel">
        <h2>${text(schedule?.title)}</h2>
        ${renderList(schedule?.items)}
      </section>
      <section class="panel leaving-panel">
        <div class="panel-heading">
          <h2>${text(leaving?.title)}</h2>
          ${actionButton(copy.actions[1], "primary")}
        </div>
        <div class="leaving-grid">${leavingItems.map((item) => `<div>${text(item)}</div>`).join("")}</div>
      </section>
    </div>`;
}

function renderMom(scene) {
  const copy = SCENE_COPY.mom;
  const pet = findSection(scene, "pet", "pet-care");
  const elderCare = findSection(scene, "elder-care");
  const family = findSection(scene, "family", "family-status");
  const camera = findSection(scene, "camera", "camera-events");
  const energy = findSection(scene, "energy");
  const suggestions = findSection(scene, "suggestions");

  return `
    ${renderTopbar(scene, copy.greeting)}
    <div class="mom-top-grid">
      <section class="panel pet-panel">
        <h2>${text(pet?.title)}</h2>
        <div class="pet-layout">
          ${renderList(pet?.events, "event-list")}
          <aside class="pet-insight">
            <strong>${text(copy.insight)}</strong>
            <span>${text(pet?.water)}</span>
            <span>${text(pet?.next)}</span>
          </aside>
        </div>
      </section>
      <section class="panel elder-care-panel">
        <div class="panel-heading">
          <h2>${text(elderCare?.title)}</h2>
          <strong>${text(elderCare?.status)}</strong>
        </div>
        ${renderList(elderCare?.items, "routine-grid")}
      </section>
    </div>
    <section class="panel family-panel">
      <div class="panel-heading">
        <h2>${text(family?.title)}</h2>
        ${actionButton(family?.action || scene.primaryAction, "warm")}
      </div>
      <div class="family-grid">${(family?.items || []).map((item) => `<div>${text(item)}</div>`).join("")}</div>
    </section>
    <div class="mom-bottom-grid">
      <section class="panel camera-panel">
        <h2>${text(camera?.title)}</h2>
        ${renderList(camera?.events, "event-list")}
        <div class="button-row">${[...(camera?.actions || []), copy.cameraAction].map((label, index) => actionButton(label, index === 0 ? "primary" : "")).join("")}</div>
      </section>
      <section class="panel energy-panel">
        <h2>${text(energy?.title)}</h2>
        <strong class="energy-value">${text(energy?.usage)}</strong>
        <span>${text(energy?.cost)}</span>
        ${(energy?.split || []).map(([label, value]) => {
          const percent = safePercent(value);

          return `
          <div class="energy-bar">
            <span>${text(label)}</span>
            <b style="--value:${percent}%"></b>
            <strong>${percent}%</strong>
          </div>`;
        }).join("")}
      </section>
      <section class="panel suggestions-panel">
        <h2>${text(suggestions?.title)}</h2>
        ${renderList(suggestions?.items)}
        <div class="button-row">${actionButton(copy.energyAction, "primary")}</div>
      </section>
    </div>`;
}

export function renderDashboard(scene) {
  const body = scene.id === "elder" ? renderElder(scene) : scene.id === "dad" ? renderDad(scene) : renderMom(scene);

  return `<section class="dashboard-stage theme-${attr(scene.theme)}" data-scene="${attr(scene.id)}">${body}</section>`;
}
