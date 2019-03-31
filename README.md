# JSON Templating Language
A tiny language that defines a simple, familiar interface to substitute JSON into strings.

# What is this?
This is a Javascript implementation of the JSON Template Language as defined in the [JSON Template Language Draft](https://tools.ietf.org/html/draft-jonas-json-template-language-00).

### What is it used for?
Specifying interfaces, runtime expression mapping, other forms of programmatically interacting with JSON and URIs.

## Why?
- specifying interfaces
  - easily identify and describe the object and array parts of a template.
  - define computed links.
- runtime usage
  - a simple and restricted embedded template language.
- interopability between [JSON](https://tools.ietf.org/html/rfc7159), [URIs](https://tools.ietf.org/html/rfc3986) specifications
  - its just **JSON** -- nothing new to learn.
  - familiar Javascript template syntax.

## Usage

To use the Javascript client you can:

Install it:
```
npm install @etclabscore/string-json-template-language --save
```

Import it:
```
import compileTemplate from "@etclabscore/string-json-template-language";
```

Use it somewhere:
```
const parsedJson = JSON.parse('{ "foo": "bar" }');
const template = "${foo}";
const resultString = compileTemplate(parsedJson, template);
// => "bar"
```

## How does it work?


for the given JSON:

```
{
  "query": {
    "number": 1,
    "salad": "potato"
  }
}
```

and the given template:

```
http://www.example.com/foo?number=${query.number}&salad=${query.salad}
                                    \__________/          \__________/
                                         |                     |
                                         |                     |
      For each key in given JSON, substitute it by key into the string.
```

##### result:

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

and the given template:

```
http://www.example.com/foo?number=${query.numbers[1]}&salad=${query.salads[1]}
                                     \_____________/          \_____________/
                                           |                         |
                                           |                         |
      For each key in given JSON, subtitute it by array index into the string.
```

##### result:

```
 http://www.example.com/foo?number=1&salad=potato
```
