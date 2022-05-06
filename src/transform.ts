import * as Compiler from 'vue/compiler-sfc';
import { transform } from 'sucrase';
import { toRefs } from 'vue';
import type { BindingMetadata, CompilerOptions, SFCDescriptor } from 'vue/compiler-sfc';
import type { File, Store } from './store';

export const COMP_IDENTIFIER = '__sfc__';
export const filename = 'run.vue';

async function transformTS(src: string) {
  return transform(src, {
    transforms: ['typescript'],
  }).code;
}

export async function compileFile(store: Store, file: File) {
  const { code, compiled } = toRefs(file);
  if (!code.value.trim()) {
    store.state.errors = [];
    return;
  }

  const { errors, descriptor } = Compiler.parse(code.value, {
    sourceMap: true,
  });
  if (errors.length > 0) {
    store.state.errors = errors;
    return;
  }

  const id = await hashId();
  if (descriptor.styles.some(s => s.lang) || (descriptor.template && descriptor.template.lang)) {
    store.state.errors = ['lang="x" pre-processors for <template> or <style> are currently not ' + 'supported.'];
    return;
  }

  const scriptLang
    = (descriptor.script && descriptor.script.lang) || (descriptor.scriptSetup && descriptor.scriptSetup.lang);
  const isTS = scriptLang === 'ts';
  if (scriptLang && !isTS) { store.state.errors = ['Only lang="ts" is supported for <script> blocks.']; }

  let clientCode = '';

  const clientScriptResult = await doCompileScript(store, descriptor, id, isTS);
  if (!clientScriptResult) { return; }

  const [clientScript, bindings] = clientScriptResult;
  clientCode += clientScript;

  // template
  // only need dedicated compilation if not using <script setup>
  if (descriptor.template && !descriptor.scriptSetup) {
    const clientTemplateResult = doCompileTemplate(store, descriptor, id, bindings, isTS);
    if (!clientTemplateResult) { return; }

    clientCode += clientTemplateResult;
  }

  if (clientCode) { compiled.value.js = clientCode.trimStart(); }

  // styles
  let css = '';
  for (const style of descriptor.styles) {
    if (style.module) {
      store.state.errors = ['<style module> is not supported in the playground.'];
      return;
    }

    const styleResult = await Compiler.compileStyleAsync({
      source: style.content,
      filename,
      id,
      scoped: style.scoped,
      modules: !!style.module,
    });
    if (styleResult.errors.length > 0) {
      // postcss uses pathToFileURL which isn't polyfilled in the browser
      // ignore these errors for now
      if (!styleResult.errors[0].message.includes('pathToFileURL')) { store.state.errors = styleResult.errors; }
    } else {
      css += `${styleResult.code}\n`;
    }
  }
  if (css) { compiled.value.css = css.trim(); } else { compiled.value.css = '/* No <style> tags present */'; }

  // clear errors
  store.state.errors = [];
}

async function doCompileScript(
  store: Store,
  descriptor: SFCDescriptor,
  id: string,
  isTS: boolean,
): Promise<[string, BindingMetadata | undefined] | undefined> {
  if (descriptor.script || descriptor.scriptSetup) {
    try {
      const expressionPlugins: CompilerOptions['expressionPlugins'] = isTS ? ['typescript'] : undefined;
      const compiledScript = Compiler.compileScript(descriptor, {
        inlineTemplate: true,
        id,
        templateOptions: {
          compilerOptions: {
            expressionPlugins,
          },
        },
      });
      let code = '';
      code += `\n${Compiler.rewriteDefault(compiledScript.content, COMP_IDENTIFIER, expressionPlugins)}`;

      if ((descriptor.script || descriptor.scriptSetup)!.lang === 'ts') { code = await transformTS(code); }

      return [code, compiledScript.bindings];
    } catch (e: any) {
      store.state.errors = [e.stack.split('\n').slice(0, 12).join('\n')];
    }
  } else {
    return [`\nconst ${COMP_IDENTIFIER} = {}`, undefined];
  }
}

function doCompileTemplate(
  store: Store,
  descriptor: SFCDescriptor,
  id: string,
  bindingMetadata: BindingMetadata | undefined,
  isTS: boolean,
) {
  const templateResult = Compiler.compileTemplate({
    source: descriptor.template!.content,
    filename: descriptor.filename,
    id,
    scoped: descriptor.styles.some(s => s.scoped),
    slotted: descriptor.slotted,
    isProd: true,
    compilerOptions: {
      bindingMetadata,
      expressionPlugins: isTS ? ['typescript'] : undefined,
    },
  });
  if (templateResult.errors.length > 0) {
    store.state.errors = templateResult.errors;
    return;
  }

  const fnName = 'render';

  return (
    `\n${templateResult.code.replace(/\nexport (function|const) (render|ssrRender)/, `$1 ${fnName}`)}`
    + `\n${COMP_IDENTIFIER}.${fnName} = ${fnName}`
  );
}

async function hashId() {
  const msgUint8 = new TextEncoder().encode(`${Math.random()}`); // encode as (utf-8) Uint8Array
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8); // hash the message
  const hashArray = Array.from(new Uint8Array(hashBuffer)); // convert buffer to byte array
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join(''); // convert bytes to hex string
  return hashHex.slice(0, 8);
}
