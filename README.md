# StateBinder

A zero-dependency, DOM-first state binder. StateBinder wires plain values to specific DOM nodes without frameworks, avoiding virtual DOM churn or component re-renders.

## Why

- Minimal surface: a few tiny classes for state and style bindings.
- Zero runtime dependencies; ships ESM + type definitions.
- SSR/test friendly: DOM access is guarded (no `document` -> no throw).
- Direct DOM writes only to targeted nodes, avoiding broad re-renders.

## Installation

```bash
npm install statebinderk
```

## Usage

### Basic state binding

```typescript
import { StateVar } from 'statebinderk';

const renderCount = (element: HTMLElement, count: number) => {
  element.textContent = `Count: ${count}`;
};

const count = new StateVar<number>(0, 'counter', renderCount);

count.transition(1); // updates #counter only
```

### Style binding

```typescript
import { StyleVar } from 'statebinderk';

const color = new StyleVar<string>( '#222', 'title', 'color');
color.transition('#f43'); // sets style color on #title
```

### Multiple bindings

```typescript
import { MultiStateVar, MultiStyleVar, StateVarList, StyleVarList, queueTransitions } from 'statebinderk';

const multi = new MultiStateVar<number>(0);
multi.addBinding('a', (el, state) => { el.textContent = `${state}`; });
multi.addBinding('b', (el, state) => { el.textContent = `${state * 2}`; });
multi.transition(5);

const styles = new StyleVarList(
  [{ id: 'boxA', state: '10px' }, { id: 'boxB', state: '12px' }],
  'padding',
  (px) => `${px}`,
);
styles.listTransition(['14px', '16px']);

// Remove or clear bindings when needed
multi.removeBinding('b');
styles.clearBindings();

// Optional: batch synchronous transitions
queueTransitions([
  () => multi.transition(6),
  () => styles.transition(0, '18px'),
]);
```

### Custom element lookup (SSR/tests)

Set a global lookup once (default: `document.getElementById`), or override per instance. This helps in SSR/tests:

```typescript
import { setGlobalLookup, StateVar } from 'statebinderk';

const lookup = (id: string) => domStub[id] ?? null;
setGlobalLookup(lookup);

const state = new StateVar(0, 'node', (el, v) => { el.value = String(v); });
```

## Development

- Build: `npm run build` (emits ESM + `.d.ts` to `dist/`)

## Contributing

PRs welcome. Please keep the API small, zero-dependency, and framework-agnostic.

## License

StateBinder is licensed under the [MIT License](LICENSE).
