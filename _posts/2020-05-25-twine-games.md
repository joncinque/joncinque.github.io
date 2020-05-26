---
layout: post
title:  "Making Twine Games, Programmer Edition"
date:   2020-05-25 10:00:00 +0100
permalink: twine-games-tutorial
comments: true
tags: programming twine games tutorial
---

Twine and its associated tools allow you to easily create a narrative browser
game with all of the features you might want.  I made an
[UNDERTALE](https://undertale.com/)-inspired game to propose to my girlfriend.
She said yes! Check it out at [DATE N' RULE](https://datenrule.com).

## TL; DR

* [Twine](https://twinery.org/) is an ecosystem of standards and tools for 
making interactive browser stories
* Want a graphical interface? Use [twinejs](https://github.com/klembot/twinejs)
* [Twee](https://twinery.org/cookbook/terms/terms_twee.html) is its 
command-line variant, generating stories from text files
* Want to do everything with your favorite code editor? Use 
[tweego](https://github.com/tmedwards/tweego)
* Twine allows for different
[story formats](https://twinery.org/cookbook/terms/terms_storyformats.html)
* Are you a web programmer who doesn't want to learn a new markup
language? Use [snowman](https://github.com/videlais/snowman)
* JS and CSS can be directly included, so treat your story like a website
* I used the characters and music from UNDERTALE to create
[DATE N' RULE](https://datenrule.com), where the characters help me propose
to my girlfriend

## Background / Getting Personal

This post has a personal component, which I will include for context and "aw"s.
My girlfriend and I love videogames, and the first game we enjoyed together 
from start to finish was [UNDERTALE](https://undertale.com/).  If you haven't
heard of it or played it, it's truly something special, and doesn't take long 
to finish.  You will be charmed by the characters, music, and writing, and you
won't want to leave the world when it ends.

A year into our relationship, it was clear that we were both ready for the next
step of marriage.  Since she's a private person, I wanted to propose to her in
an intimate environment, and I wanted to incorporate games.

The first idea was to mod the existing UNDERTALE using the
[excellent community tool](https://github.com/krzys-h/UndertaleModTool),
but it would be a lot of work to create new areas, characters, or combat
situations.  I realized that the most important part was to get my message
across, so an interactive fiction tool would be more appropriate.  It would 
also be great for it to be shareable through the internet.

After searching and testing different tools, Twine came out
as the best option for me due to its ease and similarities to html.
It's extremely flexible and
easy to get started, but due to its open format and modular design, putting all 
of the pieces together can be complicated for a heavily customized project.

This guide is meant to be a programmer's introduction to making games
with Twine, so it assumes knowledge of a command line and basic JavaScript / CSS.

## Twine and twinejs

Twine is designed for web browsers, so the output of your hard work is an html
file, filled with your story and game logic.  There are two main ways to create
this: the graphical interface or the command-line interface.

There are two graphical interfaces available as of this writing:
* [twinejs](https://github.com/klembot/twinejs)
* [twine](https://github.com/tweecode/twine)

twinejs is the actively supported implementation, so if you want to create stories
using a graphical interface, you can try it at [twinery](https://twinery.org/2).

Twine is a complex ecosystem with various evolving standards, and you can think of twinejs
as a Twine framework.  It makes many decisions for you to simplify the 
development experience at the cost of flexibility.

For example, stories are saved locally as browser cookies, which limits your 
ability to maintain versions of the story.  You have to publish the story to 
back it up, and then re-import it into Twine to restore it.

There's a lot of clicking involved in creating a story, and the code / text 
editor is limited.

Story formats (more on that later) can't be added unless you're
running twinejs locally, so you're bound to whatever is included in the
release.

## Twee and tweego

Many of the problems with twinejs were solved long ago by existing developer
tools.  Git is great for version control.  Vim / Emacs / Sublime / VSCode are
beloved and behated by their respective crowds.  Makefiles are great for
managing files and different build configurations.

Since this is a programmer's guide, we'll focus on the command-line variants
of the Twine ecosystem.

[Twee](https://twinery.org/cookbook/terms/terms_twee.html) is the generic form
of Twine markup, meant to be consumed by a Twee "compiler".  The main
compilers are:
* [twee](https://github.com/tweecode/twee)
* [tweego](https://github.com/tmedwards/tweego)
* [extwee](https://github.com/videlais/extwee)

Based on unscientific searching around the community, tweego is the more
popular and actively supported compiler, so feel free to use it.
You can follow the [official instructions](https://github.com/tmedwards/tweego#building-from-source)
to install and build `tweego`.

The basic set of commands is:
```bash
git clone https://github.com/tmedwards/tweego.git
cd tweego
go get
go build
```

Feel free to add `tweego` to your `PATH` or install it wherever you consume binaries.

Side note on versions: the Twine standard is currently at major version 2, while the 
Twee standard is at major version 3.  This is confusing.

## Story formats

Unfortunately, we can't get an example up and running with just `tweego`.  The 
next required part is the
[story format](https://twinery.org/cookbook/terms/terms_storyformats.html).
The documentation for story formats is tough to find, and
sometimes the formats themselves are not well explained in their documentation.
This series of
[blog posts](https://videlais.com/2020/02/28/creating-your-own-twine-2-story-format-part-1-understanding-twine-2-html-structures/),
however, gives a lot of useful information and 
background about the concept of story formats.  Basically, you can think of a
story format
as markup and syntactic sugar that can be used within the `passages`, the
fundamental building blocks of your Twine story.

If you have some knowledge of web languages already, you will want to
use [snowman](https://github.com/videlais/snowman), which provides the least
new functionality, but gives you access to run any vanilla JavaScript and
includes jQuery, Underscore, and Marked.

To set it up, run the following commands:
```bash
git clone https://github.com/videlais/snowman.git
cd snowman
npm install
npm run build
```

To make the story format available to `tweego`, you simply need to put
the story format build in some known place.  You have many
[well-documented options](http://www.motoslave.net/tweego/docs/#getting-started-story-formats)
to make that happen.  Here is an example that assumes that you're using version
2.0.3 of snowman:
```bash
mkdir ~/storyformats
ln -s dist/snowman-2.0.3 ~/storyformats
```

## Test Setup

We finally have everything to make a story!

To test that everything works, create a story file in its own sub-directory,
e.g. `example/example.tw`, with the following content:
```
:: StoryData
{
  "ifid": "F58E6A21-357C-4D49-A264-FB0B3AC4FABF",
  "format": "snowman",
  "format-version": "2.0.3",
  "zoom": 0.25
}

:: StoryTitle

Example Twee Story

:: Start

It worked!
[[Congratulations]]

:: Congratulations

It even worked with a passage link!
```

The important parts for now are the three elements in this twee (`.tw`) file
starting with double colon (`::`).  These define `passages`, the previously-mentioned
fundamental building blocks of your Twine story.  These three are required for 
your story to compile:

* `StoryData`: meta-data about how to compile the story
* `StoryTitle`: just the name of the story
* `Start`: the first passage

More info on how to customize these can be found at the 
[special passages docs](http://www.motoslave.net/tweego/docs/#special-passages).

Run the compilation from the story's parent directory, to keep the output
html separate from the inputs:
```bash
tweego -o example.html example
```

This should generate your story at `example.html` -- check it out with your favorite browser.

This is definitely bare-bones, but you're all set to start writing your opus of
interactive fiction!

## Project Setup

Twine and Snowman allow for a lot of customization, especially in the form of 
JS and CSS on your page.

By default, tweego looks for all `*.tw`, `*.js`, and `*.css` files in the
specified directory when invoked.  JS and CSS files are added to
the output html, to be run when the story is first loaded. Just like normal html,
you can include media in the form of fonts, sounds, music, and images.
Here's a simple proposed project directory format for all parts:
```
project
├── README.md
├── Makefile
├── example
│   ├── base.css
│   ├── base.js
│   └── example.tw
├── example.html
└── media
    ├── font
    │   ├── font1.woff
    │   └── font2.woff
    ├── img
    │   ├── img1.png
    │   └── img2.png
    ├── music
    │   └── mus.ogg
    └── sound
        └── talk.wav
```

`example.html` does not need to be added to source control, but it's your choice!

## JavaScript tips

Snowman gives you access to some special variables on `window`:
* `window.story`: global information
* `s` or `window.story.state`: state information to be shared through the entire story
* `window.passage`: state information scoped to the current passage
* `window.setup`: nothing special, just a convention for other globals 
More info at the [docs](https://videlais.github.io/snowman/2/learning/scope.html).

These few variables allow you to easily create your own templating system. For 
example, to achieve a "typewriter" effect of each character in a passage being
displayed sequentially, you can create a function as explained in the 
[documentation](https://videlais.github.io/snowman/2/examples/typewriter/snowman_typewriter.html).

### Custom Templating

To simplify things further, you can create a generic function for setting up
your whole look, e.g.:
```js
setup.createChatArea = function(imageSource) {
  return `<img class="center" src="${imageSource}">` +
  '<div id="typewriter"></div>';
}
```
You can use the function in a passage as:
```
:: Passage
<%= setup.createChatArea("image.png") $%>
```
This can be further expanded with any buttons or links you want in your game,
or you can even create new templating functions as needed!

### Sound with Typewriter

If you want to add sound to your typewriter, add the following to your JS:
```js
setup.typewriter.src = "sound.wav";
const MAX_TALK_ELEMENTS = 5;
setup.typewriter.soundElements = [];
for (var i = 0; i < MAX_TALK_ELEMENTS; ++i) {
  setup.typewriter.soundElements.push(document.createElement('audio'));
}
```
You can tune `MAX_TALK_ELEMENTS` to your pleasure -- 5 elements strikes a good
balance between allowing the full sound to play and not overwhelming the browser
with too many `audio` elements.  Mobile devices can chug otherwise!

Update the `write()` function to play the sound:
```js
setup.typewriter.write = function(){
  if(setup.typewriter.index < setup.typewriter.text.length) {
    $("#typewriter").html(
      $("#typewriter").html() + setup.typewriter.text[setup.typewriter.index]
    );
    var i = (setup.typewriter.index) % MAX_TALK_ELEMENTS;
    var el = setup.typewriter.soundElements[i];
    el.src = setup.typewriter.src;
    var playPromise = el.play();
    // Some browsers do not return a Promise on play()
    if (playPromise !== undefined) {
      // Ingest the error to continue execution
      playPromise.catch(function(error) {
        if (error.name === "NotAllowedError") {
          console.log("Talk: allow media for sound");
        } else {
          console.log(error);
        }
      });
    }
    setup.typewriter.index++;
    setup.typewriter.timerReference = setTimeout(setup.typewriter.write, 1000);
  } else {
    clearTimeout(setup.typewriter.timerReference);
    setup.typewriter.index = -1;
  }
}
```

This is used as a normal call to `write()` within your passage, and you can even
override `setup.typewriter.src` to change the sound!

### Background Music

Use the following code to safely play music with fading in and out:
```js
:: StoryTitle
Playing Music in Snowman

:: UserScript[script]
// Create a global setup object
window.setup = window.setup || {};
setup.music = {};
setup.music.element = document.createElement('audio');
setup.music.element.volume = 0.1;

setup.music.fadeIn = function() {
  var el = setup.music.element;
  el.loop = true;
  el.volume = 0.1;
  var playPromise = el.play();
  if (playPromise !== undefined) {
    playPromise.catch(function(error) {
      if (error.name === "NotAllowedError") {
        console.log("Fade in: allow media on page");
      } else {
        console.log(error);
      }
    });
  }
  var volume = 1;

  var fadeAudio = setInterval(function () {
    if (volume < 10) {
      // Only fade if past the fade out point
      el.volume = volume / 10.0;
    } else {
      // Stop when volume at zero
      clearInterval(fadeAudio);
    }
    volume += 1;
  }, 20);
}

setup.music.play = function(src) {
  var el = setup.music.element;
  el.src = src;
  setup.music.stop(setup.music.fadeIn);
}

setup.music.stop = function(callback) {
  var el = setup.music.element;
  if (el.paused === true) {
    if (callback !== undefined) {
      callback();
    }
  } else {
    // Set the point in playback that fadeout begins.
    // This is for a 2 second fade out.
    var fadePoint = el.duration - 2;
    var volume = parseInt(el.volume * 10.0);

    var fadeAudio = setInterval(function () {
      if (volume > 0) {
        el.volume = volume / 10.0;
      } else {
        clearInterval(fadeAudio);
        el.pause();
        if (callback !== undefined) {
          callback();
        }
      }
      volume -= 1;
    }, 20);
  }
}

:: Start

<%
setup.music.play("musicFile.ogg");
setup.music.stop();
%>

```
This was tested with Chrome, Firefox, and Midori.  Browsers all treat
sound differently, and many require user interaction before playing anything.
This is a kind feature for browser users, but you'll need to watch out for it!
Be sure to test as many browsers as possible.

## Useful commands / Makefile

As you write your story, you may want to split it up into multiple .tw files --
tweego will be able to tie it all together at compilation.

The `-w` flag puts tweego in `watch` mode, so updates to the underlying files
will be picked up immediately.

The `-s` flag specifies the first passage of the story.  Note that variables
changed over the normal course of the story will not be set.

You can create an old-fashioned `Makefile` to test chapters in your story, e.g:
```make
.PHONY: build dev chapter1

build:
	tweego -o example.html example

dev:
	tweego -w -o example.html example

chapter1:
	tweego -s chapter1 -w -o chapter1.html example
```

## Result

This was all put together to create [DATE N' RULE](https://datenrule.com)!  You
can find the source code and scripts in
[this repo](https://github.com/joncinque/joncinque.github.io/tree/master/twinegames/datenrule).
I hope you found inspiration and resources to get started on your own project.
Be sure to get in touch or leave a comment!

## Twine Resources

* [Twine Cookbook](https://twinery.org/cookbook/)
* [Tweego Docs](http://www.motoslave.net/tweego/docs/)
* [Snowman Docs](https://videlais.github.io/snowman/2/)
* [Discord](https://discord.gg/n5dJvPp)
