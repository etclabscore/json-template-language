# String JSON Templating Language
A tiny language that defines a simple template language to substitute JSON into strings.

# What is this?
A tiny language that defines a simple, familiar interface to substitute [JSON](https://tools.ietf.org/html/rfc7159) into strings. It is derived from the template literals of Javascript, as defined in the ECMAScript Programming Language Standard, Ninth Edition [ECMA-262](https://www.ecma-international.org/ecma-262/9.0/index.html#sec-template-literals).

The terms "object" and "array" are from the conventions of Javascript and JSON.

## Why?
- specifying interfaces
  - provides a mechanism that provides a way that the JSON object and array parts of a template can be easily identified and described.
  - define computed links.
- runtime usage
  - a simple, embedded language is better than allowing the full Javascript language specification.
- interopability between [JSON](https://tools.ietf.org/html/rfc7159), [URIs](https://tools.ietf.org/html/rfc3986) specifications
  - its just **JSON** - nothing new to learn.
  - familiar Javascript template syntax.

### What is it used for?

Specifying interfaces, runtime expression mapping, other forms of programmatically interacting with JSON and URIs.

#### How would I use it?


for the given JSON:

```
{
  "query": {
    "number": 1,
    "salad": "potato"
  }
}
```

```
 http://www.example.com/foo?number=${query.number}&salad=${query.salad}
                                     \__________/          \__________/
                                          |                     |
                                          |                     |
             For each key in given JSON, substitute it by key into the string.
```

##### result

```
 http://www.example.com/foo?number=1&salad=potato
```

#### Accessing Array indicies

for the given JSON

```
{
  "query": {
    "numbers": [0, 1, 2, 3],
    "salads": ["caesar", "potato"]
  }
}
```

```
 http://www.example.com/foo?number=${query.numbers[1]}&salad=${query.salads[1]}
                                     \__________/          \__________/
                                          |                     |
                                          |                     |
             For each key in given JSON, subtitute it by array index into the string.
```

##### result

```
 http://www.example.com/foo?number=1&salad=potato
```


## Grammar

Language Grammar defined in [ABNF](https://tools.ietf.org/html/rfc5234)

```ABNF
grammar = *( [head] template-head identifier *["." path] *[array-left array-index array-right] template-tail [tail] )
path = *( ALPHA / "_" )
array-left = "["
array-right = "]"
array-index = *( DIGIT )
template-head = "\${"
template-tail = "}"
head = *( ALPHA /  DIGIT / special-characters )
tail = *( ALPHA / DIGIT / special-characters )
identifier = *( ALPHA / "_" )
special-characters =  *("-" / "_" / "~" / "." / ":" / "/" / "?" / "#" / "[" / "]" / "@" /  "!" /  "&" / "'" / "(" / ")" /  "*" / "+" / "," / ";" / "=")
```


### Template literal
A template literal is represented within a [URIs](https://tools.ietf.org/html/rfc3986) as a pair of curly braces starting with a `$`.

```ABNF
template-head = "${"
template-tail = "}"
```

The contents within the Template literal should be valid a key-value object mapping or array-index mapping for [JSON](https://tools.ietf.org/html/rfc7159).

```
grammar = *( [head] template-head identifier *["." path] *[array-left array-index array-right] template-tail [tail] )
```

#### Identifier
An identifier is a valid JSON key.
```ABNF
identifier = *( ALPHA / "_" )
```

### Path
MUST be a valid nested JSON key that will be resolved with the Identifier

```ABNF
*["." path]
```

### Array Index
MUST be a valid index of a JSON array are represented within square brackets and MUST be a valid number.

```ABNF
*[array-left array-index array-right]
array-left = "["
array-right = "]"
array-index = *( DIGIT )
```
