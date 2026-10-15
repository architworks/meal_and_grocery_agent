---
name: Kitch — The Working Kitchen
version: 1.0.0
platform: web
components:
  button-primary:
    background: "#27472f"
    color: "#fffefa"
    radius: 11px
    height: 40px
    padding: 0 15px
  button-secondary:
    background: "#fffefa"
    color: "#465048"
    radius: 11px
    height: 40px
    padding: 0 15px
  card:
    background: "#fffefa"
    radius: 16px
    padding: 24px
  input:
    background: "#fffefa"
    color: "#1d241e"
    radius: 11px
    height: 42px
    padding: 10px 12px
---

# 1. Design Direction

**North Star: The Working Kitchen.** Kitch should feel like a calm, capable household workspace: warm enough to belong in the home, structured enough to trust with plans and orders, and fast enough for everyday use. The interface keeps the existing culinary photography and forest-green identity while removing decorative “AI app” styling.

# 2. Color

- **Hearth Forest — `#1f3c28`:** navigation shell and deepest brand surface.
- **Working Green — `#27472f`:** primary actions, active controls, and strong text accents.
- **Kitchen Green — `#46673f`:** secondary emphasis and progress.
- **Pantry Sage — `#dfead9`:** selected and supportive states.
- **Warm Ochre — `#a75b26`:** restrained culinary accent; never the main action color.
- **Canvas — `#f3f4ef`:** page ground.
- **Card — `#fffefa`:** primary content surface.
- **Ink — `#1d241e`:** primary text.
- **Soft Ink — `#465048`:** secondary text.
- **Muted — `#6e786f`:** tertiary text.
- **Line — `#d8ddd3`:** borders and dividers.
- **Danger — `#b4232b`:** destructive and error states only.

# 3. Typography

Use `Avenir Next`, falling back to `Segoe UI` and the system sans-serif, for display headings and prominent titles. Use the native system sans-serif stack for body copy, controls, and data. Headings are bold and compact with slightly negative tracking; body copy is calm and readable. Use tabular numerals for changing quantities, dates, prices, and nutrition values.

# 4. Shape, Space, and Elevation

Use an 8px, 11px, 14px, and 16px radius scale. Controls use 8–11px corners; content cards use 14–16px corners. Prefer an 8px base spacing rhythm with 12px control gaps, 18px section gaps, and 24px card padding. Keep surfaces flat by default. Reserve shadows for the rail edge, active navigation, dialogs, and the floating chat dock.

# 5. Layout and Responsiveness

Desktop uses a fixed 216px forest rail and a compact content workspace. Laptop layouts reduce padding and card density without hiding core actions. Mobile turns navigation into a horizontally scrollable top rail, stacks controls and cards, hides redundant prompts, and preserves readable touch targets. Login imagery may crop only enough to maintain full-bleed coverage; overlay content must never collide or force horizontal scrolling.

# 6. Components

- **Navigation:** forest shell, muted inactive labels, solid near-white active state, and a visible focus ring.
- **Buttons:** 40px default height, solid primary action, bordered secondary action, concise labels, and a subtle pressed scale.
- **Cards:** warm near-white surface, quiet border, 14–16px radius, and minimal elevation.
- **Inputs:** solid surface, clear label or accessible name, visible caret and focus state, and ellipsis for constrained placeholders.
- **Chips:** use only for compact status, selection, or member switching—not decorative headings.
- **Chat dock:** a compact floating command bar with one restrained entrance motion and reduced-motion support.
- **Tables:** preserve readable item names, compact quantity controls, consistent actions, and responsive horizontal handling when columns cannot fit.

# 7. Interaction and Accessibility

All interactive elements must be keyboard reachable, visibly focused, and labeled. Icon-only buttons require accessible names. Enter submits chat; Shift+Enter inserts a new line. Motion should be short, purposeful, and disabled under `prefers-reduced-motion`. Touch targets must remain comfortable on mobile, and fixed UI must not obscure focused content.

# 8. Guardrails

- Do preserve the chef-hat mark, existing kitchen photography, forest-green identity, and login-flow arrows.
- Do reuse shared components and tokens so equivalent controls look and behave alike across pages.
- Do keep operational pages calm, dense, and easy to scan.
- Do not add eyebrow labels, decorative pills, glass effects, gradient text, or ornamental component grids.
- Do not introduce translucent buttons, excessive shadows, oversized controls, or unrelated visual changes.
- Do not let animation delay an action or make the interface feel theatrical.
