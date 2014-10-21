---
layout: post
title: Replacing the file-system in an operating system
---

# {{page.title}}

One thing that has always complicated application development and
slowed down startup times, and is especially important in the mobile
world, is the time and effort spent loading up files off of the
filesystem, and parsing them from an intermediate representation (png
images, json databases, etc.) into something actually usable. This
time spent is wasted at a critical point in the time used by an
application. If it were to go away, starting up a program like an
email client could be so fast you wouldn't be able to tell it wasn't
already running.

Before you call me crazy, I will attempt to explain myself. Think
about what we use a filesystem for:

* Cached files and other miscellanea.
* User data that survives between "sessions" (which are rarely
  considered, and is usually attributed as a property of a process).
* Modification and introspection by other programs.

Now, you ask, what is it I want to use to replace the file system
with? Well, think about it for a second. What do we have in nearly
every programming language in existence that can store user data,
caches, etc. and can easily be mapped to a disk, and interfaced with
other programs? Structures, classes, or whatever other data type you
can name. You can map the data from the disk, through some facility,
and have an interface in the standard library for things like images,
sounds, databases, and whatever else you might want to store. You
could even have a way of storing the data hierarchically, like a plain
old filesystem!

Now it would seem as if we've come full circle, as modern operating
systems already do all these things. Many languages have a standard
interface for images and such, they have memory mapped files, and many
languages have fully introspectable object types. So what am I getting
at?

A tightly coupled operating system and language, in which there is no
filesystem; There are discrete "Sessions" or similar, in which act
like a heterogeneous, introspectable pool of native resources for an
application.  With all of this, the user would never have to worry
about parsing image files, or have to worry about startup
time. Starting a program would consist of mapping the pool of
resources into memory, and calling a function to notify the program
that it has been started again (like main(), but without having to
initialize this pool). Application startup would become virtually
instantaneous.

What about when I decide to move my application settings or contacts
or what have you to a new system? There could be programs to export
resource pools into a platform-independant format (png files, json
databases, etc. all wrapped up into a nice tarball, for example).

I'm sure by now you have developed the same worry I had - what if
someone uses a non-standard interface for their files? However, this
question is not very productive: there is virtually no difference
between this and using a non-standard image, sound, database, video,
etc. format in a traditional filesystem. In fact, this might even be
better - a single application that implements the interface for a
given filetype would implement that filetype for every program on the
system!

Another concern could be the space used - storing this data
uncompressed would be a huge waste of disk space. If this was an
issue, then the operating system could take large objects and compress
them intelligently (such as using png on images), or even compress the
whole resource pool.
