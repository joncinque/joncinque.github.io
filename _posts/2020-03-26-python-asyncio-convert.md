---
layout: post
title:  "Towards asyncio from threading in Python"
date:   2020-03-26 10:00:00 +0100
permalink: python-asyncio-from-threading
comments: true
image: /assets/asyncio.png
tags: programming python asyncio threading tutorial
---

Undertaking a conversion of a multithreaded Python project to 
[asyncio](https://docs.python.org/3/library/asyncio.html) can be
daunting, but your program can reap huge performance benefits with it.

![basic asyncio code](/assets/asyncio.png)

## Background

There's ample information about what asyncio is about, and how it differs
conceptually from multi-threading and multi-processing. This post doesn't cover
those differences, but rather aims to provide practical tips for solving
situations that will likely come up while converting an existing project to asyncio,
or while developing a new project using asyncio.

## Motivation

I recently converted a large project which used heavy multithreading to 
constantly fetch and store I/O bound information.  It was the 
perfect candidate for conversion, since the program mostly waited
on resources -- REST APIs, databases, and sockets.  Whenever things weren't
going fast enough, I simply added more threads and
called it a day.  After a certain point, however, at roughly 50 threads, it 
was still taking too long between fetches, so I decided to try moving 
components of the project to asyncio over time and see how that would 
improve performance.

Since the conversion was motivated by application performance, I measured 
average CPU usage, and time to complete data reporting.  Essentially, the program
simply fetches data on a loop from many different sources, so I measured how long it
took to do a full round of data reporting.  Here are the results:

| Environment | CPU Usage | Fetch Time |
|-------|--------|---------|
| multithreaded | 6% | 3 minutes |
| asyncio | 10% | 30 seconds |

This means a 6x speed-up against 2x CPU usage, meaning the effort
was well worth the time.  Additionally, there was less fluctuation in the rate of
data collection -- the 30 second fetch average in asyncio had a small
variance, while the 3 minutes in the multithreaded ranged wildly, from 1 minute to
6 minutes.

Converting to asyncio can be extremely beneficial to your system!  Again, note
that this example was particularly well-suited for big performance gains because
it was mostly I/O bound, and not CPU bound.

## History

The asyncio package has been around since Python 3.4, and each new release
has brought greater ease of use, along with usual improvements and refinements.
Here are some highlights from each release:

* 3.4: first release
* 3.5: `async` and `await` keywords
* 3.6: official stable release
* 3.7: `asyncio.run()` utility function to help get started
* 3.8: REPL available with `python3 -m asyncio`

Development in asyncio has gotten easier and more performant because of these
enhancements along with greater 3rd party library support.

## Getting started / top-level

Other languages, most notably ECMAScript / JavaScript and C#, integrate asynchronous
programming in a non-intrusive way -- you simply need to add `async` in
the function declaration and some form of `await` within the function.  For
example, here is a simple C# program to read a file synchronously:

```cs
using System;
using System.IO;

class SyncTest
{
  public static void PrintFile()
  {
    string text = File.ReadAllText("./text.txt");
    Console.WriteLine(text);
  }

  public static void Main()
  {
    PrintFile();
  }
}
```

Using asynchronous development, this becomes:

```cs
using System;
using System.IO;
using System.Threading.Tasks;
using System.Text;

class AsyncTest
{
  public static async Task PrintFile()
  {
    byte[] result;
    using (FileStream SourceStream = File.Open("./text.txt", FileMode.Open))
    {
      result = new byte[SourceStream.Length];
      await SourceStream.ReadAsync(result, 0, (int)SourceStream.Length);
    }

    string text = Encoding.ASCII.GetString(result);
    Console.WriteLine(text);
  }

  public static async Task Main()
  {
    await PrintFile();
  }
}
```

Although we have to tag `async` and `await` everywhere, and all async functions need
to return a `Task` or `Task<T>`, the general code is pretty similar, since 
`Main()` can be async.

For Python, `asyncio` works very differently from `threading`, so normal code 
changes a lot with the introduction of the event loop.
Here is a sample program that uses `threading` to read and print a file synchronously:

```python
import threading

def print_file():
    with open('./test.txt') as f:
        text = f.read()
        print(text)

t = threading.Thread(target=read_file)
t.start()
```

The asynchronous version requires an external package [aiofiles](https://pypi.org/project/aiofiles/)
and a few other bits which we will break down:

```python
import asyncio
import aiofiles

async def print_file():
    async with aiofiles.open('./test.txt') as f:
        text = await f.read()
        print(text)

async def main():
    loop = asyncio.get_event_loop()
    task = loop.create_task(print_file())
    await task

loop = asyncio.get_event_loop()
loop.run_until_complete(main())
```

Note that we could use the `asyncio.run()` and `asyncio.create_task()` 
convenience functions to make the 
code look simpler, but that would mask the event loop, which is will be
vital during the conversion.  The 
[official documentation](https://docs.python.org/3/library/asyncio-eventloop.html)
does the best job of explaining everything in detail, but the most important
functions for moving from threads are:

* `loop.run_until_complete()` to run an async function and wait for the result,
compare to a normal function call
* `loop.create_task()` to start and run an async function without blocking, compare 
to `threading.Thread.start()`
* `run_forever()` to keep the program up and running, compare to
```python
while True:
    time.sleep(0.1)
```

Those are the basics!  With this background, and your effort, it's only a
matter of time before the whole project is converted to asyncio.

## Guidelines for converting your code

### General guidelines

These general guidelines were useful for my project.  Some of them are more
stylistic, so your mileage may vary on them.  As with any large refactor, go
component by component and be sure to maintain a working synchronous version
that you can always use as a fallback.

* Tag all async functions with `async def...`
* Use `await` on all async function calls.  Thankfully, you'll get warnings on
non-awaited coroutines if you forget somewhere. Unthankfully, the code will just
stall and not provide too much more information.
* Make liberal use of `asyncio.gather(coroutine1, coroutine2, ...)` whenever
multiple things can be done at once.
* Copy existing classes into async versions, with all of the same functions, 
tagging functions `async` wherever required.  This is
a stylistic point, but it will make it clear to users of the class whether you are in
an async environment or not.  For example, if you have a component `./component.py`:

```python
import time

class Component(object):
    # __init__ and friends omitted for brevity
    def perform_long_job(self):
        # some long-running code here
        time.sleep(10)
```

You will copy it to `./component_async.py` or (even better) 
`./async_support/component.py`, which looks like:

```python
import asyncio
from .component import Component as SyncComponent

class Component(SyncComponent):
    # __init__ and friends omitted for brevity
    async def perform_long_job(self):
        # some long-running code here
        await asyncio.sleep(10)
```

This way, the users of `Component` have a simple and clear conversion, from:

```python
from .component import Component

def use_component():
    component = Component()
    component.perform_long_job()
```

Into the asynchronous version:

```python
from .async_support.component import Component

async def use_component():
    component = Component()
    await component.perform_long_job()
```

Once a component is converted, you will also want to properly test it to make
sure the functionality is maintained.  As with any refactor, this is where 
having good tests already in place is extremely helpful.  Just as with the
component, you will copy the test file and then properly use `async` and `await`
in the test code.  There are many asyncio testing components out there, but if
you're using `unittest`, the easiest way to convert tests to asyncio is to 
use this decorator on tests:

```python
import asyncio

def make_async(f):
    def wrapper(*args, **kwargs):
        coroutine = asyncio.coroutine(f)
        future = coroutine(*args, **kwargs)
        asyncio.get_event_loop().run_until_complete(future)
    return wrapper
```

For example, a sample synchronous TestCase:

```python
from unittest import TestCase
from .component import Component

class SyncTestCase(TestCase):
    def test_feature(self):
        component = Component()
        component.perform_long_job()
```

becomes:

```python
from unittest import TestCase
from .async_support.component import Component

class AsyncTestCase(TestCase):
    @make_async
    async def test_feature(self):
        component = Component()
        await component.perform_long_job()
```

For the first part of the conversion, you will feel like you're just
writing `async` and `await` all over the place, propagating through too many
classes and function calls.  And you will be right.  There is always an end in 
sight though!  Keep creating the async versions of components and test at every
level possible.

Note that this approach does violate some DRY principles, but there
will unfortunately be some inevitable repetition with some functions since one
function cannot be both async and sync at the same time.  This doesn't
mean you should neglect all code reuse.  Do reuse functionality that can stay 
sync in the async version.  To that end, you can have the async
version inherit from the synchronous version.

### Managing concurrent tasks

At the top-level, instead of handling `Thread`s, you will have `Task`s everywhere
created using `create_task()`.  Remember that the code starts executing right
after the call to `create_task()`, and you do not need to `await` it to start.

Be sure to refer to the
[Task documentation](https://docs.python.org/3/library/asyncio-task.html#task-object)
to see what is available. You will probably be happy with `done()`, 
`exception()`, and `result()`, but be sure to explore around.

## Converting dependencies

Before you've even started tackling the conversion of your own code, you'll 
need to see how all your external dependencies support asyncio, which will
strongly influence any design changes required in your application.  Your
dependencies will likely fall into a few different cases, from easiest to hardest:

* a totally compatible drop-in replacement
* an incompatible drop-in replacement
* no async version possible, operating independently
* no async version possible, requires async components

Third-party libraries are understandably all over the map for async support.
Thankfully, it's only getting better as asyncio continues to gain traction
all over the community.  It can also be the perfect opportunity to do some
useful and appreciated open-source work.  For example, 
[here](https://github.com/RomelTorres/alpha_vantage/pull/191) is a pull request
that I did for a popular financial data package.

### Drop-in replacement

Some library providers simply give an async variant that operates exactly like
its synchronous counterpart, albeit with `async` all over the place. This is 
the best possible case since you won't have to make any big changes in your
async implementation.  For example, in the MongoDB world,
[motor](https://motor.readthedocs.io/en/stable/index.html) is an extremely simple
alternative to [pymongo](https://api.mongodb.com/python/current/).  Even better,
there is extensive reuse of pymongo objects within motor, so most imports won't even 
need to be updated.

Search around for the async variants and cross your fingers that it's there!
And if not, you can make a name for yourself in the open-source community.

### Incompatible drop-in replacement

Some async libraries look similar to their sync versions but aren't exactly the
same.  For example, first-party Python libraries unfortunately look a bit different.
The [socket](https://docs.python.org/3/library/socket.html) library is mostly
replaced by functions that exist directly on the
[event loop](https://docs.python.org/3/library/asyncio-eventloop.html#opening-network-connections)
with some inconsistencies.  The asyncio version of creating a connection 
requires a `protocol_factory` implementing some 
[network protocol](https://docs.python.org/3/library/asyncio-protocol.html#asyncio-protocol)
for handling data when it's sent or received.

Note that some APIS will require the event loop to work.  Passing the event loop 
down to client code used to be the stylistic standard, but this has mostly been
replaced with getting the current event loop in most situations, unless your 
application requires multiple event loops.  Beware that older 
libraries may still require the event loop directly.  You can find the interesting
discussion [here](https://github.com/asyncio-docs/asyncio-doc/pull/13).

### No async library available, no dependency on async components

What do you do if you have mostly asynchronous
replacements for all of your dependencies, but there's still one or two holdouts?
And most importantly, you don't have the time or resources to port the library
yourself?

Thankfully, you can use `run_in_executor()` to use an 
[Executor](https://docs.python.org/3/library/asyncio-eventloop.html#executing-code-in-thread-or-process-pools)
and run your blocking synchronous code within an asynchronous context.  This
will look a lot like your old threaded setup.

This step is extremely important, because one blocking call can stall your entire
asynchronous setup.  Remember that those `await` calls tell the event loop to
move onto other tasks.  If a non-awaited call takes a long time, nothing else 
can be done in that time.

### No async library available, need to call async components

What do you do if you are using a sync-only external library that maintains its own 
thread and needs to call async code?  An example would be a listening socket 
not directly maintained by your application.  It needs to keep listening on its
socket in its own thread, and eventually call into async code when it receives data.
This is a problem because the listening thread is calling into the event loop
owned by another thread.  If multiple threads are asking one event loop to do
things, you can run into normal multi-threading race conditions.

Again, thankfully, asyncio has you covered! First, it will raise an exception
if you try to use an event loop from another thread.  Second, you have
[`run_coroutine_threadsafe()`](https://docs.python.org/3/library/asyncio-task.html#asyncio.run_coroutine_threadsafe)
to handle this situation without too much trouble. Note that this function gives you
`concurrent.futures.Future`, which must be sychronously "awaited" using
`result(timeout)` if you need the return value.

## Testing

Unless your testing library has an async
version also available, you can use the `make_async()` helper decorator described
earlier to convert tests to async.

Testing on all components is critical to ensure that 
everything behaves as expected, and to double-check that there aren't any 
missing `await`s anywhere.  Trust me, that will happen.

## Wrapping up

This post was meant to clarify how to move over to the new world of 
asyncio in Python.  Be sure to let me know if this worked for you or if you've 
encountered other cases not covered here during your asyncio transition.  The
official documentation even lists
[common pitfalls and solutions](https://docs.python.org/3/library/asyncio-dev.html)
when developing with asyncio.  It certainly helped me during the transition.

Once everything has been converted over, I hope you will find a much more 
performant and reliable Python application!
