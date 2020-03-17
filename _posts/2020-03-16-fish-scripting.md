---
layout: post
title:  "Fish shell scripting guide"
date:   2020-03-16 10:13:11 +0100
permalink: fish-scripting
comments: true
categories: programming shell
---

The [fish shell](https://fishshell.com/) has been around for some time, but there
aren't many guides for creating scripts from scratch.  Learn the basics of writing a fish
shell script here!

## History

The fish shell has good
[design principles](https://fishshell.com/docs/current/design.html)
for shells in general, opting towards the Apple model of keepings things simple
and avoiding too much configurability.  bash and zsh are highly configurable, at
the expense of discoverability of new features.  Unfortunately, the fish shell
community is not as extensive as bash's and zsh's, so resources for writing scripts
are rare.  This post aims to clear that up and provide a comprehensive set
of mini recipes useful while writing scripts in the fish shell language.

The fish shell is meant to be more readable than bash and zsh, which is why it
is not fully POSIX-compliant.  The more esoteric or strange POSIX tendencies have
been removed in favor of simplicity. For example, there is no `$"` variable.
Since fish is meant to be legible, then we should be writing more scripts for it!

## Resources

The following resources provide some great information about the fish shell and
a few programming idioms, some of which are also covered in this post.

* The [fish-cookbook](https://github.com/jorgebucaran/fish-cookbook) by Jorge 
Bucaran contains lots of great general info
* This
[simple and excellent guide](https://developerlife.com/2019/10/31/fish-scripting-manual/)
by Nazmul has tips and shorthands helpful for writing scripts

## Starting

For the filename, fish scripts typically end with in `.fish`, e.g. `test.fish`.

Just like any other shell script, you have to declare which shell you will use.
```fish
#!/usr/bin/env fish
```

## Variables

Although the fish shell recently introduced the `=` syntax to set variables for
just one command, e.g. `myvar=something echo $myvar`, the `set` command will do
most of the work in the script.  Here are some common interactions with variables:

* Set a variable
```fish
set variable_name "value"
```
* Retrieve a variable
```fish
echo $variable_name
```
* Set a list
```fish
set list_variable "value1" "value2" "value3"
```
* Get a list item (NOTE THAT ARRAY INDICES START AT 1)
```fish
echo $list_variable[1]
```
* Get a list slice
```fish
echo $list_variable[2..-1]
```
* Remove a list item (NOTE THE LACK OF `$`)
```fish
set -e list_variable[1]
```

## Conditionals

Conditions are mostly tested using the `test` function.

* Equality
```fish
  if test "$variable" = "something"
    echo $variable
  end
```

* Not Equals
```fish
  if test "$variable" != "something"
    echo $variable
  end
```

* Not operator `!`
```fish
  if ! test -e $filename
    touch $filename
  end
```

* Variable existence NOTE THE LACK OF `$`
```fish
  if set -q variable
    set variable "value"
  end
```

* Switch statement
```fish
  switch $option
    case -l --long
      set is_long 1
    case -s --short
      set is_long 0
    case "*"
      echo "$option is something else"
  end
```

## Loops

* For loop over list variable
```fish
  for p in $PATH
    echo $p
  end
```

* For loop over sequence
```fish
  for i in (seq 1 10)
    echo $i
  end
```

* While loop
```fish
  set argv script arg1 arg2 arg3
  while set -q argv[1]
    set value $argv[1]
    set -e argv[1]
    echo $value
  end
```

## Functions

Functions are easy to define and use in fish shell scripts, and you are strongly
encouraged to use them as much as possible.  The documentation string makes it
even clearer to split things up.  Remember that `$argv` is sacred and used for
all functions and also at the top-level.

Example definition and use:
```fish
function func_name -d "Function description string"
  set arg1 $argv[1]
  set arg2 $argv[2]
  echo $arg1
  echo $arg2
end
func_name first_arg second_arg
```

## Fish directories

The fish shell has a few special areas that it create designate on installation,
usually in the user's `$HOME`.

* Configuration default location: `$HOME/.config/fish/config.fish`
* Additional user-defined functions: `$HOME/.config/fish/functions/`
* Globals or files for user-defined functions / packages: `$HOME/.local/share/fish/`

## Argument parsing

There is a fish package for option parsing available called 
[fish-getopts](https://github.com/jorgebucaran/fish-getopts).  Since the
fish shell prides itself on just working out of the box with minimal extra
packages or configuration, we will create something similar from scratch using
everything from the previous sections.

```fish
#!/usr/bin/env fish
function user_script -d "Does the main work of the script"
  set long 0
  set message ''
  while set -q argv[1]
    set option $argv[1]
    switch "$option"
      case -l --long
        set long 1
      case -m --message
        set -e argv[1]
        set message $argv[1]
      case "*"
        echo "Done processing flags"
        break
    end
    set -e argv[1]
  end
  for arg in $argv
    if test $long = '1'
      printf "%s: Printing a long message for arg %s\n" "$message" "$arg"
    else
      printf "%s: arg %s\n" "$message" "$arg"
    end
  end
end

function usage -d "Show all usage examples"
  echo "Usage: user_script.fish [-l] [-m message] [args]"
  exit 1
end

if test (count $argv) -gt 0
  user_script $argv
else
  usage
end
```

## A full example: [pomo.fish](https://github.com/joncinque/pomo.fish)

All of these techniques were used in the development in a simple pomodoro timer
implementation, found at [pomo.fish](https://github.com/joncinque/pomo.fish).

If you have any questions or comments, feel free to reach out.

Enjoy the fish shell!
