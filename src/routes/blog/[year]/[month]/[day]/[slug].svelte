<script context="module">
  export async function preload({ params, query }) {
    // the `slug` parameter is available because
    // this file is called [slug].svelte
    const res = await this.fetch(
      `blog/${params.year}/${params.month}/${params.day}/${params.slug}.json`
    );
    const data = await res.json();

    if (res.status === 200) {
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
</svelte:head>

<h1>{post.title}</h1>

<span class="date">{format.format(new Date(post.date))}</span>

{@html post.html}
