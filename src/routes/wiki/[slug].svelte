<script context="module">
  export async function preload({ params, query }) {
    // the `slug` parameter is available because
    // this file is called [slug].svelte
    const res = await this.fetch(`wiki/${params.slug}.json`);

    if (res.status === 200) {
      const data = await res.json();
      return { post: data };
    } else {
      this.error(res.status, data.message);
    }
  }
</script>

<script>
  export let post;

  const format = new Intl.DateTimeFormat(undefined, {
    dateStyle: "long",
  });
</script>

<style>
  .date {
    color: rgb(100, 100, 100);
  }
</style>

<svelte:head>
  <title>{post.title}</title>

  <meta property="og:title" content={post.title} />
  <meta property="og:type" content="article" />
  <meta property="og:description" content={post.summary} />
  <meta property="og:site_name" content="Tiffany's Blog" />
  <meta property="og:article:modified_time" content={post.date} />

  <meta name="twitter:card" content="summary" />
  <meta name="twitter:creator" content="@Tiffnixen" />
</svelte:head>

<h1>{post.title}</h1>

<span class="date">Last Updated: {format.format(new Date(post.updated))}</span>

{@html post.html}
