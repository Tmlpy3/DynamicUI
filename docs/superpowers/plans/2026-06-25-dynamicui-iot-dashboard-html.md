# DynamicUI IoT Dashboard HTML Implementation Plan

## Objective

Create and maintain a static, data-driven SmartThings AIOS dashboard with three role scenes and a fixed 16:9 TV presentation.

## Implementation Steps

1. Keep all visible scene copy in `src/scenes.js`.
2. Render the sidebar and dashboard from scene data in `src/renderers.js`.
3. Keep `src/app.js` responsible for URL role parsing, history updates, keyboard role switching, and mounting.
4. Use `styles.css` for the TV canvas, role themes, grids, cards, and responsive previews.
5. Use `server.mjs` for local static serving.
6. Maintain tests for scene data, renderer behavior, CSS contracts, and server path safety.

## Scene Requirements

Elder morning:
- Warm visual tone.
- Large typography.
- Medicine reminders, health overview, and quick household actions.

Dad morning:
- Clear departure workflow.
- Security report, maintenance warnings, family schedule, and leave-home checklist.

Mom evening:
- Dark evening tone.
- Elder care, pet care, family status, camera events, energy analysis, and savings suggestions.

## Testing

Run the Node test suite after changes. The suite should confirm role support, required English copy, escaped rendering, icon paths, content types, responsive CSS, and one-screen layout rules.
