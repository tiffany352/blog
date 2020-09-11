import fs from "fs";
import md from "./_markdown";

export interface Post {
  title: string;
  summary: string;
  date: Date;
  slug: string;
  url: string;
  html: string;
}

const posts: Post[] = [];

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

    const firstParaRegex = /<p>(.*?)<\/p>/s;
    const firstParaResult = firstParaRegex.exec(html);
    const firstPara = firstParaResult
      ? firstParaResult[1]
      : "Description not available.";
    const firstParaStripped = firstPara
      .replace(/<(\w+).*?>(.*?)<\/\1>/gs, (substr, arg1, arg2) => arg2)
      .replace(/(\s+)/gs, " ");

    const summaryRegex = /(.*?\.)/;
    const summaryResults = summaryRegex.exec(firstParaStripped);
    const summary = summaryResults
      ? summaryResults[1]
      : "Description not available.";

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
      summary,
    };
    posts.push(post);
  }
}

export default posts;
