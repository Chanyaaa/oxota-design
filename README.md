# @oxota/design

The design system of the «Охота» billiard club in Kharkiv: fonts, colour tokens, the Tailwind v4 theme, the brand icons and the React primitives the club's apps build their screens from. Арена and the banquet app use it; the club's site will. The rules for using it are in [DESIGN.md](DESIGN.md).

| File | What it is |
|---|---|
| `tokens.css` | Plain CSS with no build step: the `@font-face` rules, the `--ox-*` club palette and the roles screens paint with, in both themes. A page without Tailwind links it as it is. |
| `tailwind.css` | For a Tailwind v4 app. It imports `tokens.css` and adds the roles as utilities (`bg-surface`, `text-fg-2`), the type scale (`text-meta`, `text-caption`), radii, the header shadow, easings and animations, the `short:` variant (a phone on its side), base styles and a few utilities (`.tnum`, `.caps-label`, `.pb-safe`, `.px-safe`, `.no-scrollbar`, `.select-arrow`). It also points Tailwind at `ui.tsx` and holds the page still while a `<dialog>` is open. |
| `ui.tsx` | The primitives the apps share, imported as `@oxota/design/ui`: buttons, cards, badges, fields, segmented choice, tabs, the modal, toasts, the inline confirm and the placeholders. TypeScript source with no words of its own. |
| `fonts/` | Roboto 400–700 and Playfair Display 700: Google's cyrillic, latin and math woff2 subsets, with their SIL Open Font License texts. |
| `assets/` | The club's emblem, the favicon and the install icons (192, 512, maskable 512, Apple touch). |
| `DESIGN.md` | The roles, the components and the rules. Its frontmatter carries the values for design tools, and `npm test` checks the colours against `tokens.css`. |

## Using it in an app

Install a tagged version:

```sh
npm install github:Chanyaaa/oxota-design#v1.1.0
```

In a Tailwind v4 app, import it right after Tailwind and put the app's own rules below:

```css
@import 'tailwindcss';
@import '@oxota/design/tailwind.css';
```

Dark is the default; `data-theme="light"` on `<html>` switches to light.

The pages, the web manifest and the static pages expect the icons at the site root (`/favicon.svg`, `/icon-192.png`, …). Vite takes a single `public/` folder, so Арена serves and emits the files in `assets/` with a small plugin, `brandAssets` in its `vite.config.ts`; a new app can copy it.

A site without Tailwind links `tokens.css` and keeps `fonts/` beside it, since the font URLs are relative.

### The primitives

```tsx
import { Button, Modal, useToast } from '@oxota/design/ui';
```

They need React 19, `react-dom` and `lucide-react` in the app (peer dependencies) and nothing else. `ui.tsx` is TypeScript source with no build step: the app's Vite builds it and the app's type check reads it like its own code. `tailwind.css` registers it with `@source`, so its classes reach the app's CSS with no setup in the app.

The package holds no text in any language. Four primitives take their words as props, and each app wraps them once in its own `components/ui.tsx` with its translations, so its screens never pass them:

| Primitive | Its words |
|---|---|
| `Modal` | `closeLabel`, the name of the close button |
| `ConfirmInline` | `confirmLabel` and `cancelLabel` |
| `Spinner` | `label`, what a screen reader hears while it turns |
| `ToastProvider` | `labels: { undo, retry, close }` |

Toasts stand 1rem above the bottom of the screen plus `--bar-lift`, which the app sets to the height of whatever bar it fixes along the bottom (a tab bar, an order's total). A modal needs no scroll lock of its own: `body:has(dialog)` in `tailwind.css` holds the page still while a dialog is in the DOM.

## Changing it

1. Edit `tokens.css` or `tailwind.css`, and keep the frontmatter of `DESIGN.md` equal to them. `npm test` fails when a colour differs.
2. `--ox-*` values change only by pasting from the club's WordPress theme.
3. A primitive changes in `ui.tsx`. What only one app needs becomes a prop, never a fork in that app. Run `npm install` once, then `npm test` (the colours, and what the primitives render) and `npm run lint` (the type check and the React hooks rules).
4. Raise `version` in `package.json`, commit, and tag it: `git tag vX.Y.Z && git push --tags`. A new token, primitive or optional prop, or a changed value, is a minor version. A removed or renamed token, utility, file, primitive or prop, or a new required prop, breaks the apps and is a major version.
5. In each app, install the new tag, copy the changed values into the app's `DESIGN.md` frontmatter (Арена's `npm test` names the keys), and look at its screens in both themes.

To try an unreleased change in an app, install the folder as a copy: `npm install --install-links ../oxota-design` (the path from the app). A plain link is a symlink out of the app, and Vite's dev server refuses to serve the fonts through it (403). Go back to a tag before pushing the app.

## What stays in the apps

Layout, the words, and the pieces only one app needs: Арена's `FlipList`, `Toggle`, `NameLine`, `VersusLine` and `Changed`, the banquet app's `PhoneInput` and `Thumb`, and rules such as Арена's alarm flash or the padding under its bottom menu. Move a piece here once two apps need it the same.
