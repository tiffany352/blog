<script>
  import NavItem from "./NavItem.svelte";
</script>

<style>
  nav {
    display: flex;
    flex-flow: row wrap;
    justify-content: flex-start;
    border-bottom-style: solid;
    border-bottom-width: 1px;
  }

  @media screen and (min-width: 40em) {
    nav {
      padding-left: 0.75em;
      padding-right: 0.75em;
    }
  }

  .spacer {
    flex-grow: 1;
  }
</style>

<nav>
  <NavItem text="Home" icon="home" href="." />
  <NavItem text="About" icon="info" href="about" />
  <NavItem text="Twitter" icon="twitter" href="https://twitter.com/Tiffnixen" />
  <NavItem text="GitHub" icon="github" href="https://github.com/tiffany352" />
  <NavItem text="Keybase" icon="key" href="https://keybase.io/tiffany" />
  <div class="spacer" />
  <NavItem text="" icon="rss" href="atom.xml" />
</nav>
