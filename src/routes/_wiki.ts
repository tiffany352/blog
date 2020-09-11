import fs from "fs";
import md from "./_markdown";

export interface WikiPage {
  title: string;
  summary: string;
  updated: Date;
  slug: string;
  url: string;
  html: string;
}

const wiki: WikiPage[] = [];

const dir = fs.readdirSync("./wiki");
for (const file of dir) {
  const slug = file.replace(/\.md$/, "");
  const path = `./wiki/${file}`;

  const stats = fs.statSync(path);
  const updated = stats.mtime;
  const content = fs.readFileSync(path, { encoding: "utf8" });

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

  const url = `wiki/${slug}`;

  const page: WikiPage = {
    title,
    updated,
    slug,
    html,
    url,
    summary,
  };
  wiki.push(page);
}

export default wiki;
