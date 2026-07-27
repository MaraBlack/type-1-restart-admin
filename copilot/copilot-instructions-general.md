# Project Guidelines

## Stack And Defaults

- Use Angular standalone components and lazy-loaded feature routes.
- Prefer small feature entry components that compose page sections from a local `sections/` folder.
- Keep templates in separate `.html` files. Add component-scoped CSS only when a section cannot be expressed cleanly with the existing global Tailwind utilities and theme tokens.
- Use `@ngx-translate` for user-facing text instead of hardcoded copy.
- Use `HttpClient` and feature-scoped services for API access. Do not introduce state libraries, UI libraries, or form libraries unless explicitly requested.

## Architecture

- Preserve the current feature-first structure under `src/app/features/`.
- For every new page or domain, keep the same folder vocabulary already used in this repo: `features/`, `sections/`, `components/`, `models/`, `services/`, `shared/`, `core/`, and `env/`.
- Keep route definitions centralized in `src/app/app.routes.ts` and prefer `loadComponent` for feature pages.
- Shared layout or cross-feature UI belongs in `src/app/shared/components/`.
- Cross-cutting services and generic building blocks belong in `src/app/core/`.

## Admin Generation Rules

- For each admin resource, prefer this structure:
  - page entry component at feature root
  - `sections/` for list, filters, form, details, or toolbar sections used by that page
  - `components/` for reusable resource-specific UI parts such as table rows, cards, dialogs, or form fragments
  - `models/` for request, response, and form types
  - `services/` for API calls and mapping helpers
- Prefer explicit CRUD flows: list, create, edit, delete, and details should be separate concerns in code even if they share UI pieces.
- Use typed reactive forms for create and edit flows.
- Keep resource APIs behind feature services. Do not call HTTP directly from components.
- If route guards, interceptors, or auth helpers are needed for admin, place reusable pieces in `core/` and keep resource logic inside the admin feature.

## Styling And UI

- Preserve the visual identity from `src/styles.css`, `src/typography.css`, and `src/spacing.css`.
- Reuse the existing color tokens such as `--color-primary`, `--color-secondary`, `--color-secondary-light`, and `--color-accent` before introducing any new color.
- Reuse shared utility classes like `section`, `section-sm`, `container-custom`, `btn-primary`, `btn-header-cta`, `link-inline`, `section-inner`, `icon-container`, `card-interactive`, and `card-icon` patterns.
- Keep the same soft gradients, rounded cards, airy spacing, and accent-heavy footer/header contrast instead of switching to generic admin dashboards or default Angular Material styling.
- Do not replace the existing design direction with a new theme. Extend the current theme.

## Environment And Configuration

- Keep environment-specific values in `src/env/env.ts` and `src/env/env.prod.ts`.
- For admin API integration, add base URLs or related config in the existing environment files instead of hardcoding endpoints.
- Preserve existing app initializers and global providers in `src/app/app.config.ts` unless the task explicitly requires changing startup behavior.

## Code Style

- Match the existing TypeScript style: concise classes, explicit imports, and minimal comments.
- Prefer descriptive names and small focused methods.
- Keep changes localized. Do not refactor unrelated features while adding admin CRUD flows.
- Before adding a new pattern, check whether an equivalent section, shared component, or service already exists and reuse it when practical.

## Build And Validation

- Use `npm run build` for a focused validation pass after structural changes.
- Use `npm test` when modifying behavior covered by tests or when adding new business logic.

## What To Avoid

- Do not flatten the app into type-based folders.
- Do not mix admin-specific API logic into unrelated public-site features.
- Do not invent a separate color palette for admin.
- Do not hardcode text that should be translatable.
- Do not bypass the `env` files for URLs or runtime configuration.
