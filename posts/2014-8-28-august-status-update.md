# August Status Update

It's been a few months since my last post and a lot about how IntenseLogic works and how I design software has changed.

## IntenseLogic

First up, my flagship project. These paragraphs are organized in roughly chronological order, but it's kind of hard
to remember the order of changes you made weeks ago.

The Lua bindings have been completely abandoned due to being far too complex to maintain. They're not worth keeping
around anymore. The demos have all been rewritten in C or C++.

IntenseLogic is now a set of libraries, rather than what would really be considered a game engine. In order to make this
possible, some code changes and simplifications took place. In particular, the engine had to stop taking ownership of
the main thread. This meant removing the `libevent` dependency, removing async events from the event system, and
exposing a function to poll for SDL events as part of the input library. Because of this, it is now far easier to handle
command line arguments as part of your own code, as you own `main()`. In order to use IL, you must now make your own
`main()`, and one is provided as `examples/main.c` and `examples/main.cpp`. It may also be of interest to examine how
the demos use `main()`: `demos/main.c`.

The renderer has been updated from the typeclass-based version presented in
[Graphics Refactor Plans](../../../2013/07/27/graphics-refactor.html). It now uses a
[Data-Oriented](http://www.dataorienteddesign.com/dodmain/) design which allows for much better performance, reducing
state invalidation, and reducing boiler plate; Previously, boilerplate was required to implement useless methods like
`get_storage()` and `get_complete()`. This approach has convinced me that Data Oriented Design is the paradigm I should
be using for game development, and it has been very rewarding so far. The current rendering infrastructure has far fewer
cache misses, far lower complexity, and is a much smaller mental burden than any previous generation, or any other model
I can think of. I use the paradigm wherever I can, though not everywhere. I absolutely love how I can use its own flavor
of polymorphism, as well as how much I can avoid boiler plate while maintaining extensibility and clarity.

I've switched to Tup for builds. This has made the process of building IL much simpler compared to SCons. Tup has many
advantages, such as being very smart about determining which files need to be rebuilt. When you set the Tup binary as
SUID (SUID is needed to create a chroot for intercepting paths outside of the project root) and set `updater.full_deps`
to `1`, it will see that files outside of the repository have changed (such as updating an important library) and
rebuild all of the files which are affected. The Tupfiles that now populate the source tree are
much simpler than the SCons build files were, and it is significantly faster both in respect to startup time and time
between building files. Tup also has a feature called "Variants", which allow me to have multiple versions of the binary
built at once. Currently, this comes in the form of multiple variants under `configs/`: asan (Address Sanitizer +
Undefined Behavior Sanitizer), debug (debug symbols and -O0), release (LTO, -O3, fast math). This means that I can run
the release binary to see the full performance, the debug binary under lldb/gdb, and the asan binary when there is some
kind of memory corruption. Before, I would have to manually flip flags to get these various versions, and it was
irritating to have to switch between the ASAN version (which breaks the debug info), and the debug version (which has
working debug info under gdb/lldb).

While switching to Tup, on a whim I decided to try out static linking, and I believe it to be the right direction.
Before, each directory under `src/` was compiled as a separate shared library, with standardized entry points to load
that library, which were located through the use of libdl.
This required `LD_LIBRARY_PATH`, extra command line arguments, prevented LTO from inlining functions across library
boundaries, would load extra code into memory you weren't necessarily using, and flood log messages if the plugin
directory contained files other than plugins. When I originally implemented this long ago, during an early version of
IL, it was because I was afraid of having a huge function full of nothing but calls to initialization functions.
As the code matured, my fear was shown to be wrong, as I had fewer and fewer global variables, and therefore had little
need for these initialization functions, eventually making the plugin loading system have zero tangible benefit.
In the current version, it's down to just two: Setting up logging and SDL. I may eliminate the initialization for
logging in the future. I might also decide to push SDL initialization out of the scope of IL, and into the game using
it, which would allow the use of other windowing libraries.

The view I've taken on since the plugin loader has affected many of my design decisions of the past few weeks. I've been
culling unnecessary code from IL, shrinking its scope, and replacing complex systems with very simple ones. My current
goal is to produce as simple of a codebase as possible, rather than one which achieves some useless metric of
over-abstraction. Because of this, the control flow during initialization and runtime is much clearer and
user-controlled, as well as the code in general being smaller and simpler. For example, here are some of the things
I've culled or replaced:

- The earlier mentioned removal of Lua bindings and ownership of the main thread and `main()`.
- The VFS layer has been replaced by something far simpler, rather than a manually-implemented typeclass mess.
- The remainder of references to Lua in the code have been removed - Lua is out of scope of the project now.
- The demos no longer use the plugin loader whatsoever - they simply link statically to the parts of IL that they need.
- The use of `libevent` and ownership of main() and the main thread is completely gone.
- Many global variables are now gone, which has reduced the amount of initialization calls needed.
- Parts of the code which were very old and more or less useless are gone, such as `alloc.h`.
- I've massively simplified `il_string`, from a large mess to a simple length/value struct and a few helper functions.
- `il_base`, `ilG_bindable`, `ilG_drawable3d` have all been purged from the codebase.
- The GUI code has been removed. I am currently working on a new library dedicated to GUIs using OpenGL to replace it.
- Parts of the graphics code have been pushed out to a separate library called [tiffgl](https://github.com/tiffany352/tiffgl/).
- The dead network code has been removed.

I still have many areas that need touching up, but I feel like I'm becoming happy with the code of it. The number of
items on the "Architecture" list on the [Trello](https://trello.com/b/pOWMId8i/intenselogic) has been in decline since
I started cleaning up the codebase. Future directions for improvement are detailed there.

Besides massive engine simplification, there are several new parts of the architecture which improve IL's flexibility;
The context code exposes functions for you to setup your own render thread, or run rendering on the main thread. Custom
coordinate systems are possible now, which means that if you run into rounding errors you can bump up to double
precision positioning, or fixed point. The custom coordinate system interface simply requires you to spit out matrices
according to the needs of various renderers (model-view-projection, inverse-flipped-model, etc.).

Aside from infrastructure changes, there are some new features in IL as well. Initial MSAA support has been added, a
sunlight renderer has been added.

## TiffGL

TiffGL is a new library that I've been developing. Its main purpose is to factor some of the rendering primitives out of
IL so that the GUI library I'm developing can take advantage of them. It is currently not very far along, but it
provides support for FBOs, fullscreen quads, basic shader handling, and a simple VAO abstraction. I plan to add support
for instanced rendering and a few extensions in the future. There are several places where instanced rendering would
provide performance improvements currently.

## Scripter's Haven

I've started rewriting [Scripter's Haven](https://github.com/TheCodeLab/Scripters-Haven). It will likely have a smaller
scope than originally envisioned. It's written in C++. I started on a simple idiomatic C++ binding of IL's types and
functions and I'm not sure how much I like it so far. My plans with this are to implement an FPS game to bulk up the
code and then start working on what was originally envisioned. I plan for this project to be a good basis for other
games, meant to be forked. It picks up the scope where IL was originally supposed to support, as an actual game engine
rather than just a library. Several of my plans for IL will likely end up here instead, as it will be easier to
integrate them with an existing codebase than to try to make some super-generic mechanism. For example, the developer
interface will likely be part of SH instead of part of IL, as it will be able to more thoroughly integrate that way. I
will likely try to keep such features portable, but I no longer want to create a single project which serves the needs
of absolutely every game. I'd rather produce many small libraries which can be mixed and matched.

## SpaceGame

This is a project I've been working on with a few other developers which is still more or less secret. I don't want to
get anyone's hopes up too much before it has a working demo I can show people. A few people know about it because I
can't help but showing it off from time to time. It is currently the main user of IL, and has influenced its design
significantly since I started working on it. Custom coordinate systems were added primarily for this reason.

## GUI Library

I'm working on a GUI library built around OpenGL. It is not very far along, but I do have plans for it. The main goals
are to have an easily embeddable C library for GUI rendering. I wish I could have used an existing toolkit such as EFL,
but none of them would allow me to embed it within a game, they all wanted to own the main thread (and sometimes even
`main()`!). Because of this, I've been pretty much forced to create my own library. Features I wish to include are text
rendering, widget layout, and a modular design that separates user input, drawing, and the scene graph. I will likely
include a theming mechanism someday, but I will use a separate library for actually loading in themes - there will
simply be hooks exposed for changing the themes of various widgets.

## Language Projects

I am in a sort of limbo with this right now. I originally wanted to create frscript, and I was working out a design, but
my world was turned upside down by logic programming and I scrapped it. If I do continue trying to build my own
programming language, it will be a system's programming language similar to C, but oriented towards data oriented
design, and exposing more LLVM types such as native vectors. It would target LLVM, and perhaps be reasonable as a
scripting language which can be JITed and loaded in at runtime. I have several plans for scripting in low level
languages, influenced by [Runtime Compiled C++](http://runtimecompiledcplusplus.blogspot.com/). I can't really use RC++
itself, as it is CMake-based and operates with virtual classes as the unit of compilation.

## Rust Explorations

I've been keeping track of [Rust](http://www.rust-lang.org/) since version 0.3, a promising system's language which is
type-safe as well as memory-safe, using many zero-cost abstractions which make it still feasible as a system's language.
It has pointers that any C programmer should be able to pick up quickly, and can express many of the same things.
There are several things which you can't express because their safety is unprovable, such as multiple mutable references
to the same memory location (everything is immutable by default, so this isn't as big a problem as it first appears).
I've been thinking of places where I could begin to use Rust, and I don't think I will write anything significant in it
until version 1.0 (which promises forwards compatibility to future versions), expected to come out later this year.
I've written a few things in Rust lately, and I've been somewhat happy with how it works. There are a few things which
are unfortunate, such as it not being quite as deep into the realm of Functional Programming as I would like. There's no
higher-kinded types, and therefore no Monads or Functors. There are some data oriented constructs which can be difficult
to express in Rust, because of how borrowed pointers work. I've implemented part of FRP with some careful design, as
well as written a very simple demo for IL.
