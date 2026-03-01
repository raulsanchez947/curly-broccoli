import { NuxtModule, ModuleDependencyMeta } from '@nuxt/schema'
declare module '@nuxt/schema' {
  interface ModuleDependencies {
    ["@nuxt/eslint"]?: ModuleDependencyMeta<typeof import("@nuxt/eslint").default extends NuxtModule<infer O> ? O | false : Record<string, unknown>> | false
    ["@nuxt/icon"]?: ModuleDependencyMeta<typeof import("@nuxt/icon").default extends NuxtModule<infer O> ? O | false : Record<string, unknown>> | false
    ["@nuxt/fonts"]?: ModuleDependencyMeta<typeof import("@nuxt/fonts").default extends NuxtModule<infer O> ? O | false : Record<string, unknown>> | false
    ["@nuxtjs/color-mode"]?: ModuleDependencyMeta<typeof import("@nuxtjs/color-mode").default extends NuxtModule<infer O> ? O | false : Record<string, unknown>> | false
    ["@nuxt/ui"]?: ModuleDependencyMeta<typeof import("@nuxt/ui").default extends NuxtModule<infer O> ? O | false : Record<string, unknown>> | false
    ["@nuxtjs/mdc"]?: ModuleDependencyMeta<typeof import("@nuxtjs/mdc").default extends NuxtModule<infer O> ? O | false : Record<string, unknown>> | false
    ["@nuxthub/core"]?: ModuleDependencyMeta<typeof import("@nuxthub/core").default extends NuxtModule<infer O> ? O | false : Record<string, unknown>> | false
    ["auth-utils"]?: ModuleDependencyMeta<typeof import("nuxt-auth-utils").default extends NuxtModule<infer O> ? O | false : Record<string, unknown>> | false
    ["nuxt-charts"]?: ModuleDependencyMeta<typeof import("nuxt-charts").default extends NuxtModule<infer O> ? O | false : Record<string, unknown>> | false
    ["@nuxt/devtools"]?: ModuleDependencyMeta<typeof import("@nuxt/devtools").default extends NuxtModule<infer O> ? O | false : Record<string, unknown>> | false
    ["@nuxt/telemetry"]?: ModuleDependencyMeta<typeof import("@nuxt/telemetry").default extends NuxtModule<infer O> ? O | false : Record<string, unknown>> | false
  }
  interface NuxtOptions {
    /**
     * Configuration for `@nuxt/eslint`
     */
    ["eslint"]: typeof import("@nuxt/eslint").default extends NuxtModule<infer O, unknown, boolean> ? O | false : Record<string, any> | false
    /**
     * Configuration for `@nuxt/icon`
     */
    ["icon"]: typeof import("@nuxt/icon").default extends NuxtModule<infer O, unknown, boolean> ? O | false : Record<string, any> | false
    /**
     * Configuration for `@nuxt/fonts`
     */
    ["fonts"]: typeof import("@nuxt/fonts").default extends NuxtModule<infer O, unknown, boolean> ? O | false : Record<string, any> | false
    /**
     * Configuration for `@nuxtjs/color-mode`
     */
    ["colorMode"]: typeof import("@nuxtjs/color-mode").default extends NuxtModule<infer O, unknown, boolean> ? O | false : Record<string, any> | false
    /**
     * Configuration for `@nuxt/ui`
     */
    ["ui"]: typeof import("@nuxt/ui").default extends NuxtModule<infer O, unknown, boolean> ? O | false : Record<string, any> | false
    /**
     * Configuration for `@nuxtjs/mdc`
     */
    ["mdc"]: typeof import("@nuxtjs/mdc").default extends NuxtModule<infer O, unknown, boolean> ? O | false : Record<string, any> | false
    /**
     * Configuration for `@nuxthub/core`
     */
    ["hub"]: typeof import("@nuxthub/core").default extends NuxtModule<infer O, unknown, boolean> ? O | false : Record<string, any> | false
    /**
     * Configuration for `nuxt-auth-utils`
     */
    ["auth"]: typeof import("nuxt-auth-utils").default extends NuxtModule<infer O, unknown, boolean> ? O | false : Record<string, any> | false
    /**
     * Configuration for `nuxt-charts`
     */
    ["nuxtCharts"]: typeof import("nuxt-charts").default extends NuxtModule<infer O, unknown, boolean> ? O | false : Record<string, any> | false
    /**
     * Configuration for `@nuxt/devtools`
     */
    ["devtools"]: typeof import("@nuxt/devtools").default extends NuxtModule<infer O, unknown, boolean> ? O | false : Record<string, any> | false
    /**
     * Configuration for `@nuxt/telemetry`
     */
    ["telemetry"]: typeof import("@nuxt/telemetry").default extends NuxtModule<infer O, unknown, boolean> ? O | false : Record<string, any> | false
  }
  interface NuxtConfig {
    /**
     * Configuration for `@nuxt/eslint`
     */
    ["eslint"]?: typeof import("@nuxt/eslint").default extends NuxtModule<infer O, unknown, boolean> ? Partial<O> | false : Record<string, any> | false
    /**
     * Configuration for `@nuxt/icon`
     */
    ["icon"]?: typeof import("@nuxt/icon").default extends NuxtModule<infer O, unknown, boolean> ? Partial<O> | false : Record<string, any> | false
    /**
     * Configuration for `@nuxt/fonts`
     */
    ["fonts"]?: typeof import("@nuxt/fonts").default extends NuxtModule<infer O, unknown, boolean> ? Partial<O> | false : Record<string, any> | false
    /**
     * Configuration for `@nuxtjs/color-mode`
     */
    ["colorMode"]?: typeof import("@nuxtjs/color-mode").default extends NuxtModule<infer O, unknown, boolean> ? Partial<O> | false : Record<string, any> | false
    /**
     * Configuration for `@nuxt/ui`
     */
    ["ui"]?: typeof import("@nuxt/ui").default extends NuxtModule<infer O, unknown, boolean> ? Partial<O> | false : Record<string, any> | false
    /**
     * Configuration for `@nuxtjs/mdc`
     */
    ["mdc"]?: typeof import("@nuxtjs/mdc").default extends NuxtModule<infer O, unknown, boolean> ? Partial<O> | false : Record<string, any> | false
    /**
     * Configuration for `@nuxthub/core`
     */
    ["hub"]?: typeof import("@nuxthub/core").default extends NuxtModule<infer O, unknown, boolean> ? Partial<O> | false : Record<string, any> | false
    /**
     * Configuration for `nuxt-auth-utils`
     */
    ["auth"]?: typeof import("nuxt-auth-utils").default extends NuxtModule<infer O, unknown, boolean> ? Partial<O> | false : Record<string, any> | false
    /**
     * Configuration for `nuxt-charts`
     */
    ["nuxtCharts"]?: typeof import("nuxt-charts").default extends NuxtModule<infer O, unknown, boolean> ? Partial<O> | false : Record<string, any> | false
    /**
     * Configuration for `@nuxt/devtools`
     */
    ["devtools"]?: typeof import("@nuxt/devtools").default extends NuxtModule<infer O, unknown, boolean> ? Partial<O> | false : Record<string, any> | false
    /**
     * Configuration for `@nuxt/telemetry`
     */
    ["telemetry"]?: typeof import("@nuxt/telemetry").default extends NuxtModule<infer O, unknown, boolean> ? Partial<O> | false : Record<string, any> | false
    modules?: (undefined | null | false | NuxtModule<any> | string | [NuxtModule | string, Record<string, any>] | ["@nuxt/eslint", Exclude<NuxtConfig["eslint"], boolean>] | ["@nuxt/icon", Exclude<NuxtConfig["icon"], boolean>] | ["@nuxt/fonts", Exclude<NuxtConfig["fonts"], boolean>] | ["@nuxtjs/color-mode", Exclude<NuxtConfig["colorMode"], boolean>] | ["@nuxt/ui", Exclude<NuxtConfig["ui"], boolean>] | ["@nuxtjs/mdc", Exclude<NuxtConfig["mdc"], boolean>] | ["@nuxthub/core", Exclude<NuxtConfig["hub"], boolean>] | ["nuxt-auth-utils", Exclude<NuxtConfig["auth"], boolean>] | ["nuxt-charts", Exclude<NuxtConfig["nuxtCharts"], boolean>] | ["@nuxt/devtools", Exclude<NuxtConfig["devtools"], boolean>] | ["@nuxt/telemetry", Exclude<NuxtConfig["telemetry"], boolean>])[],
  }
}
declare module 'nuxt/schema' {
  interface ModuleDependencies {
    ["@nuxt/eslint"]?: ModuleDependencyMeta<typeof import("@nuxt/eslint").default extends NuxtModule<infer O> ? O | false : Record<string, unknown>> | false
    ["@nuxt/icon"]?: ModuleDependencyMeta<typeof import("@nuxt/icon").default extends NuxtModule<infer O> ? O | false : Record<string, unknown>> | false
    ["@nuxt/fonts"]?: ModuleDependencyMeta<typeof import("@nuxt/fonts").default extends NuxtModule<infer O> ? O | false : Record<string, unknown>> | false
    ["@nuxtjs/color-mode"]?: ModuleDependencyMeta<typeof import("@nuxtjs/color-mode").default extends NuxtModule<infer O> ? O | false : Record<string, unknown>> | false
    ["@nuxt/ui"]?: ModuleDependencyMeta<typeof import("@nuxt/ui").default extends NuxtModule<infer O> ? O | false : Record<string, unknown>> | false
    ["@nuxtjs/mdc"]?: ModuleDependencyMeta<typeof import("@nuxtjs/mdc").default extends NuxtModule<infer O> ? O | false : Record<string, unknown>> | false
    ["@nuxthub/core"]?: ModuleDependencyMeta<typeof import("@nuxthub/core").default extends NuxtModule<infer O> ? O | false : Record<string, unknown>> | false
    ["auth-utils"]?: ModuleDependencyMeta<typeof import("nuxt-auth-utils").default extends NuxtModule<infer O> ? O | false : Record<string, unknown>> | false
    ["nuxt-charts"]?: ModuleDependencyMeta<typeof import("nuxt-charts").default extends NuxtModule<infer O> ? O | false : Record<string, unknown>> | false
    ["@nuxt/devtools"]?: ModuleDependencyMeta<typeof import("@nuxt/devtools").default extends NuxtModule<infer O> ? O | false : Record<string, unknown>> | false
    ["@nuxt/telemetry"]?: ModuleDependencyMeta<typeof import("@nuxt/telemetry").default extends NuxtModule<infer O> ? O | false : Record<string, unknown>> | false
  }
  interface NuxtOptions {
    /**
     * Configuration for `@nuxt/eslint`
     * @see https://www.npmjs.com/package/@nuxt/eslint
     */
    ["eslint"]: typeof import("@nuxt/eslint").default extends NuxtModule<infer O, unknown, boolean> ? O | false : Record<string, any> | false
    /**
     * Configuration for `@nuxt/icon`
     * @see https://www.npmjs.com/package/@nuxt/icon
     */
    ["icon"]: typeof import("@nuxt/icon").default extends NuxtModule<infer O, unknown, boolean> ? O | false : Record<string, any> | false
    /**
     * Configuration for `@nuxt/fonts`
     * @see https://www.npmjs.com/package/@nuxt/fonts
     */
    ["fonts"]: typeof import("@nuxt/fonts").default extends NuxtModule<infer O, unknown, boolean> ? O | false : Record<string, any> | false
    /**
     * Configuration for `@nuxtjs/color-mode`
     * @see https://www.npmjs.com/package/@nuxtjs/color-mode
     */
    ["colorMode"]: typeof import("@nuxtjs/color-mode").default extends NuxtModule<infer O, unknown, boolean> ? O | false : Record<string, any> | false
    /**
     * Configuration for `@nuxt/ui`
     * @see https://ui.nuxt.com/docs/getting-started/installation/nuxt
     */
    ["ui"]: typeof import("@nuxt/ui").default extends NuxtModule<infer O, unknown, boolean> ? O | false : Record<string, any> | false
    /**
     * Configuration for `@nuxtjs/mdc`
     * @see https://www.npmjs.com/package/@nuxtjs/mdc
     */
    ["mdc"]: typeof import("@nuxtjs/mdc").default extends NuxtModule<infer O, unknown, boolean> ? O | false : Record<string, any> | false
    /**
     * Configuration for `@nuxthub/core`
     * @see https://hub.nuxt.com
     */
    ["hub"]: typeof import("@nuxthub/core").default extends NuxtModule<infer O, unknown, boolean> ? O | false : Record<string, any> | false
    /**
     * Configuration for `nuxt-auth-utils`
     * @see https://www.npmjs.com/package/nuxt-auth-utils
     */
    ["auth"]: typeof import("nuxt-auth-utils").default extends NuxtModule<infer O, unknown, boolean> ? O | false : Record<string, any> | false
    /**
     * Configuration for `nuxt-charts`
     * @see https://www.npmjs.com/package/nuxt-charts
     */
    ["nuxtCharts"]: typeof import("nuxt-charts").default extends NuxtModule<infer O, unknown, boolean> ? O | false : Record<string, any> | false
    /**
     * Configuration for `@nuxt/devtools`
     * @see https://www.npmjs.com/package/@nuxt/devtools
     */
    ["devtools"]: typeof import("@nuxt/devtools").default extends NuxtModule<infer O, unknown, boolean> ? O | false : Record<string, any> | false
    /**
     * Configuration for `@nuxt/telemetry`
     * @see https://www.npmjs.com/package/@nuxt/telemetry
     */
    ["telemetry"]: typeof import("@nuxt/telemetry").default extends NuxtModule<infer O, unknown, boolean> ? O | false : Record<string, any> | false
  }
  interface NuxtConfig {
    /**
     * Configuration for `@nuxt/eslint`
     * @see https://www.npmjs.com/package/@nuxt/eslint
     */
    ["eslint"]?: typeof import("@nuxt/eslint").default extends NuxtModule<infer O, unknown, boolean> ? Partial<O> | false : Record<string, any> | false
    /**
     * Configuration for `@nuxt/icon`
     * @see https://www.npmjs.com/package/@nuxt/icon
     */
    ["icon"]?: typeof import("@nuxt/icon").default extends NuxtModule<infer O, unknown, boolean> ? Partial<O> | false : Record<string, any> | false
    /**
     * Configuration for `@nuxt/fonts`
     * @see https://www.npmjs.com/package/@nuxt/fonts
     */
    ["fonts"]?: typeof import("@nuxt/fonts").default extends NuxtModule<infer O, unknown, boolean> ? Partial<O> | false : Record<string, any> | false
    /**
     * Configuration for `@nuxtjs/color-mode`
     * @see https://www.npmjs.com/package/@nuxtjs/color-mode
     */
    ["colorMode"]?: typeof import("@nuxtjs/color-mode").default extends NuxtModule<infer O, unknown, boolean> ? Partial<O> | false : Record<string, any> | false
    /**
     * Configuration for `@nuxt/ui`
     * @see https://ui.nuxt.com/docs/getting-started/installation/nuxt
     */
    ["ui"]?: typeof import("@nuxt/ui").default extends NuxtModule<infer O, unknown, boolean> ? Partial<O> | false : Record<string, any> | false
    /**
     * Configuration for `@nuxtjs/mdc`
     * @see https://www.npmjs.com/package/@nuxtjs/mdc
     */
    ["mdc"]?: typeof import("@nuxtjs/mdc").default extends NuxtModule<infer O, unknown, boolean> ? Partial<O> | false : Record<string, any> | false
    /**
     * Configuration for `@nuxthub/core`
     * @see https://hub.nuxt.com
     */
    ["hub"]?: typeof import("@nuxthub/core").default extends NuxtModule<infer O, unknown, boolean> ? Partial<O> | false : Record<string, any> | false
    /**
     * Configuration for `nuxt-auth-utils`
     * @see https://www.npmjs.com/package/nuxt-auth-utils
     */
    ["auth"]?: typeof import("nuxt-auth-utils").default extends NuxtModule<infer O, unknown, boolean> ? Partial<O> | false : Record<string, any> | false
    /**
     * Configuration for `nuxt-charts`
     * @see https://www.npmjs.com/package/nuxt-charts
     */
    ["nuxtCharts"]?: typeof import("nuxt-charts").default extends NuxtModule<infer O, unknown, boolean> ? Partial<O> | false : Record<string, any> | false
    /**
     * Configuration for `@nuxt/devtools`
     * @see https://www.npmjs.com/package/@nuxt/devtools
     */
    ["devtools"]?: typeof import("@nuxt/devtools").default extends NuxtModule<infer O, unknown, boolean> ? Partial<O> | false : Record<string, any> | false
    /**
     * Configuration for `@nuxt/telemetry`
     * @see https://www.npmjs.com/package/@nuxt/telemetry
     */
    ["telemetry"]?: typeof import("@nuxt/telemetry").default extends NuxtModule<infer O, unknown, boolean> ? Partial<O> | false : Record<string, any> | false
    modules?: (undefined | null | false | NuxtModule<any> | string | [NuxtModule | string, Record<string, any>] | ["@nuxt/eslint", Exclude<NuxtConfig["eslint"], boolean>] | ["@nuxt/icon", Exclude<NuxtConfig["icon"], boolean>] | ["@nuxt/fonts", Exclude<NuxtConfig["fonts"], boolean>] | ["@nuxtjs/color-mode", Exclude<NuxtConfig["colorMode"], boolean>] | ["@nuxt/ui", Exclude<NuxtConfig["ui"], boolean>] | ["@nuxtjs/mdc", Exclude<NuxtConfig["mdc"], boolean>] | ["@nuxthub/core", Exclude<NuxtConfig["hub"], boolean>] | ["nuxt-auth-utils", Exclude<NuxtConfig["auth"], boolean>] | ["nuxt-charts", Exclude<NuxtConfig["nuxtCharts"], boolean>] | ["@nuxt/devtools", Exclude<NuxtConfig["devtools"], boolean>] | ["@nuxt/telemetry", Exclude<NuxtConfig["telemetry"], boolean>])[],
  }
}