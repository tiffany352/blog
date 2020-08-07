# Experiences in Multi-Threading

## IntenseLogic and Motivations

IntenseLogic is the game engine that I've been working on for nearly two years. It has a long history of me changing things to make sure the internals are sound. In the choice of "cheap, fast, sane, quick to develop: Pick 3" I picked everything but quick to develop.

I recently started getting sick of the annoying limitations that were being introduced by trying to run asynchronous timers in addition to rendering on the same thread. The problem lies in SwapBuffers(): The only way to implement vsync properly is for SwapBuffers to block, which prevents the asynchronous timers the rest of the engine uses to fire properly, and the CPU ends up starving. The hack I had been using up to this point was to set the async flag so that SwapBuffers wouldn't block (which, by the way, your GPU driver control panel can override), and then implemented my own rate limiter (which was arbitrarily chosen as 60 fps, because there's no way to query the FPS limit of a window, in GLFW at least).

Because there's no sane way to run rendering and an event loop on the same thread, I decided to switch to using a dedicated rendering thread.

## The Refactor

As part of this change, I had to change how the engine represents ways to draw things, and introduce message passing constructs at this level. This is why the refactor took as much time as it did, and why it was so difficult. I had to change every single caller of OpenGL functions, completely rewrite how the engine handles textures, and there's still much work to do before the legacy code stops pushing boilerplate into new code. The following are the methods defined on the `ilG_renderable` typeclass (at least, as close as you can get to typeclasses in C), which represents every single way to draw something within the engine.

- The draw method is called every single frame to actually draw things on the screen, obviously. Can only be called from the render thread, because that's where the context is bound.
- The build method is where all of the things you need to do to setup to render, like uploading VBO data and textures, is done. This takes a parameter of `ilG_context`, which contains some useful information like the screen size. Can only be called from the render thread.
- There's a function to push a message (which immediately calls the message() function if the render thread isn't yet running).
- Several commonly defined messages (add a child renderer, attach an object, attach a light source, remove each of those).
- The message function is a function which takes an integer describing what kind of message it is (which is where the previously mentioned common messages come in: they're all ints). This is called on the render thread when it exists.

There is a downside in that it increases the size of the code required for a barebones renderer, but I expect this to be resolved in both reducing the need to fully define new renderers, and with macros to reduce the size of the boilerplate.

The vast majority of the bugs were because of dealing with the spaghetti of state that is OpenGL, which got stirred up by the major restructuring of how the engine renders. Not because of the threading itself.

## Threading

All communication is done with message passing, the way this works is that the `ilG_context` has a lockless queue in it which is checked for messages at the start of each frame. The reason it's done at the start of each frame is to prevent it from mangling GL state in non-debuggable ways. In addition, it is done at the start of the frame in order to prevent mid-frame changes which cause weird artifacts when multiple dependant updates happen in sequence (as an example, removing an object and putting a new one in the same place will cause popping or overlapping if mid-frame updates are allowed).

When I did the initial switch, I encountered a bug with GLFW which I was unable to solve, and asking on IRC was going nowhere. For some reason, no matter what I did, GLFW would not register any user input. I knew that I had to call glfwPollEvents from the main thread, and that is exactly what I had been doing.

I ended up switching to SDL, which had some of its own problems. SDL defaults to 8-bit graphics, using a 3:3:2 RGB. This has a bug on intel where the screen gets squished to the left side of the window, filling the right side with random garbage from the rest of your desktop. This is what clearing to `#0000FF` (a very bright blue) looked like using default SDL window creation settings:

![This image shows the bug within SDL. It features a window, with the left side full of a dark blue, and the right side full of bits and pieces of my terminal emulator and browser.](http://i.imgur.com/ahOQPwI.png)

It took me several days to debug the issue, because I was so alarmed by the graphical corruption that I hadn't taken the time to notice that the actual window contents were in 8-bit quantized colour. I don't know why SDL defaults to state-of-the-1980s graphics, and weird API quirks like that have been pretty annoying as I started using different parts of SDL.

Not quite everything uses message passing yet, there is still some shared memory. Updates to objects in the world (position, velocity, etc.) are not synchronised, which may result in artifacts. I plan to eventually remidy this.

## Conclusion

The reputation of multithreading is that it's hard, full of bugs, nondeterministic, that you should avoid it at all costs. It's not nearly as hard as everyone says, so long as you do it right.

Message passing is the default communication primitive in languages like Rust and Go. It's that way for a reason. Message passing makes all of the states and exchanges explicit. If there's a stateful protocol over the message passing channel, then it will be well defined and easy to debug (all race conditions can be solved by drawing out a graph and looking for timing issues, and inserting barriers where needed).

The bad reputation of threading comes from languages like Java, Delphi, C++, where the default reaction to inter-thread communication is mutexes and shared memory. This is the wrong way to approach the problem, and I'm not going to go into why in this post.

I by no means say that it is something you should throw everything at and expect it to work just fine, you still have to think carefully about interactions between threads.
