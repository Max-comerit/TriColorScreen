# TriColorScreen

## File and Folder Structure

### Directory Structure
```
TriColorScreen/
├── .github/                # GitHub workflows and config
├── .nuxt/                  # Nuxt build output (generated)
├── .output/                # Production build output
├── assets/                 # Uncompiled assets
│   ├── css/                # CSS files (Tailwind, custom styles)
│   └── images/             # Image assets organized by feature
│       ├── brag-bar/       # Brag bar component images
│       ├── footer/         # Footer component images
│       ├── header/         # Header component images
│       ├── tcs-wallpaper.png   # Background wallpaper (fallback)
│       └── tcs-wallpaper.webp  # Background wallpaper (WebP)
├── components/              # Vue components
│   ├── base/               # Base/primitive components (BaseButton, BaseInput)
│   ├── common/             # Common reusable components
│   ├── features/           # Feature-specific components
│   └── layout/             # Layout-specific components (Header, Footer)
├── composables/            # Composable functions (useAuth, useFetch, etc.)
├── layouts/                # Layout templates (default.vue, etc.)
├── middleware/             # Route middleware
├── pages/                  # File-based routing pages
│   ├── about.vue           # About page
│   ├── contact.vue         # Contact page
│   ├── index.vue           # Home page
│   └── services/           # Services pages
├── plugins/                # Nuxt plugins
├── public/                 # Static files (served as-is)
│   ├── images/             # Public images organized by page
│   │   ├── about/          # About page images
│   │   ├── contact/        # Contact page images
│   │   ├── custom-design/  # Custom design images
│   │   ├── index/          # Home page images
│   │   └── services/       # Services page images
│   ├── favicon.ico         # Site favicon
│   └── robots.txt          # SEO robots file
├── server/                 # Server-side code
│   ├── api/                # API endpoints
│   ├── middleware/         # Server middleware
│   └── utils/              # Server utilities
├── stores/                 # Pinia stores (userStore, cartStore, etc.)
├── types/                  # TypeScript type definitions
├── utils/                  # Utility functions
├── app.vue                 # Root Vue component
├── nuxt.config.ts          # Nuxt configuration
├── tailwind.config.js      # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
├── eslint.config.mjs       # ESLint configuration
├── package.json            # Dependencies and scripts
└── CODING_STANDARDS.md     # This file
```