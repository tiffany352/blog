<script>
  import { stores } from "@sapper/app";
  const { page } = stores();

  export let href;
  export let icon;
  export let text;

  $: highlight = $page.path == href;
</script>

<style>
  a {
    text-decoration: none;
    padding: 0.75em;
    border-bottom: 2px solid transparent;

    --color: rgb(78, 78, 78);
    color: var(--color);
    stroke: var(--color);
  }

  @media screen and (max-width: 40em) {
    a {
      padding: 0.3em;
    }
  }

  a[data-highlight="true"] {
    --color: rgb(145, 99, 0);
  }

  a:hover,
  a:focus {
    --color: rgb(60, 13, 78);
    border-bottom: 2px solid var(--color);
  }

  svg {
    vertical-align: sub;
  }
</style>

<a {href} data-highlight={highlight}>
  <svg width="24" height="24">
    <use href="/icons/nav-icons.svg#{icon}" />
  </svg>
  {text}
</a>
