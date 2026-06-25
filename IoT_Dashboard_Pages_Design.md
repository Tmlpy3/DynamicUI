# IoT Dashboard Page Design: Three Role-Based Scenes

This document describes a SmartThings AIOS dashboard with three tailored household scenes. Each scene is designed around a specific person, time of day, and task context rather than using a generic page template.

## Scene 1: Elder Morning

The elder morning page should feel warm, calm, and highly readable from TV distance.

Key content:
- Greeting: "Good morning, Grandma Wang"
- Weather and time: "Sunny 24°C, clean air", "Morning 7:30"
- Safety brief: the home is normal, the door is locked, and medicine is due.
- Medicine reminders: blood pressure medicine at 7:30, calcium tablet at 12:00, diabetes medicine at 18:00.
- Health overview: blood pressure, steps, indoor temperature, and weight.
- Quick actions: lights, air conditioner, door lock, family call, and emergency help.

AIOS responsibilities:
- Contextual: gather time, weather, device status, medication schedule, and user preferences.
- Agentic: prioritize medicine, safety reassurance, and simple next actions.
- Capability: call weather, health, device, notification, and voice APIs.
- Presentation: render high-contrast cards, large type, and simple confirmation controls.

## Scene 2: Dad Morning

The dad morning page focuses on leaving home efficiently while checking security, maintenance, schedule, and energy status.

Key content:
- Greeting: "Good morning, have a productive workday"
- Weather and time: "Sunny 22°C, light breeze", "Morning 7:45"
- Departure overview: device health, energy use, and packages.
- Overnight security patrol: timeline, no-issue status, and week-over-week trend.
- Sensor and maintenance status: smoke, leak, kitchen light, door/window sensors, filters, and battery.
- Family schedule: school, yoga, checkup, and package delivery.
- Leave-home checklist: lights, AC, window, lock, and security mode.

AIOS responsibilities:
- Contextual: collect device state, energy data, delivery data, security history, and family schedule.
- Agentic: rank departure actions and identify unresolved risks such as a light still on.
- Capability: batch-control SmartThings devices and open supply-purchase flows.
- Presentation: use dense, scannable panels and a clear primary leave-home action.

## Scene 3: Mom Evening

The mom evening page supports dinner preparation and household awareness without requiring page switching.

Key content:
- Greeting: "Good evening, time to get dinner ready"
- Weather and time: "Cloudy 20°C, light breeze", "Evening 19:30"
- Pet care: feeding, water, activity, and next feeding.
- Elder care: Grandpa's routine and status.
- Family status: where each family member is and what they are doing.
- Camera timeline: package delivery, recognized family member, highlight replay, and pet activity.
- Energy analysis and savings suggestions.

AIOS responsibilities:
- Contextual: gather camera events, family presence, pet care data, routine signals, and energy use.
- Agentic: surface dinner-related actions and unusual activity changes.
- Capability: search camera events, run energy actions, and trigger household notifications.
- Presentation: keep the full TV dashboard visible in a single screen with a prominent family-status row.
