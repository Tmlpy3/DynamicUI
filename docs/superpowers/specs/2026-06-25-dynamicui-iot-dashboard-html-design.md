# DynamicUI IoT Dashboard HTML Design

## Goal

Build a local HTML dashboard from `IoT_Dashboard_Pages_Design.md`.

The experience should feel like a real SmartThings-style TV dashboard, not a rendered design document. The user can switch between three role scenes through a local service, and each scene appears as a complete one-screen dashboard.

## Source Material

- `IoT_Dashboard_Pages_Design.md`
- Sidebar reference: `C:\Users\yechao.xie\Documents\GitHub\AI-Home-UI`

The sidebar should follow the `AI-Home-UI` sidebar closely:

- `SmartThings` / `SAMSUNG` brand area
- Navigation labels: `Home`, `Devices`, `Routines`, `Life`, `Automations`, `Store`
- Bottom entries may keep `Settings` and `Help` if space allows
- Same basic structure: fixed sidebar, icon + label rows, active pill, TV-oriented spacing
- Reuse the `assets/icons-ai` image assets rather than replacing them with emoji in the final implementation

## App Shape

The project should provide a small local service, similar to `AI-Home-UI/server.mjs`, serving:

- `index.html`
- `styles.css`
- `src/app.js`
- scene data/rendering modules as needed
- copied icon assets used by the sidebar

The service should support role switching through URL params and sidebar/scene controls:

- `?role=elder`
- `?role=dad`
- `?role=mom`

Scene switching is internal product state. The UI should not show labels such as "elder page", "dad page", "mom page", "role=elder", or "Zone 1".

## Layout Contract

The target layout is a TV-style 16:9 dashboard, optimized for `1920x1080`.

Hard requirements:

- No scrolling for the main dashboard.
- Every scene must fit in one viewport.
- All source md zones for that scene must be represented.
- No overlapping text, cards, buttons, or panels.
- Use fixed grid rows/columns and stable card dimensions.
- Do not rely on content naturally expanding the page.
- The right content area changes by scene; the sidebar remains structurally consistent.

The final implementation should fit the viewport responsively while preserving the 16:9 composition. For small browser windows, scale the dashboard canvas rather than reflowing it into a stacked mobile layout.

## Scene Themes

### Elder Morning

The elder morning scene uses a bright morning theme.

Visual direction:

- Warm white / soft yellow / pale blue
- Large readable type
- Low information density
- Large buttons
- Clear safety and health cues

Content to include:

- Greeting: `👋 王奶奶，早上好！`
- Weather and time: `🌤 24°C 晴`, `上午 7:30`
- Home brief:
  - Weather is good / morning is calm
  - `降压药 7:30 该吃了`
  - Door lock is locked
  - Actions: `我知道了`, `已吃药`
- Medication reminder:
  - `降压药 7:30`
  - `钙片 12:00`
  - `降糖药 18:00`
- Health overview:
  - Blood pressure `128/82`
  - Steps `350`, goal `3,000`
  - Room temperature `24°C`
  - Weight `62kg`
- One-tap actions:
  - `灯光`
  - `空调`
  - `门锁`
  - `家人`
  - `求助`

The scene should imply the elder morning context through greeting, large type, health reminders, and simple action buttons. It should not display a page title like `长者 · 早晨页面`.

### Dad Morning

The dad morning scene uses a bright, efficient, cool morning theme.

Visual direction:

- White / pale blue
- Medium-high information density
- Clear action hierarchy
- Strong focus on departure and security

Content to include:

- Greeting: `👋 早上好！今天工作顺利`
- Weather and time: `🌤 22°C 多云`, `上午 7:45`
- Home brief / departure summary:
  - Home is normal
  - Energy note: `今日用电 3.2 kWh`
  - Package note: `今天有 2 个快递待收`
  - Actions: `一键出门`, `我知道了`
- Night security patrol report:
  - `全夜无异常`
  - `22:00 安防模式启动`
  - `23:15 后院移动侦测（猫）`
  - `01:30 门口移动侦测（风）`
  - `06:30 安防模式解除`
  - Trend: abnormal events down `30%`
- Sensor status:
  - Smoke, water leak, door/window, temperature sensors normal
- Device maintenance:
  - Water filter needs replacement
  - Door lock battery `78%`
  - Robot vacuum filter normal
  - Air purifier filter normal
  - Required action: `一键购买耗材`
- Family schedule:
  - Child school
  - Mom yoga
  - Grandpa checkup
  - Package delivery window
- Leaving-home security checklist:
  - Bedroom light closed
  - Living room AC closed
  - Kitchen light still on
  - Bedroom window closed
  - Door locked
  - Security mode ready
  - Required action: `一键出门模式：全部执行`

All dad scene zones must fit on one screen. Use a dashboard grid rather than a vertical document layout.

### Mom Evening

The mom evening scene uses a dark evening theme.

Visual direction:

- Dark navy / slate background
- Purple-pink active accent
- Warm night household feeling
- Family, pet, and energy management visible together

Content to include:

- Greeting: `👋 晚上好！该准备晚餐啦`
- Weather and time: `🌙 20°C 多云`, `晚上 19:30`
- Pet care:
  - Cat daily events
  - Water dispenser `75%`
  - Next feeding `18:00`
  - Activity is `20%` below usual
  - The activity note must not be clipped or overlapped
- Elder care:
  - Grandpa activity routine
  - Normal daily rhythm status
- Family status:
  - Child in bedroom doing homework
  - Dad not home / working late
  - Mom in kitchen cooking
  - Grandpa in living room watching TV
  - Action: `叫小明吃饭`
- Camera event timeline:
  - Package delivery
  - Grandpa recognized
  - Highlight moment
  - Pet in backyard
  - Actions: `今日精彩回放`, `搜索事件`
- Energy analysis:
  - `今日用电 15.2 kWh`
  - `本月预估 ¥185`
  - Consumption split: AC, water heater, fridge, other
- Energy suggestions:
  - Set AC to `26°C`
  - Shift laundry away from peak time
  - Close standby devices
  - Required action: `一键执行节能建议`

All mom scene content must fit on one screen. The bottom row must be fully visible, and the pet activity note must not overlap the next row.

## Information Architecture

The left sidebar remains the global product navigation. Role scene switching should be available without making the UI feel like a design review tool. Acceptable options:

- Keyboard/remote shortcuts and URL params for development
- A subtle scene switcher in the content footer/header only if needed
- Active `Home` state in the sidebar while the dashboard content changes

Do not replace the sidebar navigation items with `长者 / 爸爸 / 妈妈`. That would break the requirement to match `AI-Home-UI`.

## Implementation Notes

Recommended file structure:

- `server.mjs`
- `index.html`
- `styles.css`
- `src/app.js`
- `src/scenes.js`
- `assets/icons-ai/*` copied from `AI-Home-UI`

Rendering should be data-driven. Each scene should define:

- theme
- greeting
- status pills
- layout regions
- cards/panels
- actions

Avoid parsing the markdown at runtime. Use the markdown as source material and encode the dashboard content into scene data.

## Verification

Before completion:

- Start the local service.
- Open the page in the browser.
- Verify `?role=elder`, `?role=dad`, and `?role=mom`.
- Check each scene at a 16:9 viewport such as `1920x1080`.
- Confirm no scrolling is required.
- Confirm no text or buttons overlap.
- Confirm all md zones and required actions are present.
- Confirm sidebar matches `AI-Home-UI` structure and uses the copied icon assets.
