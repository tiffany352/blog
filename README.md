# Tiffany's Blog

This is my blog, hosted at <https://tiffnix.com/blog>. It's built in
TypeScript using Sapper and is exported into a set of static HTML/JS
files.

Being a Sapper app, once the initial page load finishes it actually
becomes an SPA and starts serving pages by fetching a tiny json endpoint
and rendering them in your browser.

The reason I put it on GitHub is to serve as a reference to anyone else
trying to build something similar. Feel free to take inspiration from
this project, although I don't recommend directly copying it.

## Features

- Very easy to customize because it's a web app rather than using some
  framework like Jekyll.
- Has support for blog posts, as well as a wiki.
- Atom feeds. (`src/routes/atom.xml.ts`)
- Posts are written in Markdown with syntax highlighted code fences.

## Deployment

This is mostly to remind myself since I forget sometimes. These scripts
are specific to my setup.

```
npm run export
npm run deploy
```
