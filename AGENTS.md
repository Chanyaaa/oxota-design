# Agent rules

This repository is the design system several of the club's apps install by git tag. Read `README.md` and `DESIGN.md` before you change anything.

- `tokens.css` stays plain CSS, with no Tailwind directives: sites without Tailwind link it directly. Tailwind-only rules go into `tailwind.css`.
- The frontmatter of `DESIGN.md` holds the same values as the CSS. Change both, then run `npm test`.
- Never edit an `--ox-*` value to taste: they are pasted from the club's WordPress theme.
- No dependencies and no build step. The files are used as they are.
- Every change ships as a new version: raise `version` in `package.json` and tag it `vX.Y.Z`. Removing or renaming a token, a utility or a file breaks the apps and is a major version.
- Only what two apps need the same belongs here; one app's rules stay in that app.
- Comments are in English and say why, not what.
- Do not commit, tag or push unless asked.
