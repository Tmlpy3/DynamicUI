# Mom Dashboard Visual Refresh Design

## Goal

Refresh the mom evening dashboard so it feels richer while preserving the one-screen TV layout. The family status panel remains the middle full-width row.

## Requirements

- Move `Grandpa's Activity Rhythm Today` before `Pet Care` in the top grid.
- Keep `Family Status` visible as the middle full-width panel.
- Add a simulated playback preview inside `Camera Event Timeline` below the event list.
- Add an energy status graphic above the usage number in `Energy Analysis`.
- Add a savings visual above the list in `Energy-Saving Suggestions`.
- Preserve the existing dark evening theme and no-scroll dashboard contract.

## Implementation Notes

The scene data owns all visible copy and visual preview metadata. Renderers should locate sections by `id` or `type` so the dashboard remains stable if scene arrays are reordered.

## Verification

Tests should confirm the section order, preview metadata, visual elements, responsive CSS rules, and renderer output.
