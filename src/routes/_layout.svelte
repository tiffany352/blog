<script>
  import Nav from "../components/Nav.svelte";

  export let segment;
</script>

<style>
  .container {
    display: flex;
    flex-direction: row;
    justify-content: center;
  }

  main {
    width: 40em;
    max-width: 100%;
    padding: 0;
    font-family: "Segoe UI", "San Francisco", sans-serif;
    background-color: #eee;
  }

  @media screen and (min-width: 40em) {
    main {
      margin: 1em;
      border: 1px solid black;
      border-radius: 10px;
    }
  }

  article {
    padding: 1em;
  }
</style>

<div class="container">
  <main>
    <Nav {segment} />
    <article>
      <slot />
    </article>
  </main>
</div>
