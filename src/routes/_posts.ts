// Ordinarily, you'd generate this data from markdown files in your
// repo, or fetch them from a database of some kind. But in order to
// avoid unnecessary dependencies in the starter template, and in the
// service of obviousness, we're just going to leave it here.

// This file is called `_posts.js` rather than `posts.js`, because
// we don't want to create an `/blog/posts` route — the leading
// underscore tells Sapper not to do that.

import fs from "fs";
import MarkdownIt from "markdown-it";
import hljs from "highlight.js";
import hljsSvelte from "highlightjs-svelte";

export interface Post {
  title: string;
  date: Date;
  slug: string;
  url: string;
  html: string;
}

interface Meta {
  title: string;
}

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

const posts: Post[] = [];
const md = new MarkdownIt().use(highlightPlugin);

const dir = fs.readdirSync("./posts");
for (const file of dir) {
  const regex = /^(\d+)-(\d+)-(\d+)-(.*)\.md$/;
  const result = regex.exec(file);
  if (result) {
    const date = new Date(
      parseInt(result[1]),
      parseInt(result[2]) - 1,
      parseInt(result[3])
    );
    const slug = result[4];

    const content = fs.readFileSync(`./posts/${file}`, { encoding: "utf8" });

    const initHtml = md.render(content);

    const titleRegex = /^<h1>(.*)<\/h1>(.*)$/s;
    const titleResults = titleRegex.exec(initHtml);
    const title = titleResults ? titleResults[1] : "Untitled";
    const html = titleResults ? titleResults[2] : initHtml;

    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");

    const url = `${year}/${month}/${day}/${slug}`;

    const post: Post = {
      title,
      date,
      slug,
      url,
      html,
    };
    posts.push(post);
  }
}

export default posts;
