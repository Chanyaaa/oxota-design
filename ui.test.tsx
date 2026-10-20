/**
 * What each primitive renders for the props it is given, as the apps get it. Rendered to a string
 * with no DOM: effects do not run, and a check of the markup needs none.
 */
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { renderToStaticMarkup } from 'react-dom/server';
import { Avatar, Badge, ConfirmInline, Modal, Spinner, TextInput } from './ui.tsx';

test('no words of its own: the apps pass every text in, in their language', () => {
  const source = readFileSync(new URL('./ui.tsx', import.meta.url), 'utf8');
  assert.doesNotMatch(source, /react-i18next|useTranslation|\bt\(/);
});

test("the modal's close button is named by closeLabel", () => {
  const html = renderToStaticMarkup(
    <Modal title="Новий турнір" closeLabel="Закрити" onClose={() => {}}>
      …
    </Modal>,
  );
  assert.match(html, /aria-label="Закрити"/);
});

test('the inline confirm says the words it is given', () => {
  const html = renderToStaticMarkup(
    <ConfirmInline question="Видалити?" confirmLabel="Видалити" cancelLabel="Скасувати" onConfirm={() => {}} onCancel={() => {}} />,
  );
  assert.match(html, />Скасувати</);
  assert.match(html, />Видалити</);
});

test('the spinner is a status a screen reader names by its label', () => {
  const html = renderToStaticMarkup(<Spinner label="Завантажуємо…" />);
  assert.match(html, /role="status"/);
  assert.match(html, /aria-label="Завантажуємо…"/);
});

test('a date or time field draws its box on a wrapper, so iOS cannot size it past its column', () => {
  assert.match(renderToStaticMarkup(<TextInput type="date" className="tnum" />), /^<div class="[^"]*tnum[^"]*"><input type="date"/);
  assert.match(renderToStaticMarkup(<TextInput type="text" />), /^<input type="text"/);
});

test('a badge pulses only when asked: «on the site» is not «in play»', () => {
  assert.doesNotMatch(renderToStaticMarkup(<Badge tone="live">На сайті</Badge>), /animate-pulse/);
  assert.match(renderToStaticMarkup(<Badge tone="live" pulse>Іде</Badge>), /animate-pulse/);
});

test("an avatar takes the person's colour, or the accent without one", () => {
  assert.match(renderToStaticMarkup(<Avatar name="Олег" color="#DCD886" />), /style="background:#DCD886"/);
  assert.match(renderToStaticMarkup(<Avatar name="олег" />), /bg-accent text-on-accent[^>]*>О</);
});
