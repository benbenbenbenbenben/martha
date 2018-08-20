# What is ditto?

ditto is a zero dependency parsing expression grammar or PEG parser written in TypeScript.

ditto exposes static combinator functions to make parser writing as expressive and painfree as possible.

## Quick Start

```TypeScript

```

## Writing a Parser

ditto parsers are created with the static `parse` function. `parse` takes a `source:string` as an argument and returns function accepting rules of type `IRule`

```TypeScript
static parse(source: string): (...rules:IRule[]) => any
```

Rules for ditto are created using the static `rule` function

```TypeScript
static rule(...pattern:Pattern[]): IRule;
```

Patterns for rules can be anything in the `Pattern` type:

```TypeScript
type Pattern = string|RegExp|IToken|IRule|((input:Input) => Result)|(() => IRule);
```

`string`, `RegExp`, `IToken` and `IRule` are combined to an `(input:Input) => Result` function at parse time, and you can write your own functions using this signature and pass them any of the static combinator functions, including `rule(...)`

#### `IToken` and `IRule`

`IToken` are a special type that pushes named matches to the `ResultToken` object for a rule yielder. `IToken` are returned from the static `token` function.

`IRule` are a special type that brings patterns and their outputs together. Under the hood the `IRule` extends `Function[]` with `IRule.yields(yielder:IRuleAction):IRule` and `passes(source:string, expect:any):IRule`. The `passes` function performs an immediate test against the rule.

### Built-in Combinator Functions

There are a handful of built-in combinator function:

```TypeScript
    all(...patterns:Pattern[]):(input:Input) => Result;
    many(...patterns:Pattern[]):(input:Input) => Result;
    either(...patterns:Pattern[]):(input:Input) => Result;
    optional(...patterns:Pattern[]):(input:Input) => Result;
```

