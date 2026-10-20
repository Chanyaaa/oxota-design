import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, ChevronRight, Info, X } from 'lucide-react';

/* ==========================================================================
   The UI primitives of the club's apps. One source of truth for spacing,
   rounding, touch-target sizes and states, so screens do not drift apart.
   No words of its own: every text comes in a prop, in the app's language.
   ========================================================================== */

export const cx = (...parts: Array<string | false | null | undefined>): string =>
  parts.filter(Boolean).join(' ');

/* ------------------------------ Button ---------------------------------- */

type ButtonVariant = 'primary' | 'tonal' | 'secondary' | 'ghost' | 'danger-solid';
type ButtonSize = 'sm' | 'md' | 'lg';

const BUTTON_VARIANTS: Record<ButtonVariant, string> = {
  primary: 'bg-accent text-on-accent hover:bg-accent-2',
  // The action repeated on every row or card: a column of solid peach would drown the screen's one primary
  tonal: 'bg-accent-soft text-accent border border-accent/50 hover:border-accent',
  secondary: 'bg-surface-2 text-fg border border-line hover:border-line-2 hover:bg-surface-3',
  ghost: 'bg-transparent text-fg-2 hover:text-fg hover:bg-surface-2',
  // A variant of its own, not a class on top of secondary: Tailwind decides the order of
  // utilities in the built CSS, and bg-danger lost to bg-surface-2
  'danger-solid': 'bg-danger text-on-danger hover:brightness-110',
};

const BUTTON_SIZES: Record<ButtonSize, string> = {
  sm: 'h-9 px-3 text-sm gap-1.5 rounded-lg',
  md: 'h-11 px-4 text-sm gap-2 rounded-xl',
  lg: 'h-13 px-5 text-base gap-2 rounded-xl',
};

// ComponentProps, not ButtonHTMLAttributes: it carries `ref`, which React 19 passes to a function
// component as a prop, and the spread below hands it on to the <button> (a tour focuses its «Далі»)
interface ButtonProps extends React.ComponentProps<'button'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  block?: boolean;
}

/** Button looks for elements that are not a <button>: a link that opens another app. */
export const buttonClasses = (variant: ButtonVariant = 'secondary', size: ButtonSize = 'md', block = false) =>
  cx(
    'inline-flex items-center justify-center font-medium whitespace-nowrap',
    'transition-[background-color,border-color,color,transform] duration-150',
    'active:scale-[0.98] disabled:pointer-events-none',
    'disabled:bg-fg/12 disabled:text-fg/38 disabled:border-transparent disabled:shadow-none',
    // Looks disabled yet still takes the tap, so it can point at what is missing instead of going dead
    'aria-disabled:bg-fg/12 aria-disabled:text-fg/38 aria-disabled:border-transparent aria-disabled:shadow-none',
    BUTTON_SIZES[size],
    BUTTON_VARIANTS[variant],
    block && 'w-full',
  );

export const Button: React.FC<ButtonProps> = ({
  variant = 'secondary',
  size = 'md',
  block = false,
  className,
  children,
  ...rest
}) => (
  <button {...rest} className={cx(buttonClasses(variant, size, block), className)}>
    {children}
  </button>
);

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  active?: boolean;
  tone?: 'default' | 'danger';
}

export const IconButton: React.FC<IconButtonProps> = ({
  label,
  active = false,
  tone = 'default',
  className,
  children,
  ...rest
}) => (
  <button
    {...rest}
    title={label}
    aria-label={label}
    className={cx(
      'w-11 h-11 shrink-0 inline-flex items-center justify-center rounded-xl border transition-colors active:scale-[0.94]',
      'disabled:text-fg/38 disabled:pointer-events-none',
      active
        ? 'bg-accent-soft border-accent/50 text-accent'
        : tone === 'danger'
          ? 'bg-surface-2 border-line text-fg-2 hover:text-danger hover:border-danger/40'
          : 'bg-surface-2 border-line text-fg-2 hover:text-fg hover:border-line-2',
      className,
    )}
  >
    {children}
  </button>
);

/* ------------------------------ Card ------------------------------------ */

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Yours to act on: your match, your invitation */
  highlight?: boolean;
  /** In play right now: a match, a table */
  live?: boolean;
}

export const Card: React.FC<CardProps> = ({ highlight = false, live = false, className, children, ...rest }) => (
  <div
    {...rest}
    className={cx(
      // A state that changes on another phone fades the border rather than blinking it,
      // so the change reads as the same card moving on
      'rounded-2xl border bg-surface transition-colors duration-300',
      live ? 'border-live/45' : highlight ? 'border-accent/45' : 'border-line',
      className,
    )}
  >
    {children}
  </div>
);

/* ------------------------------ Disclosure ------------------------------ */

/**
 * Reading matter folded under a title. A native <details>: it opens from the
 * keyboard and is announced as expandable with no code of ours, and it can sit
 * inside a modal without stacking a second dialog on top.
 */
export const Disclosure: React.FC<{
  title: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}> = ({ title, className, children }) => (
  <details className={cx('group rounded-xl border border-line bg-surface', className)}>
    <summary className="flex items-center gap-2.5 min-h-11 px-4 py-2 cursor-pointer list-none text-sm font-semibold text-fg [&::-webkit-details-marker]:hidden">
      <Info className="w-4 h-4 shrink-0 text-accent" aria-hidden />
      <span className="flex-1 min-w-0">{title}</span>
      <ChevronDown
        className="w-4 h-4 shrink-0 text-fg-3 transition-transform group-open:rotate-180 motion-reduce:transition-none"
        aria-hidden
      />
    </summary>
    <div className="px-4 pb-4 pt-1 max-w-[65ch] text-sm leading-relaxed text-fg-2">{children}</div>
  </details>
);

/* -------------------------------- Badge --------------------------------- */

type BadgeTone = 'neutral' | 'accent' | 'gold' | 'danger' | 'live';

const BADGE_TONES: Record<BadgeTone, string> = {
  neutral: 'bg-surface-2 border-line text-fg-2',
  accent: 'bg-accent-soft border-accent/40 text-accent',
  gold: 'bg-gold-soft border-gold/40 text-gold',
  danger: 'bg-danger-soft border-danger/40 text-danger',
  live: 'bg-live-soft border-live/50 text-live',
};

export const Badge: React.FC<{
  tone?: BadgeTone;
  /** A pulsing dot: happening this minute (a match in play), not merely switched on (a form on the site) */
  pulse?: boolean;
  children: React.ReactNode;
  className?: string;
}> = ({ tone = 'neutral', pulse = false, children, className }) => (
  <span
    className={cx(
      'inline-flex items-center gap-1.5 shrink-0 px-2.5 h-6 rounded-full border text-caption font-semibold',
      BADGE_TONES[tone],
      className,
    )}
  >
    {pulse && <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" aria-hidden />}
    {children}
  </span>
);

/* ---------------------------- Block heading ----------------------------- */

export const SectionHeader: React.FC<{
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  /** The screen's own title, at display size: a tab's title at headline size matched the app name above it */
  page?: boolean;
  className?: string;
}> = ({ title, subtitle, action, page = false, className }) => (
  // A lone title centres on its action; with a subtitle the action keeps to the last line
  <div className={cx('flex justify-between gap-3', subtitle ? 'items-end' : 'items-center', page ? 'mb-4' : 'mb-3', className)}>
    <div className="min-w-0">
      <h2 className={cx('text-fg', page ? 'text-2xl leading-tight' : 'text-lg leading-snug')}>{title}</h2>
      {/* Wraps: a subtitle is a sentence that explains the section, and cut short on a
          phone it loses the half that mattered */}
      {subtitle && <p className="text-meta text-fg-3 mt-0.5">{subtitle}</p>}
    </div>
    {action && <div className="shrink-0">{action}</div>}
  </div>
);

/* ---------------------------- Empty state ------------------------------- */

export const EmptyState: React.FC<{
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}> = ({ icon, title, description, action }) => (
  <div className="flex flex-col items-center justify-center text-center px-6 py-12 rounded-2xl border border-dashed border-line">
    {icon && <div className="text-fg-3 mb-3">{icon}</div>}
    <p className="text-sm font-semibold text-fg">{title}</p>
    {description && <p className="text-meta text-fg-3 mt-1 max-w-xs">{description}</p>}
    {action && <div className="mt-4">{action}</div>}
  </div>
);

/* ------------------------------- Avatar --------------------------------- */

export const Avatar: React.FC<{
  name: string;
  /** A colour of the person's own (Арена's player palette). Without it the initial sits on the accent */
  color?: string;
  /** Google profile photo; falls back to the initial if unset or broken. */
  avatarUrl?: string | null;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}> = ({ name, color, avatarUrl, size = 'md', className }) => {
  const [imgFailed, setImgFailed] = useState(false);
  const dims = {
    sm: 'w-7 h-7 text-caption',
    md: 'w-9 h-9 text-sm',
    lg: 'w-12 h-12 text-base',
  }[size];

  if (avatarUrl && !imgFailed) {
    return (
      <img
        src={avatarUrl}
        alt=""
        aria-hidden
        // Google refuses a photo requested with a referrer from another site now and then
        referrerPolicy="no-referrer"
        className={cx('inline-block shrink-0 rounded-full object-cover', dims, className)}
        onError={() => setImgFailed(true)}
      />
    );
  }

  return (
    <span
      className={cx(
        'inline-flex shrink-0 items-center justify-center rounded-full font-bold',
        // The palette's colours are light in both themes, so their initial stays dark in both
        color ? 'text-[#181210]' : 'bg-accent text-on-accent',
        dims,
        className,
      )}
      style={color ? { background: color } : undefined}
      aria-hidden
    >
      {name.trim().charAt(0).toUpperCase() || '?'}
    </span>
  );
};

/* -------------------------------- Fields -------------------------------- */

// Fields are text-base, never smaller: iOS Safari zooms the whole page in on a
// field under 16px the moment it takes focus, and leaves it zoomed after.

export const Label: React.FC<{ children: React.ReactNode; className?: string; htmlFor?: string }> = ({
  children,
  className,
  htmlFor,
}) => (
  <label htmlFor={htmlFor} className={cx('block text-sm font-medium text-fg-2 mb-2', className)}>
    {children}
  </label>
);

const FIELD_BOX = 'w-full h-11 px-3.5 rounded-xl bg-surface-2 border border-line transition-colors';

const TEMPORAL_TYPES = new Set(['date', 'time', 'datetime-local', 'month', 'week']);

export const TextInput: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = ({ className, ...rest }) => {
  // iOS Safari sizes a date or time field that has padding wider than its width:100% (WebKit bug
  // 301648, still in iOS 26.5): in a two-column row the date ran under the time. So the box, its
  // padding and its focus ring are a wrapper's, which clips, and the field inside has no padding
  if (rest.type && TEMPORAL_TYPES.has(rest.type)) {
    return (
      <div
        className={cx(
          FIELD_BOX,
          'flex overflow-hidden focus-within:bg-surface-3 has-[[aria-invalid=true]]:border-danger',
          'has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-accent',
          className,
        )}
      >
        <input {...rest} className="w-full min-w-0 h-full bg-transparent text-base text-fg outline-none scroll-mt-7" />
      </div>
    );
  }
  return (
    <input
      {...rest}
      className={cx(
        FIELD_BOX,
        // scroll-mt: a field focused from below (the one a save found missing) brings its Label into view
        // too, not just itself, which left the label under the sticky header
        'text-base text-fg scroll-mt-7 placeholder:text-fg-3',
        // Focus is the peach ring of the base styles in tailwind.css: a tinted border alone all but vanished on light
        'focus:bg-surface-3 aria-[invalid=true]:border-danger',
        className,
      )}
    />
  );
};

export const TextArea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = ({ className, ...rest }) => (
  <textarea
    {...rest}
    className={cx(
      'w-full px-3.5 py-2.5 rounded-xl bg-surface-2 border border-line text-base text-fg scroll-mt-7',
      'placeholder:text-fg-3 transition-colors resize-y',
      'focus:bg-surface-3 aria-[invalid=true]:border-danger',
      className,
    )}
  />
);

/**
 * A native select, not a custom dropdown: on a phone the system list scrolls
 * with a finger and does not go off the edge of the screen.
 */
export const Select: React.FC<React.SelectHTMLAttributes<HTMLSelectElement>> = ({
  className,
  children,
  style,
  ...rest
}) => (
  <select
    {...rest}
    className={cx(
      'w-full h-11 pl-3.5 pr-9 rounded-xl bg-surface-2 border border-line text-base text-fg',
      // select-arrow: the arrow itself is an image, its colour changes with the theme
      'appearance-none bg-no-repeat select-arrow transition-colors',
      'focus:bg-surface-3 aria-[invalid=true]:border-danger',
      'disabled:opacity-60',
      className,
    )}
    style={{ backgroundPosition: 'right 12px center', ...style }}
  >
    {children}
  </select>
);

/* ----------------------------- Choice ----------------------------------- */

export interface SegmentedOption<T extends string | number> {
  value: T;
  label: string;
  hint?: string;
}

export function Segmented<T extends string | number>({
  options,
  value,
  onChange,
  columns,
  className,
}: {
  options: SegmentedOption<T>[];
  /** null: nothing chosen yet, where a guess would be recorded as a fact (how a payment was made) */
  value: T | null;
  // NoInfer: T is inferred only from options/value. Otherwise a setState callback pulls T
  // to the bound `string | number`, and calls with a literal type do not compile.
  onChange: (value: NoInfer<T>) => void;
  columns?: number;
  className?: string;
}) {
  return (
    // Through a variable, not an inline grid-template: an inline style would beat a
    // caller's `sm:grid-cols-4` that spreads a phone's two rows into one
    <div
      className={cx('grid gap-2 grid-cols-[repeat(var(--cols),minmax(0,1fr))]', className)}
      style={{ '--cols': columns ?? options.length } as React.CSSProperties}
    >
      {options.map((opt) => {
        const selected = opt.value === value;
        return (
          <button
            key={String(opt.value)}
            type="button"
            onClick={() => onChange(opt.value)}
            aria-pressed={selected}
            className={cx(
              'min-h-11 px-3 py-2 rounded-xl border text-left transition-colors active:scale-[0.98]',
              selected
                ? 'bg-accent-soft border-accent/60 text-accent'
                : 'bg-surface-2 border-line text-fg-2 hover:border-line-2 hover:text-fg',
            )}
          >
            <span className="block text-sm font-semibold truncate">{opt.label}</span>
            {opt.hint && (
              // Not text-accent/70: transparency works in different directions in the two
              // themes, and on a light background the hint faded to 2.9:1
              <span className={cx('block text-meta truncate', selected ? 'text-accent' : 'text-fg-3')}>
                {opt.hint}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

/**
 * Switches between views of one screen (sign in / sign up, matches / bracket).
 * Not Segmented: that one sets a value in a form, and its accent fill would
 * compete with the filters right under a tab row.
 */
export function TabBar<T extends string>({
  tabs,
  value,
  onChange,
  className,
}: {
  /** `badge`: a count on the tab's corner, and the words a screen reader hears for it */
  tabs: Array<{ value: T; label: string; badge?: { count: number; label: string } }>;
  value: T;
  onChange: (value: NoInfer<T>) => void;
  className?: string;
}) {
  return (
    <div className={cx('flex items-center gap-1 p-1 rounded-xl bg-surface-2 border border-line', className)}>
      {tabs.map((tab) => (
        <button
          key={tab.value}
          type="button"
          onClick={() => onChange(tab.value)}
          aria-pressed={value === tab.value}
          className={cx(
            // px-1: at 360 px, px-2 left a quarter of the bar too narrow for «Банкетне» and «Кава/чай»
            'relative flex-1 min-w-0 h-11 px-1 rounded-lg text-sm font-semibold transition-colors',
            value === tab.value ? 'bg-surface-raised text-fg shadow-sm' : 'text-fg-3 hover:text-fg-2',
          )}
        >
          {/* Truncated inside, not on the button, which would clip the badge standing out of it */}
          <span className="relative inline-block max-w-full align-top">
            <span className="block truncate">{tab.label}</span>
            {tab.badge && (
              <>
                {/* Raised off the label's end, not beside it: four tabs on a phone leave «Банкетне» no
                    room for it. On the label, not the tab's corner, which on a wide tab sat nearer the next */}
                <span
                  aria-hidden
                  className="absolute -top-2 -right-3.5 min-w-4 h-4 px-1 inline-flex items-center justify-center rounded-full bg-accent-soft text-accent text-caption leading-none font-semibold tnum animate-pop"
                >
                  {tab.badge.count}
                </span>
                <span className="sr-only"> {tab.badge.label}</span>
              </>
            )}
          </span>
        </button>
      ))}
    </div>
  );
}

/* ------------------------------- Modal ---------------------------------- */

// <dialog> leaves the page behind it scrolling: `body:has(dialog)` in tailwind.css holds it still
export const Modal: React.FC<{
  title: string;
  /** The close button's name: it shows an icon only */
  closeLabel: string;
  subtitle?: string;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
  headerExtra?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  bodyClassName?: string;
}> = ({ title, closeLabel, subtitle, onClose, children, footer, headerExtra, size = 'md', bodyClassName }) => {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  // showModal() gives a focus trap, inert for the background, Esc and the top layer: none of it by hand
  useEffect(() => {
    const el = ref.current;
    if (el && !el.open) el.showModal();
  }, []);

  const maxWidth = { sm: 'sm:max-w-md', md: 'sm:max-w-2xl', lg: 'sm:max-w-4xl' }[size];
  // "sm" is a short, fixed-content dialog (a QR code, one member), which suits a bottom sheet.
  // "md"/"lg" are forms whose content can run long, where full screen avoids a sheet that keeps
  // growing and shrinking as the person fills it in.
  const sheet = size === 'sm';

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      // React hands a nested dialog's close up the component tree: a picker opened from a form would close the form too
      onClose={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      // Esc asks the owner rather than shutting the dialog itself: a screen with unsaved work
      // (a result being corrected) can answer by leaving that work instead of the screen.
      // Shut natively, a dialog its owner keeps mounted would stay closed and invisible
      onCancel={(e) => {
        if (e.target !== e.currentTarget) return;
        e.preventDefault();
        onClose();
      }}
      className="fixed inset-0 m-0 py-0 px-safe w-full h-full max-w-none max-h-none border-0 bg-transparent text-fg overflow-hidden"
    >
      <div
        className={cx('w-full h-full flex items-end sm:items-center justify-center sm:p-4', !sheet && 'short:p-0')}
        onMouseDown={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <div
          className={cx(
            'flex flex-col w-full bg-surface overflow-hidden',
            'sm:h-auto sm:max-h-[92vh] sm:rounded-2xl sm:border sm:border-line sm:shadow-2xl sm:animate-zoom-in',
            // Enter only: most modals are closed by their own footer buttons calling the
            // parent's onClose, which unmounts them before any exit could play
            sheet
              ? 'max-h-[85dvh] rounded-t-2xl border-t border-line shadow-2xl animate-sheet-up'
              : 'h-[100dvh] animate-rise [--rise:32px]',
            maxWidth,
            // A phone on its side: a centred card left a form a 200 px slot between its
            // header and footer, so the form takes the whole screen
            !sheet && 'short:h-full short:max-h-none short:max-w-none short:rounded-none short:border-0',
          )}
        >
          <header className="shrink-0 flex items-start gap-3 px-4 sm:px-5 py-3.5 short:py-2 border-b border-line bg-surface">
            {/* A lone title line centres on the close button; items-start stays for a title
                that wraps, so the button keeps to the top corner */}
            <div className={cx('min-w-0 flex-1', !subtitle && 'self-center')}>
              {/* Wraps rather than cuts: the title is often a person's name, shown in full here */}
              <h2 id={titleId} className="text-lg leading-snug text-fg">
                {title}
              </h2>
              {subtitle && <p className="text-meta text-fg-3 truncate">{subtitle}</p>}
            </div>
            {headerExtra}
            <IconButton label={closeLabel} onClick={onClose}>
              <X className="w-5 h-5" />
            </IconButton>
          </header>

          <div className={cx('flex-1 overflow-y-auto px-4 sm:px-5 py-4', bodyClassName)}>{children}</div>

          {footer && (
            // pb-safe on the same element as py-3 wins the cascade and drops the 12px, so the
            // button sat flush with the screen edge; the padding lives on the inner div instead
            <footer className="shrink-0 px-4 sm:px-5 pt-3 border-t border-line bg-surface-2 pb-safe">
              <div className="pb-3">{footer}</div>
            </footer>
          )}
        </div>
      </div>
    </dialog>
  );
};

/* -------------------------------- Toast ---------------------------------- */

export interface ToastUndo {
  run: () => void;
  /** The button's word when it does something other than undo: «Надіслати клієнту» after a save */
  label?: string;
  /** Where focus goes if the toast leaves holding it: the control that set it off is gone */
  returnTo?: string;
}

interface ToastState {
  id: number;
  message: string;
  variant: 'success' | 'error';
  onRetry?: () => void;
  undo?: ToastUndo;
}

interface ToastContextValue {
  /** Auto-closes after a few seconds; `undo` adds a "Put back" button and a little more time to reach it. */
  success: (message: string, undo?: ToastUndo) => void;
  /** Stays until dismissed by hand; onRetry adds a "Retry" button. */
  error: (message: string, onRetry?: () => void) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const TOAST_SUCCESS_MS = 3000;
const TOAST_UNDO_MS = 5000;

/** The words on a toast's buttons: undo is the default for `ToastUndo.label` */
interface ToastLabels {
  undo: string;
  retry: string;
  close: string;
}

const ToastPopover: React.FC<{ toast: ToastState; labels: ToastLabels; onClose: () => void }> = ({ toast, labels, onClose }) => {
  const ref = useRef<HTMLDivElement>(null);
  // Every dismissal sinks the toast first; onClose unmounts it once that ends
  const [leaving, setLeaving] = useState(false);
  // Under the pointer or holding focus, it waits: an undo must not leave while being reached for
  const [held, setHeld] = useState(false);
  const hasUndo = Boolean(toast.undo);
  // Inside the open modal dialog when there is one: everything outside it is inert, so a toast the
  // top layer laid over it showed its buttons and took no tap (a picker's «Повернути», a sheet's
  // «Повторити»). Back to the body when that dialog goes with the toast still up (a client saved and
  // picked at once, the picker's «Готово»)
  const [container, setContainer] = useState<Element>(() => document.querySelector('dialog:modal') ?? document.body);
  useLayoutEffect(() => {
    if (container === document.body) return;
    const check = () => !container.isConnected && setContainer(document.body);
    check();
    const observer = new MutationObserver(check);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [container]);

  // popover="manual" is what lands this in the top layer above an open <dialog>
  // (Modal uses showModal()): a plain fixed div renders underneath it instead.
  useEffect(() => {
    if (!ref.current?.isConnected) return;
    ref.current.showPopover?.();
    // The row the undone action stood on is gone, and focus fell to the page with it: the undo
    // takes it, or a keyboard has to cross the whole screen to reach it in time
    if (hasUndo && document.activeElement === document.body) ref.current.querySelector('button')?.focus();
  }, [hasUndo, container]);

  useEffect(() => {
    if (toast.variant !== 'success' || held) return;
    const timer = setTimeout(() => setLeaving(true), hasUndo ? TOAST_UNDO_MS : TOAST_SUCCESS_MS);
    return () => clearTimeout(timer);
  }, [toast.variant, hasUndo, held]);

  return createPortal(
    <div
      ref={ref}
      popover="manual"
      role={toast.variant === 'success' ? 'status' : 'alert'}
      // A keyboard's focus only: the focus handed to the undo after a tap would keep the toast up for good
      onFocus={(e) => e.target.matches(':focus-visible') && setHeld(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setHeld(false);
      }}
      // Mouse only: a finger never leaves, and a tapped toast would stay for good
      onPointerEnter={(e) => e.pointerType === 'mouse' && setHeld(true)}
      onPointerLeave={(e) => e.pointerType === 'mouse' && setHeld(false)}
      onAnimationEnd={() => {
        if (!leaving) return;
        if (toast.undo?.returnTo && ref.current?.contains(document.activeElement)) {
          document.getElementById(toast.undo.returnTo)?.focus();
        }
        onClose();
      }}
      className={cx(
        leaving ? 'animate-sink' : 'animate-rise',
        // top-auto/m-0: the UA stylesheet for [popover] sets inset:0 and margin:auto to centre it.
        // --bar-lift is the app's: the height of whatever bar is fixed along the bottom of the screen
        'fixed z-40 top-auto m-0 w-auto left-3 right-3 bottom-[calc(env(safe-area-inset-bottom,0px)+1rem+var(--bar-lift,0px))]',
        'sm:left-auto sm:right-[max(1rem,env(safe-area-inset-right))] sm:bottom-[calc(max(1rem,env(safe-area-inset-bottom))+var(--bar-lift,0px))] sm:w-96',
        'flex items-center gap-3 p-3.5 rounded-xl shadow-elevation-2 text-sm',
        // Solid fills: a surface tone was lost against the near-black background.
        // Inverse surface (fg as background) is the Material 3 snackbar colour.
        toast.variant === 'success' ? 'bg-fg text-bg' : 'bg-danger text-on-danger',
      )}
    >
      <p className="flex-1 min-w-0">{toast.message}</p>
      {toast.undo && (
        // Its own fill, as the retry below: the inverse surface takes no ghost button
        <Button
          size="sm"
          variant="secondary"
          className="shrink-0 pointer-coarse:h-11"
          onClick={() => {
            toast.undo?.run();
            setLeaving(true);
          }}
        >
          {toast.undo.label ?? labels.undo}
        </Button>
      )}
      {toast.variant === 'error' && (
        // Buttons with their own fill: a ghost button's text-fg-2 vanishes on bg-danger
        <div className="flex items-center gap-1 shrink-0">
          {toast.onRetry && (
            <Button
              size="sm"
              variant="secondary"
              className="pointer-coarse:h-11"
              onClick={() => {
                toast.onRetry?.();
                setLeaving(true);
              }}
            >
              {labels.retry}
            </Button>
          )}
          <IconButton label={labels.close} onClick={() => setLeaving(true)}>
            <X className="w-5 h-5" />
          </IconButton>
        </div>
      )}
    </div>,
    container,
  );
};

export const ToastProvider: React.FC<{ labels: ToastLabels; children: React.ReactNode }> = ({ labels, children }) => {
  const [toast, setToast] = useState<ToastState | null>(null);

  const success = useCallback((message: string, undo?: ToastUndo) => {
    setToast({ id: Date.now(), message, variant: 'success', undo });
  }, []);

  const error = useCallback((message: string, onRetry?: () => void) => {
    setToast({ id: Date.now(), message, variant: 'error', onRetry });
  }, []);

  const value = useMemo(() => ({ success, error }), [success, error]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {toast && <ToastPopover key={toast.id} toast={toast} labels={labels} onClose={() => setToast(null)} />}
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextValue => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
};

/* ------------------------------- Confirm -------------------------------- */

export const ConfirmInline: React.FC<{
  question: string;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
  /** Analytics name for the confirmation itself, so the stats count the deed and not the second thought */
  confirmEvent?: string;
  /** Other ways to say yes, set between keeping and the confirming button */
  children?: React.ReactNode;
}> = ({ question, confirmLabel, cancelLabel, onConfirm, onCancel, confirmEvent, children }) => (
    <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-xl bg-danger-soft border border-danger/30">
      <span className="text-sm text-danger font-medium">{question}</span>
      {/* Wraps: with another answer or two, three buttons outgrow a phone's row */}
      <div className="flex flex-wrap items-center justify-end gap-2 ml-auto">
        {/* The strip stands in for the button that asked, and focus would fall to the page with it; the safe answer takes it */}
        <Button size="sm" variant="ghost" className="pointer-coarse:h-11" autoFocus onClick={onCancel}>
          {cancelLabel}
        </Button>
        {children}
        <Button
          size="sm"
          variant="danger-solid"
          className="pointer-coarse:h-11"
          data-umami-event={confirmEvent}
          onClick={onConfirm}
        >
          {confirmLabel}
        </Button>
      </div>
    </div>
);

/* ------------------------------ Placeholder ----------------------------- */

/**
 * A grey block in place of content on its way. A "Loading…" line takes one row
 * while the screen that arrives is hundreds of pixels, and everything below
 * jumps; the placeholder holds the height in advance.
 */
export const Skeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cx('rounded-xl bg-surface-2 animate-pulse', className)} aria-hidden />
);

/** `label`: what a screen reader hears while it turns («Завантажуємо…») */
export const Spinner: React.FC<{ label: string; className?: string }> = ({ label, className }) => (
  <div
    role="status"
    className={cx(
      'inline-flex items-center justify-center w-8 h-8 rounded-full border-2 border-line border-t-accent animate-spin',
      className,
    )}
    aria-label={label}
  />
);

/* -------------------------------- Metric -------------------------------- */

export const Stat: React.FC<{
  label: string;
  value: React.ReactNode;
  hint?: string;
  tone?: 'default' | 'accent' | 'gold';
  /** Makes the tile a button that opens more; the chevron is what tells it from a plain tile */
  onClick?: () => void;
}> = ({ label, value, hint, tone = 'default', onClick }) => {
  const Tag = onClick ? 'button' : 'div';
  // Spans, not divs: a <button> may hold phrasing content only
  return (
    <Tag
      {...(onClick ? { type: 'button' as const, onClick } : {})}
      className={cx(
        'block p-3 rounded-xl bg-surface-2 border border-line min-w-0',
        onClick &&
          'w-full text-left transition-[background-color,border-color,transform] duration-150 hover:border-line-2 hover:bg-surface-3 active:scale-[0.98]',
      )}
    >
      <span className="flex items-center gap-1 caps-label text-fg-3">
        <span className="min-w-0 truncate">{label}</span>
        {onClick && <ChevronRight className="w-4 h-4 shrink-0 ml-auto" aria-hidden />}
      </span>
      <span
        className={cx(
          'block tnum text-xl font-bold mt-1 truncate',
          tone === 'accent' ? 'text-accent' : tone === 'gold' ? 'text-gold' : 'text-fg',
        )}
      >
        {value}
      </span>
      {hint && <span className="block text-meta text-fg-3 truncate">{hint}</span>}
    </Tag>
  );
};
