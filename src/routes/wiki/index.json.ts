import posts from "../_wiki";

const contents = JSON.stringify(
  posts.map((post) => {
    return {
      title: post.title,
      summary: post.summary,
      slug: post.slug,
      updated: post.updated,
      url: post.url,
    };
  })
);

export function get(req: any, res: any) {
  res.writeHead(200, {
    "Content-Type": "application/json",
  });

  res.end(contents);
}
