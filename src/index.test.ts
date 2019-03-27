import parse from ".";


console.log(parse('${params.potato}${params.bar.baz}${params}').rules);
