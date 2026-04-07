# TriColorScreen

## Getting Started

### Prerequisites

- **Node.js** `24.11.1` (see `.node-version`) — use [nvm](https://github.com/nvm-sh/nvm) or [fnm](https://github.com/Schniz/fnm) to manage versions
- **npm** (bundled with Node.js)

### Local Development

```bash
npm install
npm run dev
```

The dev server starts at `http://localhost:3000`.

## Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Build for SSR (server-side rendering) |
| `npm run generate` | Static site generation (used for production) |
| `npm run generate:clean` | Clean all build artefacts, then generate |
| `npm run preview` | Preview the last production build locally |
| `npm run analyze` | Analyse the production bundle |
| `npm run lint` | Run ESLint across the project |
| `npm run lint:fix` | Run ESLint and auto-fix violations |
| `npm run audit` | Run security audit (fails on moderate+ vulnerabilities) |

## Environment Variables

Set these in a `.env` file at the project root for local overrides. In production they are set in `netlify.toml`.

| Variable | Description | Default |
|---|---|---|
| `SITE_URL` | Canonical base URL used in meta tags and sitemaps | `https://www.tricolorscreen.se` |

## Deployment

The site is deployed on **Netlify** as a fully static site (SSG).

- Build command: `npm run generate:clean`
- Publish directory: `dist/`
- All routes are pre-rendered by `nuxi generate` to their own `index.html` files — there is no SPA catch-all redirect.
- Deploy previews automatically use `DEPLOY_PRIME_URL` as the canonical URL (see `nuxt.config.ts`).
- Production domain: `https://www.tricolorscreen.se`

## Tech Stack

| Technology | Purpose |
|---|---|
| [Nuxt 3](https://nuxt.com) | Full-stack Vue framework (SSG mode) |
| [Vue 3](https://vuejs.org) | UI framework (Composition API) |
| [Pinia](https://pinia.vuejs.org) | State management |
| [Tailwind CSS](https://tailwindcss.com) | Utility-first CSS |
| [Fabric.js](http://fabricjs.com) | Canvas manipulation for the Custom Design tool |
| [Zod](https://zod.dev) | Schema validation for forms |
| [Embla Carousel](https://www.embla-carousel.com) | Carousel component |
| [Netlify](https://netlify.com) | Hosting and CDN |

## File and Folder Structure

### Directory Structure

```
TriColorScreen/
├── .github/                # GitHub workflows and config
├── .nuxt/                  # Nuxt build output (generated)
├── .output/                # Production build output
├── assets/                 # Uncompiled assets
│   ├── css/                # CSS files (Tailwind, custom styles)
│   │   ├── main.css        # Base resets (critical)
│   │   ├── layout.css      # Layout grid – prevents CLS (critical)
│   │   ├── fonts.css       # Font definitions (critical)
│   │   ├── variables.css   # CSS custom properties
│   │   ├── utilities.css   # Utility classes
│   │   └── custom-design-fonts.css  # Custom Design tool fonts
│   ├── fonts/              # Local font files
│   │   └── custom-design/  # Fonts used by the Custom Design tool
│   ├── images/             # Image assets organised by feature
│   │   ├── brag-bar/       # Brag bar component images
│   │   ├── common/         # Shared/generic images
│   │   ├── custom-design/  # Custom Design tool images
│   │   ├── footer/         # Footer component images
│   │   └── icons/          # Icon assets
│   └── json/               # Static JSON data organised by page
│       ├── about/          # About page data
│       ├── contact/        # Contact page data
│       ├── custom-design/  # Custom Design tool data
│       ├── index/          # Home page data
│       └── services/       # Services page data
├── components/             # Vue components
│   ├── base/               # Base/primitive components (BaseButton, BaseDropdown, BaseModal)
│   ├── common/             # Common reusable components
│   ├── features/           # Feature-specific components
│   └── layout/             # Layout-specific components (AppHeader, AppFooter, NavBar)
├── composables/            # Composable functions
├── layouts/                # Layout templates (default.vue)
├── middleware/             # Route middleware
├── pages/                  # File-based routing pages
│   ├── about.vue           # About page
│   ├── contact.vue         # Contact page
│   ├── custom-design.vue   # Custom Design tool page
│   ├── index.vue           # Home page
│   └── services/           # Services pages
├── plugins/                # Nuxt plugins
├── public/                 # Static files (served as-is)
│   ├── images/             # Public images
│   │   ├── about/          # About page images
│   │   ├── contact/        # Contact page images
│   │   ├── custom-design/  # Custom design images
│   │   ├── header/         # Header images
│   │   ├── index/          # Home page images
│   │   ├── services/       # Services page images
│   │   ├── tcs-wallpaper.png   # Background wallpaper (fallback)
│   │   ├── tcs-wallpaper.webp  # Background wallpaper (WebP)
│   │   ├── error.png       # Error page image (fallback)
│   │   ├── error.webp      # Error page image (WebP)
│   │   ├── oops.png        # 404 image (fallback)
│   │   └── oops.webp       # 404 image (WebP)
│   ├── videos/             # Public video assets
│   ├── favicon.ico         # Site favicon
│   ├── robots.txt          # SEO robots file
│   ├── sitemap.xml         # XML sitemap
│   └── site.webmanifest    # PWA manifest
├── server/                 # Server-side code
│   ├── api/                # API endpoints
│   ├── middleware/         # Server middleware
│   └── utils/              # Server utilities
├── stores/                 # Pinia stores
│   ├── canvasStore.ts      # Canvas / Custom Design tool state
│   ├── contactFormStore.ts # Contact form state
│   ├── navigationStore.ts  # Navigation / menu state
│   └── quoteFormStore.ts   # Quote request form state
├── types/                  # TypeScript type definitions
├── utils/                  # Utility functions
├── app.vue                 # Root Vue component
├── error.vue               # Error page component
├── nuxt.config.ts          # Nuxt configuration
├── tailwind.config.ts      # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
├── eslint.config.mjs       # ESLint configuration
├── netlify.toml            # Netlify deployment configuration
├── package.json            # Dependencies and scripts
├── CODING_STANDARDS.md     # Project Coding Standard
└── README.md               # This file
```

### Misc
Dev-only Ajv warnings from ESLint are safe to ignore. CI audit ignores them.
