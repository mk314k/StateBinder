# Contributing to StateBinder

StateBinder is intentionally small and DOM-first. Contributions should preserve that character: minimal surface area, zero runtime dependencies, and no hidden rerendering or scheduling.

## Core principles
- **Targeted DOM writes**: Only update the elements you explicitly bind; no tree-wide rerenders or diffing.
- **Zero dependencies**: Keep runtime free of third-party packages. Dev-only deps are fine for linting/tests/build.
- **Framework agnostic**: Plain JS/TS with an optional element lookup. No hooks/components/schedulers baked in.
- **SSR/test friendly**: Guard DOM access; never throw when `document` is absent. Allow custom lookup injection.
- **Explicit API**: Small class surface; clear method names; no magic side effects or global state.
- **Bundle discipline**: Ship only `dist/` (ESM + types). Examples/tests stay out of the published package.

## Scope guidelines
- Prefer opt-in helpers over core complexity. If a feature adds branching to hot paths, it probably belongs as a recipe/example.
- Avoid retaining DOM references internally beyond bindings; no global registries.
- Performance-first: direct `setProperty`/`textContent` writes, no proxy/observer layers.
- Security: no dynamic `eval`/`Function`/`innerHTML` writes; never fetch/emit network requests.

## Getting started
1. `npm install`
2. `npm test` (runs `npm run build` + Node tests)
3. Use `npm run build` before publishing/PR checks.

## Testing
- Use Node’s built-in test runner with fake DOM objects (`test/*.test.js`).
- Add cases for missing elements, custom lookups, and style/state transitions.

## Examples
- Put demos in `examples/` and keep them dependency-light. They are excluded from the npm package via `.npmignore`.

## Releases
- Keep semver: breaking API changes require a major bump. Update `dist/` via `npm run build` before publishing.

## PR checklist
- [ ] Follows core principles above.
- [ ] Adds/updates tests when behavior changes.
- [ ] Keeps API surface small and explicit.
- [ ] `npm test` passes.
