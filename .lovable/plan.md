# Fix simulation sizing

## Changes
- Rework the simulation grid so the controls, graph, and results stack at narrow widths, use two columns at medium desktop widths, and only use three columns when enough space exists.
- Allow every grid section to shrink correctly without forcing horizontal overflow.
- Give the graph a responsive height and preserve a practical minimum canvas width.
- Keep the existing simulation behavior and visual design unchanged.

## Verification
- Check the simulation before and after running it at the current viewport, a narrow mobile viewport, and a wide desktop viewport.
- Confirm there is no horizontal overflow and the graph remains visible and interactive.
