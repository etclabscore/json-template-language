import Heket from "heket";

/* tslint:disable */
export const Grammar = `
grammar = [head] *(template-head identifier *["." path] *[array-left array-index array-right] template-tail [tail])
path = *( ALPHA / "_" )
array-left = "["
array-right = "]"
array-index = *( DIGIT )
template-head = "\${"
template-tail = "}"
head = *( ALPHA /  DIGIT / special-characters )
tail = *( ALPHA / DIGIT / special-characters )
literals = *( ALPHA / DIGIT / special-characters )
identifier = *( ALPHA / "_" )
special-characters =  *("-" / "_" / "~" / "." / ":" / "/" / "?" / "#" / "[" / "]" / "@" /  "!" /  "&" / "'" / "(" / ")" /  "*" / "+" / "," / ";" / "=")
`;
/* tslint:enable */

const parser = Heket.createParser(Grammar);

interface IParserObject {
  paths: string[];

  identifier: string | null;
  arrayIndex: number | null;
}

/**
 * Parse templateString and substite the given JSON.
 */
function parse(jsonObject: any, templateString: string): string {
  const match = parser.parse(templateString);
  const result = match.getRawResult();

  // walk grammar
  let currentObj: IParserObject = { paths: [], identifier: null, arrayIndex: null };
  return result
    .rules
    .reduce((resultString, rule) => {
      switch (rule.rule_name) {
        case "head":
          resultString += rule.string;
          break;
        case "template_head":
          break;
        case "identifier":
          currentObj.identifier = rule.string;
          break;
        case "path":
          currentObj.paths.push(rule.string);
          break;
        case "array_index":
          currentObj.arrayIndex = parseInt(rule.string, 10);
          break;
        case "template_tail":
          if (!currentObj.identifier) {
            break;
          }
          let value = jsonObject[currentObj.identifier];
          if (currentObj.paths.length > 0) {
            value = currentObj.paths.reduce((memo, path) => {
              return memo[path];
            }, value);
          }
          if (Number(currentObj.arrayIndex) !== null) {
            if (currentObj.arrayIndex !== null) {
              value = value[currentObj.arrayIndex];
            }
          }
          currentObj = { paths: [], identifier: null, arrayIndex: null };
          resultString += value;
          break;
        case "tail":
          resultString += rule.string;
          break;
      }
      return resultString;
    }, "");
}

export default parse;
