# DynamicUI IoT Dashboard HTML Design

## Goal

Build a static SmartThings AIOS dashboard with three role-based scenes: elder morning, dad morning, and mom evening.

## Architecture

- `index.html` hosts a single application shell.
- `src/app.js` reads the role from the URL, mounts the sidebar and dashboard, and handles role switching.
- `src/scenes.js` stores navigation labels, supported roles, scene payloads, and role parsing.
- `src/renderers.js` converts scene payloads into escaped HTML.
- `styles.css` defines the fixed 16:9 TV layout, scene themes, cards, panels, and responsive preview behavior.
- `server.mjs` serves static files for local preview.

## Scene Content

Elder morning:
- Greeting: `Good morning, Grandma Wang`
- Weather and time: `Sunny 24°C, clean air`, `Morning 7:30`
- Medicine reminders, health overview, and quick actions.

Dad morning:
- Greeting: `Good morning, have a productive workday`
- Weather and time: `Sunny 22°C, light breeze`, `Morning 7:45`
- Departure overview, security patrol, sensors, maintenance, schedule, and leave-home checklist.

Mom evening:
- Greeting: `Good evening, time to get dinner ready`
- Weather and time: `Cloudy 20°C, light breeze`, `Evening 19:30`
- Pet care, elder care, family status, camera timeline, energy analysis, and saving suggestions.

## Rendering Rules

- Do not display internal design labels such as `Zone 1` or `role=elder`.
- Keep sidebar navigation aligned with AI-Home-UI labels.
- Escape all user-visible scene text before writing HTML.
- Find scene sections by stable identifiers rather than by array position.

## Verification

Tests cover role parsing, required scene content, renderer escaping, sidebar output, static server behavior, layout CSS, and the no-scroll one-screen contract.
