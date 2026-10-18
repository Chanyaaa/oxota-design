---
name: OXOTA
description: The design system of the «Охота» billiard club in Kharkiv, shared by its site and its apps.
colors:
  bg: "rgb(24 18 16)"
  surface: "rgb(33 26 24)"
  surface-2: "rgb(37 30 27)"
  surface-3: "rgb(48 40 38)"
  line: "rgb(83 67 61)"
  line-2: "rgb(160 141 133)"
  fg: "rgb(237 224 219)"
  fg-2: "rgb(216 194 185)"
  fg-3: "rgb(160 141 133)"
  accent: "rgb(255 182 149)"
  accent-2: "color-mix(in srgb, rgb(83 34 8) 8%, rgb(255 182 149))"
  accent-soft: "rgb(84 55 42)"
  on-accent: "rgb(83 34 8)"
  gold: "rgb(220 216 134)"
  gold-soft: "color-mix(in srgb, rgb(220 216 134) 16%, rgb(37 30 27))"
  live: "rgb(162 211 161)"
  live-soft: "rgb(48 66 48)"
  danger: "rgb(255 180 171)"
  danger-soft: "color-mix(in srgb, rgb(255 180 171) 14%, rgb(37 30 27))"
  on-danger: "rgb(105 0 5)"
  backdrop: "rgb(0 0 0 / 0.7)"
  bg-light: "rgb(255 248 246)"
  surface-light: "rgb(255 241 236)"
  surface-2-light: "rgb(249 235 230)"
  surface-3-light: "rgb(243 229 225)"
  line-light: "rgb(216 194 185)"
  line-2-light: "rgb(133 115 108)"
  fg-light: "rgb(33 26 24)"
  fg-2-light: "rgb(83 67 61)"
  fg-3-light: "rgb(107 92 86)"
  accent-light: "rgb(108 54 26)"
  accent-2-light: "color-mix(in srgb, rgb(255 255 255) 8%, rgb(108 54 26))"
  accent-soft-light: "rgb(255 215 198)"
  on-accent-light: "rgb(255 255 255)"
  gold-light: "rgb(100 97 28)"
  gold-soft-light: "color-mix(in srgb, rgb(100 97 28) 16%, rgb(249 235 230))"
  live-light: "rgb(60 104 63)"
  live-soft-light: "rgb(210 228 206)"
  danger-light: "rgb(186 26 26)"
  danger-soft-light: "color-mix(in srgb, rgb(186 26 26) 14%, rgb(249 235 230))"
  on-danger-light: "rgb(255 255 255)"
  backdrop-light: "rgb(33 26 24 / 0.4)"
typography:
  display:
    fontFamily: "'Playfair Display', ui-serif, Georgia, 'Times New Roman', serif"
    fontSize: "1.5rem"
    fontWeight: 700
    lineHeight: 1.333
    letterSpacing: "normal"
    fontFeature: "lnum"
  headline:
    fontFamily: "'Playfair Display', ui-serif, Georgia, 'Times New Roman', serif"
    fontSize: "1.125rem"
    fontWeight: 700
    lineHeight: 1.375
    letterSpacing: "normal"
    fontFeature: "lnum"
  title:
    fontFamily: "'Playfair Display', ui-serif, Georgia, 'Times New Roman', serif"
    fontSize: "1rem"
    fontWeight: 700
    lineHeight: 1.375
    letterSpacing: "normal"
    fontFeature: "lnum"
  body:
    fontFamily: "Roboto, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Roboto, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: "1.25rem"
  meta:
    fontFamily: "Roboto, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 400
    lineHeight: "1.125rem"
  caption:
    fontFamily: "Roboto, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif"
    fontSize: "0.6875rem"
    fontWeight: 600
    lineHeight: "1rem"
  caps-label:
    fontFamily: "Roboto, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif"
    fontSize: "0.6875rem"
    fontWeight: 600
    lineHeight: "1rem"
    letterSpacing: "0.08em"
rounded:
  lg: "8px"
  xl: "8px"
  "2xl": "12px"
  "3xl": "16px"
  full: "9999px"
---

# Design System: OXOTA

## Overview

The «Охота» club after dark: espresso-brown surfaces, warm cream text, Playfair Display on every heading as the club's upscale voice, and plain Roboto for everything else. Colour is rare, so a hue on screen always means something; each app's own DESIGN.md says what it means there. Every target a finger can reach is at least 44 px.

The palette began on the club's WordPress site, and its colour roles are copied from there verbatim. Арена (arena.oxota.kh.ua) is built on this package, the banquet app (banket.oxota.kh.ua) is next, and the site will follow when it leaves WordPress. The emblem in `assets/oxota-emblem.svg` is the club's.

**Key Characteristics:**
- Dark by default, light opt-in; both are the club's own Material Design 3 roles.
- Two typefaces only: Playfair Display 700 for headings, Roboto for everything else.
- Three hues on a warm neutral ladder: peach, cloth green, chartreuse.
- Depth by tonal steps and hairline borders, not shadows.
- Tabular digits on every number that changes or lines up in a column.

## Colors

A warm, low-chroma espresso ladder with three rare hues, each written by hand for both themes.

The palette has two layers in `tokens.css`. The `--ox-*` roles are the club's Material Design 3 colours, copied verbatim from its WordPress theme; their names equal the theme's `--wp--preset--color--*`. The roles screens paint with (the frontmatter keys: `bg`, `surface`, `accent`, …) are expressed through them, so a brand change touches the first layer only. Dark values are the default keys; light values carry a `-light` suffix and apply under `data-theme="light"` on `<html>`.

### Primary
- **Lamplight Peach** (`accent`): the warm glow over a table, where the eye and thumb should go. The primary action, a selected option, the focus ring, text selection. Hover mixes 8% of `on-accent` into it (`accent-2`), the MD3 state layer.
- **Peach Container** (`accent-soft`): the tonal fill behind a selected option or an active item. Peach text on it, never peach on a peach fill.

### Secondary
- **Lit Cloth Green** (`live`, with `live-soft` behind it): something good is happening right now; in Арена, a game in play. The one role outside the club palette: an MD3 custom colour made from the cloth of Арена's floor plan (`#2f6b4f`), harmonized to the peach at the club roles' chroma, at tone 80 in dark and 40 in light. A brand change must regenerate it by hand.

### Tertiary
- **Trophy Chartreuse** (`gold`, with `gold-soft` behind it): wins, gains, prizes. It doubles as the warning colour (`--warn`), because the brand has no third accent.

### Neutral
- **Espresso Night** (`bg`): the page. Near-black with a warm cast.
- **Surface ladder** (`surface`, `surface-2`, `surface-3`): cards and panels on `surface`; controls and fields on `surface-2`; hover and focused fields on `surface-3`. A raised piece (`surface-raised`, the selected tab) is the top step in dark and the page colour in light: lighter is raised in both themes.
- **Warm Cream** (`fg`): primary text, names, headings.
- **Worn Cream** (`fg-2`): secondary text, unselected controls, field labels.
- **Chalk Dust** (`fg-3`): the muted step for meta lines, hints and inactive items. In light it is one step darker than the club's outline, for 5.2:1 under 13 px text.
- **Hairline** (`line`) and **Hairline Hover** (`line-2`): the 1 px border on containers and controls, and its hover step.
- **Danger** (`danger`, `danger-soft`, `on-danger`): errors and destructive confirms.
- **Backdrop** (`backdrop`): the dim behind a modal, blurred 4 px.

### Named Rules

**The Verbatim Club Rule.** Never tune an `--ox-*` value to taste. They change only by pasting from the club's theme, and components never reference them or raw colours, only the roles.

**The Not-Gold Rule.** The tertiary highlight is chartreuse. There is no yellow, amber or metallic gold anywhere.

**The Honest Tint Rule.** Secondary text gets its own role (`fg-2`, `fg-3`), never an opacity on another colour. Transparency drifts in opposite directions in the two themes: `text-accent/70` faded to 2.9:1 on light.

## Typography

**Display Font:** Playfair Display 700 (with ui-serif, Georgia, Times New Roman)
**Body Font:** Roboto 400–700 (with the system sans stack)

**Character:** Playfair is the club's voice at the door, a high-contrast serif that names pages, sections and cards. Roboto is neutral and legible at arm's length, with tabular figures for every number that moves. Both are self-hosted woff2 subsets (Cyrillic, Latin, and a math subset for arrows and ∞) under the SIL Open Font License, in `fonts/`.

### Hierarchy
- **Display** (Playfair 700, 24 px, 1.333): the page title.
- **Headline** (Playfair 700, 18 px, 1.375): a section of a screen, a modal title.
- **Title** (Playfair 700, 16 px, 1.375): a card or panel heading.
- **Body** (Roboto 400, 16 px, 1.5): what you type and read at length. Every field is 16 px so iOS does not zoom into it on focus.
- **Label** (Roboto 500–600, 14 px, 20 px line): what names or acts: names, buttons, tabs, field labels.
- **Meta** (Roboto 400, 13 px, 18 px line, `text-meta`): what describes: the line under a name, a subtitle, a hint.
- **Caption** (Roboto 600, 11 px, 16 px line, `text-caption`): what tags: badges, counters.
- **Caps label** (Roboto 600, 11 px, 0.08em, uppercase, `.caps-label`): an uppercase label naming a group or a value.

### Named Rules

**The Playfair Floor Rule.** Playfair appears only on headings, only at 700, never under 16 px, with normal tracking and lining figures. Its hairlines are drawn for display sizes, and old-style digits dipped below the line in «Турнір 30.09.2026».

**The Four Roles Rule.** Roboto has four sizes split by job: 16 to type and read, 14 to name and act, 13 to describe, 11 to tag. There is no 12 and no pixel size (`text-[13px]`); use `text-meta` and `text-caption`.

**The Steady Digits Rule.** Every score, timer, rating, price and counter uses tabular figures (`.tnum`), so a ticking number never jitters and a column of sums lines up.

**The Two Families Rule.** No third typeface, a mono for digits included.

## Elevation & Depth

Flat. Depth is lightness, as in MD3: the page is `bg`, and panels step up the surface ladder, each edged with a 1 px hairline. Shadows are kept for the few layers that float over content: `shadow-elevation-2` (MD3 elevation 2) on a sticky header and on toasts, Tailwind's `shadow-2xl` on a dialog over the blurred backdrop.

### Named Rules

**The Ladder, Not Shadow Rule.** A card never gets a shadow. If something needs to stand forward, step it up the surface ladder or tint its border; a shadow means it floats above the page.

## Shapes

Gently rounded, from the theme's `custom.borderRadius`: 8 px on controls (`rounded-lg`, `rounded-xl`), 12 px on cards, panels and modals (`rounded-2xl`), 16 px on large media (`rounded-3xl`), fully round only where a pill is the object (badges, avatars, switches). Almost every container carries a 1 px hairline, and state lives in the border as much as in the fill.

## Motion

Quick and quiet. Arrivals decelerate (`ease-arrive`, MD3 emphasized decelerate); departures accelerate and are shorter (`ease-leave`), so a dismissed thing never holds up the next tap. Colour transitions take 150 ms. The animations are `fade-in`, `rise` (its distance is `--rise`), `sink`, `sheet-up`, `zoom-in` and `pop`. `prefers-reduced-motion` turns all of them off.

## Do's and Don'ts

### Do:
- **Do** paint through the roles (`bg-surface`, `text-fg-2`, `border-line`, `text-accent`, `bg-live-soft`) and nothing else.
- **Do** keep every finger target at least 44 px, and shrink one only for a mouse with `pointer-fine:`, never by a width breakpoint: a tablet or a sideways phone is wide and still a finger.
- **Do** set every field at 16 px (`text-base`).
- **Do** put `.tnum` on every number that changes or lines up.
- **Do** keep one solid peach button per area and make repeated row actions tonal (`accent-soft`).
- **Do** mark an active state by fill as well as colour.
- **Do** check every screen in both themes, dark first.
- **Do** use a native `<select>`, whose arrow `.select-arrow` paints per theme.

### Don't:
- **Don't** use gold, yellow or amber; the highlight is Trophy Chartreuse.
- **Don't** add a third typeface.
- **Don't** set Playfair under 16 px, below 700, or with negative tracking.
- **Don't** use a raw pixel font size or a 12 px step.
- **Don't** dim text with opacity (`text-accent/70`); use `fg-2` or `fg-3`.
- **Don't** give cards a shadow.
- **Don't** reference `--ox-*` roles or hex values from a component, or edit `--ox-*` to taste.
