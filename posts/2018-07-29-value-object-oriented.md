# Value Object Oriented

**Disclaimer:** _This won’t be the most well edited post. I haven’t made a post on this blog in 4 years, and I want to start using it to organize my thoughts and share my ideas with friends in a more structured manner than long rambles on IRC/Discord._

I feel like there’s been a new programming paradigm brewing the past few years. There’s a common theme among many different subjects that I’ve been seeing again and again, and it’s this concept of simple, value-like data types, where instead of mutating them, operations create new values.

There’s many systems that various authors have proposed over the years which share this common theme of _immutable value types_ and I think that this theme qualifies as a new paradigm. First I’ll go over some of the systems that I’ve seen, and then I’ll propose my own system.

## Data Oriented Design

[Richard Fabian’s book](http://www.dataorienteddesign.com/dodmain/) - While not the only resource, this is the one I’ve examined the most closely and found the most useful.

While this is usually argued as being its own paradigm, I’ve found it really difficult to actually write an entire app in this style. The style fundamentally requires that everything you do is in terms of multiple objects - this is pretty hard when you’re talking about something that’s fundamentally unitary, or involves plumbing, or connecting to an external system.

I think DOD has some important lessons that are common with the other things I bring up, and that those commonalities are part of the basis of this new paradigm.

In DOD, the idea is that everything should be organized as structs of arrays of simple data types. Dynamic dispatch is avoided, or only used at a high level instead of in inner loops. We should try to keep things immutable and reduce data dependencies because that frees our code up for more parallelism. Not only is this for performance, but it’s also argued that this makes the code easier to reason about and maintain.

There’s also a strong relationship to relational algebra and normalization. They’re powerful tools that allow you to do some pretty cool things with your data.

## Test Driven Design

I don’t have much experience with this, but it seems like it’s common to see some of the principles I’m thinking of come up here. Testing OOP is hard, so let’s make our OOP code be less OOP.

## React, Redux, and Normalization

<https://redux.js.org/recipes/structuringreducers/normalizingstateshape>

The core premise with Redux is that you have this immutable store of primitive data, which represents the _state of the world_ for your app. It gives you various advantages like being able to easily serialize it or reconstitute it from API requests. It also makes it easier to keep your app in sync.

When you additionally use normalization techniques from relational algebra, you can get your data into a shape where you can easily avoid unnecessary HTTP requests through an app’s lifecycle. For example, if you already have data on a user, you don’t need to make another API request to get that user’s data. It sounds trivial, but it’s a very easy compromise to make in designing an app.

React is also fairly relevant - The amount of mutation involved in your components is pretty minimal, and on top of that, the only extension mechanism is composition rather than inheritance. The inputs to your components are in the form of _props_ - a dict of primitive data types.

Normalization of a Redux store is astonishingly similar to the principles from Data Oriented Design, but in a completely different environment, completely independently discovered, and with totally different goals.

## Relational Algebra

Relational algebra is the formal mathematical basis of SQL, Linq, Rust iterators, etc. It’s a powerful tool when dealing with a large body of data and you’re trying to perform analysis based on the relationships in the data.

## Gary Bernhardt’s talk: “Boundaries”

[https://www.destroyallsoftware.com/talks/boundaries](https://www.destroyallsoftware.com/talks/boundaries)

In this talk, Gary goes over the approach he describes. In it, he describes a system in which you have objects (like OOP) but they’re immutable, and the methods return new objects (like functional??). He describes these as _values_, which I think is a pretty good term.

He doesn’t go so far as to say this is a new paradigm - but I think it does make for an important subset of what would be a new paradigm.

This talk was very influential on me - it formalized a lot of the things I’d been thinking of for a long time. It got me thinking about it explicitly rather than as a bag of different patterns and techniques.

## My proposal

I’m going to call the paradigm I’m proposing **Value Object Oriented**, because it’s all about value objects - objects that behave like values. Instead of being about functions, about mutable objects, or about procedures, it’s about values. Values are inherently immutable - as immutable as the number four. When you perform an operation on a value, it returns a new value.

I think the set of tools and thoughts around this paradigm are:

- A simplistic object system. No inheritance, just objects with methods. The objects are immutable and being able to construct them easily and efficiently is important.
- Powerful tools for performing incremental modifications to immutable data structures. You can see these same tools in functional languages (especially as newer concepts like lenses), and they’ve also made their way into mainstream languages such as Javascript. Things like object spread operators.
- Relational algebra operators for performing queries against immutable data stores. These tools are relevant in both DOD and Redux, and in many other places.
- Unit testing is highly relevant in this space, because of how easy it is to implement in a codebase built around these ideas.

I think it’d be cool to build a language specifically around this. I really feel like it’d be distinct enough from either functional or OOP to be considered a paradigm of its own.

## Conclusion

I’d like to hear everyone’s thoughts on this. I think it’s fairly reasonable to say we are converging on a new paradigm, and that it should be named and treated as one.
