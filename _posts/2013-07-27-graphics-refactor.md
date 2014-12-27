---
layout: post
title: Graphics Refactor Plans
---

# {{page.title}}

Instead of the current setup in which rendering for an object fails if
the drawable, texture, or material have any sort of mismatch, there
would be only one structure: a Renderer.

The Renderer structure would contain that which is currently split
across 3 different structures. Its job would be to take all of the
components (each VBO making up the mesh, all of the texture resources,
constants such as ambient light levels, and the effect file) and
create a working way to draw any given positionable. This will not be
as efficient as the previous setup in terms of bind/unbind calls, but
it will be more powerful.

This would coincide with the addition of an effect file parser, and a
simple preprocessor for shaders.
([example](https://gist.github.com/tiffany352/6097238)) Effects can be
created for multiple GLSL versions, with or without major engine
features such as HDR, MSAA, deferred shading; and with or without
other resources within the render, such as the presence of texture
coordinates or specular maps.

This will also allow very simple live-editing of in-game options,
making it so the engine will almost never need to be restarted. In
addition, it will simplify in-game shader recompilation, and hot
reloading of shaders. It will also simplify the object tracker, and
the overall rendering path, as well as implementing most of what's
necessary for render clusters.

In addition to splitting rendering into external threads, it will make
it vastly simpler to support multiple OpenGL versions - there will be
a very confined area where all of the OpenGL calls are done. The
following file list is, roughly, where all the calls would be located:

- context.c, for window resizing and similar operations
- renderer.c, for interop between resources
- material.c, for its existing purpose: compiling and executing
  shaders
- mesh.c, for its existing purpose: uploading VBO data
- texture.c, for its existing purpose: uploading texture data
- constant.c, for uploading per-object data such as global ambient
  values and other uniforms. Should have a way to put user-specified
  data in the future, but this will require a lot of boilerplate code
  to interact with all of the glUniform calls.

The scene graph hierarchy, after all of my planned refactors, will be
something along these lines:

<!-- Stupid hack because jekyll won't add links to view inline images
directly:
[![Scene Graph](../../../images/2013-07-27-scenegraph.png)](../../../images/2013-07-27-scenegraph.png)
-->
[![Scene Graph](../../../images/2013-07-27-scenegraph.png)](../../../images/2013-07-27-scenegraph.png)

- Filled in arrows mean a one-to-many relationship
- Empty arrows mean a one-to-one relationship
- No arrow mean many-to-many
- Empty diamonds mean 1:1 or 1:0
- Dotted lines mean that the handle is an int rather than a pointer

* * *

* Contexts manage the global OpenGL state. They contain bits of
  information, such as currently bound objects, the active viewport,
  and the window size.
* Viewports manages rendering of scenes, and contain a number of
  stages. They can be used to implement in-game security cameras and
  such.
* Stages represent one pass of rendering, such as for deferred shading
  or HDR tonemapping.
* Renderers are all of the data needed to render an object - VBOs,
  shaders, textures, uniforms.
* Worlds are 3-dimensional spaces containing objects and other
  information for describing the world - this is shared by both
  graphics and physics.
* Positionable are objects that can be positioned in the world.
* Cameras are the point of view for the Viewport, and contain
  information like the projection matrix and position/rotation of the
  viewer.
