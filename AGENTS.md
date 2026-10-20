# Agent rules

This repository is the design system several of the club's apps install by git tag. Read `README.md` and `DESIGN.md` before you change anything.

- `tokens.css` stays plain CSS, with no Tailwind directives: sites without Tailwind link it directly. Tailwind-only rules go into `tailwind.css`.
- The frontmatter of `DESIGN.md` holds the same values as the CSS. Change both, then run `npm test`.
- Never edit an `--ox-*` value to taste: they are pasted from the club's WordPress theme.
- No runtime dependencies and no build step: the files, `ui.tsx` included, are used as they are. React, `react-dom` and `lucide-react` are the apps' own (peer dependencies); the devDependencies only run the checks.
- `ui.tsx` has no words of its own: every text comes in a prop, in the app's language. `npm test` fails on a `t()` call or a `react-i18next` import there. After changing it, run `npm test` and `npm run lint`.
- Every change ships as a new version: raise `version` in `package.json` and tag it `vX.Y.Z`. Removing or renaming a token, a utility, a file, a primitive or a prop, or adding a required prop, breaks the apps and is a major version.
- Only what two apps need the same belongs here; one app's rules stay in that app. What only one app needs from a shared primitive becomes a prop here, not a fork there.
- Comments are in English and say why, not what.
- Do not commit, tag or push unless asked.
