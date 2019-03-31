---
title: JSON Template Language
abbrev: JSON Templates
docname: draft-jonas-json-template-language
category: info

ipr: trust200902
area: General
keyword: Internet-Draft

stand_alone: yes
pi: [toc, sortrefs, symrefs]

author:
 -
    ins: "S. Jonas"
    name: "Shane Jonas"
    organization: "ETC Labs Core"
    email: shane.j@etclabs.org

normative:
  RFC2119:

informative:

--- abstract

JSON Template Language is a simple, compact template language to substitute [JSON](https://tools.ietf.org/html/rfc7159) into a template. It is derived from the template literals of Javascript, as defined in the ECMAScript Programming Language Standard, Ninth Edition [ECMA-262](https://www.ecma-international.org/ecma-262/9.0/index.html#sec-template-literals). It has uses not limited to: specifying interfaces, runtime expression mapping, and other forms of programmatically interacting with JSON and templates.

--- middle

# Introduction

JSON Template Language provides a mechanism for describing various parts of a template by using familiar syntax from Javascript and JSON. By using a familiar syntax we can get interoperability within the [JSON](https://tools.ietf.org/html/rfc7159, https://www.ecma-international.org/ecma-262/9.0/index.html#sec-template-literals) and [URI](https://tools.ietf.org/html/rfc6570) specifications.

The terms "string", "object" and "array" are from the conventions of Javascript and JSON.

A JSON Template provides a structural description of a template, and when JSON is provided, machine-readable instructions on how to construct a string corresponding to those values. A template is transformed into a string by replacing each of the template literals with the corresponding JSON values.

# Conventions and Definitions

The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD",
"SHOULD NOT", "RECOMMENDED", "NOT RECOMMENDED", "MAY", and "OPTIONAL" in this
document are to be interpreted as described in BCP 14 {{RFC2119}} {{!RFC8174}}
when, and only when, they appear in all capitals, as shown here.


# Security Considerations
When considering runtime security of JSON Template Language, the surface area is only expanding JSON value by key. No loops or operator grammar is defined and should be avoided in runtime contexts.

# IANA Considerations

This document has no IANA actions.


# Example Usage
for the given JSON:

~~~JSON
{
  "query": {
    "number": 1,
    "salad": "potato"
  }
}
~~~

and the given template:

~~~
number${query.number}salad${query.salad}
        \__________/       \__________/
             |                   |
             |                   |
For each key in given JSON, substitute it by key into the string.
~~~

expansion:

~~~
number1saladpotato
~~~

## Accessing Array indicies

for the given JSON

~~~JSON
{
  "query": {
    "numbers": [0, 1, 2, 3],
    "salads": ["caesar", "potato"]
  }
}
~~~

and the given template:

~~~
number${query.numbers[1]}salad${query.salads[1]}
        \_____________/         \_____________/
              |                        |
              |                        |
For each key in given JSON, substitute it by array index into the string.
~~~

expansion:

~~~
number1saladpotato
~~~

## Accessing Nested Objects and Arrays

for the given JSON

~~~JSON
{
  "nested": {
    "query": {
      "number": 1,
      "salads": ["caesar", "potato"]
    }
  }
}
~~~

and the given template:

~~~
number${query.numbers[1]}salad${query.salads[1]}
        \_____________/         \_____________/
              |                        |
              |                        |
  For each key in given JSON, substitute it by path first. then array index into the string.
~~~

expansion:

~~~
number1saladpotato
~~~

# JSON Template Grammar

Language Grammar defined in [ABNF](https://tools.ietf.org/html/rfc5234)

~~~ abnf
grammar = *( [head] template-head identifier *["." path] *[array-left array-index array-right] template-tail [tail] )
template-head = "${"
template-tail = "}"
identifier = *( ALPHA / "_" )
path = *( ALPHA / "_" )
array-left = "["
array-right = "]"
array-index = *( DIGIT )
head = *( ALPHA /  DIGIT / special-characters )
tail = *( ALPHA / DIGIT / special-characters )
special-characters =  *("-" / "_" / "~" / "." / ":" / "/" / "?" / "#" / "[" / "]" / "@" /  "!" /  "&" / "'" / "(" / ")" /  "*" / "+" / "," / ";" / "=")
~~~
{: artwork-name="syntax"}

## Template literal
The contents within the Template literal should be valid a key-value object mapping or array-index mapping for [JSON](https://tools.ietf.org/html/rfc7159).

~~~abnf
grammar = *( [head] template-head identifier *["." path] \
[array-left array-index array-right] template-tail [tail] )
~~~

A template literal is represented within a [URIs](https://tools.ietf.org/html/rfc3986) as a pair of curly braces starting with a `$`.

~~~abnf
template-head = "${"
template-tail = "}"
~~~

## Identifier
An identifier is a valid JSON key.

~~~abnf
identifier = *( ALPHA / "_" )
~~~

## Path
MUST be a valid nested JSON key that will be resolved with the identifier.

~~~abnf
*["." path]
~~~

## Array Index
MUST be a valid index of a JSON array are represented within square brackets and MUST be a valid number.

~~~abnf
*[array-left array-index array-right]
array-left = "["
array-right = "]"
array-index = *( DIGIT )
~~~

## Head
Head represents the characters before template-head, this could be beginning of the template or the last tail.

~~~abnf
head = *( ALPHA /  DIGIT / special-characters )
~~~

## Tail
Tail represents the characters after the template-tail until the end of the template or the next instance of a template literal.

~~~abnf
tail = *( ALPHA / DIGIT / special-characters )
~~~

--- back