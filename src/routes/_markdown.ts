import MarkdownIt from "markdown-it";
import hljs from "highlight.js";
import hljsSvelte from "highlightjs-svelte";

hljsSvelte(hljs);

const highlightPlugin = (md: MarkdownIt) => {
  const temp = (md as any).renderer.rules.fence.bind(md.renderer.rules);
  md.renderer.rules.fence = (
    tokens: any,
    idx: number,
    options: any,
    env: any,
    slf: any
  ) => {
    const token = tokens[idx];
    const code = token.content.trim();
    const result = hljs.highlightAuto(code, [token.info]).value;
    if (token.info.length > 0) {
      return `<pre><code class="hljs">${result}</code></pre>`;
    }
    return temp(tokens, idx, options, env, slf);
  };
};

const md = new MarkdownIt().use(highlightPlugin);
export default md;
