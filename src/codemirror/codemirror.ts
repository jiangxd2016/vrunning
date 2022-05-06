import CodeMirror from 'codemirror';
import './codemirror.css';

// language
import 'codemirror/mode/vue/vue.js';

// highlightSelectionMatches
import 'codemirror/addon/scroll/annotatescrollbar.js';
import 'codemirror/addon/search/matchesonscrollbar.js';

// modes
import 'codemirror/mode/javascript/javascript.js';
// addons
import 'codemirror/addon/edit/closebrackets.js';
import 'codemirror/addon/edit/closetag.js';
import 'codemirror/addon/comment/comment.js';
import 'codemirror/addon/fold/foldcode.js';
import 'codemirror/addon/fold/brace-fold.js';
import 'codemirror/addon/fold/indent-fold.js';
import 'codemirror/addon/fold/comment-fold.js';

export const codemirrorOption = {
  tabSize: 2,
  mode: 'text/x-vue',
  styleActiveLine: true,
  lineNumbers: true,
  autoCloseTags: true,
  styleSelectedText: true,
  line: true,
  lineWrapping: true,
  viewportMargin: Number.POSITIVE_INFINITY,
  gutters: ['CodeMirror-linenumbers'],
  highlightSelectionMatches: { showToken: /\w/, annotateScrollbar: true },
  hintOptions: {
    // 当匹配只有一项的时候是否自动补全
    completeSingle: true,
  },
  // scrollbarStyle: 'null',
  matchBrackets: true,
  showCursorWhenSelecting: true,
  extraKeys: { Ctrl: 'autocomplete' },
};

export default CodeMirror;
