<script context="module">
  export function preload({ params, query }) {
    return this.fetch(`wiki.json`)
      .then((r) => r.json())
      .then((rawPosts) => {
        const posts = rawPosts.map((post) => ({
          ...post,
          updated: new Date(post.updated),
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

  const sortedPosts = [...posts].sort((a, b) => b.updated - a.updated);
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
  <title>Wiki - Tiffany Bennett</title>
</svelte:head>

<h1>Wiki Pages</h1>

{#each sortedPosts as post}
  <div class="post">
    <a href={post.url}>
      <h3>{post.title}</h3>
    </a>
    <p class="date">Last Updated: {format.format(post.updated)}</p>
    <blockquote>{post.summary}</blockquote>
  </div>
{/each}
