# Parallax — the sky, right now

Parallax is an editorial "sky right now" app. It answers a simple question — what's overhead, this moment, from where you're standing — and then deliberately asks it twice, from two different vantage points that don't agree with each other.

## Two views, on purpose

**FROM EARTH** is the geocentric Sky Dial: where the Sun, Moon, and planets actually sit in your local sky right now — altitude, azimuth, rise/set, twilight bands, moon phase.

**FROM ABOVE** is the heliocentric Orrery: the same bodies' positions in their orbits around the Sun, ecliptic longitude and all.

These two views intentionally don't line up. A planet's place in Earth's sky and its orbital angle around the Sun are different quantities — that's correct physics, not a bug. Parallax keeps both honest rather than forcing them into a single, misleading picture.

## Powered by real data

Parallax makes no simulated or mock data. Every position, rise/set time, and moon phase comes from two live APIs built and maintained by the author:

- **[Horizon](https://horizon-prod-lk.vercel.app)** — sun/moon rise, set, twilight, and golden-hour times for your location.
- **[Orrery](https://orrery-dev.vercel.app)** — heliocentric planetary positions and ephemeris data.

Positions refresh automatically every 60 seconds.

## Tech stack

- [Vite](https://vitejs.dev/) + [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) (strict)
- [Tailwind CSS](https://tailwindcss.com/) + Radix UI primitives
- [Vitest](https://vitest.dev/) + Testing Library for unit/component tests

## Local development

```bash
npm install
npm run dev        # start the dev server
npx vitest run       # run the test suite (31 tests)
npm run build       # type-check (tsc -b, strict) + production build
npm run preview     # serve the production build locally
```

Configure API endpoints via `.env`:

```
VITE_ORRERY_URL=https://orrery-dev.vercel.app
VITE_HORIZON_URL=https://horizon-prod-lk.vercel.app
```
