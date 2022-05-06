<template>
  <div class="vue-run">
    <SplitPane :layout="layout">
      <template #right>
        <Editor />
      </template>
      <template #left>
        <Preview />
      </template>
    </SplitPane>
  </div>
</template>

<script lang="ts" setup>
import { provide } from 'vue';
import SplitPane from './SplitPane.vue';
import Editor from './Editor.vue';
import Preview from './Preview.vue';
import type { Store } from './store';
import { replStore } from './store';

interface globalProps {
  store?: Store;
  readonly?: boolean;
  autoResize?: boolean;
  clearConsole?: boolean;
  depLibs?: { name: string; url: string }[];
  depCss?: string[];
  position: 'right' | 'left';
  layout?: 'horizontal' | 'vertical';
}

const props = withDefaults(defineProps<globalProps>(), {
  store: () => new replStore(),
  autoResize: true,
  showImportMap: true,
  clearConsole: true,
  layout: 'horizontal',
  position: 'right',
  depLibs: () => [
    {
      name: 'element-plus',
      url: 'https://cdn.jsdelivr.net/npm/element-plus@2.1.4/dist/index.full.mjs',
    },
  ],
  depCss: () => ['https://unpkg.com/element-plus/dist/index.css'],
});

provide('globalProps', props);
provide('store', props.store);
</script>

<style scoped>
.vue-run {
  --bg: #fff;
  --bg-soft: #f8f8f8;
  --border: #ddd;
  --text-light: #888;
  --font-code: Menlo, Monaco, Consolas, 'Courier New', monospace;
  --color-branding: #42b883;
  --color-branding-dark: #416f9c;
  --header-height: 38px;

  height: 100%;
  width: 100%;
  flex: 1;
  font-size: 13px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans',
    'Helvetica Neue', sans-serif;
  margin: 0;
  overflow: hidden;
  background-color: var(--bg-soft);
}

.dark .vue-run {
  --bg: #1a1a1a;
  --bg-soft: #242424;
  --border: #383838;
  --text-light: #aaa;
  --color-branding: #42d392;
  --color-branding-dark: #89ddff;
}

.vue-run .Example {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 10px;
  height: var(--header-height);
  background-color: var(--bg);
  color: var(--text-light);
  font-size: 13px;
  font-weight: 500;
  line-height: 1;
  border-bottom: 1px solid var(--border);
}
</style>
