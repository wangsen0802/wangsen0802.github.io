import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import pluginVue from 'eslint-plugin-vue'

export default [
  {
    ignores: ['dist/**', 'node_modules/**'],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...pluginVue.configs['flat/recommended'],
  {
    files: ['**/*.vue'],
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser,
      },
      globals: {
        // 浏览器环境
        window: 'readonly',
        document: 'readonly',
        navigator: 'readonly',
        console: 'readonly',
        HTMLElement: 'readonly',
        Event: 'readonly',
        MouseEvent: 'readonly',
        KeyboardEvent: 'readonly',
        requestAnimationFrame: 'readonly',
        cancelAnimationFrame: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
        localStorage: 'readonly',
        sessionStorage: 'readonly',
        fetch: 'readonly',
        URL: 'readonly',

        // Vue auto-imports
        computed: 'readonly',
        ref: 'readonly',
        reactive: 'readonly',
        watch: 'readonly',
        watchEffect: 'readonly',
        onMounted: 'readonly',
        onUnmounted: 'readonly',
        onBeforeUnmount: 'readonly',
        nextTick: 'readonly',
        toRef: 'readonly',
        toRefs: 'readonly',
        defineProps: 'readonly',
        defineEmits: 'readonly',
        defineExpose: 'readonly',
        withDefaults: 'readonly',
        provide: 'readonly',
        inject: 'readonly',
        readonly: 'readonly',
        shallowRef: 'readonly',
        shallowReactive: 'readonly',
        triggerRef: 'readonly',
        isRef: 'readonly',
        unref: 'readonly',
        onBeforeMount: 'readonly',
        PropType: 'readonly',

        // Nuxt auto-imports
        useHead: 'readonly',
        useAsyncData: 'readonly',
        useFetch: 'readonly',
        useRoute: 'readonly',
        useRouter: 'readonly',
        useState: 'readonly',
        useRuntimeConfig: 'readonly',
        useCookie: 'readonly',
        useRequestHeaders: 'readonly',
        useRequestURL: 'readonly',
        useSeoMeta: 'readonly',
        useAppConfig: 'readonly',
        navigateTo: 'readonly',
        clearError: 'readonly',
        showError: 'readonly',
        createError: 'readonly',
        callOnce: 'readonly',
        useId: 'readonly',
        useLazyFetch: 'readonly',
        useLazyAsyncData: 'readonly',
        refreshNuxtData: 'readonly',
        $fetch: 'readonly',

        // 自定义 composables (composables/ 目录)
        useCodeCopy: 'readonly',
        usePageStats: 'readonly',
        usePostsCache: 'readonly',
        useSandbox: 'readonly',
        useSearch: 'readonly',
        useSeo: 'readonly',
        useStats: 'readonly',
        useTypewriter: 'readonly',
      },
    },
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      globals: {
        console: 'readonly',
      },
    },
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.vue'],
    rules: {
      // 关闭与 Prettier 冲突的格式化规则
      'vue/html-indent': 'off',
      'vue/html-closing-bracket-newline': 'off',
      'vue/multiline-html-element-content-newline': 'off',
      'vue/singleline-html-element-content-newline': 'off',
      'vue/max-attributes-per-line': 'off',
      'vue/attributes-order': 'off',
      'vue/html-self-closing': 'off',

      // Vue 规则
      'vue/multi-word-component-names': 'off',
      'vue/no-v-html': 'off', // 项目中需要使用 v-html 渲染 Markdown

      // TypeScript 规则
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-empty-object-type': 'off',
    },
  },
]
