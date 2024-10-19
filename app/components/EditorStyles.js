'use client';

// styles ni membolehkan ada styling dalam editorjs. kalau takde ni 'heading' dgn 'text' akan nampak seperti text biasa.
import { createGlobalStyle } from 'styled-components';

const EditorStyles = createGlobalStyle`
  .codex-editor h1 {
    font-size: 2em;
    font-weight: bold;
    margin-bottom: 0.5em;
  }
  .codex-editor h2 {
    font-size: 1.5em;
    font-weight: bold;
    margin-bottom: 0.5em;
  }
  .codex-editor h3 {
    font-size: 1.17em;
    font-weight: bold;
    margin-bottom: 0.5em;
  }
  .codex-editor p {
    margin-bottom: 1em;
  }
  .codex-editor ul, .codex-editor ol {
    margin-bottom: 1em;
    padding-left: 2em;
  }
  .codex-editor li {
    margin-bottom: 0.5em;
  }
  .variable {
    background-color: #e0f7fa;
    padding: 2px 4px;
    border-radius: 3px;
    font-weight: bold;
  }
`;

export default EditorStyles;
