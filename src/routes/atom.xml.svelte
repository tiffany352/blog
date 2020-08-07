<script>
  import posts from "./blog/_posts.js";

  const contents = JSON.stringify(
    posts.map((post) => {
      return {
        title: post.title,
        slug: post.slug,
      };
    })
  );

  export function get(req, res) {
    res.writeHead(200, {
      "Content-Type": "application/xml",
    });

    res.end(contents);
  }
</script>

<svelte:options namespace="xml" />
<feed xmlns="http://www.w3.org/2005/Atom">

  <title>Tiffany's Blog</title>
  <link href="/atom.xml" rel="self" />
  <link href="" />
  <updated />
  <id>tiffnix.com</id>
  <author>
    <name>Tiffany Bennett</name>
  </author>
  {#each posts as post}
    <entry>
      <title>{post.title}</title>
      <link href="/blog/{post.slug}" />
      <updated />
      <id>{post.slug}</id>
      <content type="html">{post.html}</content>
    </entry>
  {/each}
</feed>
