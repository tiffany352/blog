<script context="module">
  export function preload({ params, query }) {
    return this.fetch(`posts.json`)
      .then((r) => r.json())
      .then((rawPosts) => {
        const posts = rawPosts.map((post) => ({
          ...post,
          date: new Date(post.date),
        }));
        return { posts };
      });
  }
</script>

<script>
  export let posts;

  const format = new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
  });

  const sortedPosts = [...posts].sort((a, b) => b.date - a.date);
</script>

<svelte:head>
  <title>Tiffany Bennett</title>
</svelte:head>

<h2>Tools</h2>

<!-- prettier-ignore -->
<ul>
  <li>
    <a href="https://rinkcalc.app/">Rink</a>,
    a tool for doing calculations with units.
  </li>
  <li>
    <a href="https://tiffnix.com/unicode/">Unicode Visualizer</a>,
    a web app for viewing the breakdown of Unicode strings.
  </li>
  <li>
    <a href="https://github.com/tiffany352/twitter-archive-browser">Twitter Archive Browser</a>,
    an Electron app for browsing Twitter data archives.
  </li>
</ul>

<h2>Posts</h2>
<ul class="posts">
  {#each sortedPosts as post}
    <li>
      <span>{format.format(post.date)}</span>
      &raquo;
      <a href={post.url}>{post.title}</a>
    </li>
  {/each}
</ul>
