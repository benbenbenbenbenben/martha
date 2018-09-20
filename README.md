# Martha

Martha is an expressive statically typed concurrent programming language.

Martha is incredibly approachable and infinitely expressive. Martha is intended to be architecture agnostic in so far as she targets LLVM, CIL, WASM, BVM and for new platforms the parser provides easily readable output.

## Fundementals

Martha is functional to the extent that every token is a function, and Martha is whitespace aware by default. This means the syntax can be valid ahead of the implementation of a program being "complete". Martha code can be written in interactive development environments in ways other languages don't allow.

To illustrate the expressive nature of Martha we should be familiar with the fundemental constructs of the language: *atoms*, *statements*, *blocks* and *macros*.

## Fundementals: Blocks

### Syntax:
```
statement: statement
```

```
statement:
   statement*
```

### Examples:

```
# a single block
type: Foo
```

```
# a single block
type:
    Foo
```

## Fundementals: Statements

### Syntax:
```
atom atom*
```

## Fundementals: Atom

### Syntax:
```
literal | reference | block | macro
```

## Fundementals: Macros

### Syntax:
```
((text | $insertion) whitespace*)+
```