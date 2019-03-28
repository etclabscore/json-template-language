import parse from ".";

describe("JSON Uri Templating Language", () => {

  it("can substitute JSON into query strings", () => {
    const json = {
      number: 1,
      salad: "potato",
    };
    const uri = "?number=${number}&salad=${salad}";
    const expected = "?number=1&salad=potato";
    expect(parse(json, uri)).toEqual(expected);
  });

  it("can substitute nested JSON into URIs", () => {
    const json = {
      query: {
        number: 1,
        salad: "potato",
      },
    };
    const uri = "http://www.example.com/foo?number=${query.number}&salad=${query.salad}";
    const expected = "http://www.example.com/foo?number=1&salad=potato";
    expect(parse(json, uri)).toEqual(expected);
  });

  it("can substitute super nested JSON into URIs", () => {
    const json = {
      nested: {
        query: {
          number: 1,
          salad: "potato",
        },
      },
    };
    const uri = "http://www.example.com/foo?number=${nested.query.number}&salad=${nested.query.salad}";
    const expected = "http://www.example.com/foo?number=1&salad=potato";
    expect(parse(json, uri)).toEqual(expected);
  });

  it("can substitute JSON arrays into URIs", () => {
    const json = {
      query: {
        number: [0, 1, 2],
        salad: ["caesar", "potato"],
      },
    };
    const uri = "http://www.example.com/foo?number=${query.number[1]}&salad=${query.salad[1]}";
    const expected = "http://www.example.com/foo?number=1&salad=potato";
    expect(parse(json, uri)).toEqual(expected);
  });

  it("can substitute super nested JSON arrays into URIs", () => {
    const json = {
      nested: {
        query: {
          number: [0, 1, 2],
          salad: ["caesar", "potato"],
        },
      },
    };
    const uri = "http://www.example.com/foo?number=${nested.query.number[1]}&salad=${nested.query.salad[1]}";
    const expected = "http://www.example.com/foo?number=1&salad=potato";
    expect(parse(json, uri)).toEqual(expected);
  });

  it("can substitute super nested JSON arrays of arrays into URIs", () => {
    const json = {
      nested: {
        query: {
          number: [0, [1], 2],
          salad: ["caesar", "potato"],
        },
      },
    };
    const uri = "http://www.example.com/foo?number=${nested.query.number[1][1]}&salad=${nested.query.salad[1]}";
    const expected = "http://www.example.com/foo?number=1&salad=potato";
    expect(parse(json, uri)).toEqual(expected);
  });

  it("can not error on just a string", () => {
    const json = {};
    const uri = "foo";
    const expected = "1";
    expect(parse(json, uri)).toEqual("foo");
  });

  it("can not error on just string URIs", () => {
    const json = {
      query: {
        number: 1,
        salad: "potato",
      },
    };
    const uri = "http://www.example.com/foo?number=";
    const expected = "http://www.example.com/foo?number=";
    expect(parse(json, uri)).toEqual(expected);
  });

  it("can error with malformed template", () => {
    const json = {
      nested: {
        query: {
          number: [0, [1], 2],
          salad: ["caesar", "potato"],
        },
      },
    };
    const uri = "{nested.query.number[1][1]}";
    const expected = "1";
    expect(() => parse(json, uri)).toThrow("Too much text to match");
  });

  it("gets nothing for not existing identifiers", () => {
    const json = {
      nested: {
        query: {
          number: [0, [1], 2],
          salad: ["caesar", "potato"],
        },
      },
    };
    const uri = "${.query.number[1][1]}";
    const expected = "";
    expect(parse(json, uri)).toEqual(expected);
  });

});
