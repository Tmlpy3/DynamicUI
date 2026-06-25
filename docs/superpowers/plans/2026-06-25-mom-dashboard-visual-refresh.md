# Mom Dashboard Visual Refresh Plan

## Objective

Implement the mom evening dashboard refresh described in the design spec while keeping the single-screen TV layout intact.

## Steps

1. Update scene data with camera preview, energy state, and savings visual metadata.
2. Ensure elder care renders before pet care in the mom top grid.
3. Add renderer helpers for camera playback, energy state, and savings visuals.
4. Add or update CSS for the new visual elements and responsive preview modes.
5. Update tests for section order, metadata, rendered visual elements, and CSS contracts.

## Acceptance Criteria

- The mom top care cards show elder care before pet care.
- The family status panel remains visible as the middle row.
- The camera panel includes a simulated player.
- The energy panel includes a status graphic.
- The suggestions panel includes a savings visual.
- Static tests pass and no Chinese copy remains in project files.
