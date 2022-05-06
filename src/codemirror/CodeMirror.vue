, { codemirrorOption }
<template>
  <div ref="el" class="editor" />
</template>

<script setup lang="ts">
import { onMounted, ref, watchEffect } from 'vue';
import { debounce } from '../utils';
import CodeMirror, { codemirrorOption } from './codemirror';

interface Props {
  mode?: string;
  value?: string;
  readonly?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  mode: 'htmlmixed',
  value: '',
  readonly: false,
});

const emit = defineEmits<(e: 'change', value: string) => void>();

const el = ref<HTMLElement>();
const needAutoResize = true;

onMounted(() => {
  const editor = CodeMirror(el.value!, {
    ...codemirrorOption,
    ...{
      value: '',
      readOnly: props.readonly,
      lineWrapping: true,
    },
  });

  editor.on('change', () => {
    emit('change', editor.getValue());
  });

  watchEffect(() => {
    const cur = editor.getValue();
    if (props.value !== cur) { editor.setValue(props.value); }
  });

  watchEffect(() => {
    editor.setOption('mode', props.mode);
  });

  setTimeout(() => {
    editor.refresh();
  }, 50);

  if (needAutoResize) {
    window.addEventListener(
      'resize',
      debounce(() => {
        editor.refresh();
      }),
    );
  }
});
</script>

<style>
.editor {
  position: relative;
  height: 100%;
  width: 100%;
  overflow: hidden;
}

.CodeMirror {
  font-family: var(--font-code);
  line-height: 1.5;
  height: 100%;
}
</style>
