# Refactoring Legacy Code

I've taken up maintaining a project that my friend Darkflux works
on. It's called Fate of the Republic (FotR), a Star-Wars
[MUD](https://en.wikipedia.org/wiki/MUD). The website is
[fateoftherepublic.com](http://fateoftherepublic.com), and you can
connect via Telnet to
[fateoftherepublic.com:1313](telnet://fateoftherepublic.com:1313).

## About MUDs and FotR

MUD is short for Multi-User Dungeon, a name from the days when they
were specific to the fantasy genre (many were based on D&D). They are
text-based, with many users playing on the same server. The code for a
MUD is often closely guarded, as code stealing is rampant in the MUD
community - even FotR has had its code stolen. They're the precursor
to player-driven MMOs. There's no graphics, so the focus is entirely
on game-play and role-play, instead of on graphics and
performance. They usually have very deep mechanics - skill systems,
professions, intricate weapons, player-run vendors and quests,
crafting, space-ships and other possessions which can be bought,
created, destroyed, and sold.

FotR is a MUD that has been running for many years. It's based on a
lineage of MUDs: SMAUG, Diku MUD, Star Wars Reality, and Rebellion in
the Stars. It's a fairly unique MUD, it has many features which
differentiate it from other MUDs and the lineage it is derived
from. It's a bit difficult to get into, but once you get going it's
very fun. I suggest hopping on and trying to get to citizen level 10
before judging it. It's pretty hard to get around on your own at first
though, so you might want to ask someone who's played a bit.

Here's the current staff of FotR:

- Tiffany (myself), developer
- Darkflux, developer
- Asher, sysadmin
- Iselka, admin and community manager

So what makes this a legacy code-base?

- It's written in 200 000 lines of procedural C (compiled as C++,
  because of a handful of places with std::vector and classes
  sprinkled in by a previous maintainer)
- Thousands of global variables
- Broken support for long-dead compilers and OSes from the early 90s
- Thousands of compiler warnings
- Completely broken code formatting - some places had been indented so
  close to the edge of the author's screen that they started indenting
  backwards
- Huge procedures, some are two thousand lines long
- Screwed up control flow in many places, which makes the code hard to
  decipher
- Massive code duplication
  - Commands are only passed a string for the stuff that came after
    the command, and they have to parse the contents themselves
  - Have to manually check if the character which ran the command is
    allowed to, or capable of (doing stuff while sleeping, while dead,
    preventing NPCs from running certain commands, and so on)
  - There's some utility functions for this, but there's different
    utility functions for different files, and some of them are
    straight up duplicated (`smash_tilde()` vs `smush_tilde()` - they
    do the exact same thing).
- Pervasive use of static character buffers: functions which return
  strings almost always return a pointer to a static buffer
- Large amounts of hard-coded behavior

Note that this is in no way unique to FotR. Most MUD code-bases are
several decades old. There haven't really been new MUD code-bases for
over 10 years. Most of them are and have always been maintained by
inexperienced programmers.

## The Long Road of Improvement

We transitioned from SVN to Git. It wasn't always under SVN, however,
in the past it was not under version control. Darkflux set up SVN in
2009, and the other maintainer didn't trust it, so it wasn't until
they left that things were actually deleted when they were no longer
needed. The detritus in the repository was never removed though -
there were still many years-old `.save`, `.bak`, and blocks of
commented out code sitting around.

`clang-format` was run on the entire codebase, which fixed the
indentation issues, and some others, but not all of the
problems. Unless clang-format gets more option for fixing those
problems, it's likely the codebase will never be entirely
consistent. In particular, same-line vs next-line braces on functions,
control flow, and structures, as well as missing braces on control
flow. I found multiple bugs while fixing warnings regarding ambiguous
control flow with missing braces.

Support for old compilers that didn't support features like type
signatures in function declarations was removed, as well as code for
supporting ancient operating systems like AIX (I'm pretty sure this
didn't work anyway, so not much was lost). I replaced the `TRUE` and
`FALSE` macros with the `true` and `false` keywords from C++.

All of the warnings were corrected. There were many thousands of
them. This task alone took me many hours, and was very mechanical. In
the process I found multiple obvious memory bugs that clang warned
about - returning pointers to stack values from functions, using
garbage data from uninitialized stack values, undefined behavior
related to bool. In the process, I ended up breaking code in a few
places which had particularly strange control flow. I also found a
back-door in the MUD that was inserted by a previous maintainer. By
far the largest warning to fix was multiple thousand invalid casts
from a string literal to `char *` (you can only use `const char *` for
string literals). The only warning I could not fit was
`-Wformat-security`, there were places in the code where a function
was called on a format string before passing it to a `*printf`
function. There doesn't seem to be a way to even massage the code to
make the warning go away, so I simply disabled that warning. The code
now compiles with no warnings or errors under `-Wall -Wextra -pedantic-errors -pedantic -Wno-format-security -Werror`.

`mud.h`, the primary header file which is eighteen thousand lines
long, was reorganized so it is easier to find declarations - the file
is more than ten thousand lines long. This took several hours, and
wasn't really something I could automate in less time than it took to
actually do. I also split out many `#define`s for configuration and
hard-coded maximums into a file called `params.h`, so it's easy to
find them in case we ever want to make the values
runtime-configurable, and so we can find and remove some of the
hard-coded limits built into the MUD. Optimally, there should be no
more defines in `params.h` in the future.

A Tup build was added; The default compiler was changed to clang++. I
was ready to actually get some code written.

A major crash bug was fixed which was caused by deletion-unsafe list
iteration; Some code was swapped to std::string (this majorly
simplified some places, which had standard copy-and-paste boilerplate
of if-string-is-non-null free-string,
set-string-to-heap-allocate-this-string).

Some features have been added, like the ability for quests to expire
in the quest system, an "are you sure" for `do_junk` (because it's
easy to accidentally delete something you didn't mean to, as some
items have similar names, and searching for items is fuzzy). I fixed
text re-flowing in the built-in editor. I added unit tests where I
could, using
[Google Test](https://code.google.com/p/googletest/). There are unit
tests for the quest system, and the text editor. The unit tests
massively helped me develop these fixes and additions.

I've been reading
[Working Effectively with Legacy Code](http://www.amazon.com/Working-Effectively-Legacy-Michael-Feathers/dp/0131177052)
by Michael Feathers, and it has shown me how useful unit testing can
be while updating a code-base such as this one. I fully intend to use
the methods shown in this book to make the code in the MUD more
testable where I can.

We've also been trying to do more pair programming. Less bugs occur
while we pair program - it's easier for the other to catch something
that's tricky. We have yet to find an effective way to pair
remotely. The main problem is that the best way to pair seems to be
sharing a Tmux session of Vim or Emacs, but I don't have a very good
internet connection, so there's a lot of latency, which makes edits
really frustrating.

## Future directions

We've been accumulating ideas on how to do major structural changes to
the MUD, which would reduce the amount of duplicated code, fix cross
cutting concerns, and generally make it easier to change stuff without
having to recompile the MUD.

I suspect a proper command parser would simplify away at least 20 000
lines of code from the MUD. For example, _more than half_ of the quest
system's thousand lines of code is the `do_quest` command, which just
makes checks like if the runner of the command isn't an NPC, if the
runner of the command can offer quests, and so on.

It's hard to fix typos in the code, because you have to recompile the
MUD, push to the testing server, and then do a copyover (which
in-place replaces the MUD binary, without dropping connections) so
that we can see the changes and make sure they're right. It's hard to
experiment with coloring command output when you have a multiple
minute edit cycle. I came up with the idea that we could create a DSL
to template out the responses of commands, so they could be updated at
run-time, and commands would just return a dictionary of their return
values.

There's many places in the code which have hard-coded checks against
certain types of items. It would be nice to have an attribute system
for items, like "this item is not junk-able" or "this item cannot be
renamed" which is applied to items such as grenades that are counting
down, or very special items which it is almost certainly a mistake to
throw away. These are currently hard-coded into their relevant
commands, which adds a large amount of if checks that bloat the
code. In general, many of the issues with the code are because of
stuff being done at compile-time without meta-programming. We want to
eliminate this duplicated code by making the MUD as a whole more
data-driven.

Some of the large structures need to be broken up. The character
structure is 250 lines (that's just variables, not member functions or
anything). I want to create a component architecture so these things
can be separated out. There's a great deal of places in the code which
are arbitrarily limited to one or a set number of something because
that's how many fields there are for it in the structure. These are
things which should be replaced by component relationships. For
example, each room can only have one security camera, and it would be
preferable for there to be more than one security camera. As it
stands, this requires turning the camera in the room structure from a
single value to an array or vector, as well as finding a way to
serialize the structure to disk (further discussion
below). Preferably, a camera would be a component, and there would
simply be a room ID in the camera component which points to the room
it's in, and then the room would be able to have an arbitrary amount
of cameras without much effort. This is similar to how data
normalization works in relational databases.

The serialization system could be improved. As it stands, each
structure independently has a set of serialization routines which save
the files as plain-text files on the disk. Besides being prone to data
corruption should the mud crash mid-save (which is highly likely -
saving requires iterating through all of the structures in the
universe, and if any one of them is a dangling reference, or `NULL`,
then the MUD will crash), these files have massively duplicated code
to actually serialize with. Every single structure has a hundred lines
or so to load the structure from disk, and another hundred or so to
save to disk. Everything is done with stdio - `FILE*`s and some helper
functions. Preferably, we'd build a serialization API where you can
plug in structure values and it handles the rest for you, such that we
can eventually swap over to another format, such as an SQL database
(which are frequently transactional, and don't have issues with
corruption). After that, we could slowly transition to updating the
database every time we update the in-memory structure, so that a crash
will lose even less data.

The save file format, specifically, is a series of keys, followed by
arbitrary white-space, with a value. The type is determined by the
code reading it. Strings are terminated with a `~` character to allow
arbitrary embedded newlines, which requires smashing all `~`
characters in any serialized strings (which means you cannot set your
character's description to "kawaii desu~"). Records are terminated
with a `$` character on its own line. Usually, a file will consist of
all of the entries of that type in the entire game, each ending with a
`$`, and finally ending the file with a \$. Encountering an `EOF` is
therefore a bug, and is sometimes reported, and almost always
recovered from. Encountering an `EOF` can be caused by a file being
empty, which it shouldn't be, or a file being unfinished, as would be
caused by the MUD crashing.

As we change things, we'll be updating to C++ when practical, as that
allows us to reduce error-prone boiler plate, such as replacing
strings in structures (`std::string` has `operator=` which
automatically releases the previous string).

Such major changes will take a long time to implement. Being able to
abstract and reduce duplication means we can increase the consistency
in the MUD. There's a lot of features which would be nice to have in
the MUD but aren't there because the way the code is now makes it
hard - we hope to fix these issues eventually.
