// Ordinarily, you'd generate this data from markdown files in your
// repo, or fetch them from a database of some kind. But in order to
// avoid unnecessary dependencies in the starter template, and in the
// service of obviousness, we're just going to leave it here.

// This file is called `_posts.js` rather than `posts.js`, because
// we don't want to create an `/blog/posts` route — the leading
// underscore tells Sapper not to do that.

import fs from "fs";
import MarkdownIt from "markdown-it";

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

const posts: Post[] = [];
const md = new MarkdownIt();

const dir = fs.readdirSync("./posts");
for (const file of dir) {
  const regex = /^(\d+)-(\d+)-(\d+)-(.*)\.md$/;
  const result = regex.exec(file);
  if (result) {
    const date = new Date(
      parseInt(result[1]),
      parseInt(result[2]),
      parseInt(result[3])
    );
    const slug = result[4];

    const content = fs.readFileSync(`./posts/${file}`, { encoding: "utf8" });

    const titleRegex = /^\#\s*(.*)$/m;
    const titleResults = titleRegex.exec(content);
    const title = titleResults ? titleResults[1] : "Untitled";

    const html = md.render(content);

    const year = date.getFullYear();
    const month = date.getMonth().toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");

    const url = `/blog/${year}/${month}/${day}/${slug}`;

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