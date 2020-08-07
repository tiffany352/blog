import posts from "./_posts";

const contents = JSON.stringify(
  posts.map((post) => {
    return {
      title: post.title,
      slug: post.slug,
      date: post.date,
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
