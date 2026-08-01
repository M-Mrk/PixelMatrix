import { throttle } from "./common.js";

let editor;

export const get_editor = () => {
  if (!editor) {
    console.warn("editor not initialized yet.")
  }
  return editor;
}

const content_changed = () => {
  if (!editor) {
    console.warn("editor not initialized yet.")
    return;
  }
  console.debug("Backing up script");
  window.localStorage.setItem("script", editor.getValue());
}

export const init_editor = () => {
  let last_script = window.localStorage.getItem("script");
  if (!last_script) {
    last_script = [
      '// Write your Rhai script here',
      '// It will run on every pixel and the return will define the pixels color',
      '// Return an array of RGB values, e.g. [ 255, 125, 50 ]',
      '//',
      '// You also have access to the current pixels coordinates: x, y',
      '//',
      '// Use any built-in rhai function and some extra ones, like:',
      '// rand(min: i64, max: i64) -> i64 Returns a random number in the given range',
      'return [ x*10, x*y, y*10 ];',
    ].join('\n');
  }

  require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.45.0/min/vs' } });
  require(['vs/editor/editor.main'], function() {
    editor = monaco.editor.create(document.getElementById('editor-container'), {
      value: last_script,
      language: 'rust', // Rhai doesn't have a built-in syntax, but 'rust' looks very close!
      theme: 'vs-dark',
      minimap: {
        enabled: false,
      }
    });

    editor.onDidChangeModelContent(throttle(() => {
      content_changed();
    }, 500));
  });
}
