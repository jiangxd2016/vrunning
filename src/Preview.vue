<template>
  <iframe
    ref="iframe"
    sandbox="allow-modals allow-forms allow-pointer-lock allow-popups allow-same-origin allow-scripts"
    scrolling="yes"
    frameborder="0"
    style="width: 100%; height: 150px; border: none"
  ></iframe>
</template>

<script setup lang="ts">
import { inject, onMounted, ref, watch } from "vue";
import type Store from "~/store";

const defineImport =
  "https://unpkg.com/es-module-shims@0.10.1/dist/es-module-shims.min.js";
const defineDep: { [key in string]: string } = {
  vue: "https://unpkg.com/@vue/runtime-dom@3.2.31/dist/runtime-dom.esm-browser.js",
};
interface globalProps {
  store?: Store;
  readonly?: boolean;
  autoResize?: boolean;
  clearConsole?: boolean;
  depLibs?: { name: string; url: string }[];
  depCss: string[];
  layout?: "horizontal" | "vertical";
}

const store = inject<Store>("store");

const globalProp = inject("globalProps") as globalProps;
const iframe = ref();

onMounted(setIframe);

watch(
  () => store!.state.file.compiled.js,
  () => {
    const iframeContent = iframe.value;
    setHTML(iframeContent);
  }
);

function setIframe() {
  const iframeContent = iframe.value!;

  const iframeDocument = iframeContent.contentWindow.document;
  const stylesTags = globalProp?.depCss.map(
    (style) => `<link rel="stylesheet" href="${style}" />`
  );
  globalProp?.depLibs!.forEach((lib) => {
    defineDep[lib.name] = lib.url;
  });

  const html = `
          <!DOCTYPE html>
            <html>
              <head>
                <script async src="${defineImport}"><\/script>
                <script type="importmap" crossorigin="anonymous">{"imports":${JSON.stringify(
                  defineDep
                )}}<\/script>
                ${stylesTags!.join("\n")}
              </head>
              <body id="body">
                <div><pre id="error" style="color: red"></pre></div>
                <div id="app"></div>
              </body>
          </html>`;
  iframeDocument.open();
  iframeDocument.write(html);
  iframeDocument.close();
  iframeContent.onload = () => {
    setHTML(iframeContent);
  };
}

function getScript(script?: string) {
  return ` 
    ${script}
  import { createApp as _createApp } from 'vue'
      const AppComponent =__sfc__
      AppComponent.name = 'Repl'
      const app = (window.__app__ = _createApp(AppComponent))
      app.config.unwrapInjectedRef = true
      app.config.errorHandler = (e) => console.error(e)
      app.mount('#app')
      `;
}
// 设置html
function setHTML(iframeContent: any) {
  const iframeDocument = iframeContent.contentWindow.document;

  if (iframeDocument) {
    const elBox = iframeDocument.getElementById("body");
    if (elBox) {
      const fragment = iframeDocument.createDocumentFragment();
      // 创建样式
      const newStyle = iframeDocument.createElement("style");
      newStyle.type = "text/css";
      newStyle.innerHTML = store?.state.file.compiled.css;

      // 创建元素
      const elApp = iframeDocument.createElement("div");
      elApp.setAttribute("id", "app");
      // 创建js
      const newScript = iframeDocument.createElement("script");
      newScript.type = "module";
      newScript.innerHTML = getScript(store?.state.file.compiled.js);

      // 重置 html
      elBox.innerHTML = "";

      fragment.appendChild(newScript);
      fragment.appendChild(elApp);
      fragment.appendChild(newStyle);

      elBox.appendChild(fragment);
    }
  }
}
</script>

<style scoped>
.iframe-container,
.iframe-container :deep(iframe) {
  width: 100%;
  height: 100%;
  border: none;
}
</style>
