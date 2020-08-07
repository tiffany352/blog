<script>
  import Nav from "../components/Nav.svelte";

  export let segment;
</script>

<style>
  main {
    max-width: 40em;
    padding: 0;
    border-style: solid;
    border-width: 1px;
    font-family: "Segoe UI", "San Francisco", sans-serif;
    background-color: #eee;
    font-size: 20px;
  }

  article {
    padding: 1em;
  }
</style>

<main>
  <Nav {segment} />
  <article>
    <slot />
  </article>
</main>
