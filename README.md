# ⚡ Dev Portfolio — SvelteKit

> A highly interactive, animated, production-grade developer portfolio built with **SvelteKit**, **TailwindCSS**, and **GSAP**. Feels like an experience, not just a page.

![Preview](./static/preview.png)

---

## 🚀 Live Demo

**[your-portfolio.vercel.app](https://your-portfolio.vercel.app)**

---

## 📦 Setup Instructions

### Prerequisites
- **Node.js** ≥ 18
- **npm** ≥ 9 (or pnpm / yarn)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/dev-portfolio.git
cd dev-portfolio

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev
# → Open http://localhost:5173
```

### Build for Production

```bash
npm run build
npm run preview   # Preview the production build locally
```

### Deploy

```bash
# Vercel (recommended — zero-config for SvelteKit)
npx vercel --prod

# Netlify
npx netlify deploy --prod --dir=.svelte-kit/output

# Cloudflare Pages
# Connect GitHub repo in the CF Pages dashboard
# Build command: npm run build
# Output dir: .svelte-kit/output/client
```

---

## 🏗 Architecture Explanation

```
src/
├── app.html              # HTML shell — fonts, meta, OG tags
├── app.css               # Global CSS — design tokens, utilities
├── routes/
│   ├── +layout.svelte    # Root layout — Nav, Cursor, Footer, skip link
│   └── +page.svelte      # Home page — composes all sections
└── lib/
    ├── stores/
    │   └── theme.js       # Writable theme store (dark/light + localStorage)
    └── components/
        ├── Cursor.svelte   # Magnetic custom cursor (dot + lagged ring)
        ├── Nav.svelte      # Sticky nav — scroll spy, mobile menu, theme toggle
        ├── Hero.svelte     # Landing — canvas particles, typewriter, GSAP entrance
        ├── Projects.svelte # Filterable grid — tilt cards, expandable modal
        ├── Skills.svelte   # Animated progress bars, floating tool chips, stats
        ├── Terminal.svelte # Interactive browser terminal (creative feature)
        ├── Contact.svelte  # Validated contact form — sanitized inputs
        └── Footer.svelte   # Back-to-top, branding, copyright
```

### Design Decisions

| Decision | Reason |
|---|---|
| SvelteKit (not pure Svelte) | SSR, file-based routing, built-in preloading, easy Vercel deploy |
| Single-page scroll | Better for portfolios — continuous narrative, no route re-renders |
| Component-per-section | Clean separation, lazy-importable, testable in isolation |
| Writable store for theme | Reactive across all components; persisted to `localStorage` |
| Canvas API for particles | No library overhead — pure performance, full control |
| GSAP for entrance animations | Sequence control, `timeline()` API, hardware-accelerated |
| CSS Intersection Observer for reveals | Native, performant, no ScrollTrigger overhead |

---

## 🎬 Animation Decisions

### 1. GSAP Timeline — Hero Entrance
The hero section uses a `gsap.timeline()` to stagger 6 elements in sequence with overlapping delays (`-=0.3`). This creates a cinematic "reveal" feel without the jarring all-at-once pop of CSS `animation-delay`.

```js
const tl = gsap.timeline({ delay: 0.3 });
tl.fromTo('.hero-name', { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.8 })
  .fromTo('.hero-role',  { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6 }, '-=0.4')
  // ...
```

### 2. CSS Intersection Observer — Scroll Reveals
Every section has `.reveal` elements that transition from `opacity: 0; translateY(40px)` → `opacity: 1; translateY(0)` once they enter the viewport. The `transition-delay` utility classes create stagger without JS.

### 3. Canvas Particle System — Hero Background
Vanilla Canvas 2D — no library. Particles repel from the mouse cursor for interactivity. Connections drawn as lines between nearby particles with opacity proportional to distance. Throttled by a `ResizeObserver` to avoid re-renders on window resize.

### 4. 3D CSS Tilt — Project Cards
`perspective(800px) rotateX() rotateY()` applied in `mousemove` via JavaScript. Resets on `mouseleave`. No library — pure DOM manipulation for zero-overhead tactile feel.

### 5. Typewriter — Role Cycling
A `setInterval`-based character-by-character writer/eraser with a pause at the full string. Cycles through 4 roles. Accessible via `aria-live="polite"`.

### 6. Reduced Motion
The `app.css` global stylesheet includes:
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```
This disables all animations system-wide for users who need it.

---

## ⚡ Performance Optimization Techniques

### Bundle
- **GSAP code-split** via Rollup's `manualChunks` — GSAP loads only when needed, not blocking initial paint
- **Tree-shaking** — Svelte's compiler eliminates unused component code at build time
- **No icon library** — All icons are inline SVG path strings; zero library bytes

### Assets
- **Google Fonts with `display=swap`** — Text renders immediately in fallback font; web font enhances progressively
- **Fontshare CDN** for Clash Display — edge-cached, fast

### Runtime
- **Passive event listeners** on `mousemove` and `scroll` — never blocks main thread
- **`requestAnimationFrame` loop** for custom cursor — smooth 60fps, cancelable
- **Intersection Observer** for reveals — native browser API, no scroll listener polling

### Rendering
- **SSR via SvelteKit** — First paint is server-rendered HTML; hydration is fast because Svelte compiles to minimal vanilla JS
- **`data-sveltekit-preload-data="hover"`** — Prefetches page data on link hover

### Metrics (target)
| Metric | Target |
|---|---|
| Performance | 95+ |
| Accessibility | 100 |
| Best Practices | 100 |
| SEO | 100 |
| FCP | < 1.2s |
| LCP | < 2.0s |

---

## ♿ Accessibility Considerations

| Feature | Implementation |
|---|---|
| Skip navigation | `<a href="#main-content">` visible on focus |
| Keyboard navigation | All interactive elements reachable via Tab; custom cursor hidden for touch/keyboard |
| Focus styles | `:focus-visible` ring in gold — 2px offset, high-contrast |
| Semantic HTML | `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`, `<h1>`→`<h3>` hierarchy |
| ARIA labels | `aria-label`, `aria-labelledby`, `aria-required`, `aria-invalid`, `aria-live`, `role="dialog"`, `aria-modal` on modal |
| Alt text | All decorative SVGs have `aria-hidden="true"`; meaningful images have `alt` |
| Color contrast | Gold on dark background meets WCAG AA (4.5:1 for normal text) |
| Reduced motion | Full system-level disable via `@media (prefers-reduced-motion: reduce)` |
| Screen reader | `aria-live="polite"` on typewriter; terminal output in `role="log"` |
| Form validation | Error messages linked with `aria-describedby`; errors announced via `role="alert"` |

---

## ⚖️ Trade-offs Made

| Trade-off | Decision | Reason |
|---|---|---|
| No Three.js / WebGL | Used Canvas 2D particles instead | Keeps bundle < 100KB; same visual impact |
| No Framer Motion | Used GSAP + native CSS transitions | SvelteKit ecosystem fit; smaller bundle |
| Single-page vs multi-page | Single scrolling page | Portfolio narrative flows better; fewer route transitions to manage |
| No email SDK (SendGrid etc.) | Form handler is a stub | Keeps server costs at zero; easily swapped for Netlify Functions / Formspree |
| CSS custom cursor hidden on mobile | Touch devices get default cursor | Custom cursor is meaningless without mouse; `@media (hover: none)` restores default |
| Light mode | Implemented via `dark` class toggle | Full light mode CSS would double stylesheet size — trade-off against perf |
| No database for contact form | In-memory / third-party handler | Zero infrastructure to maintain for a portfolio |

---

## 🧩 Customization Guide

### Replace placeholder content
- **`Hero.svelte`** — Change `Your Name Here`, bio text, social hrefs
- **`Projects.svelte`** — Edit the `PROJECTS` array with your real projects
- **`Skills.svelte`** — Adjust `SKILL_GROUPS` levels and `TOOLS` list
- **`Terminal.svelte`** — Update `whoami`, `skills`, `contact` command outputs
- **`Contact.svelte`** — Replace email in `handleSubmit` with your API endpoint

### Swap accent color
Change `--gold` in `app.css` and update references in `tailwind.config.js`:
```css
:root {
  --gold: #your-color;
}
```

---

## 📋 Tech Stack

| Layer | Technology |
|---|---|
| Framework | SvelteKit 2.x |
| Styling | TailwindCSS 3.x + Custom CSS |
| Animation | GSAP 3.x + Native CSS |
| Fonts | Clash Display (Fontshare), Outfit + JetBrains Mono (Google) |
| Build | Vite 5 |
| Deployment | Vercel (recommended) |

---

## 📄 License

MIT — free to use, remix, and deploy.
