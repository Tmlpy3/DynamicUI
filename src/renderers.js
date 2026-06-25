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

function leadingIcon(value, fallback = "•") {
  const match = String(value ?? "").match(/^[^\p{L}\p{N}]+/u);
  return match?.[0]?.trim() || fallback;
}

function stripLeadingIcon(value) {
  return String(value ?? "").replace(/^[^\p{L}\p{N}]+/u, "").trim();
}

function renderCameraPlayer(preview = {}) {
  return `
    <div class="camera-player" aria-label="${attr(preview.title || "Camera playback preview")}">
      <div class="player-frame">
        ${preview.image ? `<img class="clip-preview-image" src="${attr(preview.image)}" alt="" />` : ""}
        <span class="play-dot">▶</span>
        <strong>${text(preview.title)}</strong>
        <em>${text(preview.time)}</em>
      </div>
      <span>${text(preview.caption)}</span>
    </div>`;
}

function renderEnergyState(state = {}, split = []) {
  const parts = split.map(([, value]) => safePercent(value));
  const cumulative = parts.slice(0, 4).reduce((values, value) => {
    const previous = values.at(-1) ?? 0;
    values.push(Math.min(100, previous + value));
    return values;
  }, []);
  const [first = 0, second = first, third = second] = cumulative;

  return `
    <div class="energy-state">
      <div class="energy-ring" style="--energy-a:${first}%;--energy-b:${second}%;--energy-c:${third}%"><span>${text(state.value)}</span></div>
      <div>
        <strong>${text(state.label)}</strong>
        <span>${text(state.peak)}</span>
      </div>
    </div>`;
}

function renderSavingVisual(visual = {}) {
  return `
    <div class="saving-visual">
      <span>${text(visual.label)}</span>
      <strong>${text(visual.value)}</strong>
      <em>${text(visual.detail)}</em>
    </div>`;
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

function renderTopbar(scene) {
  return `
    <header class="scene-topbar">
      <div>
        <h1>${text(scene.greeting)}</h1>
        <div class="status-pills">
          <span>${text(scene.weather)}</span>
          <span>${text(scene.time)}</span>
        </div>
      </div>
      ${scene.primaryAction ? actionButton(scene.primaryAction, "primary") : ""}
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

function renderDadDeparture(departure = {}) {
  const [deviceLine = "", energyLine = "", packageLine = ""] = departure.lines || [];

  return `
      <section class="panel dad-brief">
        <div class="dad-brief-copy">
          <div class="dad-brief-header">
            <h2>${text(departure.title)}</h2>
            <div class="button-row dad-brief-actions">${(departure.actions || []).map((label, index) => actionButton(label, index === 0 ? "primary" : "")).join("")}</div>
          </div>
          <div class="dad-brief-grid">
            <div class="dad-info-tile">
              <span class="dad-status-icon">✓</span>
              <span>
                <strong>${text(stripLeadingIcon(deviceLine))}</strong>
                <em>Home systems are ready</em>
              </span>
            </div>
            <div class="dad-info-tile">
              <span class="dad-status-icon">⚡</span>
              <span>
                <strong>${text(stripLeadingIcon(energyLine))}</strong>
                <em>Energy use is on track</em>
              </span>
            </div>
            <div class="dad-info-tile">
              <span class="dad-status-icon">📦</span>
              <span>
                <strong>${text(stripLeadingIcon(packageLine))}</strong>
                <em>Package area at the front door</em>
              </span>
            </div>
          </div>
        </div>
      </section>`;
}

function renderDadSensorStatus(section = {}) {
  const items = section.items || [];

  return `
      <section class="panel dad-detail-card sensor-card">
        <div class="dad-detail-heading">
          <span class="dad-detail-icon sensor-heading-icon" aria-hidden="true"></span>
          <h2>${text(section.title)}</h2>
        </div>
        <div class="sensor-status-grid">${items
          .map((item) => `
          <div>
            <span>${text(leadingIcon(item))}</span>
            <strong>${text(stripLeadingIcon(item))}</strong>
          </div>`)
          .join("")}</div>
      </section>`;
}

function renderDadMaintenance(section = {}) {
  const [primary = "", ...rest] = section.items || [];

  return `
      <section class="panel dad-detail-card maintenance-card">
        <div class="dad-detail-heading">
          <span class="dad-detail-icon maintenance-heading-icon" aria-hidden="true"></span>
          <h2>${text(section.title)}</h2>
          ${section.action ? actionButton(section.action, "teal") : ""}
        </div>
        <div class="maintenance-focus">
          <span>${text(leadingIcon(primary, "⚠"))}</span>
          <strong>${text(stripLeadingIcon(primary))}</strong>
        </div>
        <div class="maintenance-list">${rest
          .map((item) => `
          <div>
            <span>${text(leadingIcon(item))}</span>
            <strong>${text(stripLeadingIcon(item))}</strong>
          </div>`)
          .join("")}</div>
      </section>`;
}

function renderDadSchedule(section = {}) {
  const items = section.items || [];

  return `
      <section class="panel dad-detail-card schedule-card">
        <div class="dad-detail-heading">
          <span class="dad-detail-icon">📅</span>
          <h2>${text(section.title)}</h2>
        </div>
        <div class="schedule-stack">${items
          .map((item) => `
          <div>
            <span>${text(leadingIcon(item))}</span>
            <strong>${text(stripLeadingIcon(item))}</strong>
          </div>`)
          .join("")}</div>
      </section>`;
}

function renderElder(scene) {
  const brief = findSection(scene, "brief", "elder-brief");
  const medicine = findSection(scene, "medicine");
  const health = findSection(scene, "health", "metrics");
  const quickActions = findSection(scene, "quick-actions");

  return `
    ${renderTopbar(scene)}
    <section class="panel elder-brief">
      <h2>${text(brief?.title)}</h2>
      <div class="brief-card-grid">${(brief?.cards || []).map((card) => renderCard(card, "brief-card")).join("")}</div>
      <div class="button-row">${(brief?.actions || []).map((label, index) => actionButton(label, index === 0 ? "primary" : "warm")).join("")}</div>
    </section>
    <div class="elder-middle">
      <section class="panel medicine-panel">
        <h2>${text(medicine?.title)}</h2>
        <div class="mini-grid medicine-grid">${(medicine?.items || []).map((item) => renderCard(item)).join("")}</div>
      </section>
      <section class="panel health-panel">
        <h2>${text(health?.title)}</h2>
        <div class="mini-grid metric-grid">${(health?.items || []).map((item) => renderCard(item)).join("")}</div>
      </section>
    </div>
    <section class="quick-action-grid" aria-label="${text(quickActions?.title)}">
      ${(quickActions?.items || []).map((item) => `
        <button class="${cx("quick-action", item.tone)}" type="button">
          ${item.icon ? `<span>${text(item.icon)}</span>` : ""}
          <strong>${text(item.title)}</strong>
          ${item.detail ? `<em>${text(item.detail)}</em>` : ""}
        </button>`).join("")}
    </section>`;
}

function renderDad(scene) {
  const departure = findSection(scene, "departure", "dad-brief");
  const security = findSection(scene, "security", "security-report");
  const sensors = findSection(scene, "sensors", "compact-list");
  const maintenance = findSection(scene, "maintenance");
  const schedule = findSection(scene, "schedule");
  const leaving = findSection(scene, "leaving", "leaving-check");

  return `
    ${renderTopbar(scene)}
    <div class="dad-grid">
      ${renderDadDeparture(departure)}
      <section class="panel security-report">
        <div class="security-report-top">
          <span class="security-shield">🛡</span>
          <div>
            <h2>${text(security?.title)}</h2>
            <strong>${text(security?.status)}</strong>
          </div>
        </div>
        <div class="security-timeline">${(security?.events || [])
          .slice(0, 2)
          .map((event) => `<div><span></span><p>${text(event)}</p></div>`)
          .join("")}</div>
        <p class="security-trend">${text(security?.trend)}</p>
      </section>
      ${renderDadSensorStatus(sensors)}
      ${renderDadMaintenance(maintenance)}
      ${renderDadSchedule(schedule)}
      <section class="panel leaving-panel">
        <div class="panel-heading">
          <h2>${text(leaving?.title)}</h2>
          ${leaving?.action ? actionButton(leaving.action, "primary") : ""}
        </div>
        <div class="leaving-grid">${(leaving?.items || []).map((item) => `<div>${text(item)}</div>`).join("")}</div>
      </section>
    </div>`;
}

function renderElderCare(section = {}) {
  const metrics = section.metrics || [];
  const timeline = section.timeline || [];

  return `
      <section class="panel elder-care-panel">
        <div class="panel-heading">
          <h2>${text(section.title)}</h2>
          <strong>${text(section.status)}</strong>
        </div>
        ${section.summary ? `<p class="elder-care-summary">${text(section.summary)}</p>` : ""}
        <div class="elder-metric-grid">${metrics.map((metric) => `
          <article>
            <span>${text(metric.label)}</span>
            <strong>${text(metric.value)}</strong>
            <em>${text(metric.detail)}</em>
          </article>`).join("")}
        </div>
        <div class="activity-timeline">${timeline.map((event) => `
          <div class="${cx("activity-step", event.tone)}">
            <span>${text(event.time)}</span>
            <strong>${text(event.label)}</strong>
          </div>`).join("")}
        </div>
      </section>`;
}

function renderMom(scene) {
  const pet = findSection(scene, "pet", "pet-care");
  const elderCare = findSection(scene, "elder-care");
  const family = findSection(scene, "family", "family-status");
  const camera = findSection(scene, "camera", "camera-events");
  const energy = findSection(scene, "energy");
  const suggestions = findSection(scene, "suggestions");

  return `
    ${renderTopbar(scene)}
    <div class="mom-top-grid">
      ${renderElderCare(elderCare)}
      <section class="panel pet-panel">
        <h2>${text(pet?.title)}</h2>
        <div class="pet-layout">
          ${renderList(pet?.events, "event-list")}
          <aside class="pet-insight">
            <strong>${text(pet?.insight)}</strong>
            <span>${text(pet?.water)}</span>
            <span>${text(pet?.next)}</span>
          </aside>
        </div>
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
        ${renderCameraPlayer(camera?.preview)}
        <div class="button-row">${(camera?.actions || []).map((label, index) => actionButton(label, index === 0 ? "primary" : "")).join("")}</div>
      </section>
      <section class="panel energy-panel">
        <h2>${text(energy?.title)}</h2>
        ${renderEnergyState(energy?.state, energy?.split)}
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
        ${renderSavingVisual(suggestions?.visual)}
        ${renderList(suggestions?.items)}
        <div class="button-row">${suggestions?.action ? actionButton(suggestions.action, "primary") : ""}</div>
      </section>
    </div>`;
}

export function renderDashboard(scene) {
  const body = scene.id === "elder" ? renderElder(scene) : scene.id === "dad" ? renderDad(scene) : renderMom(scene);

  return `<section class="dashboard-stage theme-${attr(scene.theme)}" data-scene="${attr(scene.id)}">${body}</section>`;
}
