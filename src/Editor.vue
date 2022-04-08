<script setup lang="ts">
import { inject } from "vue";
import CodeMirror from "./codemirror/CodeMirror.vue";
import Message from "./Message.vue";
import { debounce } from "./utils";
import type Store from "./store";

const store = inject("store") as Store;

// eslint-disable-next-line no-console
console.log(store);

const onChange = debounce((code: string) => {
  store.state.file.code = code;
}, 150);
</script>

<template>
  <div class="editor-container">
    <CodeMirror :value="store.state.file.code" @change="onChange" />
    <Message :err="store.state.errors[0]" />
  </div>
</template>

<style scoped>
.editor-container {
  height: 100%;
  overflow: hidden;
  position: relative;
}
</style>
