---
layout: post
title:  "Programming Polyglots: Pair to learn a new language"
date:   2020-03-11 10:13:11 +0100
permalink: programming-polyglots
comments: true
categories: programming learn
---

This exercise was presented at the Recurse Center to combine its two great
loves: learning and community! The point is to expose yourself to the fringes 
of your language knowledge . And who knows, maybe you'll be inspired to use it 
for an upcoming project.

Two people pair program to accomplish a series of problems using a language that
neither of them knows well. Potential problems are given later in the list. After
some time spent working through problems, the pairs come back together to share
what they've learned.

## Language Rundown

### Established
C, C++, C#, Java, Python, JavaScript / ECMAScript, Ruby

### Rising
Go, Rust, Haskell, Scala, OCaml, Lua, Erlang / Elixir, Clojure, Factor, F#, Elm

### Fun / Esoteric
LOLCODE, Piet, Befunge, Brainf*ck, Shakespeare

### Retro
Perl, COBOL, Spitbol / Snobol, BASIC / Visual Basic, Excel, Assembly (any flavor)

## Pairing Exercises
Tackle these exercises in whatever order you'd like.  Some of them may be
unsuitable or downright impossible in the language of choice, so feel free to 
choose anything from the list.  HackerRank's 
[30 Days of Code](https://www.hackerrank.com/domains/tutorials/30-days-of-code)
might also be good inspiration.

### Getting started
 * Hello world: or make sure you can run *anything*
 * FizzBuzz: prints the numbers from 1 to 100, but for multiples of 3 print 
 “Fizz” instead of the number, for multiples of 5 print “Buzz”, for numbers 
 which are multiples of both three and five print “FizzBuzz”."

### Numbers
 * Max Contiguous Sum: given an array of ints, find the largest number you can
 create by summing adjacent / contiguous elements, e.g.  `[ 1 -3 2 3 -10 ]` 
 would give `5` because of the 2 and 3
 * Two Sum: given a list of numbers and a target, print the pairs that sum up to
 the target, using each number only once, e.g. `[ 1 3 4 0 -1 2 1]` and target `3`
 gives `(1,2)`, `(3,0)`, `(4,-1)`.  The second occurence of `1` is unused.
 * Reverse an integer: e.g. "1234" becomes "4321"

### Strings
 * String to Integer (atoi): function that takes a string of digits and
 converts it to an integer, e.g. `"2455"` becomes `2455`
 * Trim whitespace: with or without libraries, function that takes a string with 
 leading / trailing whitespace, and eliminate it, e.g. "   some stuff   " becomes
 "some stuff"
 * Remove redundant spaces: function that takes a string that may contain
 consecutive spaces among normal characters, and remove extra spaces, e.g.
 "this   is     a  test" becomes "this is a test"
 * Anagrams in a string / file: given an input word and a longer string, find all
 anagrams of that word in the longer string, e.g. "listen" and "please be silent"
 returns "silent"

### Data Structures
 * List: define the type / class / struct or use language features, and build it
 * Cycles (may not work for all languages): define a function to test if a list 
 has cycles, e.g.  `1 -> 2 -> 3 -> 4` is good, but `1 -> 2 -> 3 -> 4 -> 2 ....` is not
 * Binary tree: define the type / class / struct, create ways of building it up
 * Flip a binary tree: reverse the left and right children of a tree, e.g.
   2              2
 3   4  becomes 4   3
 * Output left child below a certain level: printLeftChild(Tree root, int level)
 to only output the left child of a binary tree past a certain level

### Meta
 * Print 1-1000 without using loops or "if" statements. Some languages do not
 support this... or do they?
