import posts, { Post } from "./blog/_posts.js";

function reducer(acc: Date, value: Post) {
  return value.date.getTime() > acc.getTime() ? value.date : acc;
}

function createEntry(post: Post) {
  const safeHtml = post.html
    .replace(/&/, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  return `<entry>
      <title>${post.title}</title>
      <link href="${post.url}" />
      <updated>${post.date.toISOString()}</updated>
      <id>https://tiffnix.com${post.url}</id>
      <content type="html">${safeHtml}</content>
    </entry>`;
}

function createFeed(posts: Post[]) {
  const mostRecent: Date = posts.reduce(reducer, new Date(1970, 1, 1));

  const meta = `<title>Tiffany's Blog</title>
    <link href="https://tiffnix.com/atom.xml" rel="self" />
    <link href="https://tiffnix.com/" />
    <updated>${mostRecent.toISOString()}</updated>
    <id>https://tiffnix.com/</id>
    <author>
      <name>Tiffany Bennett</name>
    </author>`;

  const entries = posts.map(createEntry).join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
    <feed xmlns="http://www.w3.org/2005/Atom">
      ${meta}
      ${entries}
    </feed>`;
}

export function get(req: any, res: any) {
  const content = createFeed(posts);
  res.writeHead(200, {
    "Content-Type": "application/xml",
    "Content-Disposition": "inline",
  });
  res.end(content);
}
