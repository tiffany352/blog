# Syntax Highlighting Test

This page isn't supposed to be linked to from anywhere on the site. It's
just for testing my custom css for highlight.js.

```diff
+ foo
+ bar
+ baz
- original text
- more original text
```

```markdown
# Heading 1

## Heading 2

this **bold text**

this _italic text_

this ~~strikethrough~~

This is a paragraph.

[This is a link](https://example.com)

- this
- is
- a
- list

`code?`

> this is a blockquote
```

```html
<!DOCTYPE html>
<title>Title</title>

<style>
  body {
    width: 500px;
  }
</style>

<script type="application/javascript">
  function $init() {
    return true;
  }
</script>

<body>
  <p checked class="title" id="title">Title</p>
  <!-- here goes the rest of the page -->
</body>
```

```csharp
using System.IO.Compression;

#pragma warning disable 414, 3021

namespace MyApplication
{
    [Obsolete("...")]
    class Program : IInterface
    {
        public Program() {}

        public static List<int> JustDoIt(int count)
        {
            Console.WriteLine($"Hello {Name}!");
            return new List<int>(new int[] { 1, 2, 3 })
        }
    }
}
```

```css
@font-face {
  font-family: Chunkfive;
  src: url("Chunkfive.otf");
}

body,
.usertext {
  color: #f0f0f0;
  background: #600;
  font-family: Chunkfive, sans;
  --heading-1: 30px/32px Helvetica, sans-serif;
}

@import url(print.css);
@media print {
  a[href^="http"]::after {
    content: attr(href);
  }
}
```

```lua
--[[
Simple signal/slot implementation
]]
local signal_mt = {
    __index = {
        register = table.insert
    }
}
function signal_mt.__index:emit(... --[[ Comment in params ]])
    for _, slot in ipairs(self) do
        slot(self, ...)
    end
end
local function create_signal()
    return setmetatable({}, signal_mt)
end

-- Signal test
local signal = create_signal()
signal:register(function(signal, ...)
    print(...)
end)
signal:emit('Answer to Life, the Universe, and Everything:', 42)

--[==[ [=[ [[
Nested ]]
multi-line ]=]
comment ]==]
[==[ Nested
[=[ multi-line
[[ string
]] ]=] ]==]
```

```rust
#[derive(Debug)]
pub enum State {
    Start,
    Transient,
    Closed,
}

impl From<&'a str> for State {
    fn from(s: &'a str) -> Self {
        match s {
            "start" => State::Start,
            "clo\nsed" => State::Closed,
            _ => unreachable!(),
        }
    }
}
```

```typescript
class MyClass {
  public static myValue: string;
  constructor(init: string) {
    this.myValue = init;
  }
}
import fs = require("fs");
module MyModule {
  export interface MyInterface extends Other {
    myProperty: any;
  }
}
declare magicNumber number;
myArray.forEach(() => { }); // fat arrow syntax
```

```svelte
<script context="module">
  export async function preload(req, res) {

  }
</script>

<script lang="typescript">
  let count: number = 0;

  function handleClick() {
    count += 1;
  }

  const foo: string = "test \nliteral";
  const regex = /abcd/;
</script>

<style>
  button {
    background-color: rgb(200, 100, 100);
  }
</style>

<p>Current value: {count}.</p>
<button on:click={handleClick}>
  Increment
</button>
```
