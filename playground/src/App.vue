<template>
  <main font-sans text="gray-700 dark:gray-200" flex flex-col h-full w-full relative>
    <TheNav />
    <Vrunning />
  </main>
</template>

<script lang="ts" setup>
import Vrunning from 'vrunning'
// import IconVerticalVIew from "~icons/carbon/vertical-view";
// import IconHorizontalView from "~icons/carbon/horizontal-view";
// import IconOpenPanelLeft from "~icons/carbon/open-panel-filled-left";
// import IconOpenPanelRight from "~icons/carbon/open-panel-filled-right";
// import IconReset from "~icons/carbon/reset";

const props = {
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
}
</script>
