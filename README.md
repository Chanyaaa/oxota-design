# @oxota/design

The design system of the «Охота» billiard club in Kharkiv: fonts, colour tokens, the Tailwind v4 theme and the brand icons. Арена uses it; the banquet app and the club's site will. The rules for using it are in [DESIGN.md](DESIGN.md).

| File | What it is |
|---|---|
| `tokens.css` | Plain CSS with no build step: the `@font-face` rules, the `--ox-*` club palette and the roles screens paint with, in both themes. A page without Tailwind links it as it is. |
| `tailwind.css` | For a Tailwind v4 app. It imports `tokens.css` and adds the roles as utilities (`bg-surface`, `text-fg-2`), the type scale (`text-meta`, `text-caption`), radii, the header shadow, easings and animations, the `short:` variant (a phone on its side), base styles and a few utilities (`.tnum`, `.caps-label`, `.pb-safe`, `.px-safe`, `.no-scrollbar`, `.select-arrow`). |
| `fonts/` | Roboto 400–700 and Playfair Display 700: Google's cyrillic, latin and math woff2 subsets, with their SIL Open Font License texts. |
| `assets/` | The club's emblem, the favicon and the install icons (192, 512, maskable 512, Apple touch). |
| `DESIGN.md` | The roles and the rules. Its frontmatter carries the values for design tools, and `npm test` checks the colours against `tokens.css`. |

## Using it in an app

Install a tagged version:

```sh
npm install github:Chanyaaa/oxota-design#v1.0.0
```

In a Tailwind v4 app, import it right after Tailwind and put the app's own rules below:

```css
@import 'tailwindcss';
@import '@oxota/design/tailwind.css';
```

Dark is the default; `data-theme="light"` on `<html>` switches to light.

The pages, the web manifest and the static pages expect the icons at the site root (`/favicon.svg`, `/icon-192.png`, …). Vite takes a single `public/` folder, so Арена serves and emits the files in `assets/` with a small plugin, `brandAssets` in its `vite.config.ts`; a new app can copy it.

A site without Tailwind links `tokens.css` and keeps `fonts/` beside it, since the font URLs are relative.

Nothing here puts class names in markup, so Tailwind needs no `@source` for this package. That changes once a component moves in.

## Changing it

1. Edit `tokens.css` or `tailwind.css`, and keep the frontmatter of `DESIGN.md` equal to them. `npm test` fails when a colour differs.
2. `--ox-*` values change only by pasting from the club's WordPress theme.
3. Raise `version` in `package.json`, commit, and tag it: `git tag v1.1.0 && git push --tags`. A new token or a changed value is a minor version; a removed or renamed one breaks the apps and is a major version.
4. In each app, install the new tag, copy the changed values into the app's `DESIGN.md` frontmatter (Арена's `npm test` names the keys), and look at its screens in both themes.

To try an unreleased change in an app, install the folder as a copy: `npm install --install-links ../oxota-design` (the path from the app). A plain link is a symlink out of the app, and Vite's dev server refuses to serve the fonts through it (403). Go back to a tag before pushing the app.

## What stays in the apps

Components (each app's `ui.tsx`), layout and the rules only one app has, such as Арена's alarm flash or the padding under its bottom menu. Move a piece here once two apps need it the same.
