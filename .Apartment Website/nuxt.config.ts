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

if (isBuildTime && (!dbUrl || /USER:PASS|HOST|DBNAME/.test(dbUrl))) {
  throw new Error('DATABASE_URL is missing or contains placeholders. Set DATABASE_URL (Neon) for build-time so Hub/Drizzle generate correct Postgres config.')
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

  hub: {
    // Force Postgres driver for Hub so builds use `DATABASE_URL` in all branches/environments.
    // Use the driver name expected by @nuxthub/core (see createDrizzleClient).
    db: {
      // Drizzle expects a dialect name for migrations; make it explicit.
      dialect: 'postgresql',
      driver: 'postgres-js',
      connection: {
        url: dbUrl
      }
    },
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
