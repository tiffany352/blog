<script>
  import About from "./about.svelte";
  import posts from "./blog/_posts";
</script>

<svelte:head>
  <title>Tiffany Bennett</title>
</svelte:head>

<div id="home">
  <ul class="posts">
    {#each posts as post}
      <li>
        <span>date</span>
        &raquo;
        <a href="/blog/{posts.slug}">{post.title}</a>
      </li>
    {/each}
  </ul>
</div>
