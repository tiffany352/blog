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
    dateStyle: "long",
  });

  const sortedPosts = [...posts]
    .sort((a, b) => b.date - a.date)
    .filter((post) => !post.slug.startsWith("test"));
</script>

<style>
  .date {
    color: rgb(100, 100, 100);
    margin: 0.5em 0;
    font-size: 0.9em;
  }

  .post {
    border-top: 1px dashed rgb(90, 90, 90);
  }

  h3 {
    margin-bottom: 0.25em;
  }

  blockquote {
    font-style: italic;
    text-overflow: ellipsis;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
</style>

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

{#each sortedPosts as post}
  <div class="post">
    <a href={post.url}>
      <h3>{post.title}</h3>
    </a>
    <p class="date">{format.format(post.date)}</p>
    <blockquote>{post.summary}</blockquote>
  </div>
{/each}
