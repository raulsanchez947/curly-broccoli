// https://nuxt.com/docs/api/configuration/nuxt-config
const dbUrl = process.env.DATABASE_URL || process.env.NUXT_DATABASE_URL || ''

// During CI / production / Vercel builds we must have a valid DATABASE_URL so
// the Hub generator doesn't emit placeholders like USER:PASS@HOST:5432/DBNAME.
const isBuildTime = process.env.CI === 'true' || process.env.VERCEL || process.env.GITHUB_ACTIONS === 'true' || process.env.npm_lifecycle_event === 'build' || process.env.NODE_ENV === 'production'

if (isBuildTime) {
  const maskedDbUrl = dbUrl ? dbUrl.replace(/(postgresql:\/\/[^:]+:)([^@]+)(@)/, '$1****$3') : ''
  // Log presence and a masked URL during build to verify the build-time env is available.
  // Masking avoids printing credentials in logs.
  // This runs only during build-time to keep dev logs clean.
  // eslint-disable-next-line no-console
  console.log('[build-time] DATABASE_URL present:', !!dbUrl, 'masked:', maskedDbUrl)
}

// Only require DATABASE_URL at build-time when explicitly embedding it into
// the generated Hub outputs. Embedding is opt-in via `HUB_EMBED_DB_URL=1`.
if (isBuildTime && process.env.HUB_EMBED_DB_URL && (!dbUrl || /USER:PASS|HOST|DBNAME/.test(dbUrl))) {
  throw new Error('DATABASE_URL is missing or contains placeholders. Set DATABASE_URL (Neon) for build-time or unset HUB_EMBED_DB_URL to avoid embedding DB credentials.')
}

export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    '@nuxtjs/mdc',
    '@nuxthub/core',
    'nuxt-auth-utils',
    'nuxt-charts'
  ],

  devtools: {
    enabled: true
  },

  css: ['~/assets/css/main.css'],

  mdc: {
    headings: {
      anchorLinks: false
    },
    highlight: {
      // noApiRoute: true
      shikiEngine: 'javascript'
    }
  },

  experimental: {
    viewTransition: true
  },

  compatibilityDate: '2024-07-11',

  nitro: {
    experimental: {
      openAPI: true
    }
  },

  // Vite build tuning to lower peak memory and split large vendor chunks.
  // Manual chunks reduce single large bundles which can cause high memory usage.
  vite: {
    build: {
      // Allow larger chunks but still warn for very large bundles.
      chunkSizeWarningLimit: 2000,
      // Disable build sourcemaps to avoid Tailwind plugin sourcemap warnings.
      sourcemap: false,
      rollupOptions: {
        output: {
          manualChunks(id: string) {
            if (!id.includes('node_modules')) return
            // prioritize splitting out very large or problematic packages first
            if (id.includes('/node_modules/ai') || id.includes('/node_modules/@ai-sdk')) return 'vendor_ai'
            if (id.includes('/node_modules/@nuxt/ui') || id.includes('/node_modules/nuxt-ui')) return 'vendor_nuxt_ui'
            if (id.includes('/node_modules/vue') || id.includes('/node_modules/@vue')) return 'vendor_vue'
            if (id.includes('/node_modules/@nuxt') || id.includes('/node_modules/nuxt')) return 'vendor_nuxt'
            if (id.includes('/node_modules/shiki') || id.includes('/node_modules/@shikijs')) return 'vendor_shiki'
            if (id.includes('/node_modules/@iconify') || id.includes('/node_modules/iconify')) return 'vendor_iconify'
            if (id.includes('/node_modules/@vueuse') || id.includes('/node_modules/vueuse')) return 'vendor_vueuse'
            if (id.includes('/node_modules/tailwindcss') || id.includes('/node_modules/@tailwind')) return 'vendor_tailwind'
            if (id.includes('/node_modules/firebase') || id.includes('/node_modules/@firebase')) return 'vendor_firebase'
            if (id.includes('/node_modules/@prisma') || id.includes('/node_modules/prisma')) return 'vendor_prisma'
            if (id.includes('/node_modules/drizzle') || id.includes('/node_modules/@drizzle') ) return 'vendor_drizzle'
            if (id.includes('/node_modules/lodash')) return 'vendor_lodash'
            return 'vendor_misc'
          }
        }
      }
    }
  },

  hub: {
    // Only configure Postgres when explicitly embedding DB URL at build time.
    // Otherwise leave `db` undefined so @nuxthub/core doesn't initialize
    // the postgres-js driver (which requires a DB env var).
    db: process.env.HUB_EMBED_DB_URL ? {
      dialect: 'postgresql',
      driver: 'postgres-js',
      connection: {
        url: dbUrl
      },
      applyMigrationsDuringBuild: !!(process.env.HUB_APPLY_MIGRATIONS && /^(1|true)$/i.test(process.env.HUB_APPLY_MIGRATIONS))
    } : undefined,
    blob: true
  },

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  }
})
