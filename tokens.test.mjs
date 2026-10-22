/**
 * The frontmatter of DESIGN.md is what design tools and the apps' own DESIGN.md read; tokens.css
 * is what browsers paint. Nothing else notices when one moves without the other.
 */
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

const read = (name) => readFileSync(new URL(name, import.meta.url), 'utf8');

/** The frontmatter as flat `section.key.sub` → raw value pairs: as much YAML as DESIGN.md uses */
function frontmatter(text) {
  const head = text.split(/^---\r?$/m)[1];
  const flat = {};
  const at = [];
  for (const line of head.split(/\r?\n/)) {
    const m = line.match(/^( *)"?([\w-]+)"?:\s*(.*)$/);
    if (!m) continue;
    at.length = m[1].length / 2;
    at.push(m[2]);
    if (m[3]) flat[at.join('.')] = m[3];
  }
  return flat;
}

/** Custom properties as each theme sees them: light is dark with its own blocks on top */
function themes() {
  const css = read('./tokens.css').replace(/\/\*[\s\S]*?\*\//g, '');
  const dark = {};
  const light = {};
  for (const [, selectors, body] of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    const list = selectors.split(',').map((s) => s.trim());
    for (const [, name, value] of body.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) {
      if (list.includes(':root')) dark[name] = value.trim();
      if (list.includes(":root[data-theme='light']")) light[name] = value.trim();
    }
  }
  return { dark, light: { ...dark, ...light } };
}

function resolve(value, vars) {
  return value.replace(/var\((--[\w-]+)\)/g, (_, name) => {
    assert.ok(name in vars, `${name} is used in tokens.css but never set`);
    return resolve(vars[name], vars);
  });
}

/** An sRGB colour as [r, g, b] in 0–255: an rgb() as tokens.css writes it, or a color-mix of two in srgb */
function rgb(value) {
  const mix = value.match(/^color-mix\(in srgb, (rgb\([^)]*\)) (\d+)%, (rgb\([^)]*\))\)$/);
  if (mix) {
    const [a, share, b] = [rgb(mix[1]), Number(mix[2]) / 100, rgb(mix[3])];
    return a.map((channel, i) => channel * share + b[i] * (1 - share));
  }
  const m = value.match(/^rgb\((\d+) (\d+) (\d+)\)$/);
  assert.ok(m, `cannot read the colour ${value}`);
  return m.slice(1).map(Number);
}

// WCAG 2's relative luminance and contrast ratio
const luminance = (color) => {
  const [r, g, b] = color.map((c) => (c / 255 <= 0.04045 ? c / 255 / 12.92 : ((c / 255 + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const contrast = (a, b) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

test("a Badge's text reads at 4.5:1 on its fill in both themes", () => {
  // BADGE_TONES in ui.tsx: an 11 px caption, which WCAG AA holds to 4.5:1 however bold it is
  const tones = [['fg-2', 'surface-2'], ['accent', 'accent-soft'], ['gold', 'gold-soft'], ['danger', 'danger-soft'], ['live', 'live-soft']];
  const short = [];
  for (const [theme, vars] of Object.entries(themes())) {
    for (const [text, fill] of tones) {
      const ratio = contrast(rgb(resolve(vars[`--${text}`], vars)), rgb(resolve(vars[`--${fill}`], vars)));
      if (ratio < 4.5) short.push(`${text} on ${fill} in ${theme}: ${ratio.toFixed(2)}:1`);
    }
  }
  assert.deepEqual(short, []);
});

test('every colour in DESIGN.md is the value tokens.css paints in that theme', () => {
  const { dark, light } = themes();
  const colors = Object.entries(frontmatter(read('./DESIGN.md'))).filter(([key]) => key.startsWith('colors.'));
  assert.ok(colors.length > 0, 'no colours found in the frontmatter of DESIGN.md');
  for (const [key, value] of colors) {
    const role = key.slice('colors.'.length);
    const isLight = role.endsWith('-light');
    const name = `--${isLight ? role.slice(0, -'-light'.length) : role}`;
    const vars = isLight ? light : dark;
    assert.ok(name in vars, `${key} in DESIGN.md has no ${name} in tokens.css`);
    assert.equal(resolve(vars[name], vars), value.replace(/^"|"$/g, ''), `${key} in DESIGN.md`);
  }
});
